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
    name: 'Lara Ver - Laravel Documentation Version Manager',
    short_name: 'Lara Ver',
    description: 'Automatically lock Laravel documentation to your preferred version. Never lose your place when browsing Laravel docs!',
    version: '1.0.0',
    author: 'Ryo Morimoto',
    homepage_url: 'https://github.com/ryo-morimoto/lara-ver',
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      96: 'icon/96.png',
      128: 'icon/128.png',
    },
  },
})
