#!/usr/bin/env bash
# Fixes seed.ts for the new User model: clerkId (required, unique) added,
# passwordHash removed entirely. Also wipes existing User documents first —
# they predate clerkId and will throw P2032 on every read otherwise. Safe:
# no real Clerk login exists yet, so every current User row is disposable
# dev-seed data.
set -euo pipefail

SEED="packages/database/prisma/seed.ts"
SCHEMA="packages/database/prisma/schema.prisma"
[ -f "$SEED" ] || { echo "ERROR: $SEED not found. Run from the monorepo root."; exit 1; }
[ -f "packages/database/.env" ] || { echo "ERROR: packages/database/.env not found (needs DATABASE_URL)."; exit 1; }

grep -q "clerkId" "$SCHEMA" || { echo "ERROR: clerkId not found in $SCHEMA. Schema may have changed again — paste the current User model before rerunning."; exit 1; }
grep -q "passwordHash" "$SCHEMA" && { echo "WARNING: passwordHash still found in schema.prisma — expected it to be removed. Continuing anyway, but double-check the User model matches what you pasted."; } || true

cp "$SEED" "$SEED.bak_clerkid"
echo ">> Backed up to $SEED.bak_clerkid"

cat > "$SEED" <<'TSEOF'
// Minimal DEVELOPMENT seed: 3 SaasPlans, 1 global SUPER_ADMIN,
// 2 tenants (demo-gym, other-gym) each with a Gym Admin + Sauna service.
// other-gym exists specifically to test tenant isolation.
// Safe to run repeatedly (idempotent) — EXCEPT it wipes all existing User
// documents on every run, because User.clerkId is required+unique and no
// real Clerk login exists yet, so every current row is dev-seed data with
// no clerkId, which throws P2032 on any read otherwise.
//
// clerkId values below are placeholders (dev_clerk_*), NOT real Clerk user
// ids. Once Clerk auth is wired up for real, replace this wipe-and-reseed
// approach with something that preserves real signed-up users.
import {
  BillingCycle,
  prisma,
  ServiceCategory,
  TenantStatus,
  UserRole,
} from "../src/index";

// SaasPlan.maxMembers/maxStaff are required Ints (no "unlimited" representation
// in the schema). 999999 is a placeholder sentinel for Enterprise.
const UNLIMITED_SENTINEL = 999_999;

// Codes are uppercase per the schema's own documented convention
// (`code String @unique // STARTER, PRO, ENTERPRISE`).
const SAAS_PLANS = [
  { code: "STARTER", name: "Starter", priceCents: 4900, maxMembers: 100, maxStaff: 2 },
  { code: "PRO", name: "Pro", priceCents: 14900, maxMembers: 500, maxStaff: 10 },
  {
    code: "ENTERPRISE",
    name: "Enterprise",
    priceCents: 29900,
    maxMembers: UNLIMITED_SENTINEL,
    maxStaff: UNLIMITED_SENTINEL,
  },
] as const;

async function seedSaasPlans() {
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
}

async function seedSuperAdmin() {
  const SUPER_ADMIN_EMAIL = "superadmin@platform.test";
  return prisma.user.create({
    data: {
      clerkId: "dev_clerk_super_admin",
      email: SUPER_ADMIN_EMAIL,
      role: UserRole.SUPER_ADMIN,
      firstName: "Platform",
      lastName: "Admin",
    },
  });
}

async function seedTenant(slug: string, name: string, ownerEmail: string) {
  const proPlan = await prisma.saasPlan.findUniqueOrThrow({ where: { code: "PRO" } });

  return prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: {
      name,
      slug,
      status: TenantStatus.ACTIVE, // instant-activation model: tenants start ACTIVE
      ownerEmail,
      saasPlanId: proPlan.id,
    },
  });
}

function seedUser(
  clerkId: string,
  tenantId: string,
  email: string,
  role: UserRole,
  firstName: string,
  lastName: string,
) {
  return prisma.user.create({
    data: {
      clerkId,
      tenantId,
      email,
      role,
      firstName,
      lastName,
    },
  });
}

