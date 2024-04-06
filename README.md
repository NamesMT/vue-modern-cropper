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

> Power-packed wrapper over cropperjs@next

## Table of Contents

<details>

<summary>TOC</summary>

- [Vue Modern Cropper](#vue-modern-cropper)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [License](#license)

</details>

## NOTE!!
`vue-modern-cropper` uses `cropperjs@next` (v2), which is not yet stable release, you can check it's documentation [HERE](https://fengyuanchen.github.io/cropperjs/v2/api/)

Feel free to submit PRs to add helper functions.

## Usage
```sh
# Install it
pnpm add vue-modern-cropper
```

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

```

## License

MIT [@NamesMT](https://github.com/NamesMT)
