import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'
context.registerComponent('switch',{
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'switch',
      props: {
      },
      unaided: true
    }
  },
  // 组件的属性配置
  getProperties() {
    return [
      {
        group: '常用配置',
        groupType: 'collapse',
        properties: [
          Props.uid(),
          Props.model(),
          {
            label: '打开值',
            mapping: 'props.active-value',
            type: 'input',
            value: 1,
            help: '开关打开时的值'
          },
          {
            label: '关闭值',
            mapping: 'props.inactive-value',
            type: 'input',
            value: 0,
            help: '开关关闭时的值'
          },
          Props.width(),
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        groupType: 'collapse',
        properties: [
          {
            label: '打开文字',
            mapping: 'props.active-text',
            type: 'i18n',
            value: '',
            help: '开关打开时的文字描述'
          },
          {
            label: '关闭文字',
            mapping: 'props.inactive-text',
            type: 'i18n',
            value: '',
            help: '开关关闭时的文字描述'
          },
          {
            label: '开背景色',
            mapping: 'props.active-color',
            type: 'color',
            value: '',
            help: '开关打开时的背景色'
          },
          {
            label: '关背景色',
            mapping: 'props.inactive-color',
            type: 'color',
            value: '',
            help: '开关关闭时的背景色'
          },
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
