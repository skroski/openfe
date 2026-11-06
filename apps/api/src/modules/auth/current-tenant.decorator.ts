import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // In production with JWT: request.user.organizationId
    // Fallback default organization for initial development / seeded state
    return request.user?.organizationId || request.headers['x-tenant-id'] || 'default-tenant-uuid';
  }
);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || {
      id: 'usr_default_admin',
      email: 'admin@opennfe.com.br',
      fullName: 'Administrador OpenNFE',
      role: 'TENANT_ADMIN',
      organizationId: 'default-tenant-uuid',
    };
  }
);

