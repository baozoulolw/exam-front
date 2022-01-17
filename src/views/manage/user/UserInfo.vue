<template>
  <div>
    <el-dialog v-model="data.visible" title="添加人员" width="1000px" v-if="data.visible"
               :before-close="handleClose">
      <div class="head">
        <t-steps v-model="data.current" :options="data.steps" readonly/>
      </div>
      <div class="body">
        <div v-show="data.current === 1">
          <el-form ref="base-form" :model="user" :rules="data.rules">
            <el-form-item>
              <el-input v-model="user.realName"></el-input>
            </el-form-item>
            <el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div v-show="data.current === 2">

        </div>
        <div v-show="data.current === 3">

        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="handleClose" class="mr-12">取消</t-button>
        <t-button variant="outline" theme="default" @click="data.current--" class="mr-12"
                  v-show="data.current > 1">上一步</t-button>
        <t-button theme="primary" @click="data.current++" class="mr-12" v-show="data.current < 3">下一步</t-button>
        <t-button theme="primary" @click="confirmDia" v-show="data.current === 3">确认</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch} from 'vue'

const props = defineProps({
  visible: Boolean
})


const emit = defineEmits(['update:visible'])

watch(() => props.visible,
    n => data.visible = n)

const data = reactive({
  steps: [
    {title: '填写基本信息', value: 1},
    {title: '填写详细信息', value: 2},
    {title: '设置用户名和密码', value: 3},
  ],
  current: 1,
  visible: false,
  rules: {
    realName: [],
    avatar: [],
  }
})

const user = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  avatar: '',
  gender: '',
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
onMounted(() => {
})
</script>

<style scoped lang='less'>
</style>