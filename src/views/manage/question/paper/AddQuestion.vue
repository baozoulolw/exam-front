<template>
  <div>
    <div class="search-q">
      <t-input class="mr-12" style="width: 300px" v-model="data.searchParam.param.keyword" clearable
               placeholder="请输入关键词"/>
      <t-select class="mr-12" v-model="data.searchParam.param.groupId" placeholder="请选择分类"
                clearable style="width: 150px" filterable>
        <t-option v-for="item in data.groupList" :key="item.id" :label="`${item.groupName} (${item.questionNumber})`" :value="item.id"></t-option>
      </t-select>
      <t-select class="mr-12" v-model="data.searchParam.param.type" :options="data.qTypes" placeholder="请选择题型"
                clearable style="width: 150px"/>
      <t-select class="mr-12" v-model="data.searchParam.param.hard" :options="data.qHards" placeholder="请选择难度"
                clearable style="width: 150px"/>
      <t-button variant="outline" theme="primary" @click="toSearch" :loading="data.tableLoad"> 搜索</t-button>
    </div>
    <t-table
        :loading="data.tableLoad"
        :height="268"
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
          :pageSizeOptions="[]"
          @pageSizeChange="onPageSizeChange"
          @currentChange="onCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
import {get, post} from "../../../../http/request";
import {ElMessage} from "element-plus";

const props = defineProps({
  paperId: String,
  selectId: Array
})

const emit = defineEmits(['update:selectId'])

const data = reactive({
  visible: true,
  searchParam: {
    pageNumber: 1,
    pageSize: 5,
    param: {
      keyword: '',
      type: '',
      hard: '',
      selectPaperId: props.paperId,
      groupId:''
    }
  },
  groupList:[],
  selectedRowKeys: [],
  qShowTypes: ['单选题', '多选题', '判断题', '填空题','简答题'],
  hards: ['简单', '中等', '困难'],
  qTypes: [
    {value: 0, label: '单选题'},
    {value: 1, label: '多选题'},
    {value: 2, label: '判断题'},
    {value: 3, label: '填空题'},
    {value: 4, label: '简答题'},
  ],
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  questionColumns: [
    {colKey: 'row-select', type: 'multiple', width: 60},
    {colKey: 'topic', title: '题目', ellipsis: true},
    {colKey: 'type', title: '题型', cell: 'type', width: 100},
    {colKey: 'hard', title: '难度', cell: 'hard', width: 100}
  ]
})

/**
 * 网络请求
 */
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

const getGroupList = async () => {
  let res = await get('/question/group/list');
  if (res.status === 1000) {
    data.groupList = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

/**
 * 事件
 */
const onPageSizeChange = val => {
  data.searchParam.pageNumber = 1;
  data.searchParam.pageSize = val;
  getQuestions();
}

const onCurrentChange = val => {
  data.searchParam.pageNumber = val;
  getQuestions();
}
const toSearch = () => {
  data.searchParam.pageNumber = 1;
  getQuestions();

}

const rehandleSelectChange = (value, {selectedRowData}) => {
  emit('update:selectId', value);
}

onMounted(() => {
  data.selectedRowKeys = props.selectId;
  getGroupList();
})
</script>

<style scoped lang='less'>
.search-q {
  display: flex;
  margin-bottom: 20px;
}
.page{
  margin-top:20px
}
.type-i{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>