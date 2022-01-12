<template>
  <div>
    <t-button variant="outline" theme="primary"> 添加试题</t-button>
    <div v-for="item in data.types" :key="item.value">
      <VueSortableJs v-model:list="item.questions" :options="data.sortableOptions">
        <template #item="{ element, index }">
          <div class="list-item">{{ element.question.topic }} {{ index }}</div>
        </template>
      </VueSortableJs>
    </div>
  </div>
</template>
<script setup>
import {reactive, onMounted} from 'vue'
import VueSortableJs from "@/components/common/sort/vue-sortable-js.vue";

const props = defineProps({
  question: Array
})
const data = reactive({
  types: [],
  sortableOptions: {animation: 150},
})
onMounted(() => {
  data.types = JSON.parse(JSON.stringify(props.question))
})
</script>
<style scoped lang='less'>
</style>