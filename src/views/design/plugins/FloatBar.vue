a<template>
  <div class="floating-buttons" :style="styleObj" v-show="visible">
    <template v-for="(btn, i) in buttons" :key="i">
      <el-icon @click="btn.click">
        <component :is="btn.icon"></component>
      </el-icon>
    </template>
    <el-icon @click="openActionDesign" v-show="hasEvents">
      <el-icon-setting></el-icon-setting>
    </el-icon>
    <el-icon @click="copy" v-show="showDelelte && canCopy">
      <el-icon-document-copy></el-icon-document-copy>
    </el-icon>
    <el-icon @click="remove" v-show="showDelelte">
      <el-icon-delete> </el-icon-delete>
    </el-icon>
  </div>
</template>
<script>
import context from "@/common/context";
import Metadata from "@/common/metadata";
import { getOffset } from "@/utils/util";
import { emitter, EVENTS } from '@/common/bus'
export default {
  name: "FloatBar",
  data() {
    return {
      visible: false,
      buttons: [],
      hasEvents: false,
      canCopy: true,
      showDelelte: true,
      styleObj: {},
      compId: "",
      fix: {},
    };
  },
  created() {

    emitter.on(EVENTS.COMPONENT_SELECTED, (comp) => {
      if (comp.isRoot) {
        this.visible = false;
        return;
      }
      if (comp.design && comp.design.mapping) {
        this.showDelelte = false;
      } else {
        this.showDelelte = true;
      }

      this.compId = comp.uid;
      const $el = document.querySelector(`[uid='${comp.uid}']`);
      if (!$el) {
        console.error("not find $el", this.compId);
      }
      const width = $el.offsetWidth;
      const pos = getOffset($el);
      const component = context.components[comp.name];
      this.styleObj = {
        top:
          pos.top -
          this.fix.top + 2 + $el.offsetHeight -
          document.querySelector("#design_panel").children[0].scrollTop +
          "px",
        left: (pos.left + 50 + this.fix.left) + 'px'
      };
      if (component && component.getTools) {
        const metadata = window.getMetaManager();
        this.tools = component.getTools(metadata.getComponentById(this.compId));
      } else {
        this.tools = [];
      }
      this.hasEvents = !!component.getEvents;
      this.visible = true;
      this.$nextTick(() => {
        debugger
        const left = width + pos.left - this.$el.offsetWidth - this.fix.left
        this.styleObj.left = left < 0 ? '5px' : left + 'px'
      });
    });
  },
  mounted() {
    this.fix = getOffset(document.querySelector("#design_panel"));
  },
  methods: {
    remove() {
      this.visible = false;
      Metadata.removeComponent(this.compId);
    },
    openActionDesign() {
      bus.$emit(EVENTS.SHOW_EVENT_SETUP, this.compId);
    },
    copy() {
      const path = Metadata.getCompPathById(this.compId);
      const comp = path[0];
      const parent = path[1];
      if (Array.isArray(parent.children)) {
        const index = parent.children.indexOf(comp);
        const newNode = Metadata.copyNode(comp);
        parent.children.splice(index + 1, 0, newNode);
      } else {
        window.getApp().$message.warning("该项不能复制");
      }
    },
    isInTableRow($el) {
      let node = $el.parentElement;
      let ret = false;
      while (node) {
        const cssName = node.getAttribute("class");
        if (cssName && cssName.indexOf("el-table__row") !== -1) {
          ret = true;
          break;
        } else {
          node = node.parentElement;
        }
      }
      return ret;
    },
  },
};
</script>

<style scoped lang="scss">
.floating-buttons {
  position: absolute;
  text-align: right;
  z-index: 1000;
  background: #6c757d;
  padding: 2px 5px;
  border-radius: 0 0 2px 2px;
  i {
    padding: 5px;
    color: #EEE;
    font-size: 12px;
    cursor: pointer;
    &:hover{
      color:#FFF
    }
  }
  .el-icon-delete {
    color: #fd2323;
  }
}
</style>
