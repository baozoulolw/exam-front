<template>
  <!--主页的整体布局-->
  <el-container>
      <!--菜单树-->
      <LeftMenu></LeftMenu>
      <el-container>
        <!--头部导航条-->
        <el-header><Header></Header></el-header>
        <!--路由-->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import { reactive, onMounted, provide, ref } from 'vue'
import LeftMenu from '../../components/layout/LeftMenu.vue';
import Header from '../../components/layout/Header.vue';
const data = reactive({})
// 左边菜单缩放控制，使用inject 和 provide进行数据传递
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