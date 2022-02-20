<template>
    <el-button-group style="flex-shrink:0;margin-left:10px">
        <el-button type="primary" icon="x-icon-save" @click="savePage">保存</el-button>
        <el-button icon="x-icon-json" @click="showMetaJson">元数据</el-button>
        <el-button @click="showCssCode" icon="x-icon-css">CSS</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clear">清空</el-button>
        <el-button type="warning" icon="x-icon-debug" @click="preview">预览/调试</el-button>
    </el-button-group>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import Metadata from '../../common/metadata'
export default defineComponent({
    setup() {
        return {
    
        };
    },
    methods:{
        savePage(){

        },
        showMetaJson(){

        },
        clear(){
            Metadata.reset()
        },
        preview(){

        },
        showCssCode(){

        }
    }
});
</script>


<style lang="scss" scope>
</style>