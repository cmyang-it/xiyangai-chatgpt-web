import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { OpenAI } from 'openai'
import { ChatGPTAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import httpsProxyAgent from 'https-proxy-agent'
import fetch from 'node-fetch'
import { sendResponse } from '../utils'
import { isNotEmptyString } from '../utils/is'
import { decrypt } from '../utils/decrypt'
import type { ChatContext, ModelConfig } from '../types'
import type { RequestDrawingOptions, RequestOptions, SetProxyOptions } from './types'

const { HttpsProxyAgent } = httpsProxyAgent

dotenv.config()

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 100 * 1000
const disableDebug: boolean = process.env.API_DISABLE_DEBUG === 'true'

// 这里为了启动不报错，填个假的
const mockKey = 'sk-xxxxxxxxxxxxxxxxxxxxxx'
const sApiKay: string = isNotEmptyString(process.env.API_KEY) ? process.env.API_KEY : mockKey
const modelsStr: string = isNotEmptyString(process.env.API_MODELS) ? process.env.API_MODELS : 'gpt-3.5-turbo'
const baseUrl = isNotEmptyString(process.env.API_BASE_URL) ? process.env.API_BASE_URL : 'https://api.openai.com'

let api: ChatGPTAPI

(async () => {
  const options: ChatGPTAPIOptions = {
    apiKey: sApiKay,
    debug: disableDebug,
  }

  if (isNotEmptyString(baseUrl)) {
    // if find /v1 in OPENAI_API_BASE_URL then use it
    if (baseUrl.includes('/v1'))
      options.apiBaseUrl = `${baseUrl}`
    else
      options.apiBaseUrl = `${baseUrl}/v1`
  }

  setupProxy(options)

  api = new ChatGPTAPI({ ...options })
})()

async function chatReplyProcess(options: RequestOptions) {
  const { model, apiKey, message, lastContext, process, systemMessage, max_tokens, temperature, top_p, iv, key } = options
  try {
    if (!isNotEmptyString(apiKey) && sApiKay === mockKey)
      return sendResponse({ type: 'Fail', message: 'Please fill in your API Key in the Settings', data: null })

    const sendKey = isNotEmptyString(apiKey) ? decrypt(iv, key, apiKey) : sApiKay
    const options: SendMessageOptions = { timeoutMs }

    if (isNotEmptyString(systemMessage))
      options.systemMessage = systemMessage
    options.completionParams = { model, max_tokens, temperature, top_p }

    if (lastContext != null)
      options.parentMessageId = lastContext.parentMessageId

    api.apiKey = sendKey
    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function drawingReplyProcess(options: RequestDrawingOptions) {
  const { model, apiKey, message, n, size, style, response_format, iv, key } = options
  try {
    if (!isNotEmptyString(apiKey) && sApiKay === mockKey)
      return sendResponse({ type: 'Fail', message: 'Please fill in your API Key in the Settings', data: null })
    const sendKey = isNotEmptyString(apiKey) ? decrypt(iv, key, apiKey) : sApiKay

    const openai = new OpenAI({
      baseURL: `${baseUrl}/v1`,
      apiKey: sendKey,
    })

    let msg = message
    if (isNotEmptyString(style) && style !== 'natural' && style !== 'vivid')
      msg = `${message} in the style of ${style}`

    const imageParams: OpenAI.Images.ImageGenerateParams = {
      prompt: msg,
      model,
      n,
      size,
      response_format,
    }

    if (model === 'dall-e-3') {
      // imageParams.quality = 'hd'
      if (isNotEmptyString(style) && style !== 'natural' && style !== 'vivid')
        imageParams.style = 'natural'
      else
        imageParams.style = style
    }
    const response = await openai.images.generate(imageParams, { timeout: timeoutMs }).withResponse()

    return sendResponse({ type: 'Success', data: response.data })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function chatConfig() {
  const baseUrl = process.env.API_BASE_URL
  const httpsProxy = (process.env.HTTPS_PROXY || process.env.ALL_PROXY) ?? '-'
  const socksProxy = (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
    ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`)
    : '-'
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: { baseUrl, timeoutMs, socksProxy, httpsProxy },
  })
}

async function chatModels() {
  const models: object = modelsStr.split(',')
  return sendResponse<object>({
    type: 'Success',
    data: { models },
  })
}

function setupProxy(options: SetProxyOptions) {
  if (isNotEmptyString(process.env.SOCKS_PROXY_HOST) && isNotEmptyString(process.env.SOCKS_PROXY_PORT)) {
    const agent = new SocksProxyAgent({
      hostname: process.env.SOCKS_PROXY_HOST,
      port: process.env.SOCKS_PROXY_PORT,
      userId: isNotEmptyString(process.env.SOCKS_PROXY_USERNAME) ? process.env.SOCKS_PROXY_USERNAME : undefined,
      password: isNotEmptyString(process.env.SOCKS_PROXY_PASSWORD) ? process.env.SOCKS_PROXY_PASSWORD : undefined,
    })
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options })
    }
  }
  else if (isNotEmptyString(process.env.HTTPS_PROXY) || isNotEmptyString(process.env.ALL_PROXY)) {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY
    if (httpsProxy) {
      const agent = new HttpsProxyAgent(httpsProxy)
      options.fetch = (url, options) => {
        return fetch(url, { agent, ...options })
      }
    }
  }
  else {
    options.fetch = (url, options) => {
      return fetch(url, { ...options })
    }
  }
}

export type { ChatContext, ChatMessage }

export { chatReplyProcess, drawingReplyProcess, chatConfig, chatModels }
