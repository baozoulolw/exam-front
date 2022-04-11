<template>
  <div class="main">
    <t-radio-group variant="default-filled" v-model="data.params.param.condition" @change="conditionChange">
      <t-radio-button :value="0">未开始</t-radio-button>
      <t-radio-button :value="1">进行中</t-radio-button>
      <t-radio-button :value="2">已结束</t-radio-button>
    </t-radio-group>
    <div class="search">
      <el-input v-model="data.params.param.keyword" placeholder="输入关键词" class="margin-r wit-3" clearable></el-input>
      <el-date-picker
          v-model="data.date"
          type="datetimerange"
          :shortcuts="data.shortcuts"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="margin-r"
          value-format="YYYY-MM-DD hh:mm:ss"
      >
      </el-date-picker>
      <el-button @click="toSearch" :loading="data.searchLoad" type="primary">搜索</el-button>
      <el-button @click="addExam" type="primary" plain v-if="checkHasRole(roleKeys.add)">添加考试</el-button>
    </div>
    <el-table :data="data.tableData" border style="width: 100%" v-loading="data.searchLoad">
      <el-table-column label="序号" width="50" align='center' header-align='left'>
        <template #default="scope">
              <span
                  class="table-span"
              >{{ (data.params.pageNumber - 1) * data.params.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试名称" prop="examName" show-overflow-tooltip/>
      <el-table-column label="考试时长" width="100">
        <template #default="scope">
              <span
                  class="table-span"
              >{{ scope.row.duration }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="beginTime" width="180"></el-table-column>
      <el-table-column label="结束时间" prop="endTime" width="180"></el-table-column>
      <el-table-column label="类型" width="120">
        <template #default="scope">
              <span
                  class="table-span"
              >{{ scope.row.specifyTime === 0 ? '期限完成':'定时' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
      <el-table-column label="最后操作人" prop="changeUserName" width="130"></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <div class="table-operate">
            <span @click="editExam(scope.row)" class="item-span" v-if="data.params.param.condition === 0 && checkHasRole(roleKeys.edit)">编辑</span>
            <el-divider direction="vertical" v-if="data.params.param.condition === 0 && checkHasRole(roleKeys.edit) && checkHasRole(roleKeys.del) "></el-divider>
            <span @click='delQuestion(scope.row)' class="item-span" v-if="data.params.param.condition === 0 && checkHasRole(roleKeys.del)">删除</span>
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
  <el-dialog v-model="data.examVisible" :title="data.editType === 'add' ? '添加考试':'编辑考试'" width="700px" :before-close="closeExamDia">
    <div style="padding: 0 40px">
      <el-form :model="data.addExamParam" ref="examForm" style="margin-top: 20px" label-width="110px"
               :rules="data.rules">
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="data.addExamParam.examName"></el-input>
        </el-form-item>
        <el-form-item label="考试注意事项" prop="attention">
          <el-input :rows="3" type="textarea" v-model="data.addExamParam.attention"></el-input>
        </el-form-item>
        <el-form-item label="试卷" prop="paperId">
          <el-select v-model="data.addExamParam.paperId" filterable style="width: 100%">
            <el-option v-for="item in data.papers" :key="item.id" :value="item.id" :label="item.paperName"></el-option>
          </el-select>
        </el-form-item>
        <el-row v-if="data.addExamParam.paperId">
          <el-col :span="14">
            <el-form-item label="通过分数" prop="passScore">
              <el-input v-model="data.addExamParam.passScore" type="number" :min="1">
                <template #append>分</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="position: relative">
            <span class="score">{{`试卷总分: ${selectPaper.totalScore}`}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否定时考试" prop="specifyTime">
              <t-radio-group variant="primary-filled" v-model="data.addExamParam.specifyTime" @change="typeChange">
                <t-radio-button :value="1">是</t-radio-button>
                <t-radio-button :value="0">否</t-radio-button>
              </t-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="考试时长" prop="duration">
              <el-input v-model="data.addExamParam.duration" @blur="durationChange" type="number" :min="1">
                <template #append>分钟</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="开始时间" prop="beginTime">
          <!--          <el-date-picker
                        @disabledDate="time => time.getTime() > Date.now()"
                        v-model="data.addExamParam.beginTime"
                        type="datetime"
                        placeholder="考试考试时间"
                        :default-time="Date.now()"
                    >
                    </el-date-picker>-->
          <el-date-picker
              v-model="data.addExamParam.beginTime"
              type="datetime"
              placeholder="开始考试时间"
              @change="beginChange"
              value-format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <!--        <el-date-picker
                      @disabledDate="time => time > data.addExamParam.beginTime"
                      v-model="data.addExamParam.endTime"
                      type="datetime"
                      placeholder="考试时间结束时间"

                  >
                  </el-date-picker>-->
          <el-date-picker
              v-model="data.addExamParam.endTime"
              type="datetime"
              placeholder="考试结束时间"
              :disabled="data.addExamParam.specifyTime === 1"
              value-format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参考班级" prop="userGroupIds">
          <el-select v-model="data.addExamParam.userGroupIds" filterable style="width: 100%" multiple collapse-tags>
            <el-option v-for="item in data.userGroups" :key="item.id" :value="item.id"
                       :label="item.groupName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-scrollbar max-height="200px">
            <div class="selected-group-box">
              <section v-for="item in selectGroups" class="item">
                <span>{{ item.groupName }}</span>
                <el-icon class="icon-d" @click="delSelectGroup(item.id)">
                  <delete/>
                </el-icon>
              </section>
            </div>
          </el-scrollbar>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeExamDia" class="mr-12">取消</t-button>
        <t-button theme="primary" @click="confirmExamDia" :loading="data.diaLoad">确认</t-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, onMounted, ref, computed} from 'vue'
import {get, post} from "../../../http/request";
import {ElMessage} from "element-plus";
import {
  Delete
} from '@element-plus/icons'
import {checkHasRole, dateFormat, deepCloneObj, getObjByType, getUser} from "../../../utils/utils";

const props = defineProps({})

const emit = defineEmits([])

let selectGroups = computed(() => {
  return data.userGroups.filter(i => {
    return data.addExamParam.userGroupIds.some(pi => {
      if (pi === i.id) {
        return true;
      }
    })
  })
})

let selectPaper = computed(() => getObjByType(data.papers,'id',data.addExamParam.paperId));

/**
 * 校验规则
 */

// 校验用户名是否符合标准的方法
const checkExamName = async (rule, value, callback) => {
  let flag1 = data.editType === 'add';
  let flag2 = data.editType === 'edit' && value !== data.oldName;
  if(flag1 || flag2){
    let res = await get(`/exam/check/${value}`)
    if (res.status !== 1000) {
      callback(new Error(res.desc))
    } else {
      callback()
    }
  }
}

// 校验结束时间
const checkEndTime = async (rule, value, callback) => {
  let beginTime = data.addExamParam.beginTime;
  if(beginTime){
    if(new Date(beginTime).getTime() > new Date(value)){
      callback(new Error('结束时间必须大于开始时间'));
    }else {
      callback()
    }
  }else {
    callback()
  }
}

// 校验考试时长
const checkDuration = async (rule, value, callback) => {
  let duration = data.addExamParam.duration;
  if(Number(duration) < 1){
    callback(new Error('考试时长必须大于1'));
  }else{
    callback()
  }
}

// 校验通过分数
const checkPassScore = async (rule, value, callback) => {
  let passScore = data.addExamParam.passScore;
  const paper = getObjByType(data.papers,'id',data.addExamParam.paperId);
  if(passScore > paper.totalScore){
    callback(new Error('通过分数不能大于试卷总分'));
  }else{
    callback()
  }
}

// 校验参考分组
const checkUserGroupIds = async (rule, value, callback) => {
  let userGroupIds = data.addExamParam.userGroupIds;
  if(userGroupIds.length < 1){
    callback(new Error('必须至少有一个参考分组'));
  }else{
    callback()
  }
}

const examForm = ref();

const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '',
      condition: 0,
      beginTime: '',
      endTime: '',
      createUser:''
    }
  },
  searchLoad: false,
  tableData: [],
  total: 0,
  date: '',
  shortcuts: [
    {
      text: '前一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '前一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '前三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
    {
      text: '后一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '后一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '后三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
    {
      text: '前后一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '前后一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '前后三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 90)
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
  ],
  examVisible: false,
  diaLoad: false,
  addExamParam: {
    paperId: '',
    examName: '',
    passScore: '',
    specifyTime: 1,
    beginTime: '',
    endTime: '',
    duration: '',
    attention: '',
    userGroupIds: [],
    createUser:''
  },
  rules: {
    examName:[{required: true, message: '请输入考试名', trigger: 'blur'},{validator: checkExamName, trigger: 'blur'}],
    paperId:[{required: true, message: '请选择试卷', trigger: 'change'}],
    beginTime:[{required: true, message: '请选择开始时间', trigger: 'change'}],
    endTime:[{required: true, message: '请选择结束时间', trigger: 'change'},{validator: checkEndTime, trigger: 'change'}],
    duration:[{required: true, message: '请输入考试时长', trigger: 'blur'},{validator: checkDuration, trigger: 'blur'}],
    passScore:[{required: true, message: '请输入通过分数', trigger: 'blur'},{validator: checkPassScore, trigger: 'blur'}],
    userGroupIds:[{validator: checkUserGroupIds, trigger: 'change'}]
  },
  papers: [],
  userGroups: [],
  editType:'add',
  oldName:''
})
const roleKeys = reactive({
  add: {
    teacher: 'tjks-t',
    manage: 'tjks-m'
  },
  del:{
    teacher: 'scks-t',
    manage:'scks-m'
  },
  edit:{
    teacher: 'bjks-t',
    manage:'bjks-m'
  },
  seeAll:{
    teacher:'cksyks-t',
    manage:'cksyks-m'
  },
  seeAllPaper:{
    teacher: 'cksysj-t',
    manage: 'cksysj-m'
  }
})

/**
 * 网络请求
 */
const getExamList = async () => {
  if(!checkHasRole(roleKeys.seeAll)){
    data.params.param.createUser = userInfo.id;
  }else{
    data.params.param.createUser = '';
  }
  let res = await post('/exam/list', data.params);
  if (res.status === 1000) {
    data.tableData = res.data.list;
    data.total = Number(res.data.totalCount);
  } else {
    ElMessage.error(res.desc);
  }
}

const getGroupList = async () => {
  let res = await get('/user/group/list');
  if (res.status === 1000) {
    data.userGroups = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

const getPapers = async () => {
  let params = {
    pageSize: 99999,
    pageNum: 1,
    param: {},
  };
  if(!checkHasRole(roleKeys.seeAllPaper)){
    params.param.drawer = userInfo.id;
  }else{
    params.param.drawer = "";
  }
  let res = await post('/paper/page', params);
  if (res.status === 1000) {
    data.papers = res.data.list;
  } else {
    ElMessage.error(res.desc);
  }
}


const userInfo = getUser();

const addExamQuest = async(param) => {
  data.diaLoad = true;
  param.createUser = userInfo.id;
  const res = await post('/exam/arrange',param);
  data.diaLoad = false;
  if(res.status === 1000){
    toSearch();
    closeExamDia();
    ElMessage.success('添加成功');
  }else{
    ElMessage.error(res.desc);
  }
}

const editExamQuest = async(param) => {
  //data.diaLoad = true;
  const res = await post('/exam/edit',param);
  data.diaLoad = false;
  if(res.status === 1000){
    toSearch();
    closeExamDia();
    ElMessage.success('编辑成功');
  }else{
    ElMessage.error(res.desc);
  }
}

/**
 * 事件
 */

const toSearch = () => {
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getExamList().then(() => data.searchLoad = false);
}

const conditionChange = val => {
  data.params.param.condition = val;
  toSearch();
}

const addExam = () => {
  data.addExamParam = {
    paperId: '',
    examName: '',
    passScore: '',
    specifyTime: 1,
    beginTime: '',
    endTime: '',
    duration: '',
    attention: '',
    userGroupIds: []
  }
  data.editType = 'add';
  data.examVisible = true;
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  data.searchLoad = true;
  getExamList().then(() => data.searchLoad = false);
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getExamList().then(() => data.searchLoad = false);
}

const closeExamDia = () => {
  data.examVisible = false;
  data.diaLoad = false;
  data.addExamParam = {
    paperId: '',
    examName: '',
    passScore: '',
    specifyTime: 1,
    beginTime: '',
    endTime: '',
    duration: '',
    attention: '',
    userGroupIds: []
  }
  examForm.value.resetFields();
}

const confirmExamDia = () => {
  examForm.value.validate(res => {
    if (res) {
      if(data.editType === 'add') {
        addExamQuest(data.addExamParam);
      }else{
        editExamQuest(data.addExamParam);
      }
    }
  });
}

const beginChange = time => {
  if (data.addExamParam.specifyTime === 1 && data.addExamParam.duration) {
    let date = new Date()
    date.setTime(new Date(time).getTime() + data.addExamParam.duration * 60 * 1000);
    data.addExamParam.endTime = dateFormat(date,'yyyy-MM-dd HH:ss:mm');
  }
}

const typeChange = value => {
  if (value === 1) {
    if (data.addExamParam.duration && data.addExamParam.beginTime) {
      let date = new Date()
      date.setTime(new Date(data.addExamParam.beginTime).getTime() + data.addExamParam.duration * 60 * 1000);
      data.addExamParam.endTime = dateFormat(date,'YYYY-MM-dd HH:ss:mm');
    }
  }
}

const durationChange = () => {
  typeChange(data.addExamParam.specifyTime);
}

const delSelectGroup = id => {
  let index = data.addExamParam.userGroupIds.indexOf(id);
  data.addExamParam.userGroupIds.splice(index, 1);
}

const editExam = row => {
  data.addExamParam = deepCloneObj(row);
  data.addExamParam.userGroupIds = data.addExamParam.userGroupList.map(i => i.id);
  data.examVisible = true;
  data.editType = 'edit';
  data.oldName = JSON.parse(JSON.stringify(data.addExamParam.examName));
  console.log(data.addExamParam);
}

onMounted(() => {
  toSearch();
  getPapers();
  getGroupList();
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

.selected-group-box {
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;

  .item {
    margin-right: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    padding: 0 7px;
    border-radius: 6px;
    transition: 0.3s;
    position: relative;

    .icon-d {
      display: none;
      position: absolute;
      top: 12px;
      right: 5px;
      color: #ff607b;
      cursor: pointer
    }
  }

  .item:hover {
    padding-right: 20px;

    .icon-d {
      display: unset;
    }
  }
}
.score{
  position: absolute;
  top: 12px;
  left: 30px;
}
</style>