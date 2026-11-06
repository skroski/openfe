import { describe, it, expect } from 'vitest';
import { SimpleZip } from './zip-builder';
import * as zlib from 'zlib';

describe('SimpleZip - In-memory ZIP Archive Generator', () => {
  it('deve gerar arquivo ZIP válido contendo arquivos com compressão deflate', () => {
    const zip = new SimpleZip();
    zip.addFile('test.txt', 'Conteúdo de teste OpenNFE');
    zip.addFile('subpasta/nota.xml', '<nfeProc><infNFe></infNFe></nfeProc>');

    const zipBuffer = zip.build();

    expect(zipBuffer).toBeDefined();
    expect(zipBuffer.length).toBeGreaterThan(0);

    // Valida magic bytes de cabeçalho PKZIP: 0x50, 0x4B, 0x03, 0x04 ("PK\x03\x04")
    expect(zipBuffer[0]).toBe(0x50);
    expect(zipBuffer[1]).toBe(0x4b);
    expect(zipBuffer[2]).toBe(0x03);
    expect(zipBuffer[3]).toBe(0x04);
  });
});

