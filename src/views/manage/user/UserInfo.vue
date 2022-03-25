<template>
  <div>
    <el-dialog v-model="data.visible" title="添加人员" width="1000px" @open="openDia"
               :before-close="handleClose" :close-on-click-modal="false" :destroy-on-close="true">
      <div class="head">
        <t-steps v-model="data.current" :options="data.steps" readonly/>
      </div>
      <div class="body">
        <!--输入基本信息流程（第一步）-->
        <div v-show="data.current === 1" class="baseInfo">
          <el-form ref="baseForm" :model="user" :rules="data.rules" label-width="100px">
            <div class="form-body">
              <div class="left">
                <el-form-item>
                  <avatar-upload v-model:file="data.avatarFile"></avatar-upload>
                </el-form-item>
                <el-form-item label="分组" prop="groupId">
                  <el-select v-model="user.groupId" filterable>
                    <el-option v-for="item in props.groupList" :label="item.groupName" :key="item.id" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item label="姓名" prop="realName">
                  <el-input v-model="user.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <t-radio-group v-model="user.gender" name="city" :options="data.options"></t-radio-group>
                </el-form-item>
                <el-form-item label="角色" prop="roleIds">
                  <el-select v-model="user.roleIds">
                    <el-option v-for="item in data.roles" :label="item.label" :key="item.id" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <!--输入住址、电话号码、电子邮箱流程（第二步）-->
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
        <!--输入用户名和密码流程（第三步）-->
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
          <!--输入用户名密码提示-->
          <div class="right">
            <div style="margin-bottom: 10px">*用户名：5-20个以字母开头、可带数字、“_”、“.”的字串</div>
            <div>*密码：6-20个字母、数字、下划线的字符串</div>
          </div>
        </div>
      </div>
      <!-- 弹窗底部按钮-->
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
  visible: Boolean, // 弹窗显示控制
  groupList: Array
})
const i = getCurrentInstance();
const emit = defineEmits(['update:visible','close'])

// 监听弹窗显示控制，以便第一时间赋值
watch(() => props.visible,
    n => data.visible = n)

// 验证是否为电话号码的方法
const checkPhone = (rule, value, callback) => {
  let regP = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (value !== '' && !regP.test(value)) {
    callback(new Error('请正确填写手机号'))
  } else {
    callback()
  }
}

// 验证是否为电子邮件的方法
const checkEmail = (rule, value, callback) => {
  let regP = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (value !== '' && !regP.test(value)) {
    callback(new Error('请正确填写邮箱'))
  } else {
    callback()
  }
}

// 校验用户名是否符合标准的方法
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

// 校验密码是否符合标准的方法
const checkPassword = async (rule, value, callback) => {
  let reg = /^(\w){6,20}$/;
  if (!reg.test(value)) {
    callback(new Error('请输入6-20个字母、数字、下划线的字符串'))
  } else {
    callback()
  }
}
// 第一个步骤的表单refs
const baseForm = ref();
// 第二个步骤的表单refs
const detailedForm = ref();
// 第三个步骤的表单refs
const sysForm = ref();

const data = reactive({
  // 流程控制
  steps: [
    {title: '填写基本信息', value: 1},
    {title: '填写详细信息', value: 2},
    {title: '设置用户名和密码', value: 3},
  ],
  // 性别选项
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
  roles:[
    {label:'辅导员',id:'1'},
    {label:'老师',id:'2'},
    {label:'学生',id:'3'}
  ],
  // 当前步骤
  current: 1,
  // 弹窗显示控制
  visible: false,
  // 表单校验规则
  rules: {
    realName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
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
  imageUrl: '', // 头像url
  selectedOptions: [], // 地址已选项
  avatarFile:{}, // 头像file文件
  addressOptions:regionData, // 插件文件
  submitLoad:false //点击提交加载动画控制
})

const user = reactive({
  username: '', // 用户名
  password: '', // 密码
  realName: '', // 真实姓名
  phone: '', // 电话号码
  avatar: '', // 头像
  gender: '男', // 性别
  address: '[]', // 地址
  status: 1, // 状态
  email: '', // 电子邮件
  roleIds:'',
  groupId:''
})

/**
 * 网络请求
 */


/**
 * 事件
 */
// 初始化弹窗
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
      roleIds: [{required: true, message: '请选择基础角色', trigger: 'change'}],
      groupId: [{required: true, message: '请选择基础角色', trigger: 'change'}],
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
// 初始化表单信息
const getUser = () => {
  return{
    username: '', // 用户名
    password: '', // 密码
    realName: '', // 真实姓名
    phone: '', // 电话号码
    avatar: '', // 头像
    gender: '男', // 性别
    address: '[]', // 地址
    status: 1, // 状态
    email: '', // 电子邮件
    roleIds:''
  }
}
// 打开弹窗触发
const openDia = () => {
  Object.assign(user,getUser());
  Object.assign(data,getData());
}
// 关闭弹窗触发
const handleClose = () => {

  emit('update:visible', false);
}
// 点击确定新增触发
const confirmDia = () => {
  // 先校验
  sysForm.value.validate(async(res) => {
    if (res) {
      data.submitLoad = true;
      if(data.avatarFile.type){
        let param = new FormData();
        param.append('avatar', data.avatarFile);
        // 首先上传头像，获取到上传到服务器后的url
        let res = await post('/user/avatar/add',param)
        if(res.status === 1000){
          user.avatar = res.data;
        }else{
          return;
        }
      }
      // 地址序列化转换
      if(data.selectedOptions.length === 3){
        user.address = JSON.stringify(data.selectedOptions);
      }else{
        user.address = '[]';
      }
      let ar = []
      ar.push(user.roleIds);
      user.roleIds = ar;
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

// 点击下一步触发
const nextStep = () => {
  // 首先触发表单校验，校验通过则进入下一步
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