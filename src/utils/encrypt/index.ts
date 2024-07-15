import CryptoJS from 'crypto-js'
import forge from 'node-forge'

const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
	"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzLgV2/NkLWfgdFnxINzN\n" +
	"bxXe3z4Ud/vyWQWdhT/DDlPWE0wup18bWijNPy3Z8/hwYxJNyAYWeq6S6h3BAeZe\n" +
	"dAA6yRFJbFyAziiUZUVo0TQwtgZNIcOPiyx93gY6HrupfoEEz1wRnt0wj2FC0CJt\n" +
	"ALdWwnbQu4LxCPNivSX5FzQwSFW32V6w3s2kbgpU6HWxIh3h1FGNAWFHfDfyL468\n" +
	"FTFY1bvxTWqkrsuyY5pBSzJgKenaSQ4Y/epPCYZplpebI1Dz9ZDnssHo0Hs1V/hz\n" +
	"I94p1WIcjeEWInK0rhq/4FJQ5Ia+GNocn7uRmPLBmu5DtLzB6mDPZ+EkNHvww9lB\n" +
	"wQIDAQAB\n" +
	"-----END PUBLIC KEY-----\n"


function encryptWithRSA(data: string): string {
	const spublicKey = forge.pki.publicKeyFromPem(publicKey);
	const encrypted = spublicKey.encrypt(data, 'RSA-OAEP', {
		md: forge.md.sha256.create(),
	});
	return forge.util.encode64(encrypted);
}

function getKey() {
	let random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let str = "";
	for (let i = 0; i < 16; i++) {
		str = str + random.charAt(Math.random() * random.length)
	}
	return str;
}

const iv = getKey()
const key = getKey()

function aesEncrypt(value: string) {
	const srcs = CryptoJS.enc.Utf8.parse(value)
	const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
		iv: CryptoJS.enc.Utf8.parse(iv),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	})
	return encrypted.toString();
}

export function encrypt(value: string) {
	const aesData = aesEncrypt(value)
	const rsaIv = encryptWithRSA(iv)
	const rsaKey = encryptWithRSA(key)
	return {
		data: aesData,
		iv: rsaIv,
		key: rsaKey
	}
}
