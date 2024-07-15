import { ss } from '@/utils/storage'

const LOCAL_NAME = 'modelsStorage'

export function getModels() {
  return ss.get(LOCAL_NAME)
}

export function setModel(model: object) {
  return ss.set(LOCAL_NAME, model)
}

export function removeModel() {
  return ss.remove(LOCAL_NAME)
}
