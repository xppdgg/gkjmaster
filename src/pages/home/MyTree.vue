<template>
  <a-tree  v-model:selectedKeys="selectedKeys" v-model:checkedKeys="checkedKeys" @select="handleSelect"
   :tree-data="treeData" showLine  :defaultExpandAll="defaultExpandAll" style="font-size: 13px;height: 100%;" >
    <template #title="{ title, key }">
      <span v-if="key === selectedKeys[0]" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import type { TreeProps } from 'ant-design-vue';
import { doSql } from '../../api/axios/axios';
import {tree} from './treedata'
import { DataNode } from 'ant-design-vue/es/tree';
import router from '../../router/index'
let treeData = ref<DataNode[]>();
const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const defaultExpandAll = ref<boolean>(true)
const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const props = defineProps({
  changeKey:Function,
})
const emits = defineEmits(['menukey']);
const recursive = (node:DataNode)=>{
    // console.log(789,node);
    node.parent={parent:node.parent}
    node.key=(((1+Math.random())*0x1000000)|0).toString(16).substring(1); 
    if(node.children){
        for(let i=0;i<node.children.length;i++){
            recursive(node.children[i])
        }
    }
}

const handleSelect = (selectedKeys:any,e:any)=>{
  let uuid = selectedKeys[0]
  let {node} = e;
  console.log(3366,node);
  
  if(node.title.indexOf("传感器")>=0){
    console.log(63,'传感器');  
    props.changeKey?props.changeKey(["2"],node.uuid)  :null
  }
  else if(node.title.indexOf("摄像头")>=0){
    console.log(36,'摄像头');
    props.changeKey?props.changeKey(["3"],node.uuid)  :null
  }
  
  
}
watch(expandedKeys, () => {
  // console.log('expandedKeys', expandedKeys);
});
// watch(selectedKeys, (NowSelectKeys,beforeSelectKeys) => {
//   // console.log('selectedKeys', selectedKeys);  
// });


const getTree = async () => { 
  let rs = await doSql("clwkgroup", 0, 20)
  let clwkgroup = rs.data_response.clwkgroup  
  // console.log(999,clwkgroup[clwkgroup.length-1]);
  let data:DataNode[]=[]
  
  clwkgroup.map((item: any) => {
    let ancestor:DataNode={key:1,title:'',children:[]}
    ancestor.key=item.id
    ancestor.title = item.name   
    item.str_g0=item.str_g0.replace(/\s*/g, "");
    let treedata = JSON.parse(item.str_g0)
    
    for(let x in treedata){
      recursive(treedata[x])
      ancestor.children?.push(treedata[x])
    }
    
    data.push(ancestor)
  })
  // console.log(147,data);
  
  treeData.value=data
  // console.log(data);
  
}

onBeforeMount(() => {
  getTree()
})

// watch(
//   () => treedata,
//   () => {
//     console.log(treedata);

//   },
//   { deep: true }
// )

</script>
  
  

