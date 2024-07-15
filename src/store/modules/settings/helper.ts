import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  model: string,
  systemMessage: string,
  maxTokens: number,
  temperature: number,
  top_p: number,
  isDrawing: boolean,
  n: number,
  style: string | null,
  size: string | null,
  response_format: string
}

export function defaultSetting(): SettingsState {
  return {
    model: 'gpt-3.5-turbo',
    systemMessage: 'You are an artificial intelligence AI that is able to give the most correct answer based on the questions entered by the user. Follow the user\'s instructions carefully. Respond using markdown',
    maxTokens: 2000,
    temperature: 0.8,
    top_p: 1,
    isDrawing: false,
    n: 1,
    style: null,
    size: null,
    response_format: 'url'
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  ss.set(LOCAL_NAME, setting)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
