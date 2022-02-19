<template>
  <div class="flex-row flex-grow" :class="{ dragging: dragging }"  @click="hideMenu">
    <materials class=""></materials>
    <div class="flex-col flex-grow" style="width: 0">
      <div class="toolbar flex-row">
        <div class="space" style="width: 10px" />
        <div class="space flex-grow" style="line-height:30px">
          <el-tabs v-model="activePage" type="card" :addable="true" @tab-click="pageChange" @tab-add="showPageTree" @tab-remove="pageRemove">
            <el-tab-pane v-for="page in pageList" :key="page.id" :label="page.name" :name="page.id" :closable="page.closable" />
          </el-tabs>
        </div>
        <el-button-group style="flex-shrink:0;margin-left:10px">
          <el-button
            type="primary"
            icon="x-icon-save"
            @click="savePage"
          >保存</el-button>
          <el-button
            icon="x-icon-json"
            @click="showJson"
          >元数据</el-button>
          <el-button
            @click="showCss"
            icon="x-icon-css"
          >CSS</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="clear">清空</el-button>
          <el-button
            type="warning"
            icon="x-icon-debug"
            @click="preview"
          >预览/调试</el-button>
        </el-button-group>
        <div class="space" style="width: 10px" />
      </div>
      <div
        id="design_panel"
        class="flex-row flex-grow main layout no-select"
        :class="{ dragging: dragging }"
        @contextmenu="showContextMenu"
      >
      <x-render :meta="meta" />
      </div>
    </div>
    <div class="flex-col properties">
      <!-- <properties /> -->
    </div> 
 

  </div>
</template>

<script>
import Materials from './Materials.vue'

import {ref, reactive} from 'vue'
import Properties from './Properties'
export default {
     setup(props, context){
         const dragging = ref('')
         const pageList = reactive([])
         return {
             dragging,
             pageList
         }
     },
     components:{
       Properties,Materials
     }
}
</script>
<style lang="scss" scope>
#design_panel {
  position: relative;
  overflow-x: hidden;
  overflow-y:hidden;

}
.properties {
  width:300px;
  border-left: 1px solid #ddd;
  flex-shrink: 0;
}
.toolbar {
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
.dragging .sidebar-dropdown {
  visibility: hidden;
}
.brand-icon{
  cursor: pointer;
}
</style>
