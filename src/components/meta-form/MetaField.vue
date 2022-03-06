<template>
    <div class="meta-field flex-row">
        <span v-if="prop.label" class="meta-field-label">
            {{ prop.label }}
            <el-tooltip
                v-if="prop.help"
                class="item"
                effect="dark"
                :content="prop.help"
                placement="top"
            >
                <i class="el-icon-info" />
            </el-tooltip>
        </span>
        <span class="meta-field-content flex-grow">
            <component :is="config" /> 
            <!-- <x-render :meta="config"></x-render> -->
        </span>
    </div>
</template>


<script>

import { defineComponent, ref, watch } from 'vue'
import editor from './editor'
export default defineComponent({
    props: {
        prop: Object
    },
    setup(props, { emit }) {
        const config = ref(null)
        function refreshConfig() {
            config.value = editor.getEditor(props.prop, (val, prop) => {
                emit('change', val, prop)
            })
        }
        refreshConfig()
        //属性配置更新后，修改组件
        watch(props.prop,(newdata, olddata)=>{
            if(newdata.type !== olddata.type ){
                refreshConfig()
            } else if(newdata.value!==olddata.value){
                
            }
        })
        return {
            config
        }
    }
})
</script>

<style lang="scss" scoped>
.meta-field {
  line-height: 36px;
  padding: 0 5px;
  margin-top: 3px;
}
.meta-field-label {
  width: 90px;
  font-size: 13px;
  text-align: right;
  flex-shrink: 0;
  padding-right: 8px;
}
.meta-field-content {
  font-size: 13px;
  color: rgb(56, 56, 206);
}
i.el-icon-info {
  color: burlywood;
  margin-left: 2px;
  vertical-align: middle;
  cursor: pointer;
}
.meta-field-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
