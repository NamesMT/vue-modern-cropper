# Vue Modern Cropper

[![NPM][npmBadge]][npmUrl]
[![Minzip Package][bundlePhobiaBadge]][bundlePhobiaUrl]
[![NPM Download][npmDtBadge]][npmDtUrl]

[npmBadge]: https://img.shields.io/npm/v/vue-modern-cropper.svg?maxAge=2592000
[npmUrl]: https://www.npmjs.com/package/vue-modern-cropper
[npmDtBadge]: https://img.shields.io/npm/dt/vue-modern-cropper.svg
[npmDtUrl]: https://www.npmjs.com/package/vue-modern-cropper
[bundlePhobiaBadge]: https://img.shields.io/bundlephobia/minzip/vue-modern-cropper
[bundlePhobiaUrl]: https://bundlephobia.com/package/vue-modern-cropper@latest

> It's mid 2024, I've been searching, installing, and trying all, everything, but I can't find a maintained/bug-free, easy to use cropper component library for Vue -- (╯°□°)╯︵ ┻━┻  
So I created this.

> Power-packed wrapper over cropperjs@next

## Table of Contents

<details>

<summary>TOC</summary>

- [Vue Modern Cropper](#vue-modern-cropper)
  - [Table of Contents](#table-of-contents)
  - [NOTE!!](#note)
  - [Features](#features)
  - [Usage](#usage)
    - [Install](#install)
    - [Use](#use)
  - [License](#license)

</details>

## NOTE!!
`vue-modern-cropper` is a small wrapper over `cropperjs` (v2), improving ease of use and DX, while still preversing it's full customizability power, you can check it's documentation [HERE](https://fengyuanchen.github.io/cropperjs/)

At its current state, `cropperjs` is not SSR-friendly, though, even if it's SSR-able, I think it would be better to render it client-only to avoid overhead on the server, so remember to wrap/mark the component as `ClientOnly` if your project have SSR-enabled.

Feel free to submit PRs to improve DX even more 😘.

## Features
+ 🔥 Import and use, typed component with discriminated union support

## Usage
### Install
```sh
pnpm add vue-modern-cropper
```

### Use
<!-- eslint-skip -->
```ts
// Register it globally
import { ModernCropper } from 'vue-modern-cropper'
Vue.component(ModernCropper)

/* SomeComponent.vue */
// Or you could import it locally
import { ModernCropper } from 'vue-modern-cropper'

// Use InstanceType to infer the exposed props
const cropper = ref<InstanceType<typeof ModernCropper>>()
// Or better, use `useTemplateRef` (vue 3.5+)
// const cropper = useTemplateRef('cropper')

onMounted(async () => {
  // remember to await nextTick if you use Nuxt (Nuxt client-component caveat)
  await nextTick()

  // Use onCropperMounted to execute hooks as soon as the cropper APIs is available
  cropper.value!.onCropperMounted(({ cropper, image, canvas, selection, selections }) => {
    selection.$toCanvas().then(canvas => console.log('cropped:', canvas.toDataURL()))
  })

  // Or access them directly through the ref, you need to make sure they are available though
  if (cropper.value.cropperMounted)
    cropper.value.cropper
})

... // Somewhere in the <template>:
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

// Tips: to use custom cropper components without setting `isCustomElement` config:
<component 
  v-if="cropper?.cropperMounted" 
  :is="h('cropper-viewer', { selection: '#cropper-selection-86' })"
/>
...

```

## License

MIT [@NamesMT](https://github.com/NamesMT)
