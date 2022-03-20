import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'


context.registerComponent('radio-group', {
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'radio-group',
      dataSourceType:'static',
      optionTag:'el-radio',
      span:0,
      props: {

      },
      options: [{ label: '文本', value: 'value' }],
      // 是否独立存在(不跟formItem绑定)
      unaided: true
    }
  },

  // 组件的属性配置
  getProperties(meta) {
    return [
      {
        group: '常用配置',
        properties: [
          Props.uid(),
          Props.model(),
          {
            label: '风格',
            mapping: 'optionTag',
            type: 'radio',
            options: options({ 'el-radio': '默认', 'el-radio-button': '按钮' }),
            value: '',
            help: '请选择单选框展示的样式'
          },
          Props.size({
            help: 'radio 的尺寸，仅在按钮样式有效',
            vif: meta => meta.optionTag === 'el-radio-button'
          }),
          Props.dataType(),
          ...Props.staticData(),
          Props.dynamicData(),
          ...Props.initApi(meta),
          Props.valueKey(),
          Props.labelKey(),
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        properties: [
          Props.span(),
          {
            label: '显示边框',
            mapping: 'props.border',
            type: 'bool',
            value: false,
            vif: meta => meta.optionTag === 'el-radio-button',
            help: '单选按钮,是否显示边框'
          },
          {
            label: '字体颜色',
            mapping: 'props.text-color',
            type: 'color',
            value: '',
            vif: meta => meta.optionTag === 'el-radio-button',
            help: '单选按钮激活时的文本颜色'
          },
          {
            label: '填充颜色',
            mapping: 'props.text-color',
            type: 'color',
            value: '',
            vif: meta => meta.optionTag === 'el-checkbox-button',
            help: '单选按钮 激活时的填充色和边框色'
          },
          Props.class(),
          Props.vif(),
          Props.disabled()
        ]
      }
    ]
  },

  getEvents() {
    return [
      { id: 'change', label: '值改变事件(onChange)' }
    ]
  }

})
