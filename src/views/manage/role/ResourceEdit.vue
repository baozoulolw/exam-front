<template>
  <div class="body-d">
    <el-input v-model="data.keyword" size="small" placeholder="输入关键词过滤"></el-input>
    <div class="tree">
      <el-tree
          ref="tree"
          :props="data.props"
          :data="data.treeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="data.selectKeys"
          @check-change="handleCheckChange"
          :filter-node-method="filterNode"
          @check="check"
      />
    </div>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch, ref} from 'vue'
import {get, post} from "../../../http/request";
import {ElMessage} from "element-plus";
import {deepCloneObj} from "../../../utils/utils";

const props = defineProps({
  id: String,
  visible:Boolean
})

const emit = defineEmits(['update:visible'])
const data = reactive({
  keyword: '',
  treeData: [],
  selectKeys: [],
  props: {
    label: 'resourceName',
    children: 'children',
  },
  oldKeys: []
})

/**
 * 网络请求
 */
const getKeys = async () => {
  let res = await get(`/role/resources/${props.id}`);
  if (res.status === 1000) {
    data.selectKeys = res.data;
    tree.value.setCheckedKeys(data.selectKeys);
    data.oldKeys = deepCloneObj(res.data);
  } else {
    ElMessage.error(res.desc);
  }
}

const getResources = async () => {
  let res = await get('/resource/getAll');
  if (res.status === 1000) {
    data.treeData = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}
/**
 * 事件
 */
/*
watch(() => tree.value.getCheckedKeys(),
    async(n)=> {
       if(n.length > data.oldKeys){
         let addIds = n.filter(i => data.oldKeys.every(oi => oi !== i))
         let res = await post(`/role/resource/add/${props.id}`,addIds);
         if(res.status === 1000){
           await getKeys();
           tree.value.setCheckedKeys(data.selectKeys);
         }else{
           ElMessage.error(res.desc)
         }
       }else if(n.length < data.oldKeys){
         let delIds = data.oldKeys.filter(i => n.every(oi => oi !== i))
         let res = await post(`/role/resource/del/${props.id}`,delIds);
         if(res.status === 1000){
           await getKeys();
           tree.value.setCheckedKeys(data.selectKeys);
         }else{
           ElMessage.error(res.desc)
         }
       }
     })*/
const handleCheckChange = async (val, val2) => {
}
const check = val => {
  //console.log(val,'aaa')
}

const submit = async () => {
  let checked = tree.value.getCheckedKeys();
  let addIds = checked.filter(i => data.oldKeys.every(oi => oi !== i));
  let delIds = data.oldKeys.filter(i => checked.every(oi => oi !== i));
  let map = new Map();
  map.set('add', addIds)
  map.set('del', delIds);
  if (delIds.length !== 0 || addIds !== 0) {
    let res = await post(`/role/resource/edit/${props.id}`, {add: addIds, del: delIds});
    if (res.status === 1000) {
      emit('update:visible',false);
    } else {
      ElMessage.error(res.desc)
    }
  }else{
    emit('update:visible',false);
  }
}


defineExpose({
  submit
})

const tree = ref(null)

watch(() => data.keyword, (val) => {
  tree.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.resourceName.indexOf(value) !== -1
}

onMounted(async() => {
  await getResources();
  await getKeys();
})
</script>

<style scoped lang='less'>
.body-d {
  padding: 20px;

  .tree {
    height: 300px;
    padding: 20px 40px;
  }
}
</style>