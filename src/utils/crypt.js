import CryptoJS from 'crypto-js';

const CRYPT_KEY = '2048c6983aba9344';

class Crypt {
  constructor() {
    this.key = CRYPT_KEY;
  }

  //加密
  encrypt(word) {
    let key = CryptoJS.enc.Utf8.parse(this.key);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }
}

export default new Crypt();