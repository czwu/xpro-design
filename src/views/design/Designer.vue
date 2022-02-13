<template>
  <div class="flex-row flex-grow" :class="{ dragging: dragging }"  @click="hideMenu">
    <div calss="flex-col" class="sidebar">
      <span class="sidebar-brand">
        <svg-icon icon-class="comps" class="brand-icon" />
      </span>
      <ul class="sidebar-nav">
        <li v-for="(group, i) in comps" :key="i" class="sidebar-item">
          <a class="sidebar-link">
            <svg-icon :icon-class="group.icon" />
          </a>
          <ul
            ref="dragList"
            class="sidebar-dropdown"
            :class="group.class"
          >
            <li
              v-for="(comp, index) in group.children"
              :key="index"
              :name="comp.name"
              :code="comp.code"
              :label="comp.label"
              class="sidebar-item"
            >
              <a class="sidebar-link">
                <svg-icon :icon-class="comp.icon || comp.name" />
                <span class="comp-text">{{ comp.label }}</span></a>
            </li>
          </ul>
        </li>
      </ul>
      <div class="sidebar-model flex-col" style="margin-top: 200px">
        <a class="sidebar-link" @click="showApi">
          <el-tooltip
            class="item"
            effect="dark"
            content="订阅服务"
            placement="right"
          >
            <i class="x-icon-APIkaifa" />
          </el-tooltip>
        </a>
        <a
          class="sidebar-link"
          @click="
            model = null;
            showModelEditor = true;
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="创建数据模型"
            placement="right"
          >
            <i class="x-icon-moxing" />
          </el-tooltip>
        </a>
      </div>
    </div>
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
      <properties />
    </div> 
 

  </div>
</template>

<script>
import Sortable from 'sortablejs'
import {ref, reactive} from 'vue'
import {comps} from '@/config/comps'
import Properties from './Properties'
export default {
     setup(props, context){
         const dragging = ref('')
         const pageList = reactive([])
         return {
             comps,
             dragging,
             pageList
         }
     },
     components:{
       Properties
     }
}
</script>
<style lang="scss" scope>
.svg-icon {
  width: 18px;
  height: 18px;
}
.sidebar-model {
  i {
    font-size: 18px;
    &:hover {
      color: #fff;
    }
    color: #ccc;
  }
}
#design_panel {
  position: relative;
  overflow-x: hidden;
  overflow-y:hidden;

}
.brand-icon {
  fill: #4a88eb !important;
  height: 24px;
  width: 24px;
  margin-right: 0.15rem;
}
.sidebar {
  min-width: 68px;
  max-width: 68px;
  transition: margin-left 0.35s ease-in-out, left 0.35s ease-in-out,
    margin-right 0.35s ease-in-out, right 0.35s ease-in-out;
  direction: ltr;
  background: #293042;
  .sidebar-brand {
    padding: 1.15rem 1.4rem;
    display: block;
    text-align: center;
    color: #fff;
  }
  .sidebar-nav > .sidebar-item {
    position: relative;
    &:hover {
      background: #9a969e1a;n   
      .sidebar-link {
        color: rgba(233, 236, 239, 0.8);
      }
      .sidebar-dropdown {
        cursor: move;
        &::before {
          left: -40px;
          content: "";
          position: absolute;
          top: 0px;
          width: 40px;
          height: 100%;
        }
        display: block;
        .svg-icon {
          line-height: 20px;
          vertical-align: middle;
        }
        .comp-text {
          line-height: 20px;
          padding: 2px 0 0 10px;
        }
        .sidebar-link,
        a.sidebar-link {
          &:hover {
            color: #fff;
          }
        }
      }
    }
  }

  .sidebar-nav > .sidebar-item > .sidebar-dropdown {

    display: none;
    overflow: visible;
    position: absolute;
    left: 80px;
    z-index: 1000;
    width: 150px;
    box-shadow: 0 0.5rem 3rem 0.5rem rgb(0 0 0 / 8%);
    border-radius: 0.3rem;
    background: #293042e0;
    padding: 0.5rem 0;
    font-size: 13px;
    top: 0;
    .sidebar-item .sidebar-link {
      color: #b3b3b3;
      padding: 0.45rem 1.5rem;
      cursor: move;
    }
    &.half{
       width: 300px;
      .sidebar-item{
        width:48%;
        float:left
      }
    }
  }
  .sidebar-link {
    display: block;
    padding: 0.6rem 1.5rem;
    font-weight: 400;
    transition: color 75ms ease-in-out;
    position: relative;
    text-decoration: none;
    cursor: pointer;
    color: #eee;
  }
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
