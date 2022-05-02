import context from "@/common/context";
import { options, treeEach } from "@/utils/util";
import Props from "../props";
import { emitter, EVENTS } from "@/common/bus";
context.registerComponent('row',{
  // 组件默认配置
  getConfig() {
    return {
      uid: "",
      name: "row",
      props: {
      },
      children: []
    };
  },

  dropHandler(meta, dropData) {
    if (dropData.type === "field") {
      const config = context.components["form-item"].getConfigByField({
        field: dropData.data,
      });
      meta.children.push(config);
    }
  },
  // 组件的属性配置
  getProperties() {
    return [
      {
        group: "常用配置",
        properties: [
          Props.uid(),
          Props.height(),
          {
            label:'栅格间隔',
            mapping:'props.gutter',
            type:'number',
            value:0,
          },
          {
            label: '对齐方式',
            mapping: 'props.justify',
            type: 'select',
            options: ['start', 'end', 'center', 'space-between', 'space-around','space-evenly'],
            value: 'start',
            clearable: true,
            help: 'flex 布局下的水平排列方式'
          },
          {
            label:'垂直对齐方式',
            mapping:'props.align',
            type:'radio',
            options:options({top:'靠上',middle:'居中',bottom:'靠下'}),
            value:'',
            help:'flex 布局下的垂直排列方式,默认靠上'
          }
        ]
      }
    ];
  }
});


context.registerComponent('col',{
  // 组件默认配置
  getConfig() {
    return {
      uid: "",
      name: "col",
      props: {
      },
      children: []
    };
  },

  // 组件的属性配置
  getProperties() {
    return [
      {
        group: "常用配置",
        properties: [
          Props.uid(),
          Props.span({
            mapping:'props.span'
          }),
          Props.height(),
          {
            label: '左间隔数',
            mapping: 'props.offset',
            type: 'number',
            min:0,
            max:24,
            value: '',
            help: '栅格左侧的间隔格数'
          }
        ]
      }
    ];
  }
});