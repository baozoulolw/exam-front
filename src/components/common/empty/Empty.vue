<template>
  <div class="body">
    <el-image :src="emptySvg" style="height: 200px"></el-image>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import emptySvg from '../../../assets/img/empty.svg'

const props = defineProps({})

const emit = defineEmits([])

const data = reactive({})

/**
 * 网络请求
 */


/**
 * 事件
 */

onMounted(() => {
})
</script>

<style scoped lang='less'>
.body{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>