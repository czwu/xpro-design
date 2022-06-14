import { deepClone, type, wrapCss } from "./util";
import tags from './tags'
import get from 'lodash/get'
import pretreatment from "./pretreatment";
import { generateScript } from './script'
/**
 * 组件template 渲染入口
 * @param meta 组件元数据配置对象
 * @param ctx 渲染上下文参数
 * @returns {object}
 */
export function compile(pageMeta, ctx = {}) {
  const meta = deepClone(pageMeta);
  // 上下文初始化
  ctx.vue$props = [];
  ctx.vue$data = [];
  ctx.vue$methods = [];
  ctx.vue$created = [];
  ctx.vue$watch = []; 
  ctx.vue$mounted = [];
  ctx.vue$activated = [];
  ctx.vue$beforeUnmount = [];
  ctx.path = [];
  ctx.pageMeta = meta;
  ctx.cssCode = [];
  // 优先执行html compile, compileHtml 内部会解析元数据,并分析JSCode
  const html = generateHtml(meta, ctx);
  return {
    js: generateScript(meta, ctx),
    css: wrapCss(meta.css, meta.id) + ctx.cssCode.join("\n"),
    html,
  };
}

function generateHtml(meta, ctx) {
  const { name, props } = meta;
  if (!ctx.t) {
    ctx.t = (s) => s
  }
  let tagName = tags[name] || name
  if (typeof meta === "string") {
    return ctx.t(meta)
  }
  if (!tagName) {
    return "";
  }
  // 编译前预处理,主要处理组件元数据中自定义配置项
  pretreatment(meta, ctx);
  // 预处理函数可能修改渲染组件名, 需要重新获取
  tagName = tags[meta.name] || tagName;
  // if (tagName === "async-component") {
  //   tagName = `async-component-${meta.code}`;
  // }

  // 编译元数据红的design.initApi
  // compileInitApi(meta, ctx);
  if (ctx.path[ctx.path.length - 1] !== meta) {
    ctx.path.push(meta);
  }

  // 如果有children 则递归执行子组件解析,如果没有children元素,则走动态子元素解析逻辑
  let childHtml = meta.children
    ? compileChildren(meta.children, ctx)
    : compileDynamicChildren(meta, ctx);
  const slotsHtml = compileSlots(meta.slots, ctx) ||'';
  ctx.path.pop();
  if (!childHtml && meta.props.template) {
    childHtml = meta.props.template;
    meta.props.template = ''
    meta.props.template_id = meta.uid;
  }
  // 检查元数据中是否有配置插槽名称, 如果有,则加上插槽名称
  const slotName = meta.slot ? `slot='${meta.slot}'` : "";
  // 根据元数据中的属性配置生成 vue属性字符串
  const propsHtml = compileProps(props, ctx).join("");
  //内联样式拼接处理
  const styleHtml = compileStyles(props.style, ctx).join(";");
  const styles = styleHtml.length ? `style='${styleHtml}'` : "";
  // 样式名称处理
  const css = meta.class ? `class='${meta.class.join(" ")}'` : "";

  // 获取数据模型绑定值 (需要进行处理)
  const vmodel = getModel(meta, ctx);
  // 处理循环指令
  let vfor = "";
  if (meta.vfor && meta.scope) {
    vfor = `v-for='(${meta.design.scope_alias || "item"},index) in ${meta.design.scope
      }' :key='index'`;
  }
  // 处理动态数据
  let data = "";
  if (meta.dataAttribute && meta.dataSourceType === "api" && meta.api.code) {
    data = `:${meta.dataAttribute}='${meta.uid}_${meta.dataAttribute}'`;
  }
  // 处理ref
  const ref = meta.ref ? `ref='${meta.uid || ctx.path[ctx.path.length - 1].uid}'` : "";
  // 事件处理
  // if (meta.events) {
  //   compileEvents(meta, ctx);
  // }
  const events = meta.events && !meta.isRoot ? compileEvents(meta, ctx) : "";

  const customProps = meta.customProps || "";
  const vif = meta.vif ? `v-if='${meta.vif}'` : "";
  const html = `<${tagName} ${vfor} ${vif} ${data} ${vmodel} ${slotName} ${propsHtml} ${customProps} ${css} ${ref} ${styles} ${events}>
     ${childHtml} ${slotsHtml}
     </${tagName}>`;
  // 处理元素包裹
  return wrap(html, meta, ctx);
}

function wrap(html, { tooltip }) {
  if (tooltip) {
    return `<el-tooltip content="${tooltip.content}" effect="${tooltip.effect}" placement="${tooltip.placement}">${html}</el-tooltip>`
  } else {
    return html
  }
}

/**
 * 组件template 渲染入口
 * @param children 子集元数据
 * @param ctx 渲染上下文参数
 * @returns {string}
 */