async function seedSauna(tenantId: string) {
  const existingService = await prisma.service.findFirst({
    where: { tenantId, name: "Sauna" },
  });
  if (!existingService) {
    await prisma.service.create({
      data: {
        tenantId,
        name: "Sauna",
        category: ServiceCategory.SAUNA,
        tokenCost: 2,
      },
    });
  }

  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: { tenantId, name: "Premium" },
  });
  if (!existingPlan) {
    await prisma.subscriptionPlan.create({
      data: {
        tenantId,
        name: "Premium",
        monthlyTokenAllowance: 40,
        priceCents: 7900,
        currency: "USD",
        billingCycle: BillingCycle.MONTHLY,
      },
    });
  }
}

async function main() {
  // Wipe existing User documents: they predate clerkId (required+unique)
  // and will throw P2032 on any read otherwise. No real Clerk login exists
  // yet, so nothing of value is lost here.
  const { count } = await prisma.user.deleteMany({});
  console.log(`Cleared ${count} pre-clerkId user document(s).`);

  await seedSaasPlans();
  const superAdmin = await seedSuperAdmin();

  // --- demo-gym: primary demo tenant ---
  const demoTenant = await seedTenant("demo-gym", "Demo Gym", "admin@demo-gym.test");
  const admin = await seedUser(
    "dev_clerk_demo_gym_admin",
    demoTenant.id,
    "admin@demo-gym.test",
    UserRole.GYM_ADMIN,
    "Demo",
    "Admin",
  );
  const frontDesk = await seedUser(
    "dev_clerk_demo_gym_frontdesk",
    demoTenant.id,
    "frontdesk@demo-gym.test",
    UserRole.FRONT_DESK,
    "Demo",
    "FrontDesk",
  );
  await seedSauna(demoTenant.id);

  // --- other-gym: second tenant, used to test tenant isolation ---
  const otherTenant = await seedTenant("other-gym", "Other Gym", "admin@other-gym.test");
  const otherAdmin = await seedUser(
    "dev_clerk_other_gym_admin",
    otherTenant.id,
    "admin@other-gym.test",
    UserRole.GYM_ADMIN,
    "Other",
    "Admin",
  );
  await seedSauna(otherTenant.id);

  // Read back to confirm everything, including relations, worked end to end.
  const saasPlanCount = await prisma.saasPlan.count();
  const check = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "demo-gym" },
    include: { users: true, plans: true, services: true, saasPlan: true },
  });
  console.log("Seed OK:", {
    saasPlans: saasPlanCount,
    superAdmin: superAdmin.email,
    tenant: check.slug,
    tenantSaasPlan: check.saasPlan?.code,
    users: check.users.length,
    plans: check.plans.length,
    services: check.services.length,
    otherGym: otherTenant.slug,
  });

  console.log("\nDev user ids (use as the x-dev-user-id header):");
  console.log(`  super-admin ${superAdmin.id}`);
  console.log(`  demo-gym  GYM_ADMIN   ${admin.id}`);
  console.log(`  demo-gym  FRONT_DESK  ${frontDesk.id}`);
  console.log(`  other-gym GYM_ADMIN   ${otherAdmin.id}\n`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
TSEOF

echo ">> Diff:"
diff -u "$SEED.bak_clerkid" "$SEED" || true

echo; echo ">> pnpm db:generate"
pnpm db:generate

echo; echo ">> pnpm db:seed"
pnpm db:seed

echo; echo ">> biome format"
pnpm exec biome format --write packages/database || echo "WARN: biome formatting failed; run 'pnpm lint:fix' before committing."

cat <<MSG

=======================================================
 Expected: "Cleared N pre-clerkId user document(s)." then
   Seed OK: { saasPlans: 3, superAdmin: 'superadmin@platform.test',
              tenant: 'demo-gym', tenantSaasPlan: 'PRO', users: 2,
              plans: 1, services: 1, otherGym: 'other-gym' }
 plus the dev user ids block.

 IMPORTANT: this seed now wipes ALL User documents every time it runs.
 That's fine for now (no real Clerk signups exist), but once real users
 exist via Clerk, this needs to change to NOT delete real accounts.
=======================================================
MSG
