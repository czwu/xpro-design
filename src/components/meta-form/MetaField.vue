<template>
    <div class="meta-field flex-row">
        <span v-if="prop.label" class="meta-field-label" >
            {{ prop.label }}
            <el-tooltip
                v-if="help"
                class="item"
                effect="dark"
                :content="help"
                placement="top"
            >
             <el-icon style="vertical-align:middle;"><info-filled color='#de8d10' /></el-icon>
            </el-tooltip>
        </span>
       
        <span class="meta-field-content flex-grow">
            <component :is="config" :key="key" />
            <!-- <x-render :meta="config"></x-render> -->
        </span>
    </div>
</template>


<script>
import { InfoFilled } from '@element-plus/icons-vue'
import { defineComponent, ref, watch } from 'vue'
import { uuid } from '../../utils/util'
import Editor from './editor'
export default defineComponent({
    props: {
        prop: Object
    },
    components:{
        InfoFilled
    },
    setup(props, { emit }) {
        const config = ref(null)
        const key = uuid(10)
        function refreshConfig() {
            config.value = () => Editor.create(props.prop, (val, prop) => {
                emit('change', val, prop)
            })
        }
        refreshConfig()
        // //属性配置更新后，修改组件
        // watch(props.prop,(newdata, olddata)=>{
        // //    refreshConfig()
        // })

        return {
            help:props.prop.help,
            key,
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
    background-color: #f9f9f9;
    width: 110px;
    font-size: 14px;
    text-align: right;
    flex-shrink: 0;
    padding-right: 8px;
    
}
.meta-field-content {
    padding:0 5px;
    font-size: 14px;
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
