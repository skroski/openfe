import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ImportsService } from './imports.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';

export class PreviewXmlDto {
  xmlContent!: string;
}

export class ImportXmlDto {
  companyId!: string;
  xmlContent!: string;
  autoRegisterProducts?: boolean;
  autoRegisterEntities?: boolean;
}

@ApiTags('Importação de Documentos Fiscais')
@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('preview')
  @ApiOperation({ summary: 'Analisa e pré-visualiza dados estruturados de um XML NF-e' })
  preview(@Body() body: PreviewXmlDto) {
    if (!body.xmlContent) {
      throw new BadRequestException('Conteúdo do arquivo XML é obrigatório.');
    }
    return this.importsService.previewXml(body.xmlContent);
  }

  @Post('xml')
  @ApiOperation({ summary: 'Importa um XML de NF-e, salvando documento e cadastrando produtos/fornecedores' })
  importXml(
    @CurrentTenant() tenantId: string,
    @Body() body: ImportXmlDto
  ) {
    if (!body.xmlContent) {
      throw new BadRequestException('Conteúdo do arquivo XML é obrigatório.');
    }
    return this.importsService.processXmlImport(
      tenantId,
      body.companyId || 'comp_1',
      body.xmlContent,
      {
        autoRegisterProducts: body.autoRegisterProducts !== false,
        autoRegisterEntities: body.autoRegisterEntities !== false,
      }
    );
  }
}
