<script setup lang='ts'>
import { ref } from 'vue'
import type { DrawerPlacement } from 'naive-ui'
import { NDrawer, NDrawerContent, NForm, NFormItem, NRadio, NRadioGroup, NSpace, useMessage } from 'naive-ui'
import { useSettingStore } from '@/store'
import { t } from '@/locales'

interface Props {
  toHtml: string
  imageDrawerActive: boolean
}

interface Emit {
  (ev: 'handleDrawerActive', active: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emit>()

const settingStore = useSettingStore()
const ms = useMessage()

const imageDrawerPlacement = ref<DrawerPlacement>('bottom')


const formData = ref({
  model: 'dall-e-2',
  size: '256x256',
  style: null,
  n: 1,
  response_format: 'url',
})

function handleDrawerActive(active: boolean) {
  drawerSetting()

  emit('handleDrawerActive', active)
}

function onModelUpdate(active: string) {
  formData.value.size = ''
  if (active === 'dall-e-2')
    formData.value.style = null
}

function drawerSetting() {
  if (formData.value.size ==='' || formData.value.size === null) {
    ms.warning(t('chat.imageSizeNotEmpty'))
    settingStore.size = null
    settingStore.updateSetting(settingStore.$state)
    return
  }
  if (!settingStore.isDrawing) {
    ms.info(t('setting.toDrawing'))
  } else {
    ms.success(t('common.success'))
  }
  settingStore.isDrawing = true
  settingStore.model = formData.value.model
  settingStore.size = formData.value.size
  settingStore.style = formData.value.style
  settingStore.updateSetting(settingStore.$state)
}
</script>

<template>
  <NDrawer
    :show="imageDrawerActive"
    :placement="imageDrawerPlacement"
    :trap-focus="false"
    :block-scroll="false"
    :to="toHtml"
    height="350px"
    @update-show="handleDrawerActive"
  >
    <NDrawerContent title="绘图设置">
      <NForm
        :model="formData"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
        :style="{
          maxWidth: '100%',
        }"
      >
        <NFormItem label="绘图模型" path="model">
          <NRadioGroup v-model:value="formData.model" name="model" @update-value="onModelUpdate">
            <NSpace>
              <NRadio value="dall-e-2">
                DALL·E-2
              </NRadio>
              <NRadio value="dall-e-3">
                DALL·E-3
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="图像尺寸" path="size">
          <NRadioGroup v-if="formData.model === 'dall-e-2'" v-model:value="formData.size" name="size">
            <NSpace>
              <NRadio value="256x256">
                256x256
              </NRadio>
              <NRadio value="512x512">
                512x512
              </NRadio>
              <NRadio value="1024x1024">
                1024x1024
              </NRadio>
            </NSpace>
          </NRadioGroup>
          <NRadioGroup v-else v-model:value="formData.size" name="size">
            <NSpace>
              <NRadio value="1024x1024">
                1024x1024
              </NRadio>
              <NRadio value="1792x1024">
                1792x1024
              </NRadio>
              <NRadio value="1024x1792">
                1024x1792
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="formData.model == 'dall-e-3'" label="图像风格" path="style">
          <NRadioGroup v-model:value="formData.style" name="style">
            <NSpace>
              <NRadio value="natural">
                自然
              </NRadio>
              <NRadio value="vivid">
                生动
              </NRadio>
              <NRadio value="dreamy">
                梦幻
              </NRadio>
              <NRadio value="retro">
                复古
              </NRadio>
              <NRadio value="futuristic">
                未来
              </NRadio>
              <NRadio value="minimalist">
                简约
              </NRadio>
              <NRadio value="complex">
                复杂
              </NRadio>
              <NRadio value="abstract">
                抽象
              </NRadio>
              <NRadio value="cartoon">
                卡通
              </NRadio>
              <NRadio value="pixel">
                像素
              </NRadio>
              <NRadio value="artistic">
                艺术
              </NRadio>
              <NRadio value="3d">
                3D
              </NRadio>
              <NRadio value="model">
                模型
              </NRadio>
              <NRadio value="architecture">
                建筑
              </NRadio>
              <NRadio value="product">
                产品
              </NRadio>
              <NRadio value="landscape">
                风景
              </NRadio>
              <NRadio value="surreal">
                超现实
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
      </NForm>
    </NDrawerContent>
  </NDrawer>
</template>
