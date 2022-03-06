<template>
  <div class="flex-row flex-grow" :class="{ dragging: dragging }">
    <materials></materials>
    <div class="flex-col flex-grow">
      <div class="headbar flex-row">
        <div class="space" style="width: 10px;" />
        <div class="space flex-grow" style="line-height: 30px;">
          <el-tabs
            v-model="activePage"
            type="card"
            @tab-click="pageChange"
            @tab-add="showPageSelector"
            @tab-remove="pageRemove"
          >
            <el-tab-pane
              v-for="page in pages"
              :key="page.id"
              :label="page.name"
              :name="page.id"
              :closable="page.closable"
            />
          </el-tabs>
        </div>
        <tools></tools>
        <div class="space" style="width: 10px;" />
      </div>
      <div
        id="design_panel"
        class="flex-row flex-grow main layout no-select"
        :class="{ dragging: dragging }"
        @contextmenu="showContextMenu"
      >
        <x-render
          :meta="pageMeta"
          :beforeRender="beforeRender"
          @mousedown="clickHandler"
        />
      </div>
    </div>
    <div class="flex-col properties">
      <properties></properties>
    </div>
  </div>
</template>

<script>
import Materials from "./Materials.vue";
import Tools from "./Tools.vue";
import { defineComponent, ref, reactive } from "vue";
import Properties from "./Properties";
import PageMeta from "@/common/metadata";
import beforeRender from "@/common/beforeRender";
import "@/config/index.js";
import { getComponentId,getComponentId2 } from "@/utils/util";
export default defineComponent({
  setup() {
    const dragging = ref("");
    const activePage = ref("");
    const pages = reactive([]);
    const pageMeta = PageMeta.meta;
    function clickHandler(e) {
      const uid = getComponentId(e.target);
      PageMeta.selectComponent(uid, e);
    }
    function showContextMenu(e) {
      self.event.returnValue = false;
      const uuid = getComponentId2(e.target);
      if (uuid) {
        const meta = PageMeta.getComponentById(uuid);
        PageMeta.selectComponent(uuid);
        const comp = context.components[meta.name];
        if (comp && comp.getContextMenu) {
          this.contextMenus = comp.getContextMenu();
          this.menuStyle = {
            top: e.pageY - 10 + "pX",
            left: e.pageX - 10 + "px",
          };
          return;
        }
      }
      this.contextMenus = [];
    }
    return {
      dragging,
      pages,
      activePage,
      pageMeta,
      beforeRender,
      clickHandler,
      showContextMenu
    };
  },
  created() {},
  components: {
    Properties,
    Materials,
    Tools,
  },
  methods: {
    pageChange() {},
    showPageSelector() {},
    pageRemove() {},
    showContextMenu() {},
  },
});
</script>
<style lang="scss" scoped>
#design_panel {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
}
.properties {
  width: 320px;
  border-left: 1px solid #ddd;
  flex-shrink: 0;
}
.headbar {
  line-height: 50px;
  box-shadow: rgba(41, 48, 66, 0.1) 0px 0px 2rem 0px;
  border-bottom: 1px solid #f2f2f2;
  background: #fff;
  height: 50px;
  padding-top: 8px;
  box-sizing: border-box;
}
.main {
  padding: 5px;
  background: #fff;
}
.page-title {
  line-height: 35px;
  color: #666;
  font-weight: 600;
  font-size: 15px;
  i {
    padding: 5px;
  }
}
</style>
