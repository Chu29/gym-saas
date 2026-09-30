import { BillingCycle, prisma, ServiceCategory, TenantStatus, UserRole } from "../src/index";

const DEV_PLACEHOLDER_HASH = "DEV_ONLY_PLACEHOLDER__NOT_A_REAL_HASH";

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-gym" },
    update: {},
    create: { name: "Demo Gym", slug: "demo-gym", status: TenantStatus.TRIAL },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: "admin@demo-gym.test" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@demo-gym.test",
      passwordHash: DEV_PLACEHOLDER_HASH,
      role: UserRole.GYM_ADMIN,
      firstName: "Demo",
      lastName: "Admin",
    },
  });

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

  const _check = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "demo-gym" },
    include: { users: true, plans: true, services: true },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (_e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
