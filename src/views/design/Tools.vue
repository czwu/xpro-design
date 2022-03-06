<template>
  <el-button-group style="flex-shrink: 0; margin-left: 10px;">
    <el-tooltip class="box-item" effect="dark" content="保存页面">
      <el-button
        size="large"
        type="primary"
        icon="x-icon-save"
        @click="save"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="查看元数据">
      <el-button @click="metaDrawerVisible = true" size="large">
        <svg-icon icon-class="json" style="width: 1.3em; height: 1.4em;" />
      </el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="编写页面样式">
      <el-button @click="cssDrawerVisible = true" size="large">
        <svg-icon icon-class="css" style="width: 1.5em; height: 1.4em;" />
      </el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="清空页面内容">
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="clear"
        size="large"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="预览调试页面">
      <el-button
        size="large"
        type="warning"
        icon="x-icon-debug"
        @click="preview"
      ></el-button>
    </el-tooltip>
  </el-button-group>
  <!-- 元数据JSON编辑器部分 begin -->
  <el-drawer
    v-model="metaDrawerVisible"
    size="60%"
    :with-header="false"
    custom-class="my-drawer"
  >
    <json-editor
      v-model="pageMeta"
      v-if="metaDrawerVisible"
      v-model:visible="metaDrawerVisible"
    ></json-editor>
  </el-drawer>
  <!-- end -->
  <!-- CSS 编辑器部分  begin-->
  <el-drawer
    v-model="cssDrawerVisible"
    size="100%"
    :with-header="false"
    custom-class="my-drawer"
  >
    <css-editor
      v-model="pageMeta.css"
      v-if="cssDrawerVisible"
      v-model:visible="cssDrawerVisible"
    ></css-editor>
  </el-drawer>
  <!-- end -->
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import PageMeta from "../../common/metadata";
// import { emitter, EVENTS } from "../../common/bus";
export default defineComponent({
  setup(props, context) {
    const pageMeta = PageMeta.meta;
    const metaDrawerVisible = ref(false);
    const cssDrawerVisible = ref(false);
    function clear() {
      PageMeta.reset()
    }
    function save(){

    }
    function preview(){

    }
    return {
      pageMeta,
      metaDrawerVisible,
      cssDrawerVisible,
      clear,
      save,
      preview
    };
  },
  methods: {

  },
});
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.my-drawer {
  .el-drawer__body {
    padding: 0 !important;
  }
}
</style>
