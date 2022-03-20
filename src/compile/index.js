import {compile} from './common/index'


/**
 * 基于元数据获取组件
 */
function getComponent(meta, params = {}) {
    const code = meta.isRoot ? compile(meta) : meta
    let jsCode = code.js.replace('export default ', '').trim()
    const pageId = params.pageId || params.id
    if (params.loadCss !== false) {
        loadPageStyle(code.css)
    }
    if (!jsCode.startsWith('return')) {
        jsCode = 'return ' + jsCode
    }
    const moduleNames = []
    const modules = []
    params.modules && params.modules.forEach(m => {
        moduleNames.push(m)
        modules.push(m.module)
    })

    const vmClass = new Function(...moduleNames, jsCode)
    let vm
    try {
        vm = vmClass(...modules)
    } catch (e) {
        console.error('页面脚本生成异常:', e)
    }
    vm.name = `Page${pageId}`
    vm.template = `<div class='page-component'>${code.html}</div>`
    vm.props.PAGE_ID = {
        type: String,
        default: pageId
    }
    return vm
}

function loadPageStyle(cssCode, id) {
    window.GlobalStyleMap = window.GlobalStyleMap || {}
    if (!window.GlobalStyleMap[id]) {
        const styleNode = document.createElement('style')
        styleNode.setAttribute('type', 'text/css')
        styleNode.innerHTML = cssCode
        document.querySelector('head').appendChild(styleNode)
        window.GlobalStyleMap[id] = true
    }
}

export {
    compile,
    getComponent
}