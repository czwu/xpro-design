import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'

context.registerComponent('input',{
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'input',
      props:{
        type:'text'
      },
      unaided: true
    }
  },

  // 组件的属性配置
  getProperties() {
    return [
      {
        group: '常用配置',
        properties: [
          Props.uid(),
          Props.model(),
          {
            label: '输入类型',
            mapping: 'props.type',
            type: 'select',
            options: options({ text: '文本框', textarea: '文本域', password: '密码框' }),
            value: 'text',
            help: '输入框类型'
          }, {
            label: '行数',
            mapping: 'props.rows',
            type: 'number',
            value: 2,
            vif: meta => meta.props.type === 'textarea',
            help: '文本域行数'
          },
          {
            label: '占位文本',
            mapping: 'props.placeholder',
            type: 'i18n',
            value: '',
            clearable: true
          }, {
            label: '清空按钮',
            mapping: 'props.clearable',
            type: 'bool',
            value: false
          }, 
          Props.span(),
          Props.size(),
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        properties: [
          Props.width({ vif: 'unaided' }),
          {
            label: '字数统计',
            mapping: 'props.show-word-limit',
            type: 'bool',
            value: false,
            help: '是否显示输入字数统计，只在 文本框与文本域类型 时有效'
          },
          Props.readonly(),
          Props.disabled(),
          {
            label: '前置内容',
            mapping: 'slots.prepend',
            type: 'bool',
            value: false,
            format(val){
              return val ? true : false
            },
            onChange(val,meta) {
              if (val) {
                const prepend = context.getConfig('layout', meta)
                prepend.slot = 'prepend'
                meta.slots.prepend = prepend
                return true
              } else {
                delete meta.slots.prepend
              }
            },
            help: '输入框前置内容',
            vif: meta=> meta.props.type === 'text'
          },
          {
            label: '后置内容',
            mapping: 'slots.append',
            type: 'bool',
            value: false,
            format(val){
              return val ? true : false
            },
            onChange(val,meta) {
              if (val) {
                const append = context.getConfig('layout', meta)
                append.slot = 'prepend'
                meta.slots.append = append
                return true
              } else {
                delete meta.slots.append
              }
            },
            help: '输入框后置内容',
            vif: meta=> meta.props.type === 'text'
          },
          {
            label: '头部图标',
            mapping: 'props.prefix-icon',
            type: 'icon',
            value: '',
            help: '输入框头部图标',
            vif: meta=> meta.props.type === 'text'
          },
          {
            label: '尾部图标',
            mapping: 'props.suffix-icon',
            type: 'icon',
            value: '',
            help: '输入框尾部图标',
            vif: meta=> meta.props.type === 'text'
          },
          Props.class(),
          Props.vif(),
          ...Props.tooltip(),
          ...Props.styles(),
        ]
      }
    ]
  },

  getEvents() {
    return [
      { id: 'change', label: '值改变事件(change)' },
      { id: 'keyup', label: '键盘keyUp事件'},
      { id: 'keydown', label: '键盘keyDown事件' },
      { id: 'input', label: '输入事件(input)' },
      { id: 'focus', label: '获得焦点事件' },
      { id: 'blur', label: '失去焦点事件' },
      { id: 'clear', label: '点击清空按钮' }
    ]
  }

})
