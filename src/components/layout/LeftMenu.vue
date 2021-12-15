<template>
  <div style="height: 100vh;">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :collapse="proData.menuCollapse"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      style="height:100%;"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <div class="logo">
        <el-image style="width: 30px; height: 30px;" :src="logo" fit="fill"></el-image>
        <span v-show='!proData.menuCollapse' style="margin-left:10px">Online-Exam</span>
      </div>
      <el-menu-item index="/homePage">
        <el-icon>
          <House />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <Reading />
          </el-icon>
          <span>题库</span>
        </template>
        <el-menu-item index="/questions">题库管理</el-menu-item>
        <el-menu-item index="/paper">试卷管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <Setting />
          </el-icon>
          <span>设置</span>
        </template>
        <el-menu-item index="/user">成员设置</el-menu-item>
        <el-menu-item index="/role">角色设置</el-menu-item>
        <el-menu-item index="/resource">资源设置</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import logo from '../../assets/img/logo.svg'
import {
  Location,
  House,Setting,Reading
} from '@element-plus/icons'
const data = reactive({})
let proData = inject('proData');

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

onMounted(() => {
})
</script>
<style scoped lang='less'>
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 60px;
}
:deep(.el-menu-item-group__title) {
  text-align: left;
}
:deep(.el-menu:not(.el-menu--collapse)) {
  .el-sub-menu {
    width: 200px;
  }
  .el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
    transform: rotateZ(90deg);
  }
}
</style>