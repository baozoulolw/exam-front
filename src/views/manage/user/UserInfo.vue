<template>
  <div>
    <el-dialog v-model="data.visible" title="添加人员" width="1000px" v-if="data.visible"
               :before-close="handleClose">
      <div class="head">
        <t-steps v-model="data.current" :options="data.steps" readonly/>
      </div>
      <div class="body">
        <div v-show="data.current === 1" class="baseInfo">
          <el-form ref="baseForm" :model="user" :rules="data.rules" label-width="100px">
            <div class="form-body">
              <div class="left">
                <el-form-item>
                  <avatar-upload></avatar-upload>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item label="学生姓名" prop="realName">
                  <el-input v-model="user.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <t-radio-group v-model="user.gender" name="city" :options="data.options"></t-radio-group>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div v-show="data.current === 2" class="detailedInfo">
          <el-form ref="detailedForm" :model="user" :rules="data.rules" label-width="100px">
            <el-form-item label="住址" >
              <el-cascader style="width: 100%" size='large' :options='data.addressOptions' v-model='data.selectedOptions' filterable></el-cascader>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model.number="user.phone"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="data.current === 3">
          <el-form ref="sysForm" :model="user" :rules="data.rules" label-width="100px">
          </el-form>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="handleClose" class="mr-12">取消</t-button>
        <t-button variant="outline" theme="default" @click="data.current--" class="mr-12"
                  v-show="data.current > 1">上一步</t-button>
        <t-button theme="primary" @click="nextStep" class="mr-12" v-show="data.current < 3">下一步</t-button>
        <t-button theme="primary" @click="confirmDia" v-show="data.current === 3">确认</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch,ref} from 'vue'
import AvatarUpload from "../../../components/common/upload/AvatarUpload.vue";
import {Plus} from '@element-plus/icons'
import {ElMessage} from "element-plus";
import { regionData, CodeToText } from 'element-china-area-data'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

watch(() => props.visible,
    n => data.visible = n)

const checkPhone = (rule, value, callback) => {
  let regP = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (value!=='' && !regP.test(value)) {
    callback(new Error('请正确填写手机号'))
  } else {
    callback()
  }
}

const baseForm =ref();
const detailedForm =ref();
const sysForm =ref();

const data = reactive({
  steps: [
    {title: '填写基本信息', value: 1},
    {title: '填写详细信息', value: 2},
    {title: '设置用户名和密码', value: 3},
  ],
  options: [
    {
      value: '男',
      label: '男',
    },
    {
      value: '女',
      label: '女',
    }
  ],
  current: 1,
  visible: false,
  rules: {
    realName: [{required: true, message: '请输入学生姓名', trigger: 'blur',}],
    avatar: [],
    phone:[{validator:checkPhone, trigger: 'blur'}]
  },
  imageUrl: '',
  selectedOptions:['','',''],
  addressOptions:regionData
})

const user = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  avatar: '',
  gender: '男',
  address: '',
  status: 1,
  email: ''
})

/**
 * 网络请求
 */


/**
 * 事件
 */
const handleClose = () => {
  emit('update:visible', false);
}
const confirmDia = val => {
}

const nextStep = () => {
  if(data.current === 1){
    baseForm.value.validate( res => {
      if(res){
        data.current++
      }else{
        ElMessage.info('请填写信息')
      }
    })
  }else if(data.current === 2){
    detailedForm.value.validate( res => {
      if(res){
        data.current++
      }else{
        ElMessage.info('请填写信息')
      }
    })
  }
}

onMounted(() => {
})
</script>


<style scoped lang='less'>
.head{
  padding: 0 100px;
}
.baseInfo {
  padding: 30px 150px 0 150px;

  .form-body {
    display: flex;
    .right{
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.detailedInfo{
  padding: 30px 200px 0 200px;

}
</style>