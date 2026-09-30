import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { ServicesService } from './services.service.js';

const setup = () => {
  const service = {
    findMany: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    updateMany: vi.fn(),
    findFirst: vi.fn(),
  };
  return { service, sut: new ServicesService({ service } as never) };
};

describe('ServicesService tenant isolation', () => {
  it('list always filters by tenantId', async () => {
    const { service, sut } = setup();
    await sut.list('t1', { isActive: true });
    expect(service.findMany.mock.calls[0]?.[0].where).toEqual({ tenantId: 't1', isActive: true });
  });

  it('create stamps the caller tenantId', async () => {
    const { service, sut } = setup();
    service.create.mockResolvedValue({});
    await sut.create('t1', { name: 'Sauna', category: 'SAUNA', tokenCost: 2 });
    expect(service.create.mock.calls[0]?.[0].data.tenantId).toBe('t1');
  });

  it('update scopes by id AND tenantId, 404 for another tenant', async () => {
    const { service, sut } = setup();
    service.updateMany.mockResolvedValue({ count: 0 });
    await expect(sut.update('t1', 'a'.repeat(24), { tokenCost: 3 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(service.updateMany.mock.calls[0]?.[0].where).toEqual({
      id: 'a'.repeat(24),
      tenantId: 't1',
    });
    expect(service.findFirst).not.toHaveBeenCalled();
  });

  it('rejects empty updates', async () => {
    const { sut } = setup();
    await expect(sut.update('t1', 'a'.repeat(24), {})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('maps duplicate names to 409', async () => {
    const { service, sut } = setup();
    service.create.mockRejectedValue({ code: 'P2002' });
    await expect(
      sut.create('t1', { name: 'Sauna', category: 'SAUNA', tokenCost: 2 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
