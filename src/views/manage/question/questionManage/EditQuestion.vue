<template>
  <div class="main-e" v-loading="data.saveLoad">
    <div class="operate">
    </div>
    <div class="body-question">
      <div class="head-type">
        <div class="label">题型</div>
        <el-select v-model="data.question.type" style="margin-right:40px" @change="changeType">
          <el-option
              v-for="item in data.types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
        <div class="label">难度</div>
        <el-select v-model="data.question.hard">
          <el-option
              v-for="item in data.hards"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="topic">
        <div class="label">题目</div>
        <el-input v-model="data.question.topic" :rows="4" type="textarea"></el-input>
      </div>
      <!-- 单选题 -->
      <div class="content" v-if="data.question.type === 0">
        <section class="option">
          <div class="label">答案</div>
          <el-select v-model="data.answer">
            <el-option
                v-for="item in data.options"
                :key="item.option"
                :value="item.option"
                :label="`选项${item.option}`"
            ></el-option>
          </el-select>
        </section>
        <section v-for="item in data.options" :key="item.option" class="option">
          <div class="label">
            <el-tag :type="data.answer === item.option ? 'success':'danger'">{{ item.option }}</el-tag>
          </div>
          <el-input v-model="item.value" :rows="2" type="textarea" placeholder="请填写选项内容"></el-input>
        </section>
      </div>
      <!-- 多选题 -->
      <div class="content" v-if="data.question.type === 1">
        <section class="option">
          <div class="label">答案</div>
          <el-select v-model="data.manyAnswer" multiple style="width:600px;margin-right: auto;">
            <el-option
                v-for="item in data.options"
                :key="item.option"
                :value="item.option"
                :label="`选项${item.option}`"
            ></el-option>
          </el-select>
        </section>
        <section v-for="(item,index) in data.options" :key="item.option" class="option">
          <div class="label">
            <el-tag :type="data.manyAnswer.some(v => item.option === v) ? 'success':'danger'">{{ item.option }}</el-tag>
          </div>
          <el-input
              v-model="item.value"
              :rows="2"
              type="textarea"
              placeholder="请填写选项内容"
              style="margin-right:10px"
          ></el-input>
          <el-button :icon="Plus" @click="addOption(index + 1)" type="primary" plain></el-button>
          <el-button :icon="Minus" @click="delOption(index)" type="danger" plain></el-button>
        </section>
      </div>
      <!-- 判断题 -->
      <div class="content" v-if="data.question.type === 2">
        <section class="option">
          <div class="label">答案</div>
          <div>
            <el-radio-group v-model="data.judgeAnswer" style="display:flex">
              <el-radio label="0">错误</el-radio>
              <el-radio label="1">正确</el-radio>
            </el-radio-group>
          </div>
        </section>
      </div>
      <!-- 填空题 -->
      <div class="content" v-if="data.question.type === 3">
        <section class="option">
          <div class="label">答案</div>
          <el-button :icon="CirclePlus" @click="addFill(data.fillAnswer.length)">添加填空</el-button>
        </section>
        <section v-for="(item,index) in data.fillAnswer" :key="index" class="option">
          <div class="label">填空{{ index + 1 }}:</div>
          <el-input
              v-model="item.value"
              :rows="2"
              type="textarea"
              placeholder="请填写填空答案"
              style="margin-right:10px"
          ></el-input>
          <el-button :icon="Plus" @click="addFill(index + 1)" type="primary" plain></el-button>
          <el-button :icon="Minus" @click="delFill(index)" type="danger" plain></el-button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {reactive, onMounted, onActivated, watch} from 'vue'
import {get, post} from '../../../../http/request'
import {
  CirclePlus, Plus, Minus, CaretRight
} from '@element-plus/icons'
import {useRouter,} from "vue-router";

const router = useRouter(); //路由

const props = defineProps({
  editType: String,
  id: String,
  group:String
})
const emit = defineEmits(['update:control'])
const data = reactive({
  question: {
    type: 0,
    topic: '',
    hard: 0,
    options: '',
    answer: '',
    group:'',
  },
  types: [
    {value: 0, label: '单选题'},
    {value: 1, label: '多选题'},
    {value: 2, label: '判断题'},
    {value: 3, label: '填空题'},
  ],
  hards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  options: [
    {option: 'A', value: ''},
    {option: 'B', value: ''},
    {option: 'C', value: ''},
    {option: 'D', value: ''}
  ],
  answer: 'A',
  saveLoad: false,
  manyAnswer: ['A'],
  judgeAnswer: "1",
  fillAnswer: [{value: ''}],
})

