/// <reference types="vite/client" />

declare module "file-saver" {
  export function saveAs(blob: any, name: any): void;
}
