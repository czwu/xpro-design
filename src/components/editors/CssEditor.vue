<template>
  <div>
    <div class="flex-row" style="background:#3c3c3c">
      <el-tabs type="card" class="editor-tabs flex-grow">
        <el-tab-pane>
          <template #label>
            <el-icon> <el-icon-edit-pen></el-icon-edit-pen></el-icon>  编写页面样式
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="action-bar">
        <el-button-group>
          <el-button
            type="primary"
            icon="x-icon-save"
            @click="save"
            size="large"
            >保存</el-button
          >
          <el-button icon="el-icon-download" @click="exportFile" size="large"
            >导出文件</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-circle-close"
            @click="close"
            size="large"
            >关闭</el-button
          >
        </el-button-group>
      </div>
    </div>

    <div ref="editorEl" class="editor" />
  </div>
</template>

<script>
// import { beautifierConf } from '@/common/config'
import { saveAs } from "file-saver";
import loadMonaco from "@/utils/loadMonaco";

export default {
  name: "CssEditor",
  components: {},
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "update:visible"],
  data() {
    return {
      beautifierJson: null,
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // 仅在整个视图都被渲染之后才会运行的代码
      window.addEventListener("keydown", this.preventDefaultSave);
      this.loadMonacoEditor();
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.preventDefaultSave);
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    loadMonacoEditor() {
      loadMonaco((monaco) => {
        if (this.editor) {
          this.editor.setValue(this.modelValue);
        } else {
          this.editor = monaco.editor.create(this.$refs.editorEl, {
            value: this.modelValue,
            theme: "vs-dark",
            language: "css",
            automaticLayout: true,
          });
        }
      });
    },
    exportFile() {
      this.$prompt("文件名:", "导出文件", {
        inputValue: `${+new Date()}.css`,
        closeOnClickModal: false,
        inputPlaceholder: "请输入文件名",
      })
        .then(({ value }) => {
          if (!value) value = `${+new Date()}.css`;
          const codeStr = this.editor.getValue();
          const blob = new Blob([codeStr], {
            type: "text/plain;charset=utf-8",
          });
          saveAs(blob, value);
        })
        .catch((e) => console.error(e));
    },
    close() {
      this.$emit("update:visible", false);
    },
    save() {
      try {
        this.$emit("update:modelValue", this.editor.getValue());
      } catch (error) {
        this.$notify({
          title: "错误",
          message: "JSON格式错误，请检查",
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  height: 100vh;
}
.action-bar {
  line-height: 35px;
  padding: 5px 10px;
  background: #3c3c3c;
  text-align: right;
}
</style>
<style lang="scss">
.editor-tabs {
  background: #3c3c3c;
}
.editor-tabs .el-tabs__header {
  margin: 0;
  border-bottom-color: #3c3c3c;
 }
.editor-tabs .el-tabs__header .el-tabs__nav {
  border-color: #3c3c3c;
  border:0 !important
}
.editor-tabs .el-tabs__item {
  height: 50px;
  line-height: 50px;
  color: #888a8e;
  border-left: 1px solid #121315 !important;
  background: #363636;
  margin-right: 5px;
  user-select: none;
}
.editor-tabs .el-tabs__item.is-active {
  background: #1e1e1e;
  border-bottom-color: #1e1e1e !important;
  color: #fff;
}

</style>
