import CryptoJS from 'crypto-js'
import forge from 'node-forge'

const privateKey = '-----BEGIN PRIVATE KEY-----\n' +
	'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMuBXb82QtZ+B0\n' +
	'WfEg3M1vFd7fPhR3+/JZBZ2FP8MOU9YTTC6nXxtaKM0/Ldnz+HBjEk3IBhZ6rpLq\n' +
	'HcEB5l50ADrJEUlsXIDOKJRlRWjRNDC2Bk0hw4+LLH3eBjoeu6l+gQTPXBGe3TCP\n' +
	'YULQIm0At1bCdtC7gvEI82K9JfkXNDBIVbfZXrDezaRuClTodbEiHeHUUY0BYUd8\n' +
	'N/IvjrwVMVjVu/FNaqSuy7JjmkFLMmAp6dpJDhj96k8JhmmWl5sjUPP1kOeywejQ\n' +
	'ezVX+HMj3inVYhyN4RYicrSuGr/gUlDkhr4Y2hyfu5GY8sGa7kO0vMHqYM9n4SQ0\n' +
	'e/DD2UHBAgMBAAECggEBALlIhyg6QlnCIWjNGqsmjJxUzBF7C2WI10/xAB9glTa7\n' +
	'dA6lLbh4ILZaJWFgK1pfacCRCWrW77N7myZfZZdFnAkbSBlBFxYHJuDv41dBGdv2\n' +
	'g3vLejXr3FgXHZg8RJAaQw5m0San6p7BDLlISwM7lTJHvTNl/AcqPONf/Oa6npZ7\n' +
	'G91RBreoVoy1KCDZGLshx6ZlDUl08ZxSyyxjWCABcqxOFruruIfDayXTxIJ2po4V\n' +
	'24zoZl4JdDvSvwtaCN8Z43FQLhp2fl3Xjd3uaDDlhaGGiH1etb34tiZtA53zL+yQ\n' +
	'sSEV3GyRFLsuzd2kWFO7RTUQ2ZCLF9I9uXTDCi6jgQECgYEA7hbPhWbRtwpbo1no\n' +
	'gkUOrVcCihfzNuhJA6CkoDNbrj+x5pE1rvelSdwkNOzxqu1sTZ5qqBU555nzxNVQ\n' +
	'XPfCTRC7y2Dql0EhpakOicqjdh6X1dgtYQTZHwq8rvIiAEV/qepM//UyV4mFmyao\n' +
	'gc1cPVG+vbHRUfYTNX1z/3QKPJECgYEA3B6gC4pmfEZPSrRJfPUOyyrg+a4+6WMQ\n' +
	'XntiRY3BoNGWsAIb2mIvDFhWKLgR+4h4M5WeMkG1r8tnPP7kQ/0yrqvM10qdoreY\n' +
	'rRhlLD05nUjCD8wyl2QBzBVsQRDOgBEK3UgUsmKXr/jXw0QfG3MTVK5DEriGegz/\n' +
	'vESl2IomCjECgYEAmLOWm5fLb5s8FPPINSz3ceN5ZHph6lhm4+W3UGxAI+0EO73s\n' +
	'cXCx2UJREoTZpugp60psW6tpfQp3l0m9BjN9shHGcHWTYDlMzEQ2Z9fIqSyL84J3\n' +
	'8F68prUrOQVhG013yNHWWt+3Tv+L6muL7dx5iXaRYHbYqrmprkftCu0w15ECgYAW\n' +
	'6Aj3qntny1lNCN3s5wOXGOs4kG1zlB+L9YMQgeP4fFcWEeIcI8OJoVe1/RHB/z2j\n' +
	'AJrp1/S0SpJ/wna2rI6tpqs2bEljOX/l43gD1os8Vun7AuDw6DNXrZMKYlla8msT\n' +
	'BAFDXwcyBM9PPrOOA7erREcul41G/jtOuEYZ9qZmwQKBgCqNCiAQoi+wjQg65Q17\n' +
	'cCDmKNeGWSLAv4J7aaqmRTJyej8ERRqxgQZs5+JXzHfPNjAqCCv3l5ZOOL/InjiB\n' +
	'qh400DpZRzpcwPRfD41ihdn/CgGxAUN8bk6K8W+vt5EUB3O43Y1xJY6neWF1lXCG\n' +
	'fQtMrULh6qZAG5OJFgb2IIKm\n' +
	'-----END PRIVATE KEY-----'

export function decryptWithRSA(encryptedData: string): string {
	const sprivateKey = forge.pki.privateKeyFromPem(privateKey);
	const decodedData = forge.util.decode64(encryptedData);
	const decrypted = sprivateKey.decrypt(decodedData, 'RSA-OAEP', {
		md: forge.md.sha256.create(),
	});
	return decrypted;
}

function aesDecrypt(key: string, iv: any, content: string) {
	let decrypt = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
		iv: CryptoJS.enc.Utf8.parse(iv),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return decrypt.toString(CryptoJS.enc.Utf8);
}

export function decrypt(rsaIv: string, rsaKey: string, aesData: string) {
	const iv = decryptWithRSA(rsaIv)
	const key = decryptWithRSA(rsaKey)
	return aesDecrypt(key, iv, aesData)
}
