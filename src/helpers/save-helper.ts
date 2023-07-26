import fs from 'fs';
import { SaveObject } from '../types.js';
import { ENCRYPTION_KEY } from '../constants.js';

export const isSaveFileExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export const readSaveDataFromDisk = (path: string): SaveObject | null => {
  let content: any;
  let result: any = null;

  try {
    content = fs.readFileSync(path, 'utf8');
  } catch (error) {
    return null;
  }

  try {
    result = decode(content, ENCRYPTION_KEY);
  } catch (error) {
    return null;
  }

  try {
    result = JSON.parse(result);
  } catch (error) {
    return null;
  }

  return result;
};

export const writeSaveDataToDisk = (path: string, saveObject: SaveObject): void => {
  fs.writeFileSync(path, encode(JSON.stringify(saveObject), ENCRYPTION_KEY));
};

const stringToByteArray = (str: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

const byteArrayToString = (byteArray: Uint8Array): string => {
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
};

const base64Encode = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode.apply(null, bytes));
};

const base64Decode = (str: string): Uint8Array => {
  const binaryString = atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const xorWithKey = (a: Uint8Array, key: Uint8Array): Uint8Array => {
  const out: Uint8Array = new Uint8Array(a.length);
  for (let i = 0; i < a.length; ++i) {
    out[i] = a[i] ^ key[i % key.length];
  }
  return out;
};

export const encode = (s: string, key: string): string => {
  const encodedBytes: Uint8Array = xorWithKey(stringToByteArray(s), stringToByteArray(key));
  return base64Encode(encodedBytes);
};

export const decode = (s: string, key: string): string => {
  const decodedBytes: Uint8Array = xorWithKey(base64Decode(s), stringToByteArray(key));
  return byteArrayToString(decodedBytes);
};
