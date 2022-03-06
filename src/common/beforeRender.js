import context from '@/common/context'
import metadata from '../common/metadata'
// import pretreatment from '@/compile/common/pretreatment'
import { emitter, EVENTS } from '@/common/bus'
import { getComponentId2 } from '@/utils/util'
import dragger from '@/common/dragger'
import Vue from 'vue'
import XEUtils from "xe-utils";
export default function beforeRender(renderMeta = {}, h) {
    const tags = ['div', 'i', 'template']
    if (tags.includes(renderMeta.view)) {
        return
    }
    // 处理 设计模式 组件选中状态, 添加selected 样式
    const props = renderMeta.props = Object.assign({
        class: renderMeta.class || [],
    }, renderMeta.props)
    if (renderMeta.selected) {
        renderMeta.props.class.push('design-selected')
    }
    if (renderMeta.view === 'layout' && renderMeta.span) {
        renderMeta.props.class.push(`span-${renderMeta.span}`)
    }
    if (props.columns) {
        props.columns = XEUtils.clone(props.columns, true)
    }
    // 处理栅格宽度 将栅格转换为百分百宽度的样式名称
    //   pretreatment(renderMeta, ctx, 'design')

    // 设计模式给所有渲染组件的dom添加 uuid标识

    if (renderMeta.uid) {
        props.uid = renderMeta.uid
    }
    // 处理设计时的模拟数据
    if (renderMeta.bindDataAttr) {
        if (context.components[renderMeta.view] && context.components[renderMeta.view].getMockData) {
            renderMeta.props[renderMeta.design.bindDataAttr] = context.components[renderMeta.view].getMockData(renderMeta)
        }
    }
    if (['layout'].includes(renderMeta.view)) {
        // 设计面板模式下 给设计时的组件配置拖拽
        props.onVnodeMounted = function (vnode) {
            dragger.initDrag(vnode.el, vnode.component)
        }
    }

    if (renderMeta.mapping) {
        renderMeta.mapping = renderMeta.mapping
        renderMeta.ondblclick = (e) => {
            const id = getComponentId2(e.target)
            if (id) {
                metadata.selectComponent(id)
            }
        }
    }
    if (['select', 'tree'].includes(renderMeta.name)) {
        props.mousedown = (e) => {
            bus.$emit(EVENTS.DESIGN_COMPONENT_CLICK, e)
        }
    }
    if (renderMeta.name === 'v-template') {
        let desc = renderMeta.design.desc || '自定义组件占位符'
        const myCom = Vue.extend({
            template: `<div> ${desc} </div>`
        })
        renderMeta.children = [h(myCom)]
    } else if (renderMeta.name === 'async-component') {
        const myCom = Vue.extend({
            template: `<div> 异步业务组件 占位符 </div>`
        })
        renderMeta.children = [h(myCom)]
    } else if (renderMeta.name === 'tabs') {
        if (renderMeta.children.length) {
            const val = renderMeta.children[0].data.props.name
            renderMeta.props.value = val
        }
    } else if (renderMeta.name === 'table') {
        // 修复设计时table 组件 style报错问题
        if (!renderMeta.props.height) {
            renderMeta.props.height = '200px'
        }
        // 如果有expand 列,则这些设置将生效,默认展开
        renderMeta.props['expand-row-keys'] = [1]
        renderMeta.props['row-key'] = 'id'
    } else if (renderMeta.name === 'steps') {
        // 修复设计时table 组件 style报错问题
        renderMeta.props.active = renderMeta.design.activeStep
    }

    // 处理 模型或其他元素拖拽到设计器中
    if (renderMeta.view === 'layout' || renderMeta.view === 'form') {
        renderMeta.onDragover = function (ev) {
            ev.preventDefault()
        }
        // renderMeta.nativeOn.drop = (ev) => {
        //     const data = ev.dataTransfer.getData('out2design')
        //     if (!data) { return false }
        //     const dropData = JSON.parse(data)
        //     const cnt = metadata.getCompPathById(renderMeta.uuid)
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

    if (renderMeta.view) {
        const component = context.components[renderMeta.view]
        if (component && component.beforeRender) {
            component.beforeRender(renderMeta)
        }
    }
}
