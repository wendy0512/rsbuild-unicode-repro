const { defineConfig } = require("@rsbuild/core");
const { pluginReact } = require("@rsbuild/plugin-react");
const { InjectManifest } = require("@aaroon/workbox-rspack-plugin");
const { pluginLess } = require("@rsbuild/plugin-less");
const { pluginStyledComponents } = require("@rsbuild/plugin-styled-components");
const path = require("path");

export default defineConfig({
  html: {
    template: "./public/index.html",
  },
  // dev: { lazyCompilation: true },
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  },
  plugins: [
    pluginReact(),
    pluginStyledComponents(),
    pluginLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
          math: "always",
        },
      },
    }),
  ].filter(Boolean),
  output: {
    polyfill: "usage",
    distPath: {
      root: path.resolve(__dirname, "build"),
    },
    sourceMap: {
      js: "source-map",
    },
    cssModules: {
      exportGlobals: true,
      localIdentName:
        process.env.NODE_ENV === "development"
          ? "[path][name]__[local]--[hash:base64:5]"
          : "[sha512:hash:base64:7]",
      mode: "local",
      auto: true,
    },
  },
  tools: {
    rspack(config, { appendPlugins }) {
      const plugins = [
        new InjectManifest({
          swSrc: path.resolve(__dirname, "src/service-worker.ts"),
          swDest: "service-worker.js",
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }),
      ].filter(Boolean);
      appendPlugins(plugins);
    },
  },
});
