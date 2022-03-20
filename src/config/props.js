import { getComponentId, options, uuid } from '@/utils/util'
import PageMeta from '@/common/metadata'
import { emitter, EVENTS } from '@/common/bus'
export default {
    // 组件ID, 只读
    uid() {
      return {
        label: '组件编号',
        mapping: 'uid',
        type: 'text',
        value: '',
        i18n:false,
        vif: 'uid'
      }
    },
    // 组件类型, 只读
    compName() {
      return {
        label: '组件类型',
        mapping: 'view',
        type: 'text',
        value: ''
      }
    },
    // 可变组件类型 属性 (可切换)
    compType() {
      return {
        label: '组件类型',
        mapping: 'view',
        type: 'select',
        value: ''
      }
    },
    // 标题
    title() {
      return {
        label: '标题',
        mapping: 'props.title',
        type: 'i18n',
        value: '标题',
        help: '请设置标题'
      }
    },
    // 事件编排
    eventBtn() {
      return [{ type: 'divider', title: '事件编排' }, {
        label: '事件编排',
        text: '设置',
        type: 'button',
        onClick(e, meta) {
          emitter.emit(EVENTS.SHOW_EVENT_SETUP, meta)
        }
      }]
    },
    //自定义组件样式
    class(prop) {
      return Object.assign({
        label: '扩展样式',
        mapping: 'props.class',
        type: 'input',
        value: '',
        format(val){
          return val.join(',')
        },
        valueFormat(val){
          return val.split(",")
        },
        help: '添加自定义样式类名,多选请用逗号分割'
      }, prop)
    },
    placeholder(prop) {
      return Object.assign({
        label: '占位文本',
        mapping: 'props.placeholder',
        type: 'i18n',
        value: '',
        clearable: true
      }, prop)
    },
    fontSize() {
      return {
        label: '字体大小 (px)',
        mapping: 'props.style.fontSize',
        type: 'number',
        value: '',
        placeholder:'默认',
        format(val) {
          return val ? parseInt(val) : undefined
        },
        valueFormat(val){
          return val ? val+'px' : ''
        }
      }
    },
    lineHeight() {
      return {
        label: '行高 (px)',
        mapping: 'props.style.lineHeight',
        placeholder:'默认',
        type: 'number',
        value: '',
        clearable: true,
        append: 'px',
        format(val) {
          return val ? parseInt(val) : undefined
        },
        valueFormat(val){
          return val ? (val+'px') : ''
        }
      }
    },
    multiple() {
      return {
        label: '多选',
        mapping: 'props.multiple',
        type: 'bool',
        value: false,
        help: '是否可以选中多项'
      }
    },
    clearable() {
      return {
        label: '清除按钮',
        mapping: 'props.clearable',
        type: 'bool',
        value: false,
        help: '是否显示清除按钮(clearable)'
      }
    },
    customAttr() {
      return {
        label: '自定义属性',
        mapping: 'customAttr',
        type: 'input',
        value: '',
        help: '自定义属性'
      }
    },
    model() {
      return {
        label: '模型字段',
        mapping: 'vmodel',
        type: 'model',
        help: '绑定数据模型字段(v-model)',
        value: '',
        vif: 'unaided',
        _del_: false
      }
    },
    dataType(prop = {}) {
      return Object.assign({
        label: '数据绑定',
        mapping: 'dataSourceType',
        type: 'radio',
        options: options({ static: '静态', dynamic: '动态', api: '服务' }),
        value: 'static',
        help: '请选择数据源的类型'
      }, prop)
    },
    staticData() {
      return [
        { type: 'divider', title: '录入选项数据', vif: meta => meta.dataSourceType === 'static' },
        {

        type: 'list',
        mapping: 'options',
        deleteable: true,
        addable: true,
        sortable:true,
        value: [],
        columns: [
          {
            mapping: 'label',
            type: 'input',
            value: '',
            placeholder: '标签'
          },
          {
            mapping: 'value',
            type: 'input',
            value: '',
            placeholder: '值',
            clearable: true,
            width: '80px'
          }
        ],
        vif: meta => meta.dataSourceType === 'static'
      }
      ]
    },
    dynamicData(props) {
      return Object.assign({
        label: '模型数据',
        mapping: 'dataSource',
        type: 'model',
        checkStrictly: true,
        help: '请选择数据模型',
        value: '',
        vif: meta => meta.dataSourceType === 'dynamic'
      }, props)
    },
    api(prop) {
      const apis = PageMeta.meta.apis || []
      return Object.assign({
        label: '选择服务',
        mapping: 'api',
        type: 'select',
        options: apis,
        labelKey: 'name',
        valueKey: 'code',
        help: '请选择服务',
        value: ''
      }, prop)
    },
    initApi() {
      const apis = PageMeta.meta.apis || []
      return [
        {
          label: '选择服务',
          mapping: 'api.code',
          type: 'select',
          options: apis,
          labelKey: 'name',
          valueKey: 'apiUcode',
          help: '请选择服务',
          value: '',
          vif: meta => meta.dataSourceType === 'api'
        }, {
          label: '参数设置',
          type: 'button',
          text: '设置',
          onClick(e, meta) {
            emitter.emit(EVENTS.SHOW_PARAMS_EDITOR, {
              uid: meta.uid,
              api: meta.api,
              callback(params) {
                meta.api.params = params
              }
            })
          },
          vif: meta => meta.api?.code
        }, {
          label: '数据加工',
          mapping: 'api.dataHandler',
          type: 'method',
          onlyCode: true,
          value: '',
          vif: meta => meta.api?.code,
          help: '如需要对服务返回的数据做加工处理,可选择自定义方法,并在方法内返回修正好的数据'
        }
      ]
    },
    valueKey(data = {}, meta) {
      return Object.assign({
        label: '值字段',
        mapping: 'valueKey',
        type: 'field-select',
        params: meta,
        value: '',
        vif: meta => meta.dataSourceType !== 'static'
      }, data)
    },
    labelKey(data = {}, meta) {
      return Object.assign({
        label: '描述字段',
        mapping: 'labelKey',
        params: meta,
        type: 'field-select',
        value: '',
        vif: meta => meta.dataSourceType !== 'static'
      }, data)
    },
    span(param) {
      return Object.assign({
        label: '宽度',
        mapping: 'span',
        type: 'slider',
        value: 24,
        max: 24,
        min: 0,
        marks: {
          12: ''
        },
        help: '栅格宽度,将按24等分设置布局宽度,该项优先级低于像素宽度'
      },param)
    },
    height() {
      return {
        label: '高度',
        mapping: 'props.style.height',
        type: 'input',
        value: '',
        clearable: true,
        help: '组件高度,支持像素与百分比,比如 100px 或 10%, 备注:设计模式下组件会有默认高度'
      }
    },
    width(param = {}) {
      return Object.assign({
        label: '宽度',
        mapping: 'props.style.width',
        type: 'input',
        value: '',
        clearable: true,
        append: 'px',
        format:(val)=>  (val ? parseInt(val) : '') ||'',
        valueFormat:(val)=>  val ? parseInt(val)+'px' : '',
        help: '像素宽度,该设置优先级高于栅格宽度,设置该项后 栅格宽度将不生效'
      }, param)
    },
    flexibility() {
      return {
        label: '弹性',
        mapping: 'props.style.flex-grow',
        type: 'bool',
        value: false,
        format(val, isEdit) {
          return isEdit ? !!val : val ? 1 : ''
        },
        help: '组件是否自动填充父组件剩余空间,如果多组件设置了弹性,则平分剩余空间(父组件为flex布局时生效)'
      }
    },
    disabledExp() {
      return {
        label: '禁用条件',
        mapping: 'disabled',
        type: 'input',
        value: '',
        help: '禁用条件表达式'
      }
    },
    layout() {
      return {
        label: '内部布局',
        mapping: 'props.layout',
        type: 'radio',
        options: options({ col: '列', row: '行' }),
        value: 'col',
        onChange(val, meta) {
          meta.props.style['flex-wrap'] = val === 'row' ? 'wrap' : ''
          return true
        },
        help: '组件内部布局方式,行:水平,从左至右排列, 列:垂直,子组件将从上而下排列'
      }
    },
    wrap() {
      return {
        label: '允许换行',
        mapping: 'style.flex-wrap',
        type: 'bool',
        value: false,
        format(val, isEdit) {
          if (isEdit) {
            return !!val
          } else {
            return val ? 'wrap' : ''
          }
        },
        vif: (meta) => { return meta.props.layout === 'row' },
        help: '当子组件按列布局时, 是否允许子组件超出当前行宽度后换行'
      }
    },
    justify() {
      return {
        label: '对齐方式',
        mapping: 'style.justify-content',
        type: 'select',
        options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
        value: '',
        clearable: true,
        help: '内容对齐方式,具体请查看flex 布局 justify-content详细介绍'
      }
    },
    scroll() {
      return {
        label: '滚动条',
        mapping: 'scroll',
        type: 'select',
        options: [{ value: '', label: '无' }, { value: 'x', label: '允许横向滚动' }, { value: 'y', label: '允许垂直滚动' }],
        value: ''
      }
    },
    vif() {
      return {
        label: '渲染条件',
        mapping: 'vif',
        type: 'input',
        value: '',
        help: '设置条件表达式,表达式满足时,该组件才会渲染'
      }
    },
    vfor() {
      return [{ type: 'divider', title: '循环指令配置' }, {
        label: '循环渲染',
        mapping: 'vfor',
        type: 'bool',
        value: false,
        help: '是否需要循环渲染多次该组件'
      }, {
        label: '循环变量',
        mapping: 'scope',
        type: 'model',
        filter: 'Array',
        value: '',
        vif: 'vfor',
        help: '循环的数组对象'
      }, {
        label: '对象别名',
        mapping: 'scope_alias',
        type: 'input',
        value: 'item',
        vif: 'vfor',
        help: '子组件可以使用该别名访问数组子对象'
      }]
    },
    disabled() {
      return {
        label: '禁用条件',
        mapping: 'disabled',
        type: 'input',
        value: '',
        help: '禁用条件表达式'
      }
    },
    readonly() {
      return {
        label: '只读',
        mapping: 'props.readonly',
        type: 'bool',
        value: false,
        help: '设置为只读'
      }
    },
    size(conf) {
      return Object.assign({
        label: '组件尺寸',
        mapping: 'props.size',
        type: 'radio',
        options: options({large:'较大','': '默认', small: '较小', }),
        value: ''
      },conf)
    },
    permission() {
      return [
        { type: 'divider', title: '权限控制' },
        {
          label: '权限编码',
          mapping: 'permission',
          type: 'input',
          value: '',
          help: '根据权限编码控制组件是否显示，需要结合权限指令使用'
        }
      ]
    },
    tooltip() {
      return [
        { type: 'divider', title: '提示' },
        {
          label: '提示',
          mapping: 'tooltip',
          type: 'bool',
          value: false,
          format(val){
            return !!val
          },
          valueFormat(val){
            return val ? {} : null
          },
          help: '展示鼠标 hover 时的提示信息'
        },
        {
          label: '提示文本',
          mapping: 'tooltip.content',
          type: 'i18n',
          value: '',
          placeholder:'请设置提示文本',
          help: '具体展示的文本信息',
          vif: 'tooltip'
        },
        {
          label: '提示主题',
          mapping: 'tooltip.effect',
          type: 'radio',
          options: options({ dark: '黑', light: '白' }),
          value: 'dark',
          help: '提示颜色信息',
          vif: 'tooltip'
        },
        {
          label: '提示位置',
          mapping: 'tooltip.placement',
          type: 'select',
          value: 'top',
          help: 'Tooltip 的出现位置',
          vif: 'tooltip',
          options: [
            { value: 'top-start', label: '上左' },
            { value: 'top', label: '上边' },
            { value: 'top-end', label: '上右' },
            { value: 'left-start', label: '左上' },
            { value: 'left', label: '左边' },
            { value: 'left-end', label: '左下' },
            { value: 'right-start', label: '右上' },
            { value: 'right', label: '右边' },
            { value: 'right-end', label: '右下' },
            { value: 'bottom-start', label: '下左' },
            { value: 'bottom', label: '下边' },
            { value: 'bottom-end', label: '下右' }
          ]
        }
      ]
    },
    bgcolor() {
      return {
        label: '背景色',
        mapping: 'props.style.background',
        type: 'color',
        value: '',
        help: '背景颜色设置'
      }
    },
    margin() {
      return {
        label: '外边距',
        mapping: 'props.style.margin',
        type: 'input',
        value: '',
        help: '请按照标准css margin属性配置,可以 5px 或 5px 5px 等方式配置 '
      }
    },
    padding() {
      return {
        label: '内边距',
        mapping: 'props.style.padding',
        type: 'input',
        value: '',
        help: '请按照标准css padding属性配置,可以 5px 或 5px 5px 等方式配置 '
      }
    },
    styles() {
      return [
        { type: 'divider', title: '样式设置' },
        this.padding(),
        this.margin(),
        this.bgcolor()
      ]
    }
}


function getCurrMeta(e){

}