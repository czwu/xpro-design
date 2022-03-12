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
      <el-button @click="metaVisible = true" size="large">
        <svg-icon icon-class="json" style="width: 1.3em; height: 1.4em;" />
      </el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="编写页面样式">
      <el-button @click="cssVisible = true" size="large">
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
        @click="previewVisible = true"
      ></el-button>
    </el-tooltip>
  </el-button-group>
  <!-- 元数据JSON编辑器部分 begin -->
  <el-drawer
    v-model="metaVisible"
    size="60%"
    :with-header="false"
    custom-class="my-drawer"
  >
    <json-editor
      :json="pageMeta"
      @change="metaChange"
      v-if="metaVisible"
      v-model:visible="metaVisible"
    ></json-editor>
  </el-drawer>
  <!-- end -->
  <!-- CSS 编辑器部分  begin-->
  <el-drawer
    v-model="cssVisible"
    size="100%"
    :with-header="false"
    custom-class="my-drawer"
  >
    <css-editor
      v-model="pageMeta.css"
      v-if="cssVisible"
      v-model:visible="cssVisible"
    ></css-editor>
  </el-drawer>

   <el-drawer
    v-model="previewVisible"
    size="100%"
    :with-header="false"
    custom-class="my-drawer"
  >
    <preview
      :meta="pageMeta"
      v-model:visible="previewVisible"
    ></preview>
  </el-drawer>
  <!-- end -->
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import PageMeta from "../../common/metadata";
import Preview from "./Preview.vue";
// import { emitter, EVENTS } from "../../common/bus";
export default defineComponent({
  setup(props, context) {
    const pageMeta = PageMeta.meta;
    const metaVisible = ref(false);
    const cssVisible = ref(false);
    const previewVisible = ref(false)
    function clear() {
      PageMeta.reset()
    }
    function metaChange(meta){
      Object.assign(PageMeta.meta, meta)
    }
    function save(){
      
    }
    return {
      pageMeta,
      metaVisible,
      cssVisible,
      previewVisible,
      metaChange,
      clear,
      save
    };
  },
  components:{
    Preview
  }
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
