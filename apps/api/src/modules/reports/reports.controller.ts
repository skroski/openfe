import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';

@ApiTags('Relatórios & Fechamento Fiscal')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly-zip')
  @ApiOperation({ summary: 'Exporta pacote ZIP de fechamento fiscal mensal com todos os XMLs e resumo CSV' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @ApiQuery({ name: 'month', required: false, example: 11 })
  async downloadMonthlyZip(
    @CurrentTenant() tenantId: string,
    @Query('companyId') companyId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Res() res: Response
  ) {
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;

    const { filename, buffer } = await this.reportsService.generateMonthlyClosureZip(
      tenantId,
      companyId || 'comp_1',
      y,
      m
    );

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
