import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  model: string | 'gpt-3.5-turbo'
  apiKey: string | ''
  prompt: string
  options?: ChatContext
  systemMessage: string
  max_tokens?: number
  temperature?: number
  top_p?: number
	iv?: string
	key?: string
}

export interface RequestDrawingProps {
  model?: (string & {}) | 'dall-e-2' | 'dall-e-3' | null;
  apiKey: string | ''
  prompt: string
  n: number | 1,
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;
  style?: 'vivid' | 'natural' | null;
  response_format?: 'url' | 'b64_json' | null;
	iv?: string,
	key?: string
}


export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ModelConfig {
  baseUrl?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
}

export type ApiModel = 'ChatGPTAPI'
