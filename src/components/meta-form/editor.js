import { emitter, EVENTS } from "@/common/bus";
import { type } from "@/utils/util";
import { useI18n } from "vue-i18n";
import { h, resolveComponent, ref } from "vue";
import props from "@/config/props";

export default {
  /**
   * 获取编辑器构造器
   * @param {String} name
   * @returns
   */
  get(name) {
    return this[name] || this.input;
  },

  /**
   * 注册新的元数据编辑器或渲染器组件
   * @param {String} name
   * @param {Function} fn
   */
  register(name, fn) {
    this.editors[name] = fn;
  },

  /**
   * 创建编辑器实例
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   * @returns
   */
  create(prop, change) {
    const type = prop.type;
    return this.get(type)(prop, change);
  },
  /**
   * 文本渲染组件 支持i18n
   * @param {*} prop
   * @returns
   */
  text(prop) {
    return h(
      "span",
      { style: { fontWeight: "bold" } },
      prop.i18n ? useI18n().t(prop.value) : prop.value
    );
  },

  divider(prop) {
    return h(resolveComponent("el-divider"), () => prop.title);
  },

  /**
   * 文本框输入组件
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   */
  input(prop, change) {
    const conf = {
      modelValue: prop.format ? prop.format(prop.value) : prop.value,
      clearable: prop.clearable,
      placeholder: prop.placeholder,
      onInput(val) {
        let value = prop.valueFormat ? prop.valueFormat(val) : val;
        change(value, prop);
      },
    };
    let slots = null;
    if (prop.append) {
      const type = typeof prop.append;
      slots = {
        append:
          type === "string"
            ? () => prop.append
            : () => Editors.getEditor(prop.append, change),
      };
    }
    return h(resolveComponent("el-input"), conf, slots);
  },

  /**
   * 下拉框组件
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   */
  select(prop, change) {
    const children = prop.options.map((option) => {
      const props =
        type(option) !== "object"
          ? { label: option, value: option }
          : {
              label: option[prop.labelKey || "label"],
              value: option[prop.valueKey || "value"],
            };
      return h(resolveComponent("el-option"), props);
    });
    return h(
      resolveComponent("el-select"),
      {
        modelValue: prop.value, // 默认值
        disabled: prop.disabled, // 是否禁用
        multiple: prop.multiple, // 是否可多选
        placeholder: prop.placeholder, // 占位符
        clearable: prop.clearable, // 是否允许清空
        allowCreate: prop.allowCreate,
        filterable: prop.filterable,
        style: props.style,
        onChange(value) {
          change(value, prop);
        },
      },
      () => children
    );
  },

  /**
   * 滑块组件
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   */
  slider(prop, change) {
    return h(resolveComponent("el-slider"), {
      modelValue: prop.value, // 默认值
      max: prop.max,
      min: prop.min,
      marks: prop.marks,
      range: prop.range,
      onInput(value) {
        change(value, prop);
      },
    });
  },

  /**
   * 单选组件
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   */
  radio(prop, change) {
    const children = prop.options.map((option) => {
      const props =
        type(option) !== "object"
          ? { label: option, value: option }
          : {
              label: option[prop.labelKey || "label"],
              value: option[prop.valueKey || "value"],
            };
      return h(
        resolveComponent("el-radio-button"),
        { label: props.value },
        () => props.label
      );
    });
    return h(
      resolveComponent("el-radio-group"),
      {
        modelValue: prop.value, // 默认值
        onChange(value) {
          change(value, prop);
        },
      },
      () => children
    );
  },

  /**
   * bool值勾选的checkbox 组件
   * @param {Object} prop  组件配置项
   * @param {Function} change  onChange回调
   */
  bool(prop, change) {
    return h(resolveComponent("el-checkbox"), {
      modelValue: prop.format ? prop.format(prop.value) : prop.value,
      clearable: prop.clearable,
      onChange(val) {
        let value = prop.valueFormat ? prop.valueFormat(val) : val;
        change(value, prop);
      },
    });
  },

  /**
   * 按钮渲染器
   * @param {Object} prop  组件配置项
   */
  button(prop, change) {
    return h(
      resolveComponent("el-button"),
      {
        icon: prop.icon ? resolveComponent(prop.icon) : "",
        type: prop.btnType,
        style: prop.style,
        onClick: () => prop.onClick(change),
      },
      () => prop.text
    );
  },

  /**
   * 颜色选中编辑器
   * @param {Object} prop  组件配置项
   */
  color(prop, change) {
    return h(resolveComponent("el-color-picker"), {
      modelValue: prop.value,
      showAlpha: true,
      onChange(val) {
        change(val, prop);
      },
    });
  },

  /**
   * 数字编辑器
   * @param {Object} prop  组件配置项
   */
  number(prop, change) {
    return h(resolveComponent("el-input-number"), {
      modelValue: prop.format ? prop.format(prop.value) : prop.value,
      step: prop.step,
      stepStrictly: prop.stepStrictly,
      max: prop.max,
      min: prop.min,
      onChange(val) {
        let value = prop.valueFormat ? prop.valueFormat(val) : val;
        change(value, prop);
      },
    });
  },
};

const Editors = { editors: [], register() {} };

