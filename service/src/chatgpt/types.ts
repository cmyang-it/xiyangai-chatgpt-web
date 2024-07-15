import type { ChatMessage } from 'chatgpt'
import type fetch from 'node-fetch'

export interface RequestOptions {
  model?: string
  apiKey?: string
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  iv?: string
  key?: string
}

export interface RequestDrawingOptions {
  model?: (string & {}) | 'dall-e-2' | 'dall-e-3' | null;
  apiKey?: string
  message: string
  n: number
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;
  style?: 'vivid' | 'natural' | null;
  response_format?: 'url' | 'b64_json' | null;
  iv?: string
  key?: string
}

export interface SetProxyOptions {
  fetch?: typeof fetch
}
