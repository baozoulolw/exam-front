<template>
  <el-container>
      <LeftMenu></LeftMenu>
      <el-container>
        <el-header><Header></Header></el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import { reactive, onMounted, provide, ref } from 'vue'
import LeftMenu from '../../components/layout/LeftMenu.vue';
import Header from '../../components/layout/Header.vue';
const data = reactive({})

provide('proData', reactive({menuCollapse:false}));
onMounted(() => {
})
</script>
<style scoped lang='less'>
:deep(.el-header){
  padding: 0;
}
:deep(.el-main){
  background: rgba(245,247,249,1);
}
</style>