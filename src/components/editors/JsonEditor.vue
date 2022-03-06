<template>
  <div>
    <div class="action-bar">
      <el-button-group>
        <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button
          ref="copyBtn"
          icon="el-icon-document-copy"
          class="copy-json-btn"
          >复制JSON</el-button
        >
        <el-button icon="el-icon-download" @click="exportJsonFile"
          >导出JSON文件</el-button
        >
        <el-button type="danger" icon="el-icon-circle-close" @click="close"
          >关闭</el-button
        >
      </el-button-group>
    </div>
    <div ref="editorEl" class="json-editor" />
  </div>
</template>

<script>
// import { beautifierConf } from '@/common/config'
import ClipboardJS from "clipboard";
import { saveAs } from "file-saver";
import loadMonaco from "@/utils/loadMonaco";

export default {
  name: "JsonEditor",
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
      const clipboard = new ClipboardJS(".copy-json-btn", {
        text: (trigger) => {
          this.$notify({
            title: "成功",
            message: "代码已复制到剪切板，可粘贴。",
            type: "success",
          });
          return this.beautifierJson;
        },
      });
      clipboard.on("error", (e) => {
        this.$message.error("代码复制失败");
      });
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
      const str = JSON.stringify(this.modelValue).replace(
        /"selected":true,/g,
        ""
      );
      loadMonaco((monaco) => {
        if (this.editor) {
          this.editor.setValue(str);
        } else {
          this.editor = monaco.editor.create(this.$refs.editorEl, {
            value: str,
            wrappingIndent: "indent",
            tabSize: 2,
            theme: "vs-dark",
            language: "json",
            automaticLayout: true,
          });
        }
        setTimeout(() => {
          this.editor.getAction("editor.action.formatDocument").run();
        }, 50);
      });
    },
    exportJsonFile() {
      this.$prompt("文件名:", "导出文件", {
        inputValue: `${+new Date()}.json`,
        closeOnClickModal: false,
        inputPlaceholder: "请输入文件名",
      })
        .then(({ value }) => {
          if (!value) value = `${+new Date()}.json`;
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
    refresh() {
      try {
        this.$emit("update:modelValue", JSON.parse(this.editor.getValue()));
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
.json-editor {
  height: calc(100vh - 45px);
}
.action-bar {
  line-height: 35px;
  padding: 5px 10px;
  background: #3c3c3c;
}
.el-button {
  height: 40px;
}
</style>
