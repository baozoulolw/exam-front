<template>
  <div class="main">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import Header from '../../components/student/Header.vue';
const data = reactive({})
onMounted(() => {
})
</script>
<style scoped lang='less'>
//background: url('../../assets/img/bac.jpg');
:deep(.el-main) {
  height: calc(100vh - 60px);
  background: #ece9e6; /* fallback for old browsers */
  .main {
    height: calc(100vh - 100px);
    background: white;
  }
}
</style>