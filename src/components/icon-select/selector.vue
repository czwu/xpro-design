<template>
  <div class="design-dialog">
    <el-dialog
      width="980px"
      title="选择图标"
      v-model="visible"
      @open="onOpen"
      @close="onClose"
    >
      <div class="dialog-content">
        <ul class="icon-ul">
          <li v-for="(name, index) in icons" :key="index"  @click="onSelect(name)">
            <component
              :is="'ElIcon' + name"
              class="font-size:14px;"
            ></component>
            <span>{{ name }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as Icons from "@element-plus/icons-vue";
export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "update:visible","select"],
  data() {
    return {
      icons: [],
      key: "",
    };
  },
  created() {
    const getData = () => {
      let icons = [];
      for (const name in Icons) {
        icons.push(name);
      }
      return icons;
    };
    this.icons = getData();
  },
  mounted() {},
  methods: {
    getIconList() {
      // this.$http.post('/api/app-h5-compose/icon/version/list/enable').then(res => {
      //   res.data.forEach(item => {
      //     this.iconList.push('p-icon-' + item.fontClass)
      //     context.iconList = [... this.iconList]
      //   })
      // })
    },
    onOpen() {
      this.key = "";
    },
    onClose() {
      this.$emit("update:visible", false);
    },
    onSelect(icon) {
      this.$emit("select", icon);
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-ul {
  margin: 0;
  padding: 0;
  font-size: 0;
  li {
    
    list-style-type: none;
    text-align: center;
    font-size: 14px;
    display: inline-block;
    width: 16.66%;
    box-sizing: border-box;
    padding: 15px 6px 6px 6px;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      background: #f2f2f2;
    }
    &.active-item {
      background: #e1f3fb;
      color: #7a6df0;
    }
    > svg{
      margin:auto;
      display: block;
      width: 50px !important;
      height: 50px !important;
    }
  }
}

::v-deep .design-dialog {
  margin: 60px auto 0 !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
.dialog-content {
  height: calc(80vh - 100px);
  overflow-y: auto;
}
</style>
