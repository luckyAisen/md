import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import { Editor } from "@bytemd/react";
import "bytemd/dist/index.css";
import "github-markdown-css";
import "highlight.js/styles/vs.css";
// placed after highlight styles to override `code` padding
import "katex/dist/katex.css";
import { useState } from "react";

const localeKey = "zh_Hans";

function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce((p, [key, value]) => {
    p[key.split("/").slice(-1)[0].replace(".json", "")] = value;
    // console.log(p)
    return p;
  }, {} as Record<string, any>);
}

const locales = stripPrefixes(
  import.meta.glob("/node_modules/bytemd/locales/*.json", { eager: true })
);

const gfmLocales = stripPrefixes(
  import.meta.glob("/node_modules/@bytemd/plugin-gfm/locales/*.json", {
    eager: true,
  })
);

const mathLocales = stripPrefixes(
  import.meta.glob("/node_modules/@bytemd/plugin-math/locales/*.json", {
    eager: true,
  })
);

const mermaidLocales = stripPrefixes(
  import.meta.glob("/node_modules/@bytemd/plugin-mermaid/locales/*.json", {
    eager: true,
  })
);

const plugins = [
  frontmatter(),
  gemoji(),
  gfm({
    locale: gfmLocales[localeKey],
  }),
  highlight(),
  math({
    locale: mathLocales[localeKey],
    katexOptions: { output: "html" }, // https://github.com/KaTeX/KaTeX/issues/2796
  }),
  mediumZoom(),
  mermaid({
    locale: mermaidLocales[localeKey],
  }),
].filter((x) => x);

function App() {
  const [value, setValue] = useState("");
  const mode = "split";

  return (
    <div className="container pt-4 pb-4 mx-auto">
      <Editor
        value={value}
        mode={mode}
        plugins={plugins}
        placeholder={"Start writing"}
        locale={locales[localeKey]}
        uploadImages={(files) => {
          return Promise.all(
            files.map((file) => {
              // TODO:
              return {
                alt:'图片上传还没搞好',
                title:'图片上传还没搞好',
                url: "https://caixusheng.com/favicon.ico",
              };
            })
          );
        }}
        onChange={(e) => {
          setValue(e);
        }}
      />
    </div>
  );
}

export default App;
