<script lang="ts" setup>
import { isDark, toggleDarkmode } from '~/composables/useDarkmode'
import { ModernCropper } from '../packages'
import { onMounted, ref } from 'vue';

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, milliseconds) })
}

const srcImg = ref('https://i.imgur.com/5BYAJlz.png')
sleep(5000).then(() => srcImg.value = 'https://i.imgur.com/ISGwgk9.png')
const cropper = ref<InstanceType<typeof ModernCropper>>()

onMounted(async () => {
  console.log('Hi!', 'mount state:', cropper.value?.cropperMounted)
  console.log('Will log again in 1 sec...')
  await sleep(1000)
  
  if (cropper.value?.cropperMounted) {
    console.log({
      cropperRef: cropper.value,
      selection: cropper.value.selection
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
const cropper = ref<InstanceType<typeof ModernCropper>>()

onMounted(() => {
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
  :src="imgSrc"
>
</ModernCropper>
...
`
</script>

<template>
  <div class="w-full h-full min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <div class="container mx-auto max-w-5xl relative">
      <nav class="h-20 py-4 flex-between text-primary">
        <div class="font-semibold text-xl flex-center gap-2">
          <Logo class="h-6 w-6" />
          <span class="text-#327959">Vue</span>Modern Cropper
        </div>
        <div class="flex-center gap-4">
          <button class="!bg-transparent opacity-50 hover:opacity-100 transition" @click="(e) => toggleDarkmode()">
            <carbon:moon class="w-6 h-6" v-if="isDark" />
            <carbon:sun class="w-6 h-6" v-else />
          </button>
          <a class="opacity-50 hover:opacity-100 transition" href="https://github.com/NamesMT/vue-modern-cropper">
            <carbon:logo-github class="h-6 w-6" />
          </a>
        </div>
      </nav>
      <header class="py-20">
        <div class="font-extrabold">
          <span class="text-6xl text-neon">Looking for a modern cropper?</span>
          <div class="text-6xl text-primary flex gap-2"><Logo class="w-15 h-15" />Vue Modern Cropper</div>
        </div>
        <div class="text-2xl font-semibold text-slate-700 py-4 dark:text-slate-200">
          Power-packed wrapper over cropperjs@next
        </div>
        <div class="text-xl italic font-semibold text-slate-700 py-4 dark:text-slate-200">
          <p>Why "modern cropper"?</p>
          <p>It's mid 2024, I been searching, installing, trying all everything and can't find a maintained/bug-free,
            easy to use cropper component library for Vue -- <span class="whitespace-nowrap">(╯°□°)╯︵ ┻━┻</span></p>
          <p>So I created this.</p>
          <p class="text-base">btw, <a href="https://github.com/NamesMT/nuxt-modern-cropper" class="text-lime">there's also a module for <b class="text-#00DC82 text-xl">Nuxt</b></a></p>
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

      <div class="my-2 text-primary">
        Check out cropperjs@next document: <a href="https://fengyuanchen.github.io/cropperjs/v2/api/" class="text-#3399ff">https://fengyuanchen.github.io/cropperjs/v2/api/</a>
        <ModernCropper ref="cropper" :src="srcImg" class="h-40"/>
      </div>

      <footer class="mt-16 w-full flex-center text-primary" text="slate-900 dark:slate-300 opacity-60 sm">
        <div class="copyright flex flex-col justify-center items-center">
          <p>
            Code with ❤ & ☕️ by
            <a class="text-neon" href="https://github.com/NamesMT">
              @NamesMT
            </a>
            <span> © {{ new Date().getFullYear() }}</span>
          </p>
          <p class="flex items-center space-x-1">
            <carbon:logo-twitter class="text-emerald-500" />
            <span>
              <a href="https://twitter.com/NamesMT" class="text-neon" target="_blank">
                Follow me on Twitter
              </a>
            </span>
            <span class="px-2 text-emerald-300">|</span>
            <carbon:cafe class="text-emerald-500" />
            <span>
              <a href="https://www.buymeacoffee.com/xlbd" target="_blank" class="text-neon">
                Buy me a coffee
              </a>
            </span>
            <span class="px-2 text-emerald-300">|</span>
            <mdi:heart class="text-emerald-500" />
            <span>
              <a href="https://github.com/sponsors/NamesMT" target="_blank" class="text-neon">
                Sponsor me on GitHub
              </a>
            </span>
          </p>
        </div>
      </footer>

      <div class="w-full mx-auto"></div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/highlight.scss';
</style>
