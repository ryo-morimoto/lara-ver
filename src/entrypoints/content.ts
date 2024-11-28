import { getDocumentSite } from "@/entrypoints/documentSite";

export default defineContentScript({
  matches: ["https://readouble.com/laravel/*", "https://laravel.com/docs/*"],
  main() {
    const url = new URL(location.href);
    const documentSite = getDocumentSite(url);

    console.log(documentSite.getSiteName());
    console.log(documentSite.getVersion());
    console.log(documentSite.setVersion("10.x"));
  },
});
