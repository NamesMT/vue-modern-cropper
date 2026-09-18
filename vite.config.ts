import type { UserConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import CleanCSS from 'clean-css'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

const cleanCssInstance = new CleanCSS({})
function minify(code: string) {
  return cleanCssInstance.minify(code).styles
}

let cssCodeStr = ''

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  const userConfig: UserConfig = {}

  const commonPlugins = [
    vue({
      script: {
        propsDestructure: true,
      },
    }),
    UnoCSS(),
    Components({
      dirs: 'components',
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
      ],
    }),
    Icons(),
  ]

  if (mode === 'lib') {
    userConfig.build = {
      target: 'esnext',
      lib: {
        entry: resolve(import.meta.dirname, 'lib/index.ts'),
        name: 'ModernCropper',
        fileName: 'vue-modern-cropper',
      },
      outDir: resolve(import.meta.dirname, './dist'),
      emptyOutDir: true,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        external: ['vue', 'cropperjs'],
        output: [
          {
            format: 'es',
            entryFileNames: `vue-modern-cropper.mjs`,
          },
        ],
      },
    }
    userConfig.plugins = [
      ...commonPlugins,
      {
        name: 'inline-css',
        transform(code, id) {
          const isCSS = (path: string) => /\.(?:css|scss|sass|postcss)$/.test(path)
          if (!isCSS(id))
            return

          const cssCode = minify(code)
          cssCodeStr = cssCode
          return {
            code: '',
            map: { mappings: '' },
          }
        },
        renderChunk(code, { isEntry }) {
          if (!isEntry)
            return

          return {
            code: `\
            function injectCss(code) {
              if (!code || typeof document == 'undefined') return
              let head = document.head || document.getElementsByTagName('head')[0]
              let style = document.createElement('style')
              style.type = 'text/css'
              head.appendChild(style)
              ;style.styleSheet ? (style.styleSheet.cssText = code) : style.appendChild(document.createTextNode(code))
            }\n
            injectCss(${JSON.stringify(cssCodeStr)})
            \n ${code}`,
            map: { mappings: '' },
          }
        },
      },
    ]
  }

  return {
    root: './docs',
    build: {
      outDir: resolve(import.meta.dirname, './dist-docs'),
    },
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, './docs'),
        '~': resolve(import.meta.dirname, './lib'),
      },
    },
    plugins: [...commonPlugins],
    ...userConfig,
  }
})
