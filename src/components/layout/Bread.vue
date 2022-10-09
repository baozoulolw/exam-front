<template>
  <div>
    <el-breadcrumb separator="/">
      <!-- to为点击跳转 title为路由中的meta属性定义的标题 -->
      <el-breadcrumb-item
          v-for="(v, i) in data.breadList"
          :key="i"
      >{{ v.meta.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch, computed} from 'vue'
import {useRouter} from "vue-router";
import {deepCloneObj} from "../../utils/utils";

const props = defineProps({})

const emit = defineEmits([])

const data = reactive({
  breadList: []
})

/**
 * 网络请求
 */


/**
 * 事件
 */

const router = useRouter(); //路由

watch(() => router.currentRoute.value.path,
    () => {
      getBreadcrumb()
    },
    {
      deep:true
    }
)
const breadList = computed(() => {
  let matched = router.currentRoute.value.matched;
  //如果不是首页
  if (!isHome(matched[0])) {
    matched = [].concat(matched);
  }
  return matched;
})
const getBreadcrumb = () => {
  console.log('1234')
  let matched = router.currentRoute.value.matched;
  //如果不是首页
  if (!isHome(matched[0])) {
    matched = [].concat(matched);
  }
  data.breadList = deepCloneObj(matched);
  data.breadList.shift()
}

const isHome = (route) => {
  return route.name === "HomePage";
}

onMounted(() => {
  getBreadcrumb();
})
</script>

<style scoped lang='less'>
</style>