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
  },
})
