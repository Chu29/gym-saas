import { Global, Module } from "@nestjs/common";
import { prisma } from "@repo/database";

export const PRISMA_CLIENT = "PRISMA_CLIENT";

@Global()
@Module({
  providers: [{ provide: PRISMA_CLIENT, useValue: prisma }],
  exports: [PRISMA_CLIENT],
})
export class PrismaModule {}
