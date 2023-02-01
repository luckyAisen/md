import { useState, useEffect } from "react";

import { Editor } from "@bytemd/react";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";

import mdLocales from "bytemd/locales/zh_Hans.json";
import gfmLocales from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import mathLocales from "@bytemd/plugin-math/locales/zh_Hans.json";
import mermaidLocales from "@bytemd/plugin-mermaid/locales/zh_Hans.json";

import "bytemd/dist/index.css";
import "github-markdown-css";
import "highlight.js/styles/vs.css";
import "katex/dist/katex.css";

import Share from "./components/icon/Share";
import GitHub from "./components/icon/Github";
import Download from "./components/icon/Download";

import { debounce, utoa, atou } from "./utils";

type AppState = {
  time: number;
  data: string;
};

const plugins = [
  frontmatter(),
  gemoji(),
  gfm({
    locale: gfmLocales,
  }),
  highlight(),
  math({
    locale: mathLocales,
    katexOptions: { output: "html" },
  }),
  mediumZoom(),
  mermaid({
    locale: mermaidLocales,
  }),
].filter((x) => x);

const Header = () => {
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    alert("可共享的URL已复制到剪贴板。");
  };

  const downloadFile = () => {
    alert("下载还没搞好");
  };

  return (
    <nav className="h-10 pl-4 pr-4 flex items-center justify-between">
      <h1 className="text-xl">Markdown Playground</h1>
      <div className="flex items-center">
        <button
          className="pr-4 text-gray-500 hover:text-gray-900"
          title="复制URL"
          onClick={copyLink}
        >
          <Share className="w-5 h-5" />
        </button>
        <button
          className="pr-4 text-gray-500 hover:text-gray-900"
          title="下载文件"
          onClick={downloadFile}
        >
          <Download className="w-5 h-6" />
        </button>
        <button
          className="text-gray-500 hover:text-gray-900"
          title="查看 GitHub"
        >
          <a href="https://github.com/Aisen60/md" target="_blank">
            <GitHub className="w-6 h-6" />
          </a>
        </button>
      </div>
    </nav>
  );
};

function App() {
  const [value, setValue] = useState("");

  const init = () => {
    initValue();
    initView();
  };

  const initValue = () => {
    const hash = location.hash.slice(1);
    if (hash) {
      try {
        const appState: AppState = JSON.parse(atou(hash));
        setValue(appState.data);
      } catch {
        history.replaceState({}, "", "#");
      }
    } else {
      history.replaceState({}, "", "#");
    }
  };

  const initView = () => {
    const el = document.querySelector(
      `.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right[bytemd-tippy-path="5"]`
    ) as HTMLElement;
    el.style.display = "none";
  };

  const onChange = debounce((data: string) => {
    setValue(data);
    if (data.trim()) {
      const appState: AppState = { time: new Date().getTime(), data };
      history.replaceState({}, "", "#" + utoa(JSON.stringify(appState)));
    } else {
      history.replaceState({}, "", "#");
    }
  }, 250);

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header />
      <Editor
        value={value}
        mode="split"
        plugins={plugins}
        placeholder={"Start writing"}
        locale={mdLocales}
        uploadImages={(files) => {
          alert("图片上传还没搞好");
          return Promise.reject(
            files.map((file) => {
              // TODO:
              return {
                alt: "图片上传还没搞好",
                title: "图片上传还没搞好",
                // url: "https://caixusheng.com/favicon.ico",
              };
            })
          );
        }}
        onChange={onChange}
      />
    </div>
  );
}

export default App;
