<script setup lang="ts">
import Cropper from 'cropperjs'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import type { SetNonNullable } from 'type-fest'

const {
  id = `ModernCropper${Math.random()}`,
  src = '',
  crossorigin = 'anonymous',
} = defineProps<{
  id?: string
  src?: string
  crossorigin?: 'anonymous' | 'use-credentials'
}>()

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, milliseconds) })
}

const cropper = ref<Cropper>()
const image = ref<ReturnType<Cropper['getCropperImage']>>()
const canvas = ref<ReturnType<Cropper['getCropperCanvas']>>()
const selection = ref<ReturnType<Cropper['getCropperSelection']>>()
const selections = ref<ReturnType<Cropper['getCropperSelections']>>()

const cropperKeys = reactive({
  cropper,
  image,
  canvas,
  selection,
  selections,
})

type MountedCropperKeys = SetNonNullable<typeof cropperKeys>
type CropperHook = (cropperKeys: MountedCropperKeys) => any
function callHook(hook: CropperHook) {
  hook(cropperKeys as MountedCropperKeys)
}

let hooksList: Array<CropperHook> = []
const cropperMounted = ref<boolean>(false)
function onCropperMounted(hook: CropperHook) {
  if (cropperMounted.value)
    callHook(hook)
  else
    hooksList.push(hook)
}

onMounted(async () => {
  await nextTick()

  cropper.value = new Cropper(document.getElementById(id) as HTMLImageElement)
  image.value = cropper.value.getCropperImage()
  canvas.value = cropper.value.getCropperCanvas()
  selection.value = cropper.value.getCropperSelection()
  selections.value = cropper.value.getCropperSelections()

  cropperMounted.value = true
  hooksList.forEach(callHook)
  hooksList = []
})

onCropperMounted(({ image }) => {
  image.$image.crossOrigin = crossorigin

  // Watch src and replace / recenter
  watch(() => src, (newSrc) => {
    image.$image.src = newSrc
    image.$ready(() => sleep(0).then(() => image.$center('contain')))
  }, { immediate: true })
})

type DiscriminatedExpose = { onCropperMounted: typeof onCropperMounted }
  & (
    ({ cropperMounted: false } & typeof cropperKeys) |
    ({ cropperMounted: true } & MountedCropperKeys)
  )

defineExpose(reactive({
  ...cropperKeys,

  cropperMounted,
  onCropperMounted,
}) as DiscriminatedExpose)
</script>

<template>
  <div class="modernCropperWrapper">
    <img v-bind="{ id, src, crossorigin }">
  </div>
</template>

<style lang="scss">
.modernCropperWrapper {
  cropper-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
