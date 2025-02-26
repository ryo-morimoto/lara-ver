import { defineConfig } from "wxt";
import path from "path";
// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  publicDir: path.resolve(__dirname, "public"),
  manifest: {
    name: "Lara Ver - ドキュメントのバージョンを自動固定",
    version: "1.0.0",
    description:
      "⚡️ Laravelドキュメントのバージョン切り替えを自動化！ 📌 お気に入りのバージョンを固定して、快適なドキュメント閲覧を実現します ✨ 開発効率アップをサポートする Chrome 拡張機能です。",
    permissions: ["storage", "tabs"],
    host_permissions: ["*://laravel.com/docs/*", "*://readouble.com/laravel/*"],
  },
});
