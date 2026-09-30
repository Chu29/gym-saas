import { BillingCycle, prisma, ServiceCategory, TenantStatus, UserRole } from '../src/index';

// ==========================================
// DEVELOPMENT SEED
// ==========================================
//
// This seed is intended for local development/testing.
// It creates:
// - 3 SaaS plans
// - 1 global SUPER_ADMIN
// - demo-gym with GYM_ADMIN + FRONT_DESK
// - other-gym with GYM_ADMIN
// - Sauna service for both gyms
//
// Because clerkId is required and real Clerk users do not exist
// in the development seed, existing User documents are cleared
// before recreating the development users.
//
// Do NOT use this seed against a production database.
//

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

async function seedSaasPlans() {
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
}

async function seedSuperAdmin() {
  const SUPER_ADMIN_EMAIL = 'superadmin@platform.test';

  return prisma.user.create({
    data: {
      clerkId: 'dev_clerk_super_admin',
      email: SUPER_ADMIN_EMAIL,
      role: UserRole.SUPER_ADMIN,
      firstName: 'Platform',
      lastName: 'Admin',
    },
  });
}

async function seedTenant(slug: string, name: string, ownerEmail: string) {
  const proPlan = await prisma.saasPlan.findUniqueOrThrow({
    where: { code: 'PRO' },
  });

  return prisma.tenant.upsert({
    where: { slug },
    update: {
      ownerEmail,
      saasPlanId: proPlan.id,
    },
    create: {
      name,
      slug,
      status: TenantStatus.ACTIVE,
      ownerEmail,
      saasPlanId: proPlan.id,
    },
  });
}

async function seedUser(
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
    where: {
      tenantId,
      name: 'Sauna',
    },
  });

  if (existingService) {
    return;
  }

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
  // DEVELOPMENT USER RESET
  // ==========================================

  const { count } = await prisma.user.deleteMany({});

  console.log(`Cleared ${count} development user document(s).`);

  // ==========================================
  // PLATFORM-LEVEL SaaS PLANS
  // ==========================================

  await seedSaasPlans();

  // ==========================================
  // GLOBAL SUPER ADMIN
  // ==========================================

  const superAdmin = await seedSuperAdmin();

  // ==========================================
  // DEMO GYM
  // ==========================================

  const demoTenant = await seedTenant('demo-gym', 'Demo Gym', 'admin@demo-gym.test');

  const admin = await seedUser(
    'dev_clerk_demo_gym_admin',
    demoTenant.id,
    'admin@demo-gym.test',
    UserRole.GYM_ADMIN,
    'Demo',
    'Admin',
  );

  const frontDesk = await seedUser(
    'dev_clerk_demo_gym_frontdesk',
    demoTenant.id,
    'frontdesk@demo-gym.test',
    UserRole.FRONT_DESK,
    'Demo',
    'FrontDesk',
  );

  await seedSauna(demoTenant.id);

  // ==========================================
  // DEMO GYM SUBSCRIPTION PLAN
  // ==========================================

  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      tenantId: demoTenant.id,
      name: 'Premium',
    },
  });

  if (!existingPlan) {
    await prisma.subscriptionPlan.create({
      data: {
        tenantId: demoTenant.id,
        name: 'Premium',
        monthlyTokenAllowance: 40,
        priceCents: 7900,
        currency: 'USD',
        billingCycle: BillingCycle.MONTHLY,
      },
    });
  }

  // ==========================================
  // SECOND GYM
  // Used for tenant-isolation testing
  // ==========================================

  const otherTenant = await seedTenant('other-gym', 'Other Gym', 'admin@other-gym.test');

  const otherAdmin = await seedUser(
    'dev_clerk_other_gym_admin',
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

  const check = await prisma.tenant.findUniqueOrThrow({
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

  console.log('\nSeed completed successfully.');
  console.log(`SaaS plans: ${saasPlanCount}`);
  console.log(`Global super admins: ${superAdminCount}`);
  console.log(`Demo gym: ${check.slug}`);
  console.log(`Demo gym SaaS plan: ${check.saasPlan?.code}`);
  console.log(`Demo gym users: ${check.users.length}`);
  console.log(`Demo gym plans: ${check.plans.length}`);
  console.log(`Demo gym services: ${check.services.length}`);

  console.log('\nDevelopment user ids:');
  console.log(`  super-admin ${superAdmin.id}`);
  console.log(`  demo-gym  GYM_ADMIN   ${admin.id}`);
  console.log(`  demo-gym  FRONT_DESK  ${frontDesk.id}`);
  console.log(`  other-gym GYM_ADMIN   ${otherAdmin.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
