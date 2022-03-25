<template>
  <div class="main">
    <!--缩放左边菜单控制-->
    <el-icon :size="20" @click="collapseChange" class="collapse">
      <Expand v-if="proData.menuCollapse"/>
      <Fold v-else/>
    </el-icon>
    <div class="username">
      <el-icon :size="20">
        <User/>
      </el-icon>
      <span class="name">{{ userInfo.username }}</span>
    </div>
    <el-popover placement="bottom-end" :width="200" trigger="hover" popper-class="head-pop">
      <!--头像-->
      <template #reference>
        <el-avatar :size="45" :src="userInfo.avatarUrl" class="avatar"></el-avatar>
      </template>
      <!--鼠标放在头像上呼出菜单-->
      <div>
        <el-button type="text" class="item" @click="selfInfo">个人信息</el-button>
      </div>
      <div>
        <el-button type="text" class="item" @click="changePassword">密码修改</el-button>
      </div>
      <div>
        <el-button type="text" class="item" @click="logout()">退出登录</el-button>
      </div>
    </el-popover>
  </div>
  <el-dialog
      v-model="data.visible" title="个人信息" width="700px" @open="openDia"
      :before-close="handleClose" :close-on-click-modal="false" :destroy-on-close="true">
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">头像：</el-col>
      <el-col :span="10">
        <el-image style="width: 100px; height: 100px" :src="data.showUser.avatarUrl" fit="fill"/>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="openEditAvatar">
          <component :is="Edit"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">姓名：</el-col>
      <el-col :span="10" class="content">
        <el-input v-if="data.editShow[1]" v-model="data.editObj.realName"></el-input>
        <span v-else>{{ data.showUser.realName }}</span>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[1] = 1" v-if="!data.editShow[1]">
          <component :is="Edit"/>
        </el-icon>
        <el-icon style="margin-right: 12px" size="15" @click="submitItem('realName')" v-if="data.editShow[1]">
          <component :is="Check"/>
        </el-icon>
        <el-icon size="15" @click="data.editShow[1] = 0" v-if="data.editShow[1]">
          <component :is="Close"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">用户名：</el-col>
      <el-col :span="10" class="content">{{ data.showUser.username }}</el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[2] = 1" v-if="false">
          <component :is="Edit"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">性别：</el-col>
      <el-col :span="10" class="content">
        <t-radio-group v-if="data.editShow[3]" v-model="data.editObj.gender" name="city" :options="data.options"></t-radio-group>
        <span v-else>{{ data.showUser.gender }}</span>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[3] = 1" v-if="!data.editShow[3]">
          <component :is="Edit"/>
        </el-icon>
        <el-icon style="margin-right: 12px" size="15" @click="submitItem('gender')" v-if="data.editShow[3]">
          <component :is="Check"/>
        </el-icon>
        <el-icon size="15" @click="data.editShow[3] = 0" v-if="data.editShow[3]">
          <component :is="Close"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">住址：</el-col>
      <el-col :span="10" class="content">
        <el-cascader style="width: 100%" size='large' :options='data.addressOptions'
                     v-model='data.editObj.address' filterable v-if="data.editShow[4]"></el-cascader>
        <span v-else>{{getAddressStringByCode(JSON.parse(data.showUser.address))}}</span>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[4] = 1" v-if="!data.editShow[4]">
          <component :is="Edit"/>
        </el-icon>
        <el-icon style="margin-right: 12px" size="15" @click="submitItem('address')" v-if="data.editShow[4]">
          <component :is="Check"/>
        </el-icon>
        <el-icon size="15" @click="data.editShow[4] = 0" v-if="data.editShow[4]">
          <component :is="Close"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">电话号码：</el-col>
      <el-col :span="10" class="content">
        <el-input v-if="data.editShow[5]" v-model="data.editObj.phone"></el-input>
        <span v-else>{{ data.showUser.phone }}</span>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[5] = 1" v-if="!data.editShow[5]">
          <component :is="Edit"/>
        </el-icon>
        <el-icon style="margin-right: 12px" size="15" @click="submitItem('phone')" v-if="data.editShow[5]">
          <component :is="Check"/>
        </el-icon>
        <el-icon size="15" @click="data.editShow[5] = 0" v-if="data.editShow[5]">
          <component :is="Close"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">电子邮箱：</el-col>
      <el-col :span="10" class="content">
        <el-input v-if="data.editShow[6]" v-model="data.editObj.email"></el-input>
        <span v-else>{{ data.showUser.email }}</span>
      </el-col>
      <el-col :span="3" class="edit">
        <el-icon size="15" @click="data.editShow[6] = 1" v-if="!data.editShow[6]">
          <component :is="Edit"/>
        </el-icon>
        <el-icon style="margin-right: 12px" size="15" @click="submitItem('email')" v-if="data.editShow[6]">
          <component :is="Check"/>
        </el-icon>
        <el-icon size="15" @click="data.editShow[6] = 0" v-if="data.editShow[6]">
          <component :is="Close"/>
        </el-icon>
      </el-col>
    </el-row>

    <!-- 弹窗底部按钮-->
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="handleClose" class="mr-12">关闭</t-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="data.avatarVisible" title="头像修改" width="230px"
      :before-close="avatarClose" :close-on-click-modal="false" :destroy-on-close="true"
  >
    <avatar-upload v-model:file="data.avatarFile"></avatar-upload>
    <!-- 弹窗底部按钮-->
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="confirmAvatar" class="mr-12">确定</t-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="data.passwordVisible" title="密码修改" width="500px"
      :before-close="passwordClose" :close-on-click-modal="false" :destroy-on-close="true"
  >
    <el-form ref="sysForm" :model="data.password" :rules="data.rules" label-width="100px">
      <el-form-item label="输入密码" prop="one">
        <el-input type="password" v-model="data.password.one" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="再次输入" prop="two">
        <el-input type="password" v-model="data.password.two" autocomplete="new-password"></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹窗底部按钮-->
    <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="confirmPassword" class="mr-12">确定</t-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, onMounted, inject, ref} from 'vue'
