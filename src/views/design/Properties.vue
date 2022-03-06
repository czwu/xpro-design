<template>
  <div class="flex-col flex-grow" style="position: relative; height: 0px;">
    <div
      class="flex-col flex-grow"
      style="overflow: hidden;"
      @mousedown="showChildEditor = false"
    >
      <el-tabs v-model="activeTab" class="right-tabs">
        <el-tab-pane name="properties">
          <template #label>
            <span><i class="p-icon-setting" /> 属性配置</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="models">
          <template #label>
            <span><i class="p-icon-moxing" /> 数据管理</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <meta-form
        v-if="activeTab === 'properties' && properties && meta"
        :properties="properties"
        :meta="meta"
        class="scroll-y flex-grow"
      />
      <!-- <page-props v-if="activeTab === 'properties' && pagePropsVisible" />
      <model-panel v-if="activeTab === 'models'" class="scroll-y" /> -->
    </div>
    <div v-if="childFormVisible" class="child-editor">
      <meta-form
        v-if="activeTab === 'properties' && childProps && childMeta"
        :properties="childProps"
        :meta="childMeta"
        class="scroll-y flex-grow"
      />
    </div>
  </div>
</template>

<script>
// import ModelPanel from '@/views/design/ModelPanel'
// import PageProps from './PageProps'
import { defineComponent, ref, reactive, onMounted } from "vue";
import context from "@/common/context";
import { uuid } from "@/utils/util";
import { emitter, EVENTS } from "@/common/bus";
export default defineComponent({
  components: {},
  setup(props) {
    const childFormVisible = ref(false);
    const activeTab = ref("properties");
    const properties = ref(null);
    const meta = ref(null);
    const childProperties = ref(null);
    const pagePropsVisible = ref(false);
    const childMeta = ref(null);

    onMounted(() => {
      emitter.on(EVENTS.COMPONENT_SELECTED, (compMeta) => {
        const view = compMeta._view_ || compMeta.view;
        if (!compMeta.isRoot) {
          // 关闭子属性编辑器
          if (childFormVisible.value) {
            childFormVisible.value = false;
          }
          //重新获取选中组件的属性编辑器配置
          properties.value = context.components[view].getProperties(compMeta);
          // addPropId(this.properties);
          meta.value = compMeta;
        } else {
          pagePropsVisible.value = true;
          meta.value = null;
        }
        childFormVisible.value = false;
        context.activeMeta = null;

        activeTab.value = "properties";
      });
    });
    return {
      activeTab,
      properties,
      meta,
      childMeta,
      childProperties,
      childFormVisible,
      pagePropsVisible,
    };
  },
  mounted() {
    emitter.on(EVENTS.MEATA_SELECTED, (meta, parent) => {
      this.childFormVisible.value = false;
      const name = meta._view_ || meta.view;
      this.pagePropsVisible.value = false;
      this.properties.value = context.components[name].getProperties(meta);
      this.addPropId(this.properties.value);
      this.meta.value = meta;
      this.activeTab.value = "properties";
    });
    emitter.on(EVENTS.SHOW_MODEL_PANEL, () => {
      this.activeTab.value = "models";
    });
    emitter.on(EVENTS.SHOW_CHILD_PROP, (meta) => {
      const view = meta._view_ || meta.view;
      this.childProperties.value = context.components[view].getProperties(meta);
      this.addPropId(this.childProperties.value);
      this.childMeta.value = meta;
      this.childFormVisible.value = true;
    });
  },
  methods: {
    addPropId(props) {
      // props.forEach((item) => {
      //   item._id_ = uuid(12);
      //   if (Array.isArray(item.properties)) {
      //     this.addPropId(item.properties);
      //   }
      //   if (Array.isArray(item.columns)) {
      //     this.addPropId(item.columns);
      //   }
      // });
    },
  },
});
</script>
<style lang="scss" scoped>
.scroll-y {
  overflow-y: auto;
  overflow-x: hidden;
}
.child-editor {
  position: absolute;
  right: 300px;
  width: 300px;
  max-height: 300px;
  max-height: calc(100% - 70px);
  overflow-y: auto;
  top: 50px;
  height: auto;
  background: #fff;
  border: 1px solid #f2f2f2;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
<style lang="scss">
.right-tabs {
  .el-tabs__item {
    width: 49% !important;
    text-align: center;
    color: #fff;
  }
  .el-tabs__nav {
    width: 100%;
    line-height: 50px;
    height: 50px;
    background: #293042ab;
  }
  .el-tabs__header {
    position: relative;
    margin: 0 0 1px;
  }
}
</style>
