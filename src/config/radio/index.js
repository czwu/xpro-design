import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'


context.components['radio-group'] = {
  // 组件默认配置
  getConfig(parent, ctx) {
    return {
      uuid: '',
      name: 'radio-group',
      props: {},
      design: {
        dataType: 'static',
        options: [{ label: '文本', value: 'value' }]
      },
      class: {},
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
            label: '按钮样式',
            mapping: 'design.buttonStyle',
            type: 'bool',
            value: false,
            help: '是否使用按钮样式'
          },
          {
            label: '组件尺寸',
            mapping: 'props.size',
            type: 'radio',
            options: options({ medium: '中等', small: '较小', mini: '迷你' }),
            value: constants_SIZE,
            vif(meta) { return meta.design.buttonStyle },
            help: 'Radio 的尺寸，仅在按钮样式有效'
          },
          Props.dataType(),
          Props.staticData(),
          Props.dynamicData(),
          ...Props.initApi(meta),
          Props.valueKey(null, meta),
          Props.labelKey(null, meta),
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        groupType: 'collapse',
        properties: [
          {
            label: '字体颜色',
            mapping: 'porps.text-color',
            type: 'color',
            value: '',
            vif(meta) { return meta.design.buttonStyle },
            help: '按钮形式的 Radio 激活时的文本颜色'
          },
          {
            label: '填充颜色',
            mapping: 'porps.text-color',
            type: 'color',
            value: '',
            vif(meta) { return meta.design.buttonStyle },
            help: '按钮形式的 Radio 激活时的填充色和边框色'
          },
          Props.classList(),
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

}
