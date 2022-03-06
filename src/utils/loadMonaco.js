import { loadScriptQueue } from "./loadScript";

import { ElLoading } from "element-plus";

export default function loadMonaco(cb) {
  if (window.monaco) {
    cb(window.monaco);
    return;
  }

  const vs = "./static/vs";

  // 使用element ui实现加载提示
  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "编辑器资源初始化中...",
    spinner: "el-icon-loading",
    background: "rgba(255, 255, 255, 0.5)",
  });

  !window.require && (window.require = {});
  !window.require.paths && (window.require.paths = {});
  window.require.paths.vs = vs;

  loadScriptQueue(
    [
      `${vs}/loader.js`,
      `${vs}/editor/editor.main.nls.js`,
      `${vs}/editor/editor.main.js`,
    ],
    () => {
      loading.close();
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        cb(window.monaco);
      },5);
    }
  );
}
