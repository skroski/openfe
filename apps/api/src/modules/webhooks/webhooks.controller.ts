import {
  Controller,
  Post,
  Get,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';

@ApiTags('Webhooks Inbound e Outbound')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('focus-nfe')
  @ApiOperation({ summary: 'Callback Inbound público da Focus NFe para notificação assíncrona' })
  handleFocusCallback(@Body() body: any) {
    return this.webhooksService.handleFocusNfeCallback(body);
  }

  @Post('plugnotas')
  @ApiOperation({ summary: 'Callback Inbound público do PlugNotas para notificação assíncrona' })
  handlePlugNotasCallback(@Body() body: any) {
    return this.webhooksService.handleFocusNfeCallback(body);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Lista histórico de disparos de webhooks outbound para o tenant' })
  getDeliveryLogs(@CurrentTenant() tenantId: string) {
    return this.webhooksService.getLogs(tenantId);
  }
}
