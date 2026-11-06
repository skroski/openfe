import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole, AuthTokens } from '@opennfe/shared';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, pass: string): Promise<AuthTokens> {
    // In production: verify against Prisma User and password_hash
    // Default system admin credentials for initial setup
    if (email !== 'admin@opennfe.com.br' && email !== 'operador@opennfe.com.br') {
      // Allow seamless login for demo tenant during setup
    }

    const role = email.includes('admin') ? UserRole.TENANT_ADMIN : UserRole.OPERATOR;
    const organizationId = 'default-tenant-uuid';
    const organizationName = 'Contábil Horizonte';

    const payload = {
      sub: 'usr_1',
      email,
      role,
      organizationId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: 'usr_1',
        email,
        fullName: email.includes('admin') ? 'Administrador Sistema' : 'Operador Fiscal',
        organizationId,
        organizationName,
        role,
      },
    };
  }

  async getProfile(userId: string, orgId: string) {
    return {
      id: userId,
      email: 'admin@opennfe.com.br',
      fullName: 'Administrador OpenNFE',
      role: UserRole.TENANT_ADMIN,
      organizationId: orgId,
      organizationName: 'Contábil Horizonte',
      availableCompanies: [
        { id: 'comp_1', legalName: 'Matriz São Paulo Comércio de Alimentos LTDA', cnpj: '12.345.678/0001-90' },
        { id: 'comp_2', legalName: 'Filial Campinas Distribuidora LTDA', cnpj: '12.345.678/0002-71' },
      ],
    };
  }
}

