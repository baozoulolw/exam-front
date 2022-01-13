<template>
  <div>
    <t-button variant="outline" theme="primary" @click="addQuestion"> 添加试题</t-button>
    <div v-for="item in data.types" :key="item.value" style="margin-bottom: 20px">
      <div>{{ item.label }}</div>
      <VueSortableJs v-model:list="item.questions" :options="data.sortableOptions">
        <template #item="{ element, index }">
          <div class="list-item">{{ element.question.topic }} {{ index }}</div>
        </template>
      </VueSortableJs>
    </div>
    <t-dialog v-model:visible="data.addShow" header="添加试题" width="700px" attach="body"
              :on-confirm="onConfirmDia" :destroyOnClose="true">
      <div class="search-q">
        <t-input class="mr-12" v-model="data.searchParam.param.keyword" clearable placeholder="请输入关键词"/>
        <t-select class="mr-12" v-model="data.searchParam.param.type" placeholder="请选择题型" clearable>
          <t-option v-for="item in data.qTypes" :key="item.value" :label="item.label" :value="item.value"></t-option>
        </t-select>
        <t-select class="mr-12" v-model="data.searchParam.param.hard" :options="data.qHards" placeholder="请选择难度"
                  clearable/>
        <t-button variant="outline" theme="primary" @click="toSearch" :loading="data.tableLoad"> 搜索</t-button>
      </div>
      <t-table
          :loading="data.tableLoad"
          row-key="id"
          :data="data.tableData"
          :columns="data.questionColumns"
          :selected-row-keys="data.selectedRowKeys"
          @select-change="rehandleSelectChange"
      >
        <template #type="{ row }">
          <span>{{ data.qShowTypes[row.type] }}</span>
        </template>
        <template #hard="{ row }">
          <span>{{ data.hards[row.hard] }}</span>
        </template>
      </t-table>
      <div class="page">
        <t-pagination
            v-model="data.searchParam.pageNumber"
            v-model:pageSize="data.searchParam.pageSize"
            :total="data.total"
            size="small"
            theme="simple"
            :pageSizeOptions="[]"
            @pageSizeChange="onPageSizeChange"
            @currentChange="onCurrentChange"
        />
      </div>
    </t-dialog>
  </div>
</template>
<script setup>
import {reactive, onMounted} from 'vue'
import VueSortableJs from "@/components/common/sort/vue-sortable-js.vue";
import {post} from "../../../../http/request";

const props = defineProps({
  question: Array,
  paperId: String
})
const data = reactive({
  tableLoad:false,
  addShow: false,
  types: [],
  total: 0,
  tableData: [],
  sortableOptions: {animation: 150},
  searchParam: {
    pageNumber: 1,
    pageSize: 5,
    param: {
      keyword: '',
      type: '',
      hard: '',
      selectPaperId: props.paperId
    }
  },
  selectedRowKeys: [],
  qShowTypes: ['单选题', '多选题', '判断题', '填空题'],
  hards: ['简单', '中等', '困难'],
  qTypes: [
    {value: 0, label: '单选题'},
    {value: 1, label: '多选题'},
    {value: 2, label: '判断题'},
    {value: 3, label: '填空题'},
  ],
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  questionColumns: [
    {colKey: 'row-select', type: 'multiple', width: 50},
    {colKey: 'topic', title: '题目'},
    {colKey: 'type', title: '题型', cell: 'type'},
    {colKey: 'hard', title: '难度', cell: 'hard'}
  ]
})

const getQuestions = async () => {
  data.tableLoad = true;
  let res = await post('/question/page', data.searchParam);
  if (res.status === 1000) {
    data.tableData = res.data.list;
    data.total = Number(res.data.totalCount);
  } else {
    ElMessage.error(res.desc);
  }
  data.tableLoad = false;
}
const addQuestion = () => {
  data.addShow = true
}
const toSearch = () => {
  data.searchParam.pageNumber = 1;
  getQuestions();

}

const onPageSizeChange = val => {
  data.searchParam.pageNumber = 1;
  data.searchParam.pageSize = val;
  getQuestions();
}

const onCurrentChange = val => {
  data.searchParam.pageNumber = val;
  getQuestions();
}

const onConfirmDia = () => {
  if (data.selectedRowKeys.length > 0) {
    console.log(data.selectedRowKeys)
  }
}
const rehandleSelectChange = (value, {selectedRowData}) => {
  data.selectedRowKeys = value;
}

onMounted(() => {
  data.types = JSON.parse(JSON.stringify(props.question))
})
</script>
<style scoped lang='less'>
.search-q {
  padding-right: 100px;
  display: flex;
}
.page{
  margin-top:20px
}
</style>