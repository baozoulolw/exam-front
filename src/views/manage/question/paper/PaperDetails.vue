<template>
  <div v-loading="data.isLoad" class="main">

  </div>
</template>

<script setup>
import {reactive, onMounted, watch} from 'vue'
import {useRouter} from "vue-router";
import {get} from "../../../../http/request";
import {ElMessage} from "element-plus";

const router = useRouter(); //路由

watch(
    () => props.id,
    n => {
      getPaperById(n);
    })
const props = defineProps({
  id:String
})

const emit = defineEmits([])

const data = reactive({
  isLoad:false,
  paper: ''
})

/**
 * 网络请求
 */
const getPaperById = async (id) => {
  data.isLoad = true;
  let res = await get(`/paper/one/${id}`);
  if (res.status === 1000) {
    props.id = res.data;
  }else{
    ElMessage.error(res.desc);
  }
  data.isLoad = false;
}

/**
 * 事件
 */

onMounted(() => {
  getPaperById(props.id);
})
</script>

<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 140px);
  padding: 20px;
}
</style>