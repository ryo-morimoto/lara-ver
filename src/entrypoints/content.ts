export default defineContentScript({
  matches: ["*://laravel.com/docs/*", "*://readouble.com/laravel/*"],
  async main() {
    console.log("Laravel documentation detected");

    // Get user's preferred version from storage
    const { preferredVersion } = await browser.storage.sync.get(
      "preferredVersion"
    );

    if (!preferredVersion) {
      console.log("No preferred version set");
      return;
    }

    // Check current URL and redirect if needed
    const url = window.location.href;

    // Handle laravel.com URLs
    if (url.includes("laravel.com/docs")) {
      // Extract the current version from URL
      const currentVersionMatch = url.match(/laravel\.com\/docs\/([^\/]+)/);
      const currentVersion = currentVersionMatch
        ? currentVersionMatch[1]
        : null;

      if (currentVersion && currentVersion !== preferredVersion) {
        // Replace the version in the URL
        const newUrl = url.replace(
          `/docs/${currentVersion}`,
          `/docs/${preferredVersion}`
        );
        window.location.href = newUrl;
      }
    }

    // Handle readouble.com URLs
    if (url.includes("readouble.com/laravel")) {
      // Extract the current version from URL
      const currentVersionMatch = url.match(
        /readouble\.com\/laravel\/([^\/]+)/
      );
      const currentVersion = currentVersionMatch
        ? currentVersionMatch[1]
        : null;

      if (currentVersion && currentVersion !== preferredVersion) {
        // Replace the version in the URL
        const newUrl = url.replace(
          `/laravel/${currentVersion}`,
          `/laravel/${preferredVersion}`
        );
        window.location.href = newUrl;
      }
    }
  },
});
