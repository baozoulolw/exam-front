<template>
  <div>
    <div class="head">
      <el-icon :size="16" style="margin-right: 8px">
        <Warning/>
      </el-icon>
      拖动调整顺序
    </div>
    <div v-if="data.question.questions.length > 0">
    <draggable v-model="data.question.questions" item-key="id" :animation="250" ghost-class="dragging"
               @start="startDrag" @end="endDrag">
      <template #item="{ element,index }">
        <div
            :class="['list-item',{'hover':!data.dragging&&data.hoverId===element.id},{'dragItem':element.id===data.dragId}]"
            @mouseover="mouserHover(element.id)"
            @mouseleave="mouseLeave" :id="element.id">
          <span class="topic">
          {{ element.question.topic }}</span>
          <div class="operate">
            <el-button type="text" @click="changeSort(element,index,1)" v-show="index !== 0">升序</el-button>
            <t-divider theme="vertical" v-show="index !== 0"/>
            <el-button type="text" @click="changeSort(element,index,-1)"
                       v-show="index+1 !== data.question.questions.length">降序
            </el-button>
            <t-divider theme="vertical" v-show="index+1 !== data.question.questions.length"/>
            <el-button type="text" @click="changeSort(element,index,0)">删除</el-button>
          </div>
        </div>
      </template>
    </draggable>
    </div>
    <empty v-else></empty>
  </div>
</template>
<script setup>
import {reactive, onMounted, watch} from 'vue'
import {get, post} from "../../../../http/request";
import {ElMessage} from "element-plus";
import {ArrowUpIcon, ArrowDownIcon, DeleteIcon} from 'tdesign-icons-vue-next';
import {Warning} from '@element-plus/icons';
import VueSortableJs from "@/components/common/sort/vue-sortable-js.vue";
import draggable from 'vuedraggable'
import Empty from "@/components/common/empty/Empty.vue";

const props = defineProps({
  question: Object,
  paperId: String,
  delIds: Array
})
const emits = defineEmits(['update:question', 'update:delIds'])
const data = reactive({
  question: {
    questions:[]
  },
  dragging: false,
  hoverId: '',
  dragId: '',
  delIds: []
})

watch(() => data.question.questions,
    () => emits('update:question', data.question))

const changeSort = (element, index, sort,scope) => {
  console.log(scope)
  if (sort === 1) {
    data.question.questions.splice(index - 1, 0, element);
    data.question.questions.splice(index + 1, 1);
  } else if (sort === 0) {
    data.delIds.push(element.id);
    emits('update:delIds', data.delIds)
    data.question.questions.splice(index, 1);
  } else {
    data.question.questions.splice(index + 2, 0, element);
    data.question.questions.splice(index, 1);
  }
  console.log(element, index, sort)
}

const startDrag = (e) => {
  data.dragId = e.clone.id;
  data.dragging = true;
}

const endDrag = (e) => {
  data.dragId = '';
  data.hoverId = e.clone.id;
  data.dragging = false;
}

const mouserHover = id => {
  data.hoverId = id;
}

const mouseLeave = () => {
  data.hoverId = ''
}
onMounted(() => {
  data.question = JSON.parse(JSON.stringify(props.question))
})
</script>
<style scoped lang='less'>
.head {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 45px;
  width: 660px;
  border: 1px solid #DCDEE2;
  border-radius: 4px;
  margin-bottom: 10px;

  span {
    margin-right: auto;
    max-width: 450px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operate {

  }
}

.hover, .dragItem, .dragging {
  background: #D3CCE3; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #E9E4F0, #D3CCE3); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #E9E4F0, #D3CCE3);
}
</style>