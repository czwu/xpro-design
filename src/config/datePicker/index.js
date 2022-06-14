import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'

context.registerComponent('date-picker',{
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'date-picker',
      props: { },
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
            label: '模式',
            mapping: 'props.type',
            type: 'select',
            options: ['year', 'month', 'date', 'dates', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'],
            value: '',
            help: '日期选择模式'
          },
          {
            label: '时间格式',
            mapping: 'props.value-format',
            type: 'input',
            value: 'yyyy-MM-dd',
            help: '可选,绑定值的格式。不指定则绑定值为 Date 对象'
          }, {
            label: '显示格式',
            mapping: 'props.format',
            type: 'input',
            value: 'yyyy-MM-dd',
            help: '显示在输入框中的格式'
          },
          {
            label: '显示格式',
            mapping: 'props.format',
            type: 'input',
            value: 'yyyy-MM-dd',
            help: '显示在输入框中的格式'
          },
          Props.placeholder(),
          Props.size(),
          { type: 'divider', label: '禁用时间区间' },
          {
            label: '周起始日',
            mapping: 'firstDayOfWeek',
            type: 'select',
            value: '',
            clearable: true,
            options: options({
              '1': '星期一',
              '2': '星期二',
              '3': '星期三',
              '4': '星期四',
              '5': '星期五',
              '6': '星期六',
              '7': '星期日'
            }),
            help: '选择器中的周起始日设置,默认为星期日'
          }, {
            label: '禁用区间类型',
            mapping: 'disabledAreaType',
            type: 'select',
            value: '',
            clearable: true,
            options: options({
              'beforeToday': '当天前',
              'afterToday': '当天后',
              'customArea': '自定义区间',
              'customFn': '自定义方法'
            }),
            onChange(val, meta) {
              if (val === 'customArea') {
                meta.disAreaValType = 'before'
                return true
              }
            }
          },
          {
            label: '禁用区间',
            mapping: 'disAreaVal',
            type: 'input',
            value: '',
            append: {
              mapping: 'disAreaValType',
              type: 'select',
              value: 'before',
              options: options({ 'before': '天前', 'after': '天后' }),
              width: '100px'
            },
            vif: (meta) => meta.disabledAreaType === 'customArea'
          },
          {
            label: '自定义方法',
            mapping: 'disabledDateFn',
            type: 'method',
            onlyCode: true,
            value: '',
            vif: (meta) => meta.disabledAreaType === 'customFn',
            help: '设置禁用状态，参数为当前日期，要求返回 Boolean'
          },
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        groupType: 'collapse',
        properties: [
          Props.clearable(),
          Props.readonly(),
          {
            label: '时间范围',
            mapping: 'props.range-separator',
            type: 'bool',
            value: '',
            vif: 'props.is-range',
            help: '选择范围时的分隔符,如不配置,默认为"-"'
          },
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
