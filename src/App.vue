<script setup>
import { ref, reactive} from 'vue'
import Designer from './views/design/Designer.vue'
const data = reactive({
  view:'button',
  props:{
    type:'primary'
  },
  children:'sdfdfsdf'
})
</script> 
<template>
  <Designer></Designer>
</template>

<style lang="scss" >
#app{
  width:100vw;
  height:100vh;
  display: flex;
  flex-direction: column;
}
</style>