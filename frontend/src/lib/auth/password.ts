import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

/**
 * Hash mật khẩu bằng thuật toán scrypt kèm salt
 * Định dạng lưu: `<salt_hex>:<hash_hex>`
 */
export function hashPassword(plainPassword: string, customSalt?: string): string {
  const salt = customSalt ?? randomBytes(16).toString('hex');
  const derivedKey = scryptSync(plainPassword, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Xác thực mật khẩu so với chuỗi `<salt_hex>:<hash_hex>` đã lưu
 */
export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;

  try {
    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = scryptSync(plainPassword, salt, KEY_LENGTH);
    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
