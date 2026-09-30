import type { RawBodyRequest } from '@nestjs/common';
import { BadRequestException, Controller, Headers, Post, Req } from '@nestjs/common';
import { UserRole } from '@repo/database';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { PrismaService } from '../prisma/prisma.service.js';

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
    public_metadata?: {
      tenantId?: string | null;
      role?: UserRole;
    };
  };
};

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('clerk')
  async handleClerkWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('Missing CLERK_WEBHOOK_SECRET');
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const wh = new Webhook(webhookSecret);
    let evt: ClerkWebhookEvent;

    try {
      // Use rawBody provided by NestFactory configuration
      const verified = wh.verify(req.rawBody as Buffer, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });

      if (!verified) {
        throw new BadRequestException('Webhook verification failed');
      }

      evt = verified as ClerkWebhookEvent;
    } catch {
      throw new BadRequestException('Webhook verification failed');
    }

    const { type, data } = evt;

    if (type === 'user.created') {
      const primaryEmail = data.email_addresses?.[0]?.email_address ?? '';
      const tenantId = data.public_metadata?.tenantId || null;
      const role = data.public_metadata?.role ?? UserRole.MEMBER;

      await this.prisma.user.upsert({
        where: { clerkId: data.id },
        update: {
          email: primaryEmail,
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          imageUrl: data.image_url,
          role: role,
          tenantId: tenantId,
        },
        create: {
          clerkId: data.id,
          email: primaryEmail,
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          imageUrl: data.image_url,
          role: role,
          tenantId: tenantId,
        },
      });
    }

    if (type === 'user.updated') {
      const primaryEmail = data.email_addresses?.[0]?.email_address ?? '';
      const tenantId = data.public_metadata?.tenantId || null;
      const role = data.public_metadata?.role ?? UserRole.MEMBER;

      await this.prisma.user.update({
        where: { clerkId: data.id },
        data: {
          email: primaryEmail,
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          imageUrl: data.image_url,
          role: role,
          tenantId: tenantId,
        },
      });
    }

    if (type === 'user.deleted') {
      await this.prisma.user.deleteMany({
        where: { clerkId: data.id },
      });
    }

    return { success: true };
  }
}
