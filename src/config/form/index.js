import context from "@/common/context";
import { options } from "@/utils/util";
import Props from "../props";
import Metadata from "@/common/metadata";
context.registerComponent("form", {
  // 组件默认配置
  getConfig() {
    const row = context.getConfig('row')
    return {
      uid: "",
      name: "form",
      props: {
        model: "",
        labelWidth:'110'
      },
      children:row,
      ref: true,
    };
  },
  getFloatButtons(meta) {
    return [
      {
        icon: "ElIconPlus",
        label: "添加表单项",
        click() {
          showFormItemTree(meta);
        },
      },
    ];
  },
  beforeRender(opts) {

  },

  dropHandler(meta, dropData) {
    debugger
    if (dropData.type === "field") {
      const config = context.components["form-item"].getConfigByField({
        field: dropData.data,
      });
      meta.children.push(config);
    }else{

    }
  },
  // 组件的属性配置
  getProperties() {
    const models = Metadata.meta.models.map((m) => {
      return { label: m.name, value: m.name };
    });
    return [
      {
        group: "常用配置",
        properties: [
          Props.uid(),
          {
            label: "表单模型",
            mapping: "props.:model",
            type: "select",
            help: "表单的数据模型",
            value: "",
            options: models,
            onChange(val, meta) {
              // if (val) {
              //   showFormItemTree(meta)
              // }
            },
          },
          Props.span(),
          Props.width(),
          {
            label: "元素间隔",
            mapping: "props.itemGutter",
            type: "number",
            value: 0,
            clearable: true,
            format(val, isEdit) {
              return parseInt(val) || 0;
            },
            help:
              "内部表单元素之间的间隔,单位像素(px) --该配置只对内部表单项FormItem生效",
          },
          {
            label: "标签宽度",
            mapping: "props.labelWidth",
            type: "input",
            value: "",
            clearable: true,
            append: "px",
            help: "表单内部元素(FormItem)的默认标签宽度",
          },
          {
            label: "标签位置",
            mapping: "props.labelPosition",
            type: "select",
            options:options({top:'上方',left:'左对齐',right:'右对齐'}),
            value: "right",
            help: "表单内部元素(FormItem)的默认标签位置",
          }

        ],
      },
      {
        group: "高级配置",
        properties: [
          Props.size(),
          Props.disabled(),
          Props.customAttr()
        ],
      },
    ];
  },
  getContextMenu() {
    return [
      {
        code: "sort",
        name: "表单项排序",
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
            title: "表单项排序",
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

function showFormItemTree(meta) {
  if (!meta.props[":data"]) {
    window.getApp().$message.warning("请先绑定表单的数据模型");
    return;
  }
  let model = Metadata.meta.models.find((m) => m.name === meta.props[":data"]);
  if (model) {
    model = JSON.parse(JSON.stringify(model));
  }

  if (!model.fields.length) {
    window.getApp().$message.warning("该模型下没有可使用的模型字段!");
    return;
  }
  const values = [];
  metadata.compEach(meta.children, (item) => {
    if (item.name === "form-item") {
      values.push(item.props.prop);
    }
  });
  treeEach(
    [model],
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
    data: [model],
    onSelect(data) {
      const list = data.filter((item) => !values.includes(item.id));
      const items = list.map((i) => {
        return context.components["form-item"].getConfigByField({ field: i });
      });
      meta.children.push(...items);
    },
  });
}
