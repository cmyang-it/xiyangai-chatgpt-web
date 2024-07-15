import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { encrypt } from '@/utils/encrypt'
import { useSettingStore, useUserStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatModels<T = any>() {
  return get<T>({
    url: '/models',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()
  const userStore = useUserStore()

  const data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
    model: settingStore.model,
    systemMessage: settingStore.systemMessage,
    max_tokens: settingStore.maxTokens,
    temperature: settingStore.temperature,
    top_p: settingStore.top_p,
  }

  if (userStore.userInfo.apiKey) {
    const encryptData = encrypt(userStore.userInfo.apiKey)
    data.apiKey = encryptData.data
    data.iv = encryptData.iv
    data.key = encryptData.key
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchChatAPIDrawingProcess<T = any>(
  params: {
    prompt: string
  },
) {
  const settingStore = useSettingStore()
  const userStore = useUserStore()

  const data: Record<string, any> = {
    prompt: params.prompt,
    model: settingStore.model,
    n: settingStore.n,
    size: settingStore.size,
    style: settingStore.style,
    response_format: settingStore.response_format,
  }

  if (userStore.userInfo.apiKey) {
    const encryptData = encrypt(userStore.userInfo.apiKey)
    data.apiKey = encryptData.data
    data.iv = encryptData.iv
    data.key = encryptData.key
  }

  return post<T>({
		url: '/drawing-process',
		data
	})
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
