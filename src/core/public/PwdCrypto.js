//RSA非对称加密解密
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const privateKeyStr = fs.readFileSync(path.join(__dirname, "./rsa_private_key.pem")).toString();
const publicKeyStr = fs.readFileSync(path.join(__dirname, "./rsa_public_key.pem")).toString();
const NodeRSA = require('node-rsa');
const privateKey = new NodeRSA(privateKeyStr);
const publicKey = new NodeRSA(publicKeyStr);


privateKey.setOptions({encryptionScheme: {scheme:'pkcs1'}});
publicKey.setOptions({encryptionScheme: {scheme:'pkcs1'}});

class PwdCrypto {
  /**
   * rsa加密算法
   * @param data 加密原文
   * @param mode 生成密文编码格式
   * @returns
   */
  static rsaEncrypt(data,mode = 'base64') {
    return publicKey.encrypt(data,mode);
  };

  /**
   * rsa解密算法
   * @param encrypted 加密密文
   * @param mode 生成编码格式
   * @returns
   */
  static rsaDecrypt(encrypted,mode = 'utf-8') {
    return privateKey.decrypt(encrypted,mode);
  };

  /**
   * aes加密算法
   * @param data 加密明文
   * @param public_key 所用公钥
   * @returns {*}
   */
  static aesEncrypt(data,public_key){
    let keyIv = this.enkey(public_key);
    let cipher = crypto.createCipheriv('aes-128-cbc', keyIv.key, keyIv.iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    return Buffer.from(crypted, 'binary').toString('base64');
  };

  /**
   * aes解密算法
   * from wfc
   * @param data 密文
   * @param public_key 所用公钥
   * @returns {*}
   */
  static aesDecipher(data,public_key){
    let keyIv = this.enkey(public_key);
    data = new Buffer(data, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', keyIv.key, keyIv.iv);
    var decoded = decipher.update(data, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  };



  static enkey(string=''){
    return {
      "key": string.substr(0,16),
      "iv": string.substr(16,16)
    };
  }

}

// const plainText = "123456";
// const encrypted = PwdCrypto.rsaEncrypt(plainText,'base64');
// const decrypted = PwdCrypto.rsaDecrypt(encrypted,'utf-8');
// console.log("RSA非对称加密结果:%s",encrypted);
// console.log("RSA非对称解密结果:%s",decrypted);

module.exports = PwdCrypto;