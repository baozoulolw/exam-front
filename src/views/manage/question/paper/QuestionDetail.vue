<template>
  <div>
    <span>
      {{`${props.questionInfo.index}.${props.questionInfo.question.topic}`}}
    </span>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const props = defineProps({
  questionInfo:Object
})

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
</style>