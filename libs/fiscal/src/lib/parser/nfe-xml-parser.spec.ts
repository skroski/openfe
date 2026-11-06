import { describe, it, expect } from 'vitest';
import { NfeXmlParser } from './nfe-xml-parser';
import { OperationType, DocumentType, DocumentStatus } from '@opennfe/shared';

describe('NfeXmlParser - SEFAZ NF-e XML Parser', () => {
  const sampleNfeXml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe35261112345678000190550010000010421000001042" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>00001042</cNF>
        <natOp>VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>1042</nNF>
        <dhEmi>2026-11-03T10:00:00-03:00</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
      </ide>
      <emit>
        <CNPJ>12345678000190</CNPJ>
        <xNome>DISTRIBUIDORA DE ALIMENTOS PAULISTA LTDA</xNome>
        <xFant>PAULISTA ALIMENTOS</xFant>
        <enderEmit>
          <xLgr>AV PAULISTA</xLgr>
          <nro>1000</nro>
          <xBairro>BELA VISTA</xBairro>
          <cMun>3550308</cMun>
          <xMun>SAO PAULO</xMun>
          <UF>SP</UF>
          <CEP>01310100</CEP>
        </enderEmit>
        <IE>111222333444</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        <CNPJ>98765432000110</CNPJ>
        <xNome>SUPERMERCADOS ALVORADA LTDA</xNome>
        <enderDest>
          <xLgr>RUA DAS FLORES</xLgr>
          <nro>250</nro>
          <xBairro>CENTRO</xBairro>
          <cMun>3550308</cMun>
          <xMun>SAO PAULO</xMun>
          <UF>SP</UF>
          <CEP>01001000</CEP>
        </enderDest>
        <IE>999888777666</IE>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>CAFE-01</cProd>
          <cEAN>7891234567890</cEAN>
          <xProd>Cafe Gourmet Especial 500g</xProd>
          <NCM>09012100</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>10.0000</qCom>
          <vUnCom>25.0000</vUnCom>
          <vProd>250.00</vProd>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>3</modBC>
              <vBC>250.00</vBC>
              <pICMS>18.00</pICMS>
              <vICMS>45.00</vICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>01</CST>
              <vBC>250.00</vBC>
              <pPIS>1.65</pPIS>
              <vPIS>4.13</vPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>01</CST>
              <vBC>250.00</vBC>
              <pCOFINS>7.60</pCOFINS>
              <vCOFINS>19.00</vCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vBC>250.00</vBC>
          <vICMS>45.00</vICMS>
          <vProd>250.00</vProd>
          <vFrete>0.00</vFrete>
          <vDesc>0.00</vDesc>
          <vPIS>4.13</vPIS>
          <vCOFINS>19.00</vCOFINS>
          <vNF>250.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>1</tpAmb>
      <verAplic>SP_NFE_PL_009</verAplic>
      <chNFe>35261112345678000190550010000010421000001042</chNFe>
      <dhRecbto>2026-11-03T10:00:30-03:00</dhRecbto>
      <nProt>135260012345678</nProt>
      <digVal>abc123def456=</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;

  it('deve extrair chave de acesso, série, número e dados gerais da NF-e', () => {
    const parsed = NfeXmlParser.parse(sampleNfeXml);

    expect(parsed.accessKey).toBe('35261112345678000190550010000010421000001042');
    expect(parsed.series).toBe(1);
    expect(parsed.number).toBe(1042);
    expect(parsed.model).toBe('55');
    expect(parsed.operationNature).toBe('VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS');
    expect(parsed.protocolNumber).toBe('135260012345678');
  });

  it('deve extrair dados do emitente e destinatário corretamente', () => {
    const parsed = NfeXmlParser.parse(sampleNfeXml);

    expect(parsed.issuer.document).toBe('12345678000190');
    expect(parsed.issuer.legalName).toBe('DISTRIBUIDORA DE ALIMENTOS PAULISTA LTDA');
    expect(parsed.issuer.tradeName).toBe('PAULISTA ALIMENTOS');
    expect(parsed.issuer.state).toBe('SP');

    expect(parsed.recipient.document).toBe('98765432000110');
    expect(parsed.recipient.legalName).toBe('SUPERMERCADOS ALVORADA LTDA');
    expect(parsed.recipient.stateRegistration).toBe('999888777666');
  });

  it('deve extrair itens de produto com quantidades, valores e tributos', () => {
    const parsed = NfeXmlParser.parse(sampleNfeXml);

    expect(parsed.items).toHaveLength(1);
    const item = parsed.items[0];
    expect(item.code).toBe('CAFE-01');
    expect(item.description).toBe('Cafe Gourmet Especial 500g');
    expect(item.ncm).toBe('09012100');
    expect(item.cfop).toBe('5102');
    expect(item.quantity).toBe(10);
    expect(item.unitPrice).toBe(25);
    expect(item.totalPrice).toBe(250);
    expect(item.icmsValue).toBe(45);
    expect(item.pisValue).toBe(4.13);
    expect(item.cofinsValue).toBe(19);
  });

  it('deve converter parsed document para FiscalDocumentDto com status AUTHORIZED e INBOUND', () => {
    const parsed = NfeXmlParser.parse(sampleNfeXml);
    const dto = NfeXmlParser.toFiscalDocument(parsed, 'tenant_test', 'comp_test');

    expect(dto.organizationId).toBe('tenant_test');
    expect(dto.companyId).toBe('comp_test');
    expect(dto.accessKey).toBe(parsed.accessKey);
    expect(dto.operationType).toBe(OperationType.INBOUND);
    expect(dto.status).toBe(DocumentStatus.AUTHORIZED);
    expect(dto.items).toHaveLength(1);
    expect(dto.items[0].description).toBe('Cafe Gourmet Especial 500g');
  });

  it('deve lançar erro em caso de XML inválido', () => {
    expect(() => NfeXmlParser.parse('<invalid>xml</invalid>')).toThrow(
      'Conteúdo XML inválido ou não é uma NF-e/NFC-e padrão SEFAZ.'
    );
  });
});

