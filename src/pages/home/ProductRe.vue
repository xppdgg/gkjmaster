<template>
  <div style="background-color:  #3b8f73;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
     <div style="width: 200px;display: flex;">
      <div style="color: white;line-height: 40px;margin-right: 10px;">产品记录</div>
      <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="()=>{visible = true}">新增</a-button>
    </div>
    <a-input-search style="width: 300px;margin-top: 3px;" placeholder="input search text" enter-button />
  </div>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }" :pagination="pagination"
    @change="changePage"
  >
    <template v-slot:bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex == 'action'">
        <span style="">
          <!-- <a-button type="primary" :disabled="userii.roleid != 3 ? false : true" >开始</a-button> -->
          <a-button :disabled="userii.roleid != 3 ? false : true" @click="()=>{updateProductEndTime(record)}">结束</a-button>
        </span>
      </template>
      <template v-if="column.dataIndex == 'operation'">
        <span style="display: flex;justify-content: space-around;">
          <a-button type="primary" :disabled="userii.roleid != 3 ? false : true" @click="()=>{visible1 = true;selectRow=record
          }">修改</a-button>
          <a-button danger :disabled="userii.roleid != 3 ? false : true" :onclick="()=>deleteData(record.key)">删除</a-button>
        </span>
      </template>
      <template v-if="column.dataIndex == 'uuid'">
          <span>{{ getuuidName(record) }}</span>
      </template>
    </template>
    <template v-slot:headerCell="{ column, record, index }">
      <template v-if="column.key == 'action'">
        <span><a>{{ column.title }}</a></span>
      </template>
      <template v-if="column.key == 'operation'">
        <span><a>{{ column.title }}</a></span>
      </template>
    </template>
  </a-table>
  <a-modal title="增加产品记录" v-model:open="visible" @ok="() => { addProduct }" :footer="[]" wrapClassName="full-modal">
      <AddProForm :uuids="uuids" @getData="getData"></AddProForm>  
      <!-- 刷新数据需要用到传子函数 -->
    </a-modal>
    <a-modal title="修改产品记录" v-model:open="visible1" @ok="() => { updateProduct }" :footer="[]" wrapClassName="full-modal">
       <UpdateProForm :uuids="uuids" :selectRow="selectRow" v-if="visible1 == true" @getData="getData"></UpdateProForm>
    </a-modal>
</template>
<script lang="ts" setup>
import { message, version, type Select, type TableColumnsType } from 'ant-design-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { deleteRows, doSql, orderSql, updateProductSql, whereSql } from '../../api/axios/axios'
import { userInfomation } from '../../store/userinfo'
import AddProForm from '../../components/productRecord/AddProForm.vue'
import UpdateProForm from '../../components/productRecord/UpdateProForm.vue'
import moment from 'moment';
const columns: TableColumnsType = [
  { title: '产品名称', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: '产品条码', width: 100, dataIndex: 'code', key: 'code', fixed: 'left' },
  { title: '订单号', width: 100, dataIndex: 'str2', key: 'str2', fixed: 'left' },
  { title: '岗位', dataIndex: 'uuid', key: 'uuid', width: 150 },
  { title: '开始时间', dataIndex: 'utc_create', key: 'utc_create', width: 150 },
  { title: '结束时间', dataIndex: 'tm0', key: 'utc_end', width: 150 },
  { title: '合格数量', dataIndex: 'int_g0', key: 'int_g0', width: 150 },
  { title: '异常数量', dataIndex: 'int_g1', key: 'int_g1', width: 150 },
  { title: '校对合格数量', dataIndex: 'int_g2', key: 'int_g2', width: 150 },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    align:'center',
    width: 100,
  },
  {
    title: '删改',
    key: 'operation',
    dataIndex: 'operation',
    fixed: 'right',
    align:'center',
    width: 180,
  }
];
const userii = userInfomation();
let data = ref([])
const visible = ref<boolean>(false)
const visible1 = ref<boolean>(false)
const uuids = ref<[]>([]);
const selectRow = ref<any>()
const getuuids = async () => {
  let rs = await doSql("uuid", 0, 100)
  console.log(rs);
  uuids.value = rs.data_response.uuid
}
const getuuidName = (record:any)=>{
  let name = ''
  uuids.value.map((item:any)=>{
      if(item.uuid==record.uuid){
        name = item.name
      }
  })
  return name
}
const getData = async (offset:number,limit:number) => {
  let rs = await whereSql("clproductrecord", offset, limit, "id desc",`int0:eq:${userii.userid}`)
  // console.log(999, rs);
  data.value = rs.data_response.clproductrecord
}

const updateProductEndTime = async(data:any)=>{
    let d ={
      id:data.id,
      name:data.name,
      tm0:moment().format('YYYY-MM-DD HH:mm:ss'),
      version:0
    }
    // console.log(44,d);
    let rs = await updateProductSql(d)
    if(rs.message=='success'){
      message.success('结束成功')
      getData(0,10)
    }
    else{
      message.error('结束失败')
    }
}

const addProduct = async () => {
  visible.value = !visible.value
}
const updateProduct =async () => {
  visible1.value = !visible1.value
}
watch(
  () => data,
  () => {
    console.log(111, data);

  },
  { deep: true }
)

onBeforeMount(() => {
  //获取产品数据
  getData(0,10)

  //
  getuuids()
})

const deleteData = async(key: string) => {
  let drow = data.value.filter(item => key == item.key)
  let rs = await deleteRows('clproductrecord',0,10,drow[0].id)
  console.log(rs);
  if(rs.message=='success'){
    message.success('删除成功')
    let data1 = data.value.filter(item => item.id != drow[0].id)
    console.log(666,data1);
    
    data.value = data1
  }
  else{
    message.error('删除失败')
  }
};

const pagination = ref({
    total: Infinity,
    // showTotal: () => `共 ${} 条`,
    showSizeChanger:false,
    pageSize:10,
    showQuickJumper:true,
    simple:true
})

const changePage = (pageinfo:{current:number, pageSize: number,showQuickJumper:boolean,showSizeChanger:boolean,total: number,})=>{
    console.log(987,pageinfo);
    let {current,pageSize} = pageinfo
    getData((current-1)*10,pageSize)
}

</script>
  
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 600px;
    top: 20px;
    padding: 0;
  }

  .ant-modal-content {
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    height: calc(90vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>
    