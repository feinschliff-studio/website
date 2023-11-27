import type { Plugin, ResolvedConfig } from "vite";
import plugin from "vite-plugin-webfont-dl";

interface PluginOptions {
  urls: string[];
}

export function augmentWebfontDlForSveltekitPlugin(options: PluginOptions): Plugin {
  const instance = plugin(options.urls, {
    injectAsStyleTag: false,
  });

  return {
    name: "vite-plugin-augment-webfont-dl-for-sveltekit",
    enforce: "post",

    configResolved(resolvedConfig: ResolvedConfig) {
      if (typeof instance.configResolved === "function")
        return instance.configResolved.apply(this, [resolvedConfig]);
    },

    configureServer(server) {
      if (typeof instance.configureServer === "function") {
        return instance.configureServer.apply(this, [server]);
      }
    },

    async generateBundle(options, bundle, isWrite) {
      if (typeof instance.generateBundle === "function") {
        await instance.generateBundle.apply({
          ...this,
          emitFile: (emittedFile) => {
            if ("name" in emittedFile && "source" in emittedFile && emittedFile.name === "webfonts.css") {
              return this.emitFile({
                type: "asset",
                name: emittedFile.name,
                fileName: "webfonts.css",
                source: emittedFile.source,
              });
            }

            return this.emitFile(emittedFile);
          },
        }, [options, bundle, isWrite]);
      }
    },
  };
}
