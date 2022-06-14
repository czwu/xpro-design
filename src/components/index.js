import { defineComponent, h } from 'vue'
import XRender from './render/render.js'
import SvgIcon from './svg-icon/index.vue'
import MetaForm from './meta-form/MetaForm.vue'
import JsonEditor from './editors/JsonEditor'
import CssEditor from './editors/CssEditor'
import ListEditor from './editors/ListEditor'
import IconSelect from './icon-select/index'

export default {
  install: (app) => {
    //将元数据json 渲染成UI页面   用于 设计面板的及时渲染与属性编辑器的渲染
    app.component('XRender',XRender)
    //svg 图标组件
    app.component(SvgIcon.name,SvgIcon)
    //元数据表单配置器 用于组件的属性配置
    app.component(MetaForm.name, MetaForm)
    // 元数据Json的格式化编辑器显示
    app.component(JsonEditor.name, JsonEditor)
    app.component(CssEditor.name, CssEditor)
    app.component(ListEditor.name, ListEditor)
    app.component(IconSelect.name, IconSelect)

    app.component('DesignSlot', defineComponent(function DesignSlot(props,context) {
      return ()=> {
        return  h('div',{ class:['design-slot', props.uid]}, context.slots)
      }
    }))
    //布局
  }
}
