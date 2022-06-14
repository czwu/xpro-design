<template>
  <div>
    <el-input v-model="value" v-bind="$attrs"  >
     <template #append>
        <el-button icon="el-icon-search"  @click="visible=true"/>
      </template>
    </el-input>
    <selector v-if="visible" v-model:visible="visible" :current="value" @select="selectHandler" />
  </div>
</template>

<script>
import selector from './selector'
export default {
  name: 'IconSelect',
  components: { selector },
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  emits: ["input"],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    selectHandler(icon) {
      this.$emit('input', 'ElIcon'+icon)
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
