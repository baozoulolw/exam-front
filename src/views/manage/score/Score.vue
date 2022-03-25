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
              >{{ scope.row.marking === 0 ? scope.row.score:'待阅卷' }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
      <el-table-column label="最后操作人" prop="changeUserName" width="130"></el-table-column>-->
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <div class="table-operate">
            <span @click="showAnswer(scope.row)" class="item-span" v-if="scope.row.marking === 0">查看答卷</span>
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
      v-model="data.visible" title="查看答卷" width="700px"
       style="min-height: 500px"
      :before-close="scoreClose" :close-on-click-modal="false" :destroy-on-close="true">

    <div style="margin-bottom: 20px;font-size: 18px"><span>题目：</span>{{ showQuestion.question.topic }}</div>
<!--    <div v-if="data.showQuestions[data.showIndex].question .type === 0">

      <div style="margin-bottom: 20px;font-size: 16px">
        <span>学生答案: </span>
        <span>{{ data.markQuestions[data.showIndex].myAnswer.content[0] }}</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>参考答案: </span>
        <span>{{ JSON.parse(data.showQuestions[data.showIndex].question.answer)[0].value }}</span>
      </div>
    </div>
    <div v-if="data.showQuestions[data.showIndex].question .type === 1">
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>学生答案: </span>
        <span>{{ data.markQuestions[data.showIndex].myAnswer.content[0] }}</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>参考答案: </span>
        <span>{{ JSON.parse(data.showQuestions[data.showIndex].question.answer)[0].value }}</span>
      </div>
    </div>
    <div v-if="data.showQuestions[data.showIndex].question .type === 2">
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>学生答案: </span>
        <span>{{ data.markQuestions[data.showIndex].myAnswer.content[0] }}</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>参考答案: </span>
        <span>{{ JSON.parse(data.showQuestions[data.showIndex].question.answer)[0].value }}</span>
      </div>
    </div>
    <div v-if="data.showQuestions[data.showIndex].question .type === 3">
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>学生答案: </span>
        <span>{{ data.markQuestions[data.showIndex].myAnswer.content[0] }}</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>参考答案: </span>
        <span>{{ JSON.parse(data.showQuestions[data.showIndex].question.answer)[0].value }}</span>
      </div>
    </div>-->
    <div v-if="showQuestion.question.type === 0">
      <section v-for="item in JSON.parse(showQuestion.question.options)" :key="item.option" class="mb-10">
        <el-tag :type="showQuestion.question.answer === item.option ? 'success':'danger'" size="small"
                class="mr-20">{{ item.option }}
        </el-tag>
        <span>{{ item.value }}</span>
      </section>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        参考答案：
        <el-tag size="small" type="success">{{ showQuestion.question.answer }}</el-tag>
      </div>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        学生答案：
        <el-tag size="small" type="success" v-if="showQuestion.myAnswer.content">{{ showQuestion.myAnswer.content }}</el-tag>
      </div>
    </div>
    <div v-if="showQuestion.question.type === 1">
      <section v-for="item in JSON.parse(showQuestion.question.options)" :key="item.option" class="mb-10">
        <el-tag
            :type="JSON.parse(showQuestion.question.answer).some(v => item.option === v) ? 'success':'danger'"
            size="small"
            class="mr-20">{{ item.option }}
        </el-tag>
        <span>{{ item.value }}</span>
      </section>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        参考答案：
        <el-tag style="margin-right: 10px" size="small" type="success"
                v-for="item in JSON.parse(showQuestion.question.answer)" :key="item">
          {{ item }}
        </el-tag>
      </div>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        学生答案：
        <el-tag size="small" type="success" v-for="item in showQuestion.myAnswer.content">{{ item }}</el-tag>
      </div>
    </div>
    <div v-if="showQuestion.question.type === 2">
      <div class="mb-10">
        <el-tag class="mr-20" size="small">1</el-tag>
        <span class="status correct"></span></div>
      <div class="mb-20">
        <el-tag class="mr-20" size="small">2</el-tag>
        <span class="status incorrect"></span></div>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        参考答案：
        <el-tag style="margin-right: 10px" size="small" type="success"
                v-for="item in JSON.parse(showQuestion.question.answer)" :key="item">
          {{ item }}
        </el-tag>
      </div>
      <div style="display: flex;align-items: center;padding-right: 40px;margin-bottom: 20px">
        学生答案：
        <el-tag size="small" type="success" v-for="item in showQuestion.myAnswer.content">{{ item }}</el-tag>
      </div>
    </div>
    <div v-if="showQuestion.question.type === 3" style="margin-bottom: 20px">
      <section v-for="(item,index) in JSON.parse(showQuestion.question.answer)" :key="index">
        <el-tag size="small" class="mr-20">{{ `填空${index + 1}` }}</el-tag>
        <span style="margin-right: 20px">参考答案： {{ item.value }} </span>
        <span>学生答案： {{ showQuestion.myAnswer.content[index] }} </span>
      </section>
    </div>
    <div v-if="showQuestion.question .type === 4">
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>学生答案: </span>
        <span>{{ showQuestion.myAnswer.content[0] }}</span>
      </div>
      <div style="margin-bottom: 20px;font-size: 16px">
        <span>参考答案: </span>
        <span>{{ JSON.parse(showQuestion.question.answer)[0].value }}</span>
      </div>
    </div>
    <div style="font-size: 20px;display: flex;align-items: center">
      <div style="margin-right: 100px">
        满分：{{ showQuestion.score }}
      </div>
      <div style="display: flex;align-items: center">
        学生得分：{{showQuestion.myAnswer.score}}
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="nextTo(-1)" class="mr-12" v-show="data.showIndex !== 0">上一题</t-button>
        <t-button theme="default" @click="nextTo(1)" class="mr-12" v-show="data.showIndex+1 < data.showQuestions.length">下一题</t-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, onMounted, computed} from 'vue'
import {get, post} from "../../../http/request";
import {ElMessage} from "element-plus";

const props = defineProps({})

const emit = defineEmits([])

let showQuestion = computed(() => data.showQuestions[data.showIndex]);

const data = reactive({
  params:{
    pageNumber: 1,
    pageSize: 10,
    param:{
      keyword:'',
      examId:'',
      userId:'',
      groupId:''
    }
  },
  groups:[],
  exams:[],
  tableData:[],
  showQuestions:[],
  total:0,
  visible:false,
  searchLoad:false,
  showIndex:0
})

/**
 * 网络请求
 */
const getRecords = async() => {
  let res = await post('/exam/record/list',data.params);
  if(res.status === 1000){
    data.tableData = res.data.list;
    data.total = Number(res.data.totalCount);
  }
}

const getExams = async() => {
  let res = await get('/exam/exams');
  if (res.status === 1000) {
    data.exams = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

const getGroups = async() => {
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
  let types = JSON.parse(row.answer);
  data.showQuestions = types.reduce( (pre,i) => [...pre,...i.questions],[])
  data.visible = true;
}

const nextTo = (val) => {
  data.showIndex += val;
}

const scoreClose = () => {
  data.visible = false;
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
.correct:before {
  content: '\2714';
  color: #008100;
}

.incorrect:before {
  content: '\2716';
  color: #b20610;
}
</style>