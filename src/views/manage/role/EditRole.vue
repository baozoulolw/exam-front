<template>
  <el-dialog :title="data.title" v-model="props.visible" :before-close="closeDialog" width="500px">
    <el-form ref="form" :model="data.formData" label-width="80px" :rules="data.rules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="data.formData.roleName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-switch
          v-model="data.formData.isDefault"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :rows="3" v-model="data.formData.remark" size="mini" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog" class="diaButton">取消</el-button>
        <el-button type="primary" @click="submit" class="diaButton">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, onMounted, getCurrentInstance} from 'vue'
import { post } from '../../../http/request'

const { proxy } = getCurrentInstance()

const props = defineProps({
  roleData: Object,
  type: {
    type: String,
    default: () => 'add'
  },
  visible: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits(['update:visible', 'close'])

const data = reactive({
  formData: {
    roleName: '',
    remark: '',
    isDefault: false
  },
  title: '新增角色',
  rules: {
    roleName: [
      { required: true, message: '请输入角色名', trigger: 'blur' },
    ]
  }
})

const editRole = async () => {
  let res = await post('/role/edit_role', data.formData);
  if (res.status === 1000) {
    closeDialog();
  } else {
    ElMessage.error(res.desc);
  }
}

const addRole = async () => {
  let res = await post('/role/add_role', data.formData);
  if (res.status === 1000) {
    closeDialog();
  } else {
    ElMessage.error(res.desc);
  }
}

const closeDialog = () => {
  emit('update:visible', false);
  emit('close');
}

const submit = async () => {
  let valid = true;
  proxy.$refs['form'].validate(res => valid = res);
  if (!valid) return;
  data.formData.isDefault = data.formData.isDefault ? '1' : '0'
  if (props.type === 'add') {
    addRole();
  } else {
    editRole();
  }
}
onMounted(() => {
  console.log(props.type, 'type');
  if (props.type === 'edit') {
    data.title = '编辑角色';
    data.formData = props.roleData;
  }
})
</script>
<style scoped lang='less'>
</style>