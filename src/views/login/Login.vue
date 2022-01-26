<template>
  <div class="login-body">
    <div class="form">
      <div class="title">在线考试系统</div>
      <el-form :model="data.loginParam" style="width: 100%;">
        <el-form-item prop="username">
          <el-input type="text" v-model="data.loginParam.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="data.loginParam.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="data.radio" style="display:flex">
            <el-radio label="student">我是学生</el-radio>
            <el-radio label="teacher">我是老师</el-radio>
            <el-radio label="manage">我是管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button color="#2a62e9" @click="toLogin" class="submit" :loading="data.butLoad">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>

import { reactive, onMounted } from 'vue'
import { post } from '../../http/request'
import Cookies from 'js-cookie'
import $store from '../../store/index'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";

const router = useRouter(); //路由
const data = reactive({
  loginParam: {
    username: '',
    password: ''
  },
  radio: 'student',
  butLoad: false
})
const toLogin = async () => {
  data.butLoad = true;
  let res = await post('/login?platform='+data.radio, qs.stringify(data.loginParam));
  console.log(res);
  if (res.status === 2000) {
    Cookies.set('token', res.data.token);
    res.data.user.id = res.data.id;
    res.data.user.operUser = res.data.operuser;
    localStorage.setItem('user', JSON.stringify(res.data.user));
    await $store.dispatch('setUserInfo', res.data.user);
    let path = data.radio === 'student' ? '/student_home' : '/manage_home';
    Cookies.set('platform', data.radio);
    await router.push({path});
  } else {
    ElMessage.error(res.desc);
  }
  data.butLoad = false;
}
onMounted(() => {
})
</script>
<style scoped lang='less'>
.login-body {
  height: 100vh;
  width: 100vw;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #bbd2c5; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #292e49,
    #536976,
    #bbd2c5
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #292e49,
    #536976,
    #bbd2c5
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  .form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 500px;
    width: 500px;
    box-sizing: border-box;
    padding: 60px 100px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.1);
    .title {
      font-size: 30px;
      position: relative;
      top: -40px;
      left: -60px;
    }
    :deep(.el-radio):not(.is-checked) {
      .el-radio__label {
        color: white;
      }
    }
    :deep(.el-input__inner) {
      height: 50px;
      background: transparent;
      border-color: rgba(128, 138, 135, 1);
      color: white;
    }
    :deep(.submit) {
      width: 100%;
      background: #2a62e9;
      border-color: transparent;
      color: white;
    }
    :deep(.submit:hover) {
      background: #409eff;
    }
    :deep(.el-radio__inner) {
      background: transparent;
      border-color: rgba(128, 138, 135, 1);
    }
  }
}
</style>