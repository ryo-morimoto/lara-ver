export default defineBackground(() => {
  console.log("LaraVer extension initialized");

  // Initialize default settings if not already set
  browser.storage.sync.get("preferredVersion").then(({ preferredVersion }) => {
    if (!preferredVersion) {
      // Set default version to 10.x (or whatever latest version is)
      browser.storage.sync.set({ preferredVersion: "10.x" });
      console.log("Set default preferred version to 10.x");
    } else {
      console.log(`Current preferred version: ${preferredVersion}`);
    }
  });

  // Listen for messages from the popup
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "setPreferredVersion") {
      browser.storage.sync.set({ preferredVersion: message.version });
      console.log(`Updated preferred version to ${message.version}`);

      // Reload any Laravel docs tabs to apply the change
      browser.tabs
        .query({
          url: ["*://laravel.com/docs/*", "*://readouble.com/laravel/*"],
        })
        .then((tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) {
              browser.tabs.reload(tab.id);
            }
          });
        });

      return Promise.resolve({ success: true });
    }
  });
});
