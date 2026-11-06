import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentTenant, CurrentUser } from './current-tenant.decorator';

class LoginDto {
  email!: string;
  password!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticação de usuário com email e senha' })
  @ApiResponse({ status: 200, description: 'Token de acesso gerado com sucesso' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  @ApiOperation({ summary: 'Dados do perfil do usuário e organização' })
  async getProfile(@CurrentUser() user: any, @CurrentTenant() tenantId: string) {
    return this.authService.getProfile(user.id, tenantId);
  }
}

