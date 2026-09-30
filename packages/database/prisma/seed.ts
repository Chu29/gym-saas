import { BillingCycle, prisma, ServiceCategory, TenantStatus, UserRole } from '../src/index';

function seedTenant(slug: string, name: string) {
  return prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: { name, slug, status: TenantStatus.TRIAL },
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
    where: { tenantId_email: { tenantId, email } },
    update: {},
    create: {
      clerkId: `seed_${tenantId}_${email}`,
      tenantId,
      email,
      role,
      firstName,
      lastName,
    },
  });
}

async function seedSauna(tenantId: string) {
  const existing = await prisma.service.findFirst({ where: { tenantId, name: 'Sauna' } });
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
  // Demo gym
  const tenant = await seedTenant('demo-gym', 'Demo Gym');
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

  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: { tenantId: tenant.id, name: 'Premium' },
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
  await seedSauna(tenant.id);

  // Second gym, used to test tenant isolation
  const otherTenant = await seedTenant('other-gym', 'Other Gym');
  const otherAdmin = await seedUser(
    otherTenant.id,
    'admin@other-gym.test',
    UserRole.GYM_ADMIN,
    'Other',
    'Admin',
  );
  await seedSauna(otherTenant.id);

  await prisma.tenant.findUniqueOrThrow({
    where: { slug: 'demo-gym' },
    include: { users: true, plans: true, services: true },
  });

  console.log('\nDev user ids (use as the x-dev-user-id header):');
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
