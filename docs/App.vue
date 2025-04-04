<!-- eslint-disable no-console -->
<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, h } from 'vue'
import { ModernCropper } from '~/index'
import { isDark, toggleDarkmode } from '@/composables/useDarkmode'

import AmongSus from '@/assets/amongus_sus.mp3'

const audioAmongSus = new Audio(AmongSus)
audioAmongSus.volume = 0.2

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, milliseconds) })
}

const imgSrc = ref('https://i.imgur.com/5BYAJlz.png')
sleep(5000).then(async () => {
  audioAmongSus.play()
  await sleep(100)
  imgSrc.value = 'https://i.imgur.com/ISGwgk9.png'
})
const cropper = useTemplateRef('cropper')

onMounted(async () => {
  console.log('Hi!', 'mount state:', cropper.value?.cropperMounted)
  console.log('Will log again in 1 sec...')
  await sleep(1000)

  if (cropper.value?.cropperMounted) {
    console.log({
      cropperRef: cropper.value,
      selection: cropper.value.selection,
    })
  }
})

const importSnippet = `import { ModernCropper } from 'vue-modern-cropper'`
const demoCode0 = `
// Register it globally
${importSnippet}
Vue.component(ModernCropper)

/* SomeComponent.vue */
// Or you could import it locally
${importSnippet}

// Use InstanceType to infer the exposed props
const cropper = useTemplateRef('cropper')

onMounted(async () => {
  // remember to await nextTick if you use Nuxt (Nuxt client component caveat)
  await nextTick()

  // Use onCropperMounted to execute hooks as soon as the cropper APIs is available
  cropper.value!.onCropperMounted(({ cropper, image, canvas, selection, selections }) => {
    selection.$toCanvas().then(canvas => console.log('cropped:', canvas.toDataURL()))
  })

  // Or access them directly through the ref, you need to make sure they are available though
  if (cropper.value.cropperMounted)
    cropper.value.cropper
})
...
<ModernCropper
  ref="cropper"
  class="w-80 h-40"
  :src="imgSrc"
  :pass-through="{
    cropper: { constructOptions: undefined },
    image: { attributes: { class: 'blur' } },
    canvas: { attributes: { background: false } },
    selection: { attributes: { id: 'cropper-selection-86' } },
    selections: { attributes: undefined },
  }"
/>

// To creates a 'cropper-viewer' component
<component 
  v-if="cropper?.cropperMounted" 
  :is="h('cropper-viewer', { selection: '#cropper-selection-86' })"
/>
...
`
</script>

<template>
  <div class="h-full min-h-screen w-full bg-neutral-50 dark:bg-neutral-900">
    <div class="relative mx-auto max-w-5xl container">
      <nav class="h-20 flex-between py-4 text-primary">
        <div class="flex-center gap-2 text-xl font-semibold">
          <Logo class="h-6 w-6" />
          <span class="text-#327959">Vue</span>Modern Cropper
        </div>
        <div class="flex-center gap-4">
          <button class="opacity-50 transition !bg-transparent hover:opacity-100" @click="(e) => toggleDarkmode()">
            <tabler:moon v-if="isDark" class="h-6 w-6" />
            <tabler:sun v-else class="h-6 w-6" />
          </button>
          <a class="opacity-50 transition hover:opacity-100" href="https://github.com/NamesMT/vue-modern-cropper">
            <tabler:brand-github class="h-6 w-6" />
          </a>
        </div>
      </nav>
      <header class="py-20">
        <div class="font-extrabold">
          <span class="text-6xl text-neon">Looking for a modern cropper?</span>
          <div class="flex gap-2 text-6xl text-primary">
            <Logo class="h-15 w-15" />
            <span class="text-#327959">Vue</span>Modern Cropper
          </div>
        </div>
        <div class="py-4 text-2xl text-slate-700 font-semibold dark:text-slate-200">
          Power-packed wrapper over cropperjs@next
        </div>
        <div class="py-4 text-xl text-slate-700 font-semibold italic dark:text-slate-200">
          <p>Why "modern cropper"?</p>
          <p>
            It's mid 2024, I been searching, installing, trying all everything and can't find a maintained/bug-free,
            easy to use cropper component library for Vue -- <span class="whitespace-nowrap">(╯°□°)╯︵ ┻━┻</span>
          </p>
          <p>So I created this.</p>
          <p class="text-base">
            btw, <a href="https://github.com/NamesMT/nuxt-modern-cropper" class="text-lime">there's also a module for <b class="text-xl text-#00DC82">Nuxt</b></a>
          </p>
        </div>
        <!-- <div class="flex gap-4 mt-8">
          <a
            class="bg-gray-200 hover:bg-gray-300 transition rounded-full text-lg font-semibold py-3 px-6 w-full sm:w-auto text-center"
            href="https://github.com/NamesMT/vue-modern-cropper"
            target="_blank"
          >
            <span>See Github repo</span>
          </a>
          <a
            class="bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center space-x-3 transition rounded-full text-white text-lg font-semibold py-3 px-6 w-full sm:w-auto cursor-pointer"
            href="https://github.com/new?template_name=vue-modern-cropper&template_owner=NamesMT"
            target="_blank"
          >
            <span>Use the template</span>
          </a>
        </div> -->
      </header>

      <main class="grid grid-cols-1 gap-8 text-xs 2xl:text-sm">
        <Highlight :autodetect="false" language="javascript" :code="demoCode0" />
      </main>

      <div class="my-2 text-primary flex flex-col gap-4">
        Check out cropperjs's document: <a href="https://fengyuanchen.github.io/cropperjs/" class="text-#3399ff">https://fengyuanchen.github.io/cropperjs/</a>

        <hr>

        <div class="flex items-center justify-center gap-10">
          <ModernCropper
            ref="cropper"
            class="h-40 w-80"
            :src="imgSrc"
            :pass-through="{
              cropper: { constructOptions: undefined },
              image: { attributes: { class: 'blur' } },
              canvas: { attributes: { background: false } },
              selection: { attributes: { id: 'cropper-selection-69' } },
              selections: { attributes: undefined },
            }"
          />

          <div class="w-80 h-40 overflow-hidden">
            <component 
              v-if="cropper?.cropperMounted" 
              :is="h('cropper-viewer', { selection: '#cropper-selection-69' })"
            />
          </div>
        </div>
      </div>

      <footer class="[&_a]:text-primary-600 [&_a]:dark:text-primary-300 mt-16 w-full" text="slate-900 dark:slate-300 opacity-60 sm">
        <div class="mb-2 flex justify-center">
          <ThemeToggle />
        </div>

        <div class="copyright flex flex-col items-center justify-center">
          <p>
            Code with ❤ & ☕️ by
            <a href="https://github.com/NamesMT">
              @NamesMT
            </a>
            <span> © {{ new Date().getFullYear() }}</span>
          </p>

          <p class="flex items-center space-x-1">
            <tabler:brand-twitter-filled class="text-primary-400" />
            <span>
              <a href="https://twitter.com/topnames_MT" target="_blank">
                Follow me on Twitter
              </a>
            </span>
            <span class="text-primary-300 px-2">|</span>
            <tabler:brand-github-filled class="text-primary-400" />
            <span>
              <a href="https://github.com/sponsors/NamesMT" target="_blank">
                Sponsor me on GitHub
              </a>
            </span>
          </p>
        </div>
      </footer>

      <div class="mx-auto w-full" />
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/highlight.scss';
</style>