function compileChildren(children, ctx) {
  if (children) {
    if (Array.isArray(children)) {
      return children.map(meta => {
        return meta ? generateHtml(meta, ctx) : ''
      }).join('')
    } else if (typeof children === 'object') {
      return generateHtml(children, ctx)
    } else if (typeof children === 'string') {
      return children
    }
  } else {
    return ''
  }
}

function compileSlots(slots, ctx) {
  if (slots && typeof slots !== 'object') {
    console.error('compileSlots 编译出错,不是有效的插槽元数据对象: slots=>', slots)
  }
  return slots && Object.values(slots).map(slot => generateHtml(slots))
}


/**
 * 组件动态子元素渲染, 一些特殊组件(select radio-group checkbox-group)的子元素根据api数据或数据模型生成,
 * 因此需要根据其配置动态编译成代码并返回
 * 该处依赖 compileInitApi方法中生成的bindDataName属性,因此需要在compileInitApi之后执行
 * @param meta 组件元数据
 * @param ctx 渲染上下文参数
 * @returns {string}
 */
function compileDynamicChildren(meta, ctx) {
  const dataVariable = get(meta, 'api.dataVariable') || meta.dataVariable
  if (dataVariable && meta.optionTag && ['select', 'checkbox-group', 'radio-group', 'el-dropdown-menu'].includes(meta.name)) {
    const tag = meta.optionTag
    const label = `item.${meta.labelKey || 'label'}`
    const value = `item.${meta.valueKey || 'value'}`
    if (meta.name === 'select') {
      return `<${tag} v-for="(item,i) in ${dataVariable}" :key='i' :label='${label}' :value='${value}'></${tag}>`
    } else if (meta.name === 'el-dropdown-menu') {
      return `<${tag} v-for="(item,i) in ${dataVariable}" :key='i' command='${value}' > {{${label}}}</${tag}>`
    } else {
      return `<${tag} v-for="(item,i) in ${dataVariable}" :key='i' :label='${value}' > {{${label}}}</${tag}>`
    }
  }
  return ''
}




/**
 * 根据元数据中的Props生成组件 属性html
 * props : {name:'field1',title:'标题'} ==>
 * 转换成字符串数组 ["name='field1'", "title='标题'"]
 * @param props 属性配置对象
 * @param ctx 上下文对象
 * @returns {*}
 */
function compileProps(props, ctx) {
  const attrs = []
  props && Object.keys(props).forEach(name => {
    if (!['style', 'class'].includes(name)) {
      const val = props[name]
      const valType = type(val)
      if (valType !== 'null' && valType !== 'undefined' && val !== '') {
        if (valType === 'boolean' || valType === 'number') {
          attrs.push(`:${name}='${val}'`)
        } else if (valType === 'string') {
          attrs.push(`${name}='${val}'`)
        } else if (valType === 'object' || valType === 'array') {
          let json = JSON.stringify(val).replace(/"---\$---/g, '').replace(/---\$---"/g, '')
          if (name === 'rules') {
            json = json.replace(/\\\\/g, '\\')
          }
          attrs.push(`:${name}='${json}'`)
        }
      }
    }
  })
  return attrs
}


/**
 * 根据元数据中的style 样式配置生成组件html style属性
 * @param props 属性配置对象
 * @param ctx 上下文对象
 * @returns {string}
 */
function compileStyles(props, ctx) {
  const attrs = []
  for (const name in props) {
    const val = props[name]
    if (val || val === 0) {
      attrs.push(`${name}:${val}`)
    }
  }
  return attrs
}



/**
 * 通过元数据与上下文对象分析并返回 dataModel
 * @param {Object} meta 当前组件元数据对象
 * @param {Object} ctx  编译上下文
 */
function getModel(meta, ctx) {
  // vmodel  vfor的作用域处理
  let modelVal = meta.vmodel
  if (modelVal) {
    const scopes = []
    ctx.path.forEach(item => {
      if (item.scope) {
        scopes.push({ name: item.scope, alias: item.scope_alias })
      }
    })
    scopes.reverse().some(scope => {
      if (modelVal.startsWith(scope.name)) {
        modelVal = `${scope.alias}${modelVal.substr(scope.name.length)}`
        return true
      }
    })
  }
  return modelVal ? `v-model='${modelVal}'` : ''
}


/**
 * 根据元数据中的events 配置的方法名称,绑定code方法
 * @param meta 元数据对象
 * @returns {string}
 */
function compileEvents(meta, ctx) {
  const isInTable = ctx.path.some(item => item.name === 'table')
  const isInTree = ctx.path.some(item => item.name === 'tree')
  let params = []

  if (isInTable) {
    params = ['scope.row']
  } else if (isInTree) {
    params = ['data']
  }
  return Object.keys(meta.events).map(name => {
    const event = meta.events[name]
    if (event.params) {
      params = [...event.params, ...params]
    }
    const handlerName = `${meta.uid || meta.pid}_${name}`
    return `@${name}='${handlerName}(${params.join(',')})'`
  }).join(' ')
}

