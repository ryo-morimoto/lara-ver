import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  manifest: {
    permissions: [
      'storage',
    ],
    host_permissions: [
      'https://laravel.com/*',
      'https://readouble.com/*',
    ],
    name: 'Lara Ver',
    description: 'Laravel documentation version fixer',
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      96: 'icon/96.png',
      128: 'icon/128.png',
    },
  },
})
