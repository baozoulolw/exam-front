<template>
  <div class="main">
    <div class="h">
      <h1>{{getTimeState()}}</h1>
      <h5>{{userInfo.realName}}</h5>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import {getUser} from "../../../utils/utils";

const userInfo = getUser();
const data = reactive({})
onMounted(() => {
})
const getTimeState = () =>{
  // 获取当前时间
  let timeNow = new Date();
  // 获取当前小时
  let hours = timeNow.getHours();
  // 设置默认文字
  let state= ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
    state = `Good Morning`;
  } else if (hours > 10 && hours <= 14) {
    state= `Good Afternoon`;
  } else if (hours > 14 && hours <= 18) {
    state= `Good Afternoon`;
  } else if (hours > 18 && hours <= 24) {
    state= `Good Evening`;
  }
  return state;
}
</script>
<style scoped lang='less'>
.main {
  //background: white;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  padding: 60px;
  overflow: hidden;
  background: url("/src/assets/home/xiyang.jpg");
  background-size: 100% 100%;
  font-family: nunito, "segoe ui", arial;
  //color: white;
  position: relative;
  .h{
    position: absolute;
    bottom: 20px;
    h1{
      font-size: 4rem;
      line-height: 0;
    }
    h5{
      font-size: 2rem;
    }
  }
}
</style>