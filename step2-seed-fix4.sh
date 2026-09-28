#!/usr/bin/env bash
# STEP 2 FIX #3 — matches the REAL schema.prisma from commit b73308a, which
# differs from what earlier scripts assumed:
#   - SaasPlan.maxMembers / maxStaff are now required Int (not Int?)
#     -> Enterprise uses 999999 as an "unlimited" sentinel (Sanch's call).
#   - Tenant.ownerEmail is new and required.
#   - Tenant.status now defaults to ACTIVE (instant-activation model).
#   - Plan codes follow the schema's own documented convention: uppercase.
set -euo pipefail

SEED="packages/database/prisma/seed.ts"
# (fix4: check super admin existence by email only, not tenantId: null)
SCHEMA="packages/database/prisma/schema.prisma"
[ -f "$SEED" ] || { echo "ERROR: $SEED not found. Run from the monorepo root."; exit 1; }
[ -f "packages/database/.env" ] || { echo "ERROR: packages/database/.env not found (needs DATABASE_URL)."; exit 1; }

echo ">> Confirming the schema on disk still matches what this script expects..."
grep -q "ownerEmail" "$SCHEMA" || { echo "ERROR: Tenant.ownerEmail not found in $SCHEMA. The schema has changed again — paste it before rerunning this."; exit 1; }
grep -q "maxMembers    Int " "$SCHEMA" > /dev/null 2>&1 || grep -qE "maxMembers\s+Int\s" "$SCHEMA" || { echo "ERROR: SaasPlan.maxMembers doesn't look like a required Int in $SCHEMA. Paste the current schema before rerunning."; exit 1; }

cp "$SEED" "$SEED.bak5"
echo ">> Backed up to $SEED.bak5"

cat > "$SEED" <<'TSEOF'
// Minimal DEVELOPMENT seed: 3 SaasPlans, 1 global SUPER_ADMIN,
// 1 demo Tenant (+ Gym Admin, Plan, Service).
// Safe to run repeatedly (idempotent).
//
// passwordHash is a deliberate placeholder, NOT a real hash and NOT a real password.
// These accounts cannot log in. The authentication phase will replace how hashes are made.
import {
  BillingCycle,
  prisma,
  ServiceCategory,
  TenantStatus,
  UserRole,
} from "../src/index";

const DEV_PLACEHOLDER_HASH = "DEV_ONLY_PLACEHOLDER__NOT_A_REAL_HASH";

// SaasPlan.maxMembers/maxStaff are required Ints (no "unlimited" representation
// in the schema). 999999 is a placeholder sentinel for Enterprise, chosen for
// the dev seed — revisit if the app ever needs to branch on "is this plan
// actually unlimited" logic.
const UNLIMITED_SENTINEL = 999_999;

// --- Platform-level SaaS plans (Super Admin module) ---
// Codes are uppercase per the schema's own documented convention
// (`code String @unique // STARTER, PRO, ENTERPRISE`).
const SAAS_PLANS = [
  { code: "STARTER", name: "Starter", priceCents: 4900, maxMembers: 100, maxStaff: 2 },
  { code: "PRO", name: "Pro", priceCents: 14900, maxMembers: 500, maxStaff: 10 },
  { code: "ENTERPRISE", name: "Enterprise", priceCents: 29900, maxMembers: UNLIMITED_SENTINEL, maxStaff: UNLIMITED_SENTINEL },
] as const;

