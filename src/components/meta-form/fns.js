 
  import get from "lodash/get";
  import set from "lodash/set";
  /**
   * 执行编辑器配置条件，判断该属性编辑器是否需要显示
   * @param {Object} fieldEditor  编辑器配置
   */
  export function checkField(field, meta) {
    let ret = true;
    if (field.vif) {
      const valType = typeof field.vif;
      if (valType === "string") {
        ret = get(meta, field.vif);
      } else if (valType === "function") {
        ret = field.vif(meta);
      }
    }
    //   if (field.mapping) {
    //     // 给元数据赋初始值, 才能正常双向绑定
    //     const val = field.value;
    //     if (ret) {
    //       set(ctx, field.mapping, val);
    //     } else if (field._del_ !== false) {
    //       delAttrByPath(meta.value, field.mapping);
    //     }
    //   }
    return ret;
  }

  export function syncValue(properties, meta) {
    properties.forEach((group) => {
      group.properties.forEach((field) => {
        if (field.mapping) {
          const val = get(meta, field.mapping);
          if (val !== undefined && val !== null) {
            if (
              !Array.isArray(val) &&
              typeof val === "object" &&
              typeof field.value === "object"
            ) {
              Object.assign(field.value, val);
            } else {
              field.value = val;
            }
          }
        }
      });
    });
  }

