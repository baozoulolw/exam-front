<template>
  <div v-loading="data.diaLoad">
    <el-dialog v-model="props.visible" :before-close="closeDialog" width="600px" :title="data.title">
      <el-form ref="form" label-width="80px" :rules="data.rules" :model="data.params">
        <el-form-item label="试卷名称" prop="paperName">
          <el-input v-model="data.params.paperName"></el-input>
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="data.params.hard">
            <el-radio v-for="item in data.qHards" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model="data.params.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog" type="primary" plain>取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, ref} from 'vue'
import {post} from "../../../../http/request";
import {ElMessage} from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false
  },
  type: {
    type: String,
    default: () => 'add'
  },
  data: Object,
})

const emit = defineEmits(['update:visible'])

const data = reactive({
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  params: {
    paperName: '',
    hard: 0,
    remark: '',
    totalScore: 0
  },
  title: '新增试卷',
  rules: {
    paperName: [
      {
        required: true,
        message: '请输入试卷名称',
        trigger: 'blur'
      }
    ]
  },
  diaLoad: false
})

const form = ref();
/**
 * 网络请求
 */
const addPaper = async () => {
  data.diaLoad = true;
  let res = await post('/paper/add', data.params);
  data.diaLoad = false;
  if (res.status === 1000) {
    ElMessage.success('添加成功');
    closeDialog();
  } else {
    ElMessage.error(res.desc);
  }
}

const editPaper = async () => {
  data.diaLoad = true;
  let res = await post('/paper/update', data.params);
  data.diaLoad = false;
  if (res.status === 1000) {
    ElMessage.success('更新成功');
    closeDialog();
  } else {
    ElMessage.error(res.desc);
  }
}

/**
 * 事件
 */
const closeDialog = () => {
  emit('update:visible', false);
}

const submit = () => {
  form.value.validate(v => {
    if (v) {
      if (props.type === 'add') {
        addPaper();
      } else {
        editPaper();
      }
    }
  })
}

onMounted(() => {
  if (props.type === 'edit') {
    data.params = props.data;
    data.title = '编辑试卷'
  }
})
</script>

<style scoped lang='less'>
</style>