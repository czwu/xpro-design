import { useI18n } from "vue-i18n";
import { treeEach } from './util'
// import componentsPretreatment from '../components/index'

/**
  * 元数据预处理函数,将元数据对象解析成vue render可识别的属性
  * 加你个元数据对象design下面的配置项目 解析到 vue 可识别的 props attrs style 等对象中
  * @param {Object} meta 组件元数据配置对象
  * @param {Object} ctx 解析器上下文配置对象
  * @param {String} type  解析模式 [runtime, design] , 默认为运行时解析,  当值未design时,是设计器的解析模式,设计器中可以忽略许多配置解析
  */
export default function pretreatment(meta, ctx, type = 'runtime') {
  const i18n = useI18n()
  ctx.isRuntime = type === 'runtime'
  meta.props = meta.props || {}
  meta.props.class = meta.props.class || []
  // 如果配置了span属性,则将span 解析成 样式 [span-1] 的类名,添加到class中
  if (meta.span) {
    meta.props.class.push(`span-${meta.span}`)
  }
  if (meta.uid) {
    meta.props.class.push(meta.uid)
  }
  if (meta.permission) {
    if (type === 'runtime') {
      meta.props['v-permission'] = `"${meta.permission}"`
    }
  }

  // if (isStrVal(meta.layout)) {
  //   meta.props.class.push(meta.layout === 'col' ? 'flex-col' : 'flex-row')
  // }

  // 如果配置了slotText,则将slotText 放入 childdren中
  if (meta.slotText) {
      meta.children = ctx.isRuntime ? `{{$t("${meta.slotText}")}}` : i18n.t(meta.slotText)
  }
  // 如果配置了disabled
  if (meta.disabled) {
    if (typeof meta.disabled === 'boolean') {
      meta.props.disabled = meta.disabled
    } else {
      meta.props[':disabled'] = meta.disabled
    }
  }

  // 处理选项数据信息
  // optionsConvert(meta, ctx)
  // 其他组件各自的代码编译预处理程序
  // componentsPretreatment(meta, ctx, type, pretreatment)
  // 处理国际化配置信息meta,'
  // i18nConvert(meta, ctx)
  // 布局处理 (flex栅格 与 标准栅格)
  // layoutConvert(meta, ctx, type)
}

/**
 * 识别组件属性中的国际化信息,转换成当前语种对应文本
 * @param {Object} meta 当前组件元数据对象
 * @param {Object} ctx  编译上下文
 */
function i18nConvert(meta, ctx) {
  // 设计时 国际化转换处理
  if (meta.props) {
    if (meta.props.title) {
      meta.props.title = i18n.t(meta.props.title)
    }
    if (meta.props.label) {
      meta.props.label = i18n.t(meta.props.label)
    }
    if (meta.props['active-text']) {
      if (ctx.isRuntime) {
        meta.props[':active-text'] = `$t("${meta.props['active-text']}")`
        delete meta.props['active-text']
      } else {
        meta.props['active-text'] = i18n.t(meta.props['active-text'])
      }
    }
    if (meta.props['inactive-text']) {
      if (ctx.isRuntime) {
        meta.props[':inactive-text'] = `$t("${meta.props['inactive-text']}")`
        delete meta.props['inactive-text']
      } else {
        meta.props['inactive-text'] = i18n.t(meta.props['inactive-text'])
      }
    }
    if (meta.props.placeholder) {
      if (ctx.isRuntime) {
        if (ctx.path[ctx.path.length - 1].name === 'grid') {
          meta.props[':placeholder'] = `$t('${meta.props.placeholder}')`
        } else {
          meta.props[':placeholder'] = `$t("${meta.props.placeholder}")`
        }
      } else {
        meta.props.placeholder = i18n.t(meta.props.placeholder)
      }
    }
  }
  if (typeof meta.children === 'string') {
    meta.children = i18n.t(meta.children)
  }
}

function isStrVal(val) {
  return typeof val === 'string' && val
}

/**
 * options 转换,用于组件:checkbox-group radio-group select等
 * @param {Object} meta 当前组件元数据对象
 * @param {Object} ctx  编译上下文
 */
function optionsConvert(meta, ctx) {
  const childTag = meta.childTag
  if (meta.dataSourceType === 'static' && meta.options) {
    const datatype = findFieldDataType(ctx, meta.design.vmodel)
    meta.children = meta.design.options.map(opt => {
      const val = datatype === 'Integer' ? opt.value * 1 : opt.value
      return {
        name: childTag,
        props: {
          label: meta.name === 'select' ? i18n.t(opt.label) : val,
          value: meta.name === 'select' ? val : ''
        },
        design: {},
        children: meta.name === 'select' ? null : i18n.t(opt.label)
      }
    })
  }
}

function findFieldDataType(ctx, fieldId) {
  if (!ctx.pageMeta) {
    return
  }
  const model = ctx.pageMeta.models.find(m => m.id === fieldId.split('.')[0])
  let dataType = 'String'
  if (model) {
    treeEach(model.fields, (item) => {
      if (item.id === fieldId) {
        dataType = item.dataType
      }
    }, 'fields')
  }
  return dataType
}

function layoutConvert(meta, ctx, type) {
  if (meta.name === 'layout' || meta.name === 'form') {
    if (meta.design.mode === 'span') {
      meta.name = 'row'
      meta.class['flex-row'] = false
      meta.class['flex-col'] = false
      meta.style = {}
    }
  }
}
