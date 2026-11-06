import { describe, it, expect } from 'vitest';
import { EncryptionService } from './encryption.service';

describe('EncryptionService (AES-256-GCM)', () => {
  it('deve cifrar e decifrar texto confidencial mantendo a fidelidade', () => {
    const secretText = 'SenhaForte123!@#_CertificadoA1';
    const encrypted = EncryptionService.encrypt(secretText);

    expect(encrypted.encryptedData).toBeDefined();
    expect(encrypted.iv).toHaveLength(32); // 16 bytes in hex
    expect(encrypted.authTag).toHaveLength(32); // 16 bytes in hex

    const decrypted = EncryptionService.decryptString(encrypted);
    expect(decrypted).toBe(secretText);
  });

  it('deve cifrar e decifrar buffers binários (.pfx de certificados digitais)', () => {
    const rawCertificateBytes = Buffer.from([0x30, 0x82, 0x04, 0xbf, 0x02, 0x01, 0x03]);
    const encrypted = EncryptionService.encrypt(rawCertificateBytes);

    const decrypted = EncryptionService.decrypt(encrypted);
    expect(decrypted.equals(rawCertificateBytes)).toBe(true);
  });

  it('deve rejeitar decifração caso o auth tag seja adulterado (Integridade GCM)', () => {
    const encrypted = EncryptionService.encrypt('Dados Fiscais');
    // Adulterar auth tag
    const tampered = {
      ...encrypted,
      authTag: encrypted.authTag.replace(/^[0-9a-f]/, 'a' === encrypted.authTag[0] ? 'b' : 'a'),
    };

    expect(() => EncryptionService.decrypt(tampered)).toThrow();
  });
});

