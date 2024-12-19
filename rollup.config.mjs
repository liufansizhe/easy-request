import commonjs from "@rollup/plugin-commonjs";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import path from "path";
import strip from "@rollup/plugin-strip";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    dir: path.dirname("dist/bundle.ts"),
    // format: "es",
    // exports: "named", // 指定导出模式（自动、默认、命名、无）
    // preserveModules: true, // 保留模块结构
    // preserveModulesRoot: "src", // 将保留的模块放在根级别的此路径下
  },
  plugins: [
    json(),
    externals({
      devDeps: false, // devDependencies 类型的依赖就不用加到 externals 了。
    }),
    commonjs(),
    typescript({
      outDir: "dist",
      declaration: true,
      declarationDir: "dist",
    }),
    strip(),
  ],
};
