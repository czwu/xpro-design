import { h } from 'vue'
export default {
    // 页面布局容器组件
    name: 'layout',
    props: ['span'],
    setup(props,context) {
        const spanCss = props.span ? `span-${props.span}` : ''
        return () => h('div', {
            class:['layout', spanCss, context.attrs.class]
        }, context.slots)
    }
}