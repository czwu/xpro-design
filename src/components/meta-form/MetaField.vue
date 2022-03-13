<template>
    <div class="meta-field flex-row">
        <span v-if="prop.label" class="meta-field-label">
            {{ prop.label }}
            <el-tooltip v-if="help" class="item" effect="dark" :content="help" placement="top">
                <el-icon style="vertical-align:middle;">
                    <question-filled color="#8f8ed4" />
                </el-icon>
            </el-tooltip>
        </span>

        <span class="meta-field-content flex-grow">
            <component :is="config" :key="key" />
            <!-- <x-render :meta="config"></x-render> -->
        </span>
    </div>
</template>


<script>
import { QuestionFilled } from '@element-plus/icons-vue'
import { defineComponent, ref, watch } from 'vue'
import { uuid, clone } from '../../utils/util'
import Editor from './editor'
export default defineComponent({
    props: {
        prop: Object
    },
    components: {
        QuestionFilled
    },
    setup(props, { emit }) {
        const config = ref(null)
        const key = uuid(10)
        config.value = () => Editor.create(props.prop, (val, prop) => {
            emit('change', val, prop)
        })
        // function refreshConfig() {
        //     config.value = () => Editor.create(props.prop, (val, prop) => {
        //         emit('change', val, prop)
        //     })
        // }
        // refreshConfig()
        return {
            help: props.prop.help,
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
    padding: 0 5px;
    font-size: 14px;
    color: rgb(56, 56, 206);
}
i.el-icon-info {
    color: #7e888d;
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
