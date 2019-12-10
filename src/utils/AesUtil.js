import CryptoJS from 'crypto-js'

const AesUtil = function(keySize, iterationCount) {
  this.keySize = keySize / 32
  this.iterationCount = iterationCount
}

AesUtil.prototype.generateKey = function(salt, passPhrase) {
  const key = CryptoJS.PBKDF2(
    passPhrase,
    CryptoJS.enc.Hex.parse(salt),
    { keySize: this.keySize, iterations: this.iterationCount })
  return key
}

AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
  const key = this.generateKey(salt, passPhrase)
  const encrypted = CryptoJS.AES.encrypt(
    plainText,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
  const key = this.generateKey(salt, passPhrase)
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  })
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export default AesUtil
