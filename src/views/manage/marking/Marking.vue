<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.params.param.keyword" placeholder="输入关键词" class="margin-r wit-3" clearable></el-input>
      <el-select v-model="data.params.param.examId" class="margin-r wit-3" filterable clearable>
        <el-option v-for="item in data.exams" :label="item.examName" :key="item.id" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="data.params.param.groupId" class="margin-r wit-3" filterable clearable>
        <el-option v-for="item in data.groups" :label="item.groupName" :key="item.id" :value="item.id"></el-option>
      </el-select>
      <el-button @click="toSearch" :loading="data.searchLoad" type="primary">搜索</el-button>
    </div>
    <el-table :data="data.tableData" border style="width: 100%" v-loading="data.searchLoad">
      <el-table-column label="序号" width="50" align='center' header-align='left'>
        <template #default="scope">
              <span
                  class="table-span"
              >{{ (data.params.pageNumber - 1) * data.params.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试名称" prop="exam.examName" show-overflow-tooltip/>
      <el-table-column label="姓名" prop="username" show-overflow-tooltip/>
      <el-table-column label="所属分组" prop="groupName" show-overflow-tooltip/>
      <!--      <el-table-column label="考试时长" width="100">
              <template #default="scope">
                    <span
                        class="table-span"
                    >{{ scope.row.duration }}分钟</span>
              </template>
            </el-table-column>-->
      <el-table-column label="开始考试时间" prop="beginTime" width="180"></el-table-column>
      <el-table-column label="结束考试时间" prop="endTime" width="180"></el-table-column>
      <!--      <el-table-column label="类型" width="120">
              <template #default="scope">
                    <span
                        class="table-span"
                    >{{ scope.row.specifyTime === 0 ? '期限完成':'定时' }}</span>
              </template>
            </el-table-column>-->
      <el-table-column label="分数" prop="endTime" width="180">
        <template #default="scope">
              <span
                  class="table-span"
              >{{ scope.row.marking === 0 ? scope.row.score : '待阅卷' }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
            <el-table-column label="最后操作人" prop="changeUserName" width="130"></el-table-column>-->
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <div class="table-operate">
            <span @click="showAnswer(scope.row)" class="item-span" v-if="checkHasRole(roleKeys.mark)">阅卷</span>
            <!--            <el-divider direction="vertical" v-if="data.params.param.condition === 0"></el-divider>
                        <span @click='delQuestion(scope.row)' class="item-span" v-if="data.params.param.condition === 0">删除</span>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 4, 8, 10]"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :total="data.total"
      ></el-pagination>
    </div>
  </div>
  <el-dialog
      v-model="data.visible" title="批阅" width="700px"
      :before-close="scoreClose" :close-on-click-modal="false" :destroy-on-close="true">
    <div style="margin-bottom: 20px;font-size: 18px"><span>题目：</span>{{ data.markQuestions[data.showIndex].question.topic }}</div>
    <div style="margin-bottom: 20px;font-size: 16px">
      <span>学生答案: </span>
      <span>{{ data.markQuestions[data.showIndex].myAnswer.content[0] }}</span>
    </div>
    <div style="margin-bottom: 20px;font-size: 16px">
      <span>参考答案: </span>
      <span>{{ JSON.parse(data.markQuestions[data.showIndex].question.answer)[0].value }}</span>
    </div>
    <div style="font-size: 20px;display: flex;align-items: center">
      <div style="margin-right: 100px">
        满分：{{ data.markQuestions[data.showIndex].score }}
      </div>
      <div style="display: flex;align-items: center">得分：
        <el-input-number v-model="data.markQuestions[data.showIndex].myAnswer.score" :min="0" :max="data.markQuestions[data.showIndex].score" @change="handleChange" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="nextTo(-1)" class="mr-12" v-show="data.showIndex !== 0">上一题</t-button>
        <t-button theme="default" @click="nextTo(1)" class="mr-12" v-show="data.showIndex+1 < data.markQuestions.length">下一题</t-button>
        <t-button theme="default" @click="confirmMarking" class="mr-12">提交</t-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, onMounted, computed} from 'vue'
import {get, post} from "../../../http/request";
import {ElMessage} from "element-plus";
import {checkHasRole, getUser} from "../../../utils/utils";

const props = defineProps({})

const emit = defineEmits([])

const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '',
      examId: '',
      userId: '',
      groupId: '',
      marking: 1
    }
  },
  groups: [],
  exams: [],
  tableData: [],
  total: 0,
  visible: false,
  searchLoad: false,
  editRecord: '',
  types: [],
  markQuestions:[],
  showIndex: 0
})
const roleKeys = reactive({
  mark: {
    teacher: 'yj-t',
    manage: 'yj-m'
  },
})

/**
 * 网络请求
 */
const getRecords = async () => {
  let res = await post('/exam/record/list', data.params);
  if (res.status === 1000) {
    data.tableData = res.data.list;
    data.total = Number(res.data.totalCount);
  }
}

const getExams = async () => {
  let res = await get('/exam/exams');
  if (res.status === 1000) {
    data.exams = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

const getGroups = async () => {
  let res = await get('/user/group/list');
  if (res.status === 1000) {
    data.groups = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}
/**
 * 事件
 */
const toSearch = () => {
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getRecords().then(() => data.searchLoad = false);
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  data.searchLoad = true;
  getRecords().then(() => data.searchLoad = false);
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getRecords().then(() => data.searchLoad = false);
}

const showAnswer = (row) => {
  data.editRecord = JSON.parse(JSON.stringify(row));
  data.types = JSON.parse(data.editRecord.answer);
  data.markQuestions = data.types.filter(({label}) => label === '简答题')[0].questions.filter(({myAnswer: {marking}}) => marking )
  data.visible = true;
}

const scoreClose = () => {
  data.visible = false;
}

const nextTo = (val) => {
  data.showIndex += val;
}

const confirmMarking = async() => {
  let check = data.markQuestions.some(i => i.myAnswer.marking);
  if(check){
     ElMessage.warning('还有题目为批阅，请点击下一题继续批阅');
     return;
  }
  let score = data.editRecord.score;
  data.types.forEach(i => {
    i.questions.forEach(question => {
      score += question.myAnswer.score;
    })
  })

  let param = {
    answer : JSON.stringify(data.types),
    score:score,
    id:data.editRecord.id,
    marking:0
  }
  let res = await post('/exam/marking',param);
  if(res.status === 1000){
    await getRecords();
    data.visible = false;
  }else{
    ElMessage.error(res.desc);
  }
}

const userInfo = getUser();

const handleChange = () => {
  data.markQuestions[data.showIndex].myAnswer.marking = false;
  data.markQuestions[data.showIndex].myAnswer.markTeacher = userInfo.realName;
}
onMounted(() => {
  getRecords();
  getExams();
  getGroups();

})
</script>

<style scoped lang='less'>
.main {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  height: calc(100vh - 100px);
  padding: 20px;
  position: relative;

  .search {
    display: flex;
    margin-bottom: 20px;
    margin-top: 20px;
    align-items: center;

    .group {
      margin-left: auto;
      font-size: 16px;
    }
  }

  .pagination {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>