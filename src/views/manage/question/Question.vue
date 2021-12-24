<template>
  <router-view #slot="{ Component }">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
const data = reactive({})
onMounted(() => {
})
</script>
<style scoped lang='less'>
</style>