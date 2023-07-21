import fs from 'fs';
import { ENCRYPTION_KEY } from '../constants.js';
import { CardWithTitle, Preset, RelicWithTitle, SaveObject } from '../types.js';
export class EncoderService {
  public isSaveFileExists(path: string): boolean {
    return fs.existsSync(path);
  }

  public readSaveDataFromDisk(path: string): any {
    const content = fs.readFileSync(path, 'utf8');
    let result: any = null;
    try {
      result = this.decode(content, ENCRYPTION_KEY);
    } catch (error) {
      return null;
    }

    try {
      result = JSON.parse(result);
    } catch (error) {
      return null;
    }

    return result;
  }

  private stringToByteArray(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  private byteArrayToString(byteArray: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(byteArray);
  }

  private base64Encode(bytes: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, bytes));
  }

  private base64Decode(str: string): Uint8Array {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private xorWithKey(a: Uint8Array, key: Uint8Array): Uint8Array {
    const out: Uint8Array = new Uint8Array(a.length);
    for (let i = 0; i < a.length; ++i) {
      out[i] = a[i] ^ key[i % key.length];
    }
    return out;
  }

  public encode(s: string, key: string): string {
    const encodedBytes: Uint8Array = this.xorWithKey(
      this.stringToByteArray(s),
      this.stringToByteArray(key)
    );
    return this.base64Encode(encodedBytes);
  }

  public decode(s: string, key: string): string {
    const decodedBytes: Uint8Array = this.xorWithKey(
      this.base64Decode(s),
      this.stringToByteArray(key)
    );
    return this.byteArrayToString(decodedBytes);
  }

  public injectPresetToSaveObject(
    presetObject: Preset,
    saveObject: SaveObject,
    cards: CardWithTitle,
    relics: RelicWithTitle
  ): SaveObject {
    return;
  }
}
