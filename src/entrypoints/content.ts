export default defineContentScript({
  matches: ['*://*.readouble.com/*', '*://*.laravel.com/*'],
  main() {
    console.log('Hello content.');
  },
});
