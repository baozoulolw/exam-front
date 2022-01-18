<template>
  <div>
    <el-dialog v-model="data.visible" title="添加人员" width="1000px" @open="openDia"
               :before-close="handleClose" :close-on-click-modal="false" :destroy-on-close="true">
      <div class="head">
        <t-steps v-model="data.current" :options="data.steps" readonly/>
      </div>
      <div class="body">
        <div v-show="data.current === 1" class="baseInfo">
          <el-form ref="baseForm" :model="user" :rules="data.rules" label-width="100px">
            <div class="form-body">
              <div class="left">
                <el-form-item>
                  <avatar-upload v-model:file="data.avatarFile"></avatar-upload>
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
            <el-form-item label="住址">
              <el-cascader style="width: 100%" size='large' :options='data.addressOptions'
                           v-model='data.selectedOptions' filterable></el-cascader>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model.number="user.phone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="data.current === 3" class="sysInfo">
          <div class="left">
            <el-form ref="sysForm" :model="user" :rules="data.rules" label-width="100px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="user.password" autocomplete="new-password"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <div style="margin-bottom: 10px">*用户名：5-20个以字母开头、可带数字、“_”、“.”的字串</div>
            <div>*密码：6-20个字母、数字、下划线的字符串</div>
          </div>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="handleClose" class="mr-12">取消</t-button>
        <t-button variant="outline" theme="default" @click="data.current--" class="mr-12"
                  v-show="data.current > 1">上一步</t-button>
        <t-button theme="primary" @click="nextStep" class="mr-12" v-show="data.current < 3">下一步</t-button>
        <t-button theme="primary" @click="confirmDia" v-show="data.current === 3" :loading="data.submitLoad">确认</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch, ref, getCurrentInstance} from 'vue'
import AvatarUpload from "../../../components/common/upload/AvatarUpload.vue";
import {Plus} from '@element-plus/icons'
import {ElMessage} from "element-plus";
import {regionData, CodeToText} from 'element-china-area-data'
import {get, post} from "../../../http/request";

const props = defineProps({
  visible: Boolean
})
const i = getCurrentInstance();
const emit = defineEmits(['update:visible','close'])

watch(() => props.visible,
    n => data.visible = n)

const checkPhone = (rule, value, callback) => {
  let regP = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (value !== '' && !regP.test(value)) {
    callback(new Error('请正确填写手机号'))
  } else {
    callback()
  }
}

const checkEmail = (rule, value, callback) => {
  let regP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (value !== '' && !regP.test(value)) {
    callback(new Error('请正确填写邮箱'))
  } else {
    callback()
  }
}

const checkUsername = async (rule, value, callback) => {
  let reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
  if (!reg.test(value)) {
    callback(new Error('请输入5-20个以字母开头、可带数字、“_”、“.”的字串'))
  } else {
    let res = await get(`/user/check/${value}`)
    if (res.status !== 1000) {
      callback(new Error(res.desc))
    } else {
      callback()
    }
  }
}

const checkPassword = async (rule, value, callback) => {
  let reg = /^(\w){6,20}$/;
  if (!reg.test(value)) {
    callback(new Error('请输入6-20个字母、数字、下划线的字符串'))
  } else {
    callback()
  }
}

const baseForm = ref();
const detailedForm = ref();
const sysForm = ref();

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
    realName: [{required: true, message: '请输入学生姓名', trigger: 'blur'}],
    avatar: [],
    phone: [{validator: checkPhone, trigger: 'blur'}],
    email: [{validator: checkEmail, trigger: 'blur'}],
    username: [
      {required: true, message: '请输入用户名', trigger: 'blur'},
      {validator: checkUsername, trigger: 'blur'}
    ],
    password: [{required: true, message: '请输入密码', trigger: 'blur'},
      {validator: checkPassword, trigger: 'blur'}]
  },
  imageUrl: '',
  selectedOptions: [],
  avatarFile:{},
  addressOptions:regionData,
  submitLoad:false
})

const user = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  avatar: '',
  gender: '男',
  address: '[]',
  status: 1,
  email: ''
})

/**
 * 网络请求
 */


/**
 * 事件
 */
const getData = () => {
  return{
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
    visible: true,
    rules: {
      realName: [{required: true, message: '请输入学生姓名', trigger: 'blur'}],
      avatar: [],
      phone: [{validator: checkPhone, trigger: 'blur'}],
      email: [{validator: checkEmail, trigger: 'blur'}],
      username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {validator: checkUsername, trigger: 'blur'}
      ],
      password: [{required: true, message: '请输入密码', trigger: 'blur'},
        {validator: checkPassword, trigger: 'blur'}]
    },
    imageUrl: '',
    selectedOptions: [],
    avatarFile:{},
    addressOptions:regionData,
    submitLoad:false
  }
}
const getUser = () => {
  return{
    username: '',
    password: '',
    realName: '',
    phone: '',
    avatar: '',
    gender: '男',
    address: [],
    status: 1,
    email: ''
  }
}
const openDia = () => {
  Object.assign(user,getUser());
  Object.assign(data,getData());
}
const handleClose = () => {

  emit('update:visible', false);
}
const confirmDia = () => {
  sysForm.value.validate(async(res) => {
    if (res) {
      data.submitLoad = true;
      if(data.avatarFile.type){
        let param = new FormData();
        param.append('avatar', data.avatarFile);
        let res = await post('/user/avatar/add',param)
        if(res.status === 1000){
          user.avatar = res.data;
        }else{
          return;
        }
      }
      if(data.selectedOptions.length === 3){
        user.address = JSON.stringify(data.selectedOptions);
      }else{
        user.address = '[]';
      }
      let res = await post('/user/add', user)
      data.submitLoad = false;
      if(res.status === 1000){
        ElMessage.success('创建成功');
        emit('close');
      }else{
        ElMessage.error(res.desc);
      }
    }
  })
}

const nextStep = () => {
  if (data.current === 1) {
    baseForm.value.validate(res => {
      if (res) {
        data.current++
      } else {
        ElMessage.info('请填写信息')
      }
    })
  } else if (data.current === 2) {
    detailedForm.value.validate(res => {
      if (res) {
        data.current++
      } else {
        ElMessage.info('请填写信息')
      }
    })
  }
}

onMounted(() => {
})
</script>


<style scoped lang='less'>
.head {
  padding: 0 100px;
}

.baseInfo {
  padding: 30px 150px 0 150px;

  .form-body {
    display: flex;

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}

.detailedInfo {
  padding: 30px 200px 0 200px;
}

.sysInfo {
  padding: 30px 100px 0 150px;
  display: flex;
  align-items: center;
  .left{
    flex:5;
    margin-right: 20px;
    margin-top: 20px;
  }
  .right{
    padding: 10px;
    box-sizing: border-box;
    flex:2;
    height: 100px;
    border: 1px solid var(--el-border-color-base);
    border-radius: 2px
  }
}

</style>