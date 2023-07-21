import fs from 'fs';
export class EncoderService {
  public isSaveFileExists(path: string) {
    return fs.existsSync(path);
  }

  private stringToByteArray(str: string) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  private byteArrayToString(byteArray: any) {
    const decoder = new TextDecoder();
    return decoder.decode(byteArray);
  }

  private base64Encode(bytes: any) {
    return btoa(String.fromCharCode.apply(null, bytes));
  }

  private base64Decode(base64String: any) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
