import { defineStore } from 'pinia'
import {getModels, setModel} from './helper'
import { store } from '@/store/helper'
import { fetchChatModels } from '@/api'

interface ModelResponse {
  models: []
}

export interface ModelStore {
  models: []
}

export const modelStore = defineStore('model-store', {
  state: (): ModelStore => ({
    models: getModels(),
  }),

  getters: {

  },

  actions: {
    async getModels() {
      try {
        const { data } = await fetchChatModels<ModelResponse>()
				let options = [];
				for (let value of data.models) {
					options.push({label: value, value: value})
				}
        return Promise.resolve(options)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

		setModel(data: object) {
			setModel(data)
		},

		getModelCache() {
			return getModels();
		}
  },
})

export function modelStoreWithout() {
  return modelStore(store)
}
