<template>
  <div class="main">
    <div class="exam card">
      <el-image :src="exam" class="icon"></el-image>
      <span class='text'>考试</span>
    </div>
    <div class="prc card" @click="toPath('/exercise')">
      <el-image :src="prc" class="icon"></el-image>
      <span class='text'>练习</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import prc from '../../../assets/img/prc.svg'
import exam from '../../../assets/img/exam.svg'
import { useRouter } from "vue-router";

const router = useRouter(); //路由
const data = reactive({})

const toPath = path => {
  router.push({ path });
}
onMounted(() => {
})
</script>
<style scoped lang='less'>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  // //background: url("../../../assets/img/bac.jpg") !important;
  // background: #757f9a; /* fallback for old browsers */
  // background: -webkit-linear-gradient(
  //   to right,
  //   #d7dde8,
  //   #757f9a
  // ) !important; /* Chrome 10-25, Safari 5.1-6 */
  // background: linear-gradient(
  //   to right,
  //   #d7dde8,
  //   #757f9a
  // ) !important; /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .prc {
  }
  .exam{
    margin-right: 40px;
  }
  .card {
    height: 200px;
    width: 150px;
    //background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    cursor: pointer;
    .icon{
      height: 100px;
      margin-bottom: 30px;
    }
    .text{
      text-align: center;
      font-size: 40px;
    }
  }
}
</style>