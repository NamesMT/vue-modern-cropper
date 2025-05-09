<script setup lang="ts">
import type { CropperOptions } from 'cropperjs'
import Cropper from 'cropperjs'
import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue'
import type { SetNonNullable } from 'type-fest'

export interface PassThroughOptions {
  /**
   * The `new Cropper()` class construction
   */
  cropper?: { constructOptions?: CropperOptions }

  /**
   * The cropper-image element
   */
  image?: { attributes?: Partial<ReturnType<Cropper['getCropperImage']> & { class: string }> }

  /**
   * The cropper-canvas element
   */
  canvas?: { attributes?: Partial<ReturnType<Cropper['getCropperCanvas']> & { class: string }> }

  /**
   * The (first) cropper-selection element
   */
  selection?: { attributes?: Partial<ReturnType<Cropper['getCropperSelection']> & { class: string }> }

  /**
   * All cropper-selection elements
   */
  selections?: { attributes?: Partial<ReturnType<Cropper['getCropperSelection']> & { class: string }> }
}

const {
  id = `ModernCropper${Math.random()}`,
  src = '',
  crossorigin = 'anonymous',

  resetOnInitialAttributes = true,
  useEventListeners = false,

  passThrough,
} = defineProps<{
  id?: string
  src?: string
  crossorigin?: 'anonymous' | 'use-credentials'

  /**
   * Automatically call $reset() on initial attributes changes
   * @default true
   */
  resetOnInitialAttributes?: boolean
  /**
   * Use event listeners instead of direct property assignment for event attributes (onchange etc)
   * @default false
   */
  useEventListeners?: boolean

  passThrough?: PassThroughOptions
}>()

const pixelData = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

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

  cropper.value = new Cropper(document.getElementById(id) as HTMLImageElement, passThrough?.cropper?.constructOptions)
  image.value = cropper.value.getCropperImage()
  canvas.value = cropper.value.getCropperCanvas()
  selection.value = cropper.value.getCropperSelection()
  selections.value = cropper.value.getCropperSelections()

  cropperMounted.value = true
  hooksList.forEach(callHook)
  hooksList = []
})

// process top-level props (i.e: src, crossorigin)
onCropperMounted(({ image }) => {
  image.$image.crossOrigin = crossorigin

  // Watch src and replace / recenter
  watch(() => src, (newSrc) => {
    if (!newSrc)
      console.warn(`[ModernCropper]: 'src' is empty, will fallback to pixel data to avoid error fetch.`)
    const _newSrc = newSrc || pixelData

    image.setAttribute('src', _newSrc)
    image.$ready(() => sleep(0).then(() => image.$center('contain')))

    // Optional but nice to have, also change `src` of the original <img> element
    document.getElementById(id)?.setAttribute('src', _newSrc)
  }, { immediate: true })
})

// process passThrough options
onCropperMounted(({ image, canvas, selection, selections }) => {
  watch(
    () => passThrough?.image,
    (newImagePassThrough) => {
      if (newImagePassThrough?.attributes)
        _setElementAttributes(image, newImagePassThrough.attributes)
    },
    { deep: true, immediate: true },
  )

  watch(
    () => passThrough?.canvas,
    (newCanvasPassThrough) => {
      if (newCanvasPassThrough?.attributes)
        _setElementAttributes(canvas, newCanvasPassThrough.attributes)
    },
    { deep: true, immediate: true },
  )

  watch(
    () => passThrough?.selection,
    (newSelectionPassThrough) => {
      if (newSelectionPassThrough?.attributes)
        _setElementAttributes(selection, newSelectionPassThrough.attributes)
    },
    { deep: true, immediate: true },
  )

  watch(
    () => passThrough?.selections,
    (newSelectionsPassThrough) => {
      if (newSelectionsPassThrough?.attributes)
        selections.forEach(selection => _setElementAttributes(selection, newSelectionsPassThrough.attributes!))
    },
    { deep: true, immediate: true },
  )
})

type DiscriminatedExpose = { onCropperMounted: typeof onCropperMounted }
  & (
    ({ cropperMounted: false } & typeof cropperKeys) |
    ({ cropperMounted: true } & MountedCropperKeys)
  )

defineExpose(reactive({
  ...toRefs(cropperKeys),

  cropperMounted,
  onCropperMounted,
}) as DiscriminatedExpose)

function _setElementAttributes(element: HTMLElement, attributes: Record<any, any>) {
  let doReset = false

  Object.entries(attributes).forEach(([attribute, value]) => {
    // Convert camelCase to kebab-case
    const _attribute = attribute.replaceAll(/([a-z])([A-Z])/g, (_match, p1: string, p2: string) => `${p1}-${p2.toLowerCase()}`) as keyof HTMLElement
    const currentValue = element[_attribute] ?? element.getAttribute(_attribute)

    if (value === undefined || currentValue === value)
      return

    if (_attribute.includes('initial') && resetOnInitialAttributes)
      doReset = true

    if (value === false || value === null)
      return element.removeAttribute(_attribute)

    // Handle event attributes
    if (/^on[a-z]+$/.test(_attribute)) {
      if (useEventListeners)
        element.addEventListener(_attribute.replace(/^on/, ''), value)
      else {
        // @ts-expect-error cannot assign to readonly property
        element[_attribute] = value
      }
      return
    }

    element.setAttribute(_attribute, value)
  })

  if (doReset) {
    console.warn(`[ModernCropper]: "initial"-type attribute detected, will call $reset()`)
    // @ts-expect-error $reset don't exist on HTMLElement
    element.$reset()
  }
}
</script>

<template>
  <div class="modern-cropper__wrapper">
    <img :src="pixelData" v-bind="{ id, crossorigin }">
  </div>
</template>

<style lang="scss">
.modern-cropper__wrapper {
  cropper-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
