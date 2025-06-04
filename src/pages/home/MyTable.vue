<template>
  <div style="background-color: #3b8f73;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
    <a-select ref="select" v-model:value="value1" style="width: 120px;top: 3px" >
      <a-select-option value=0>查看自己</a-select-option>
      <a-select-option value=1>查看全部</a-select-option>
    </a-select>
    <a-input-search style="width: 300px;margin-top: 3px;" 
      placeholder="input search text"
      enter-button
    />
  </div>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }" :pagination="pagination"
    @change="changePage"
  >
    <template v-slot:bodyCell="{column,record,index}">
          <template v-if="record.tm0 && column.key=='utc_create' && (record['int0']==5)">
            <span>---</span>
          </template>
          <template v-if="record.tm0 && column.key=='tm0' && (record['int0']==1 || record['int0']==0)">
            <span>---</span>
          </template>
          <template v-if="column.key=='int0'">
            <span v-if="record[column.key]==0">
                登陆
            </span>
            <span v-else-if="record[column.key]==1">
                上岗
            </span>
            <span v-else-if="record[column.key]==5">
                登出
            </span>
          </template>
    </template>
        
  </a-table>
</template>
<script lang="ts" setup>
import { message, type Select, type TableColumnsType } from 'ant-design-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { doSql, whereSql,orderSql } from '../../api/axios/axios'
import { userInfomation } from '../../store/userinfo'
const columns: TableColumnsType = [
  { title: '姓名', width: 100, dataIndex: 'nickname', key: 'nickname', fixed: 'left' },
  // { title: '角色', width: 100, dataIndex: 'rolename', key: 'rolename', fixed: 'left' },
  { title: '岗位', dataIndex: 'uuidName', key: 'uuidName', width: 150 },
  { title: '动作', dataIndex: 'int0', key: 'int0', width: 100 },
  { title: '开始时间', dataIndex: 'utc_create', key: 'utc_create', width: 150 },
  { title: '结束时间', dataIndex: 'tm0', key: 'tm0', width: 150 },
  // {
  //   title: '操作',
  //   key: 'operation',
  //   fixed: 'right',
  //   width: 100,
  // },
];
const userii = userInfomation();
let data = ref([])
let value1 = ref<string>('0')
const getData = async (offset:number,limit:number) => {
  let reqU:string=`logid:eq:${userii.userid}`;
  console.log(369,userii);
  
  if(userii?.clwkdanyuan_id!=null){  
    reqU = `logid:eq:${userii.userid}&where=clwkline_id:eq:${userii.clwkdanyuan_id}`
  }
  else if(userii?.clwkline_id!=null){
    reqU = `logid:eq:${userii.userid}&where=clwkline_id:eq:${userii.clwkline_id}`
  }
  let rs = await whereSql("cluserrecord", offset, limit, "id desc", reqU)
  let tmpdata = rs.data_response.cluserrecord
  tmpdata.forEach((item: any) => {
    item.nickname = userii.nickname
    item.rolename = userii.rolename
    item.uuidName = userii.uuidName
    item.key = item.id
  })
  // console.log(tmpdata);

  data.value = tmpdata
}

const getAllData =async (offset:number,limit:number)=>{
  //查看所有请求
  let reqU:string=`logid:eq:${userii.userid}`;
  if(userii?.clwkdanyuan_id && userii?.clwkdanyuan_id!=null){
    reqU = `clwkline_id:eq:${userii.clwkdanyuan_id}`
  }
  else if(userii?.clwkline_id && userii?.clwkline_id!=null){
    reqU = `clwkline_id:eq:${userii.clwkline_id}`
  }
  let rs = await whereSql("cluserrecord",offset,limit,"id desc",`clwkline_id:eq:${userii.clwkline_id}`)
  let tmpdata = rs.data_response.cluserrecord
  tmpdata.forEach((item: any) => {
    item.nickname = userii.nickname
    item.rolename = userii.rolename
    item.uuidName = userii.uuidName
    item.key = item.id
  })
  // console.log(tmpdata);

  data.value = tmpdata
  
}

watch(
  () => data,
  () => {
    console.log(777,data);

  },
  { deep: true }
)

watch(value1, () => {
  // console.log('value1', value1);
  //看自己时
  if(value1.value=='0'){
    getData(0,10)
  }else if(value1.value=='1'){
    if(userii.roleid==2||1){  
    //看全部时（根据roleid来判断有无资格，无资格就alert）
  
      getAllData(0,10)
    }
    else{
      message.error("无权访问")
    }
    
  }
  
});

onBeforeMount(() => {
  //将自己的数据查看
  getData(0,10)
})

//分页
const changePage = (pageinfo:{current:number, pageSize: number,showQuickJumper:boolean,showSizeChanger:boolean,total: number,})=>{
    // console.log(987,pageinfo);
    let {current,pageSize} = pageinfo
    if(value1.value=='0'){
    getData((current-1)*pageSize,pageSize)
  }else if(value1.value=='1'){
    if(userii.roleid==2||1){  
    //看全部时（根据roleid来判断有无资格，无资格就alert）
      getAllData((current-1)*10,pageSize)
    }
}
}
const pagination = ref({
    total: Infinity,
    // showTotal: () => `共 ${} 条`,
    showSizeChanger:false,
    pageSize:10,
    showQuickJumper:true,
    simple:true
})


</script>
  
  