// 图标选择编辑器
Editors.register("icon", (prop, changeFn) => {
  return {
    view: "icon-select",
    props: {
      value: prop.value,
      size: "small",
    },
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});
// 国际化选择编辑器
Editors.register("i18n", (prop, changeFn) => {
  return {
    view: "i18n-select",
    props: {
      value: prop.value,
    },
    style: prop.style,
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});

// 模型选择编辑器
Editors.register("model", (prop, changeFn) => {
  return {
    view: "model-select",
    props: {
      value: prop.value,
      clearable: true,
      filter: prop.filter, // 筛选: Array 过滤出数组字段 Object 过滤出对象类型的字段
      onlyModel: prop.onlyModel, // 默认值false,  为true时,只列出主模型
      checkStrictly: prop.checkStrictly, // 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。
      showAllLevels: prop.showAllLevels,
    },
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});

// 颜色选择器

const componentMethods = {
  table: [
    { value: "selection", label: "获取选中行数据", type: "prop" },
    { value: "clearSelection", label: "清空用户的选择(用于多选表格)" },
    { value: "doLayout", label: "对 Table 进行重新布局" },
  ],
  tree: [
    { value: "getCurrentKey", label: "获取当前被选中节点的 key" },
    { value: "setCurrentKey", label: "通过 key 设置某个节点的当前选中状态" },
  ],
};
// 页面方法选择器
Editors.register("compMethod", (prop, changeFn) => {
  const children = [];
  return {
    view: "select",
    props: {
      value: prop.format ? prop.format(prop.value, true) : prop.value,
      disabled: prop.disabled, // 是否禁用
      multiple: prop.multiple, // 是否可多选
      placeholder: prop.placeholder, // 占位符
      clearable: true, // 是否允许清空
      "allow-create": prop.allowCreate,
      filterable: prop.filterable,
      size: "small",
    },
    on: {
      input: (value) => {
        if (prop.format) {
          value = prop.format(value) || "";
        }
        changeFn(value, prop);
      },
      "visible-change": (bool) => {
        if (bool && prop.params) {
          let options;
          if (prop.params.uuid.indexOf("table") !== -1) {
            options = componentMethods.table;
          } else if (prop.params.uuid.indexOf("tree") !== -1) {
            options = componentMethods.tree;
          }
          options = options.map((option) => {
            return {
              view: "option",
              props: option,
            };
          });
          children.length = 0;
          children.push(...options);
        }
      },
    },
    children,
  };
});
// 页面方法选择器
Editors.register("method", (prop, changeFn) => {
  const metadata = window.getMetaManager();
  var options = metadata.meta.events.codeMethods.children.map((item) => {
    return { label: `自定义函数:${item.id}`, value: item.id };
  });
  // 判断 是否只需要自定义的代码函数
  if (!prop.onlyCode) {
    options.push(
      ...metadata.meta.events.methods.children.map((item) => {
        return {
          label: `编排函数 ${item.label}:${item.name}`,
          value: item.name,
        };
      })
    );
  }
  options.push({ label: "页面Init", value: "init" });
  metadata.compEach(metadata.meta.children, (item) => {
    if (item.name === "v-table" && item.props["@search"]) {
      options.push({
        label: `${item.uuid} 查询`,
        value: item.props["@search"],
      });
    }
  });
  const children = options.map((option) => {
    return {
      view: "option",
      props: option.value ? option : { label: option, value: option },
    };
  });
  return {
    view: "select",
    props: {
      value: prop.format ? prop.format(prop.value, true) : prop.value,
      disabled: prop.disabled, // 是否禁用
      multiple: prop.multiple, // 是否可多选
      placeholder: prop.placeholder, // 占位符
      clearable: true, // 是否允许清空
      "allow-create": prop.allowCreate,
      filterable: prop.filterable,
      size: "small",
    },
    on: {
      input: (value) => {
        if (prop.format) {
          value = prop.format(value) || "";
        }
        changeFn(value, prop);
      },
    },
    children,
  };
});

// 页面选择编辑器
Editors.register("page", (prop, changeFn) => {
  return {
    view: "layout",
    props: {
      size: "small",
    },
    children: [
      {
        view: "button",
        props: {
          type: prop.value.id ? "text" : "primary",
          size: "small",
        },
        children: prop.value.label || "设置",
        on: {
          click() {
            bus.$emit(EVENTS.SHOW_PAGE_SELECTOR, {
              callback(item) {
                changeFn({
                  value: {
                    id: item.id,
                    label: item.labelName,
                    url: item.code,
                  },
                  prop,
                });
              },
              id: prop.value.id || "",
            });
          },
        },
      },
    ],
  };
});

// 页面选择编辑器
Editors.register("exportApi", (prop, changeFn) => {
  return {
    view: "layout",
    props: {
      size: "small",
    },
    children: [
      {
        view: "button",
        props: {
          type: prop.value ? "text" : "primary",
          size: "small",
        },
        children: prop.value || "设置",
        on: {
          click() {
            bus.$emit(EVENTS.SHOW_EXPORT_APIS, {
              callback(item) {
                changeFn({
                  value: item,
                  prop,
                });
              },
            });
          },
        },
      },
    ],
  };
});
// 自定义编辑器
Editors.register("custom", (prop, changeFn) => {
  return prop.render(prop, changeFn);
});

// 校验规则编辑器
Editors.register("validator", (prop, changeFn) => {
  return {
    view: "validator",
    props: {
      value: prop.value,
    },
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});

// 图标选择编辑器
Editors.register("icon", (prop, changeFn) => {
  return {
    view: "icon-select",
    props: {
      value: prop.value,
      size: "small",
    },
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});


// 字段选择编辑器
Editors.register("field-select", (prop, changeFn) => {
  return {
    view: "field-select",
    props: {
      value: prop.value,
      clearable: true,
      params: prop.params,
    },
    on: {
      input: (value) => {
        changeFn(value, prop);
      },
    },
  };
});