async function main() {
  // --- SaasPlan seeding (upsert by unique `code`) ---
  for (const p of SAAS_PLANS) {
    await prisma.saasPlan.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        name: p.name,
        priceCents: p.priceCents,
        currency: "USD",
        maxMembers: p.maxMembers,
        maxStaff: p.maxStaff,
      },
    });
  }

  // --- Global SUPER_ADMIN (tenantId = null) ---
  // Filtering by `tenantId: null` in a WHERE clause is fine on MongoDB, but
  // `create()` rejects an explicit `null` for an optional field, so tenantId
  // is simply OMITTED below — an absent key is what "no tenant" means here.
  const SUPER_ADMIN_EMAIL = "superadmin@platform.test";
  // Checking by email alone (not tenantId: null) — Prisma's `tenantId: null`
  // filter doesn't reliably match a document where tenantId is simply absent
  // vs. explicitly null on MongoDB. Email is unique enough for this dev seed.
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { email: SUPER_ADMIN_EMAIL },
  });
  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        email: SUPER_ADMIN_EMAIL,
        passwordHash: DEV_PLACEHOLDER_HASH,
        role: UserRole.SUPER_ADMIN,
        firstName: "Platform",
        lastName: "Admin",
      },
    });
  }

  // --- Demo tenant, linked to the "PRO" SaasPlan so the relation is exercised ---
  const proPlan = await prisma.saasPlan.findUniqueOrThrow({ where: { code: "PRO" } });

  const DEMO_OWNER_EMAIL = "admin@demo-gym.test";
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-gym" },
    update: {},
    create: {
      name: "Demo Gym",
      slug: "demo-gym",
      status: TenantStatus.ACTIVE, // instant-activation model: tenants start ACTIVE
      ownerEmail: DEMO_OWNER_EMAIL,
      saasPlanId: proPlan.id,
    },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: DEMO_OWNER_EMAIL } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: DEMO_OWNER_EMAIL,
      passwordHash: DEV_PLACEHOLDER_HASH,
      role: UserRole.GYM_ADMIN,
      firstName: "Demo",
      lastName: "Admin",
    },
  });

  // Plan and Service have no natural unique key, so check-then-create.
  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: { tenantId: tenant.id, name: "Premium" },
  });
  if (!existingPlan) {
    await prisma.subscriptionPlan.create({
      data: {
        tenantId: tenant.id,
        name: "Premium",
        monthlyTokenAllowance: 40,
        priceCents: 7900,
        currency: "USD",
        billingCycle: BillingCycle.MONTHLY,
      },
    });
  }

  const existingService = await prisma.service.findFirst({
    where: { tenantId: tenant.id, name: "Sauna" },
  });
  if (!existingService) {
    await prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: "Sauna",
        category: ServiceCategory.SAUNA,
        tokenCost: 2,
      },
    });
  }

  // Read back to prove everything, including the new relations, works end to end.
  const saasPlanCount = await prisma.saasPlan.count();
  const superAdminCount = await prisma.user.count({ where: { role: UserRole.SUPER_ADMIN, tenantId: null } });
  const check = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "demo-gym" },
    include: { users: true, plans: true, services: true, saasPlan: true },
  });
  console.log("Seed OK:", {
    saasPlans: saasPlanCount,
    globalSuperAdmins: superAdminCount,
    tenant: check.slug,
    tenantStatus: check.status,
    tenantOwnerEmail: check.ownerEmail,
    tenantSaasPlan: check.saasPlan?.code,
    users: check.users.length,
    plans: check.plans.length,
    services: check.services.length,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
TSEOF

echo ">> Diff vs the version that failed:"
diff -u "$SEED.bak5" "$SEED" || true

echo; echo ">> pnpm db:generate (make sure the client matches the current schema)"
pnpm db:generate

echo; echo ">> pnpm db:seed"
pnpm db:seed

echo; echo ">> biome format"
pnpm exec biome format --write packages/database || echo "WARN: biome formatting failed; run 'pnpm lint:fix' before committing."

cat <<MSG

=======================================================
 Expected output:
   Seed OK: { saasPlans: 3, globalSuperAdmins: 1, tenant: 'demo-gym',
              tenantStatus: 'ACTIVE', tenantOwnerEmail: 'admin@demo-gym.test',
              tenantSaasPlan: 'PRO', users: 1, plans: 1, services: 1 }
=======================================================
MSG
