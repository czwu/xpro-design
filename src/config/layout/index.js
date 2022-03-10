import context from "@/common/context";
import { options, treeEach } from "@/utils/util";
import Props from "../props";
import { emitter, EVENTS } from "@/common/bus";
context.registerComponent('layout',{
  // 组件默认配置
  getConfig() {
    return {
      uid: "",
      name: "layout",
      span:24,
      props: {
        layout: "row",
        style: {
          "flex-wrap": "wrap",
        },
        class: []
      },
      children: []
    };
  },

  beforeRender(opts) {
    // 设计时样式修正,没设置高度,则给添加一个样式,用于给一个默认的最小高度
    if (!opts.props.style.height) {
      opts.props.class.push("no-height");
    }
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
          Props.span(),
          Props.width(),
          Props.height(),
          Props.layout(),
        ],
      },
      {
        group: "高级配置",
        properties: [
          {
            label: '自动换行',
            mapping: 'style.flex-wrap',
            type: 'bool',
            value: false,
            format(val) {
              return !!val
            },
            valueFormat(val){
              return val ? 'wrap' : ''
            },
            vif: (meta) => { return meta.props.layout === 'row' },
            help: '是否允许子组件超出当前行宽度后换行'
          },
          {
            label: '弹性',
            mapping: 'props.style.flex-grow',
            type: 'bool',
            value: false,
            format(val) {
              return !!val
            },
            valueFormat(val){
              return  val ? 1 : ''
            },
            help: '组件是否自动填充父组件剩余空间,如果多组件设置了弹性,则平分剩余空间(父组件为flex布局时生效)'
          },
          {
            label: '对齐方式',
            mapping: 'props.style.justify-content',
            type: 'select',
            options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
            value: '',
            clearable: true,
            help: '内容对齐方式,具体请查看flex 布局 justify-content详细介绍'
          },
          // // Props.scroll(),
         Props.class(),
         Props.vif(),
          ...Props.vfor(),
          ...Props.styles(),
        ],
      },
    ];
  },

  getTools(meta) {
    const metadata = window.getMetaManager();
    let form;
    if (meta.uuid) {
      form = metadata
        .getCompPathById(meta.uuid)
        .filter((comp) => comp.name === "form")[0];
      if (!form) {
        return [];
      }
    } else {
      return [];
    }

    return [
      {
        icon: "p-icon-plus-circle",
        label: "设置",
        click() {
          let models = metadata.meta.models.filter(
            (m) => m.name === form.props[":data"]
          );
          models = JSON.parse(JSON.stringify(models));
          const values = [];
          metadata.compEach(form.children, (item) => {
            if (item.name === "form-item") {
              values.push(item.props.prop);
            }
          });
          treeEach(
            models,
            (item) => {
              item.label = item.label || item.name;
              if (values.includes(item.id)) {
                item.disabled = true;
              }
            },
            "fields"
          );
          TreeSelect({
            title: "请选择需要加入表单的字段",
            nodeKey: "id",
            childKey: "fields",
            labelKey: "label",
            value: values,
            data: models,
            onSelect(data) {
              const list = data.filter((item) => !values.includes(item.id));
              const items = list.map((i) => {
                return context.components["form-item"].getConfigByField({
                  field: i,
                });
              });
              meta.children.push(...items);
            },
          });
        },
      },
    ];
  },
  getContextMenu() {
    return [
      {
        code: "sort",
        name: "内容排序",
        icon: "el-icon-sort",
        handle: (meta) => {
          const list = meta.children.map((item) => {
            if (item.name === "form-item") {
              return {
                id: item.uuid,
                label: item.props.title,
                ref: item,
              };
            } else {
              return {
                id: item.uuid,
                label: item.uuid,
                ref: item,
              };
            }
          });
          bus.$emit(EVENTS.SHOW_SORT_DIALOG, {
            title: "内容排序",
            data: list,
            callback(list) {
              meta.children = list.map((item) => item.ref);
            },
          });
        },
      },
    ];
  },
});

// context.components.col = {
//   // 组件的属性配置
//   getProperties() {
//     return [
//       {
//         group: "常用配置",
//         groupType: "collapse",
//         properties: [
//           Props.compId(),
//           {
//             label: "宽度",
//             mapping: "props.span",
//             type: "slider",
//             value: 24,
//             max: 24,
//             min: 1,
//             marks: {
//               12: "",
//             },
//             help: "栅格宽度,将按24等分设置布局宽度",
//           },
//         ],
//       },
//     ];
//   },
// };
