import { BillingCycle, prisma, ServiceCategory, TenantStatus, UserRole } from '../src/index';

// ==========================================
// DEVELOPMENT SEED
// ==========================================

// SaaS plans
const UNLIMITED_SENTINEL = 999_999;

const SAAS_PLANS = [
  {
    code: 'STARTER',
    name: 'Starter',
    priceCents: 4900,
    maxMembers: 100,
    maxStaff: 2,
  },
  {
    code: 'PRO',
    name: 'Pro',
    priceCents: 14900,
    maxMembers: 500,
    maxStaff: 10,
  },
  {
    code: 'ENTERPRISE',
    name: 'Enterprise',
    priceCents: 29900,
    maxMembers: UNLIMITED_SENTINEL,
    maxStaff: UNLIMITED_SENTINEL,
  },
] as const;

function seedTenant(slug: string, name: string) {
  return prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: {
      name,
      slug,
      status: TenantStatus.ACTIVE,
    },
  });
}

function seedUser(
  tenantId: string,
  email: string,
  role: UserRole,
  firstName: string,
  lastName: string,
) {
  return prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId,
        email,
      },
    },
    update: {},
    create: {
      tenantId,
      email,
      role,
      firstName,
      lastName,
    },
  });
}

async function seedSauna(tenantId: string) {
  const existing = await prisma.service.findFirst({
    where: {
      tenantId,
      name: 'Sauna',
    },
  });

  if (existing) return;

  await prisma.service.create({
    data: {
      tenantId,
      name: 'Sauna',
      category: ServiceCategory.SAUNA,
      tokenCost: 2,
    },
  });
}

async function main() {
  // ==========================================
  // PLATFORM-LEVEL SaaS PLANS
  // ==========================================

  for (const plan of SAAS_PLANS) {
    await prisma.saasPlan.upsert({
      where: { code: plan.code },
      update: {},
      create: {
        code: plan.code,
        name: plan.name,
        priceCents: plan.priceCents,
        currency: 'USD',
        maxMembers: plan.maxMembers,
        maxStaff: plan.maxStaff,
      },
    });
  }

  // ==========================================
  // GLOBAL SUPER ADMIN
  // ==========================================

  const SUPER_ADMIN_EMAIL = 'superadmin@platform.test';

  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      email: SUPER_ADMIN_EMAIL,
    },
  });

  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        email: SUPER_ADMIN_EMAIL,
        role: UserRole.SUPER_ADMIN,
        firstName: 'Platform',
        lastName: 'Admin',
      },
    });
  }

  // ==========================================
  // DEMO GYM
  // ==========================================

  const proPlan = await prisma.saasPlan.findUniqueOrThrow({
    where: {
      code: 'PRO',
    },
  });

  const tenant = await seedTenant('demo-gym', 'Demo Gym');

  // Link demo gym to the PRO SaaS plan.
  if (!tenant.saasPlanId) {
    await prisma.tenant.update({
      where: {
        id: tenant.id,
      },
      data: {
        saasPlanId: proPlan.id,
      },
    });
  }

  const admin = await seedUser(
    tenant.id,
    'admin@demo-gym.test',
    UserRole.GYM_ADMIN,
    'Demo',
    'Admin',
  );

  const frontDesk = await seedUser(
    tenant.id,
    'frontdesk@demo-gym.test',
    UserRole.FRONT_DESK,
    'Demo',
    'FrontDesk',
  );

  // ==========================================
  // DEMO GYM SUBSCRIPTION PLAN
  // ==========================================

  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      tenantId: tenant.id,
      name: 'Premium',
    },
  });

  if (!existingPlan) {
    await prisma.subscriptionPlan.create({
      data: {
        tenantId: tenant.id,
        name: 'Premium',
        monthlyTokenAllowance: 40,
        priceCents: 7900,
        currency: 'USD',
        billingCycle: BillingCycle.MONTHLY,
      },
    });
  }

  // ==========================================
  // DEMO GYM SERVICE
  // ==========================================

  await seedSauna(tenant.id);

  // ==========================================
  // SECOND GYM
  // Used for tenant-isolation testing
  // ==========================================

  const otherTenant = await seedTenant('other-gym', 'Other Gym');

  const otherAdmin = await seedUser(
    otherTenant.id,
    'admin@other-gym.test',
    UserRole.GYM_ADMIN,
    'Other',
    'Admin',
  );

  await seedSauna(otherTenant.id);

  // ==========================================
  // VERIFICATION
  // ==========================================

  const saasPlanCount = await prisma.saasPlan.count();

  const superAdminCount = await prisma.user.count({
    where: {
      role: UserRole.SUPER_ADMIN,
      tenantId: null,
    },
  });

  await prisma.tenant.findUniqueOrThrow({
    where: {
      slug: 'demo-gym',
    },
    include: {
      users: true,
      plans: true,
      services: true,
      saasPlan: true,
    },
  });

  console.log('\nDev seed completed successfully.');
  console.log(`SaaS plans: ${saasPlanCount}`);
  console.log(`Global super admins: ${superAdminCount}`);

  console.log('\nDev user ids:');
  console.log(`  demo-gym  GYM_ADMIN   ${admin.id}`);
  console.log(`  demo-gym  FRONT_DESK  ${frontDesk.id}`);
  console.log(`  other-gym GYM_ADMIN   ${otherAdmin.id}\n`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
