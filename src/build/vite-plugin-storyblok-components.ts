import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import type { Plugin, ResolvedConfig } from "vite";

interface PluginOptions {
  componentsPath: string;
}

export function storyblokComponentsPlugin(options: PluginOptions): Plugin {
  const virtualModuleId = "virtual:$storyblok/components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  let config: ResolvedConfig;

  return {
    // required, will show up in warnings and errors
    name: "vite-plugin-storyblok-components",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    async load(id: string) {
      if (id !== resolvedVirtualModuleId) {
        return;
      }

      const root = cwd();
      const componentsPath = resolve(root, options.componentsPath);
      const libAlias = config.resolve.alias.find(({ find, replacement }) => (
        find === "$lib" ? componentsPath.startsWith(resolve(replacement)) : undefined
      ));

      const componentsImportLocation = componentsPath
        .replace(resolve(libAlias?.replacement ?? ""), "$lib")
        .replace(/^\//, "");
      const componentFiles = await readdir(componentsPath);
      const imports = componentFiles
        .map((file) => `import ${formatComponentName(file.replace(/\.svelte$/, ""))} from "${componentsImportLocation}/${file}";`)
        .join("\n");
      const componentsMap = componentFiles
        .map((file) => file.replace(/\.svelte$/, ""))
        .map((file) => formatComponentName(file))
        .join(",\n  ");

      return `${imports}\nexport const components = {\n${componentsMap}\n}`;
    },
  };
}

export default storyblokComponentsPlugin;

function formatComponentName(name: string) {
  return name
    .replace(/^./, (letter) => letter.toUpperCase())
    .replace(/\W+(.)/g, (letter) => letter.toUpperCase())
    .replace(/[^a-zA-Z]/g, "");
}
