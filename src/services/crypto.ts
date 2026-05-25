import CryptoJS from 'crypto-js';

const secretkey = import.meta.env.VITE_SECRET_KEY;
export function encryptPayload(data: any): string {
  if (data === undefined || data === null) return data;
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretkey).toString();
}

export function decryptPayload(cipherText: string): any {
  if (!cipherText) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretkey);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null;
    return JSON.parse(decryptedStr);
  } catch (e) {
    console.error('Decryption failed', e);
    return null;
  }
}