const getQuestionById = async (id) => {
  data.saveLoad = true;
  let res = await get(`/question/getById/${id}`);
  data.saveLoad = false;
  if (res.status === 1000) {
    data.question = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}
const addQuestion = async () => {
  data.saveLoad = true;
  let res = await post('/question/add', data.question);
  data.saveLoad = false;
  if (res.status === 1000) {
    ElMessage.success('保存成功');
    backList();
  } else {
    ElMessage.error(res.desc);
  }
}

const editQuestion = async () => {
  data.saveLoad = true;
  let {id, type, topic, hard, options, answer} = data.question;
  let obj = {
    id, type, topic, hard, options, answer
  }
  let res = await post('/question/edit', obj);
  data.saveLoad = false;
  if (res.status === 1000) {
    ElMessage.success('保存成功');
    backList();
  } else {
    ElMessage.error(res.desc);
  }
}

const computeOptions = () => {
  data.options.forEach((item, index) => {
    item.option = String.fromCharCode('A'.charCodeAt(0) + index);
  })
}
watch(() => router.currentRoute._rawValue.path,
    (n) => {
      if (n === '/question_edit') {
        init();
      }
    })

const changeType = val => {
  if (val === 0 || val === 1) {
    data.options = [
      {option: 'A', value: ''},
      {option: 'B', value: ''},
      {option: 'C', value: ''},
      {option: 'D', value: ''}
    ]
    data.answer = 'A';
    data.manyAnswer = ['A'];
  }
  if (val === 2) {
    data.judgeAnswer = "1";
  }
  if (val === 3) {
    data.fillAnswer = [{value: ''}];
  }
}

const addFill = index => {
  data.fillAnswer.splice(index, 0, {value: ''})
}

const delFill = index => {
  if (data.options.length === 1) {
    ElMessage.warning('填空数量不得小于1');
    return;
  }
  data.fillAnswer.splice(index, 1);
}

const addOption = index => {
  if (data.options.length === 7) {
    ElMessage.warning('选项数量不得大于七');
    return;
  }
  if (index) {
    console.log(index);
    data.options.splice(index, 0, {option: 0, value: ''});
  } else {
    console.log('1231231');
    data.options.push({option: 0, value: ''})
  }
  computeOptions();
}

const delOption = index => {
  if (data.options.length === 4) {
    ElMessage.warning('选项数量不得小于四');
    return;
  }
  data.options.splice(index, 1);
  computeOptions();
}

const save = () => {
  if (data.question.type === 0) {
    data.question.options = JSON.stringify(data.options);
    data.question.answer = data.answer;
  } else if (data.question.type === 1) {
    data.question.options = JSON.stringify(data.options);
    data.question.answer = JSON.stringify(data.manyAnswer);
  } else if (data.question.type === 2) {
    data.question.answer = data.judgeAnswer;
  } else {
    data.question.answer = JSON.stringify(data.fillAnswer);
  }
  if (props.editType === 'add') {
    addQuestion();
  } else {
    editQuestion();
  }
}

const init = () => {
  data.question.hard = Number(data.question.hard)
  if (data.question.type === 0) {
    data.options = JSON.parse(data.question.options);
    data.answer = data.question.answer;
  }
  if (data.question.type === 1) {
    data.options = JSON.parse(data.question.options);
    data.manyAnswer = JSON.parse(data.question.answer);
  }
  if (data.question.type === 2) {
    data.judgeAnswer = data.question.answer;
  }
  if (data.question.type === 3) {
    data.fillAnswer = JSON.parse(data.question.answer);
  }
}
onActivated(() => {
  console.log('123')
  init();
})

onMounted(async() => {
  if (props.editType === 'edit') {
    await getQuestionById(props.id);
    init();
  }else{
    data.question.groupId = props.group;
  }
})

defineExpose({
  save,
})

// onBeforeRouteEnter(() => {
//   console.log('123')
//   init();
// })
</script>
<style scoped lang='less'>
.main-e {
  padding: 20px;

  .operate {
    text-align: right;
  }

  .body-question {
    .head-type {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .label {
        width: 50px;
        margin-right: 10px;
      }
    }

    .topic {
      display: flex;
      margin-bottom: 20px;

      .label {
        min-width: 50px;
        margin-right: 10px;
        line-height: 36px;
      }
    }

    .content {
      .option {
        display: flex;
        margin-bottom: 20px;

        .label {
          min-width: 50px;
          margin-right: 10px;
          line-height: 36px;
        }
      }
    }
  }
}
</style>