import avatar from '../../assets/img/avatar.png'
import AvatarUpload from "@/components/common/upload/AvatarUpload.vue";
import {getAddressStringByCode, getUser} from '../../utils/utils'
import $store from '../../store/index'
import Cookies from 'js-cookie'
import {regionData, CodeToText} from 'element-china-area-data'
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  Avatar, Fold, Expand, User, Edit,Check,Close
} from '@element-plus/icons'
import {get, post} from "../../http/request";


const userInfo = getUser();
const router = useRouter();
let proData = inject('proData');

//点击进行菜单缩放或显示
const collapseChange = () => {
  proData.menuCollapse = !proData.menuCollapse;
}

//退出登录
const logout = () => {
  ElMessageBox.confirm(
      '将清除登录信息并跳转至登录页面',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        $store.dispatch('setUserInfo', {})
        router.push({path: '/login'});
        ElMessage.success('退出成功')
      })
}

const selfInfo = () => {
  closeEdit();
  data.visible = true;
}

const handleClose = () => {
  data.visible = false;
  localStorage.setItem('user', JSON.stringify(data.showUser));
  $store.dispatch('setUserInfo', data.showUser);
}

const openDia = async () => {
  let res = await get('/user/self');
  if (res.status === 1000) {
    data.showUser = res.data;
    data.editObj = JSON.parse(JSON.stringify(res.data));
    data.editObj.address = JSON.parse(data.editObj.address)
  } else {
    ElMessage.error(res.desc);
  }
}
const closeEdit = () => {
  data.editShow = [0, 0, 0, 0, 0, 0, 0]
}

const submitItem = async(key) => {
  let param = {
    [key]: key === 'address' ? JSON.stringify(data.editObj[key]):data.editObj[key],
    id:data.editObj.id
  }
  let res = await post('/user/edit',param);
  if(res.status === 1000){
    await openDia()
    closeEdit();
  }
}

const avatarClose = () => {
  data.avatarFile = {};
  data.avatarVisible = false
}

const openEditAvatar = () => {
  data.avatarFile = {};
  data.avatarVisible = true;
}
const confirmAvatar = async() => {
  console.log(data.avatarFile)
  console.log(typeof data.avatarFile)
  console.log(JSON.stringify(data.avatarFile))
  /*if(JSON.stringify(data.avatarFile) === '{}'){
    ElMessage.warning('请选择图片');
    return;
  }*/
  let avatar = new FormData();
  avatar.append('avatar', data.avatarFile);
  let res = await post('/user/avatar/add',avatar);
  if(res.status === 1000){
    let param = {
      avatar:res.data,
      id:data.editObj.id
    }
    let res1 = await post('/user/edit',param);
    if(res1.status === 1000){
      await openDia()
      avatarClose();
    }
  }else{
    ElMessage.error(res.desc)
  }
}

const changePassword = () => {
  data.password = {
    one:'',
    two:''
  };
  data.passwordVisible = true;
}
const sysForm = ref();
const confirmPassword = () => {
  sysForm.value.validate(async(res) => {
    if(res){
      let res = await post('/user/edit/password',{password:data.password.one});
      if(res.status === 1000){
        ElMessage.success('修改成功');
        Cookies.remove('token');
        localStorage.removeItem('user');
        $store.dispatch('setUserInfo', {})
        router.push({path: '/login'});
      }else{
        ElMessage.error(res.desc)
      }
    }
  })
}
const passwordClose = () => {
  data.passwordVisible = false;
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

// 校验密码是否符合标准的方法
const checkTwoPassword = async (rule, value, callback) => {
  let old = data.password.one
  if (old !== value) {
    callback(new Error('请输入与第一次相同的密码'))
  } else {
    callback()
  }
}


const data = reactive({
  visible: false,
  avatarVisible:false,
  passwordVisible:false,
  avatarFile:{},
  showUser: {
    avatarFile: '',
    address: '[]'
  },
  rules: {
    one: [{required: true, message: '请输入密码', trigger: 'blur'},
               {validator: checkPassword, trigger: 'blur'}],
    two: [{required: true, message: '请再次输入密码', trigger: 'blur'},
      {validator: checkTwoPassword, trigger: 'blur'}]
  },
  editObj: {},
  editShow: [0, 0, 0, 0, 0, 0, 0],
  addressOptions: regionData, // 插件文件
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
  password:{
    one:'',
    two:''
  }
})

onMounted(() => {
})
</script>
<style scoped lang='less'>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .collapse {
    margin-right: auto;
    margin-left: 20px;
  }

  .username {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 17px;

    .name {
      margin-left: 10px;
    }
  }

  .avatar {
    margin-right: 30px;
  }
}

.item-info {
  min-height: 30px;
  margin-bottom: 12px;
  font-size: 14px;

  .title ,.content,.edit{
    display: flex;
    align-items: center;
  }
}

</style>
<style lang="less">
.head-pop {
  padding-left: 0 !important;
  padding-right: 0 !important;

  .item {
    padding-left: 20px;
    width: 100%;
    text-align: left;
  }

  .item:hover {
    background: rgb(247, 247, 248);
    cursor: pointer;
  }
}
</style>