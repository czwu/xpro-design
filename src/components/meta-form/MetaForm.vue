<template>
  <div class="meta-form flex-col">
    <template v-for="(prop, i) in properties" :key="i">
      <template v-if="prop.group">
        <el-collapse :key="prop.group" v-model="activeName" :accordion="true">
          <el-collapse-item :title="prop.group" :name="prop.group">
            <div class="meta-form-group" :class="meta.class">
              <template
                class=""
                v-for="(item, index) in prop.properties"
                :key="index"
              >
                <meta-field
                  v-if="check(item)"
                  :prop="item"
                  @change="onFieldChange"
                ></meta-field>
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>
      </template>
      <div v-else class="meta-form-group" :class="prop.class">
        <template
          class=""
          v-for="(item, index) in prop.properties"
          :key="index"
        >
          <meta-field
            :prop="item"
            v-if="check(item)"
            @change="onFieldChange"
          ></meta-field>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, watch } from "vue";
import MetaField from "./MetaField.vue";
import { delAttrByPath } from "@/utils/util";
import get from "lodash/get";
import set from "lodash/set";
import { checkField, syncValue } from './fns'
export default defineComponent({
  name:'MetaForm',
  props: {
    properties: Array,
    meta: Object,
  },
  setup(props, { emit }) {
    const { properties, meta } = toRefs(props);
    const activeName = ref(properties.value[0]?.group || "");
    function onFieldChange(value, prop) {
      if(prop){
        prop.value = value;
        set(meta.value, prop.mapping, value);
        debugger
      }
    }
    function check(field){
        return checkField(field, meta.value)
    }
    //将组件配置的各项属性值，同步到属性编辑器中
    syncValue(properties.value, meta.value)

    watch(meta,(data)=>{
       syncValue(properties.value, data)
    } )
    return {
      properties,
      activeName,
      onFieldChange,
      check,
    };
  },
  components: {
    MetaField,
  },
  methods: {
    
  },
});
</script>
