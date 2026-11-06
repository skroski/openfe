import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

export interface EncryptedData {
  encryptedData: string; // base64
  iv: string;            // hex
  authTag: string;       // hex
}

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;

  /**
   * Derive a 32-byte key from the provided secret or environment variable
   */
  private static getKey(customKey?: string): Buffer {
    const rawKey = customKey || process.env['APP_ENCRYPTION_KEY'] || 'opennfe_secure_default_master_encryption_key_32bytes!';
    return createHash('sha256').update(rawKey).digest();
  }

  /**
   * Encrypts plaintext or binary buffer with AES-256-GCM
   */
  static encrypt(data: string | Buffer, customKey?: string): EncryptedData {
    const key = this.getKey(customKey);
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, key, iv);

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8');
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypts an EncryptedData payload with AES-256-GCM and verifies authenticity
   */
  static decrypt(payload: EncryptedData, customKey?: string): Buffer {
    const key = this.getKey(customKey);
    const iv = Buffer.from(payload.iv, 'hex');
    const authTag = Buffer.from(payload.authTag, 'hex');
    const decipher = createDecipheriv(this.ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);
    const encryptedBuffer = Buffer.from(payload.encryptedData, 'base64');
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

    return decrypted;
  }

  /**
   * Helper to decrypt as UTF-8 string
   */
  static decryptString(payload: EncryptedData, customKey?: string): string {
    return this.decrypt(payload, customKey).toString('utf-8');
  }
}

