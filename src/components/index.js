import XRender from './render/render.js'
import SvgIcon from './svg-icon/index.vue'
import MetaForm from './meta-form/MetaForm.vue'
import Layout from './ui/layout/index'
import JsonEditor from './editors/JsonEditor'
import CssEditor from './editors/CssEditor'

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
    //布局
    app.use(Layout)
  }
}
