import type { Router } from 'vue-router'
import { modelStoreWithout } from '@/store/modules/models'

export function setupPageModel(router: Router) {
	router.beforeEach(async (to, from, next) => {
		const modelStore = modelStoreWithout()
		const modelData = await modelStore.getModels()
		modelStore.setModel(modelData)
		next()
	})
}
