<template>
  <div class="flex-row" style="height: 100%; position: relative;">
    <div v-show="showLeft" class="flex-col left-panel flex-grow">
      <el-tabs v-model="activeTab" type="card" class="editor-tabs">
        <el-tab-pane name="html">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'html'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>HTML模板
          </template>
        </el-tab-pane>
        <el-tab-pane name="js">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'js'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>脚本
          </template>
        </el-tab-pane>
        <el-tab-pane name="css">
          <template #label>
            <el-icon>
              <el-icon-edit-pen v-if="activeTab === 'css'"></el-icon-edit-pen>
              <el-icon-document v-else></el-icon-document>
            </el-icon>样式
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="full-btn">
        <svg-icon
          :icon-class="isFullScreen ? 'full-cancel' : 'full'"
          @click="isFullScreen = !isFullScreen"
          style="width: 1.2em; height: 1.2em;"
        />
      </div>
      <div v-show="activeTab === 'html'" ref="htmlEditor" class="tab-editor flex-grow" />
      <div v-show="activeTab === 'js'" ref="scriptEditor" class="tab-editor flex-grow" />
      <div v-show="activeTab === 'css'" ref="cssEditor" class="tab-editor flex-grow" />
    </div>
    <div v-show="!isFullScreen || !showLeft" class="flex-col right-panel flex-grow">
      <div class="action-bar flex-row">
        <el-button-group>
          <el-button icon="el-icon-refresh" type="primary" @click="runCode" size="large" plain>刷新</el-button>
          <el-button
            plain
            type="primary"
            icon="el-icon-arrow-left-bold"
            @click="$emit('update:visible', false)"
            size="large"
          >返回设计面板</el-button>
        </el-button-group>
        <span class="flex-grow" />
        <div class="full-btn">
          <svg-icon
            :icon-class="isFullScreen ? 'full-cancel' : 'full'"
            @click="showLeft = !showLeft; isFullScreen = !isFullScreen"
            style="width: 1.2em; height: 1.2em;"
          />
        </div>
      </div>
      <div class="page-container flex-grow">
        <component :is="pageComponent" v-if="pageComponent"></component>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { parse } from "@babel/parser";
import loadMonaco from "@/utils/loadMonaco";
import { vueTemplate, vueScript, cssStyle } from '@/compile/common/util'
import { getComponent, compile } from '@/compile'
const editorObj = { html: '', js: '', css: '' };
let monaco;
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["meta", 'visible'],
  data() {
    return {
      activeTab: "html",
      isFullScreen: false,
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      showLeft: true,
      pageComponent:''
    };
  },
  watch: {
    visible(val) {
      if (val && monaco) {
        this.init()
      }
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => this.init());
  },
  methods: {
    init() {
      const compileData = compile(this.meta);
      this.htmlCode = compileData.html;
      this.jsCode = compileData.js;
      this.cssCode = compileData.css;
      loadMonaco((val) => {
        monaco = val;
        this.setEditorValue(this.$refs.htmlEditor, "html", beautifier.html(this.htmlCode));
        this.setEditorValue(this.$refs.scriptEditor, "js", beautifier.js(this.jsCode));
        this.setEditorValue(this.$refs.cssEditor, "css", beautifier.css(this.cssCode));
        this.runCode();
      });
    },
    setEditorValue(node, type, codeStr) {
      const mode = {
        html: "html",
        js: "javascript",
        css: "css",
      };
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
    runCode() {
      this.pageComponent = defineComponent(getComponent({
        html: editorObj.html.getValue(),
        js: editorObj.js.getValue(),
        css: editorObj.css.getValue()
      }))
    },
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue());
      const script = vueScript(editorObj.js.getValue());
      const css = cssStyle(editorObj.css.getValue());
      return beautifier.html(html + script + css, beautifierConf.html);
    }
  },
};
</script>

<style lang="scss" scoped>
.left-panel,
.right-panel {
  width: 50%;
}
.full-btn {
  padding: 0 10px;
  :deep(svg) {
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}
.left-panel {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
  .full-btn {
    position: absolute;
    right: 10px;
    top: 2px;
    z-index: 1000;
  }
}
.tab-editor {
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
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
.action-bar {
  background: #515874;
  :deep(.el-button-group) {
    padding: 5px;
  }
}
.page-container{
  padding:10px;
}
</style>
