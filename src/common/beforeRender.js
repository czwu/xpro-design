import context from '@/common/context'
import metadata from '../common/metadata'
// import pretreatment from '@/compile/common/pretreatment'
import { emitter, EVENTS } from '@/common/bus'
import { getComponentId2 } from '@/utils/util'
import dragger from '@/common/dragger'
import Vue from 'vue'
export default function designRender(renderOpts = {}, h) {
    const tags = ['div', 'i', 'template']
    if (tags.includes(renderOpts.view)) {
        return
    }
    // 处理 设计模式 组件选中状态, 添加selected 样式
    const props = renderOpts.props = Object.assign({
        class: renderOpts.class || {},
    }, renderOpts.props)
    if (renderOpts.view) { renderOpts.nativeOn = Object.assign({}, renderOpts.nativeOn) }
    renderOpts.design = renderOpts.design || {}
    props.class['design-selected'] = renderOpts.selected
    if (props.columns) {
        props.columns = JSON.parse(JSON.stringify(props.columns))
    }
    // 处理栅格宽度 将栅格转换为百分百宽度的样式名称
    //   pretreatment(renderOpts, ctx, 'design')

    // 设计模式给所有渲染组件的dom添加 uuid标识

    if (renderOpts.uid) {
        props.uid = renderOpts.uid
    }
    // 处理设计时的模拟数据
    if (renderOpts.bindDataAttr) {
        if (context.components[renderOpts.view] && context.components[renderOpts.view].getMockData) {
            renderOpts.props[renderOpts.design.bindDataAttr] = context.components[renderOpts.view].getMockData(renderOpts)
        }
    }

    // 设计面板模式下 给设计时的组件配置拖拽
    props.onVnodeMounted = function(vnode){
        dragger.initDrag(vnode.el, vnode.component)
    }
    if (renderOpts.mapping) {
        renderOpts.mapping = renderOpts.mapping
        renderOpts.ondblclick = (e) => {
            const id = getComponentId2(e.target)
            if (id) {
                metadata.selectComponent(id)
            }
        }
    }
    if (['select', 'tree'].includes(renderOpts.name)) {
        props.mousedown = (e) => {
            bus.$emit(EVENTS.DESIGN_COMPONENT_CLICK, e)
        }
    }
    if (renderOpts.name === 'v-template') {
        let desc = renderOpts.design.desc || '自定义组件占位符'
        const myCom = Vue.extend({
            template: `<div> ${desc} </div>`
        })
        renderOpts.children = [h(myCom)]
    } else if (renderOpts.name === 'async-component') {
        const myCom = Vue.extend({
            template: `<div> 异步业务组件 占位符 </div>`
        })
        renderOpts.children = [h(myCom)]
    } else if (renderOpts.name === 'tabs') {
        if (renderOpts.children.length) {
            const val = renderOpts.children[0].data.props.name
            renderOpts.props.value = val
        }
    } else if (renderOpts.name === 'table') {
        // 修复设计时table 组件 style报错问题
        if (!renderOpts.props.height) {
            renderOpts.props.height = '200px'
        }
        // 如果有expand 列,则这些设置将生效,默认展开
        renderOpts.props['expand-row-keys'] = [1]
        renderOpts.props['row-key'] = 'id'
    } else if (renderOpts.name === 'steps') {
        // 修复设计时table 组件 style报错问题
        renderOpts.props.active = renderOpts.design.activeStep
    }

    // 处理 模型或其他元素拖拽到设计器中
    if (renderOpts.view === 'layout' || renderOpts.view === 'form') {
        if (renderOpts.design.mode === 'span') {
            renderOpts.name = 'row'
        }
        renderOpts.nativeOn.dragover = function (ev) {
            ev.preventDefault()
        }
        // renderOpts.nativeOn.drop = (ev) => {
        //     const data = ev.dataTransfer.getData('out2design')
        //     if (!data) { return false }
        //     const dropData = JSON.parse(data)
        //     const cnt = metadata.getCompPathById(renderOpts.uuid)
        //     if (dropData.type === 'field') {
        //         // field只允许拖拽到表单中, 因此遍历父容器,查看是否存在form组件,如有则允许拖拽
        //         if (cnt.filter(item => item.name === 'form').length) {
        //             if (['form', 'panel', 'layout'].includes(cnt[0].name)) {
        //                 const config = context.components['form-item'].getConfigByField({ field: dropData.data })
        //                 cnt[0].children.push(config)
        //             }
        //         } else {
        //             window.getApp().$message('字段只允许拖拽到form容器中')
        //         }
        //     }
        //     ev.stopPropagation()
        // }
    }

    if (renderOpts.view) {
        const component = context.components[renderOpts.view]
        if (component && component.beforeRender) {
            component.beforeRender(renderOpts)
        }
    }
}
