<template>
  <div class="flex-row" style="height: 100%; position: relative;">
    <div v-show="showLeft" class="flex-col left-panel flex-grow">
      <el-tabs v-model="activeTab" type="card" class="editor-tabs">
        <el-tab-pane name="html">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'html'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>
            HTML模板
          </template>
        </el-tab-pane>
        <el-tab-pane name="js">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'js'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>
            脚本
          </template>
        </el-tab-pane>
        <el-tab-pane name="css">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'css'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>
            样式
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="full">
        <el-button
          :icon="fullscreen ? 'p-icon-fullscreen-exit' : 'p-icon-fullscreen'"
          @click="full"
        />
      </div> -->
      <div
        v-show="activeTab === 'html'"
        ref="htmlEditor"
        class="tab-editor flex-grow"
      />
      <div
        v-show="activeTab === 'js'"
        ref="scriptEditor"
        class="tab-editor flex-grow"
      />
      <div
        v-show="activeTab === 'css'"
        ref="cssEditor"
        class="tab-editor flex-grow"
      />
    </div>
    <div v-show="!fullscreen" class="flex-col right-panel flex-grow">
      <div class="action-bar flex-row">
        <el-button-group>
          <el-button
            plain
            :icon="showLeft ? 'p-icon-fullscreen' : 'p-icon-fullscreen-exit'"
            @click="showLeft = !showLeft"
            size="large"
          />

          <el-button
            icon="el-icon-refresh"
            type="primary"
            @click="runCode"
            size="large"
            >刷新</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-circle-close"
            @click="$emit('update:visible', false)"
            size="large"
            >关闭</el-button
          >
        </el-button-group>
        <span class="flex-grow" />
      </div>
      <div class="result-wrapper flex-grow"></div>
    </div>
  </div>
</template>
<script>
import { parse } from "@babel/parser";
import loadMonaco from "@/utils/loadMonaco";
const editorObj = {
  html: null,
  js: null,
  css: null,
};
const mode = {
  html: "html",
  js: "javascript",
  css: "css",
};
let monaco;

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["meta"],
  data() {
    return {
      activeTab: "html",
      fullscreen: false,
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      showLeft: true,
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.$nextTick(() => this.init());
  },
  methods: {
    init() {
      const compileData = {
        html: "<template></template>",
        js: "exprot default {}",
        css: "",
      };
      this.htmlCode = compileData.html;
      this.jsCode = compileData.js;
      this.cssCode = compileData.css;
      loadMonaco((val) => {
        monaco = val;
        this.setEditorValue(this.$refs.htmlEditor, "html", this.htmlCode);
        this.setEditorValue(this.$refs.scriptEditor, "js", this.jsCode);
        this.setEditorValue(this.$refs.cssEditor, "css", this.cssCode);
        if (!this.isInitcode) {
          this.isRefreshCode = true;
          this.isIframeLoaded && (this.isInitcode = true) && this.runCode();
        }
      });
    },
    onClose() {
      this.isInitcode = false;
      this.isRefreshCode = false;
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isRefreshCode && (this.isInitcode = true) && this.runCode();
      }
    },
    setEditorValue(node, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr);
      } else {
        editorObj[type] = monaco.editor.create(node, {
          value: codeStr,
          theme: "vs-dark",
          language: mode[type],
          automaticLayout: true,
        });
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown((e) => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode();
        }
      });
    },
    runCode() {},
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue());
      const script = vueScript(editorObj.js.getValue());
      const css = cssStyle(editorObj.css.getValue());
      return beautifier.html(html + script + css, beautifierConf.html);
    },

    setResource(arr) {
      const scripts = [];
      const links = [];
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          if (item.endsWith(".css")) {
            links.push(item);
          } else {
            scripts.push(item);
          }
        });
        this.scripts = scripts;
        this.links = links;
      } else {
        this.scripts = [];
        this.links = [];
      }
    },
    full() {
      this.fullscreen = !this.fullscreen;
    },
  },
};
</script>

<style lang="scss" scoped>
.left-panel,
.right-panel {
  width: 50%;
}
.left-panel {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
  .full {
    position: absolute;
    right: 10px;
    top: 2px;
    z-index: 1000;
  }
}
.tab-editor {
  // position: absolute;
  // top: 33px;
  // bottom: 0;
  // left: 0;
  // right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting {
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    margin: 10px;
    height: calc(100vh - 50px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
.scheme-label {
  font-size: 13px;
  padding: 3px 8px 0 0;
}
:deep(.el-drawer__header) {
  display: none;
}
.action-bar {
  padding: 1px 10px 2px;
  background: #dcdcdc;
}
</style>

<style lang="scss"></style>
