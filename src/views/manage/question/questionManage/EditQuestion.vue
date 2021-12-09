<template>
  <div class="edit-main" v-loading="data.saveLoad">
    <div class="operate">
      <el-button @click="save()">保存</el-button>
      <el-button @click="backList()">返回</el-button>
    </div>
    <div class="body-question">
      <div class="head-type">
        <div class="label">题型</div>
        <el-select v-model="data.question.type" style="margin-right:40px">
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
      <div class="content">
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
          <div class="label">选项{{ item.option }}:</div>
          <el-input v-model="item.value" :rows="2" type="textarea" placeholder="请填写选项内容"></el-input>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, onMounted } from 'vue'
import { post } from '../../../../http/request'
const props = defineProps({
  control: Boolean,
  editType: String,
  data: Object,
})
const emit = defineEmits(['update:control'])
const data = reactive({
  question: {
    type: 0,
    topic: '',
    hard: 0,
    options: '',
    answer: '',
  },
  types: [
    { value: 0, label: '单选题' },
    { value: 1, label: '多选题' },
    { value: 2, label: '判断题' },
    { value: 3, label: '填空题' },
  ],
  hards: [
    { value: 0, label: '简单' },
    { value: 1, label: '中等' },
    { value: 2, label: '困难' },
  ],
  options: [
    { option: 'A', value: '' },
    { option: 'B', value: '' },
    { option: 'C', value: '' },
    { option: 'D', value: '' }
  ],
  answer: 'A',
  saveLoad: false
})

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

const backList = () => {
  emit('update:control', true);
}

const save = () => {
  if (data.question.type === 0) {
    data.question.options = JSON.stringify(data.options);
    data.question.answer = data.answer;
  }
  addQuestion();
}
onMounted(() => {
  if (props.editType === 'edit') {
    data.question = props.data;
    data.question.hard = Number(props.data.hard)
    if (props.data.type === 0) {
      data.options = JSON.parse(props.data.options);
      data.answer = props.data.answer;
    }
  }
})
</script>
<style scoped lang='less'>
.main {
  display: flex;
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