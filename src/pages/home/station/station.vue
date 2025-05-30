<script lang="ts" setup>
import { cloneDeep, concat } from 'lodash-es';
import { defineComponent, onBeforeMount, reactive, ref, UnwrapRef } from 'vue';
import { doSql,whereSql,deleteRows } from '../../../api/axios/axios';
import { Item } from 'ant-design-vue/es/menu';
import moment from 'moment';
import { InputSearch, TableColumnsType, message } from 'ant-design-vue';
import {updatewkstation,addwkstation} from '../../../api/axios/clwkstation/crud'
import { handleResize } from '../../../api/others/function';
import { WhereUrl } from '../../../api/axios/axios.config';
const columns =ref<TableColumnsType>( [
  {
    title: 'UUID',
    dataIndex: 'uuid',
    width: 100,
    resizable: true
  },
  {
    title: '工位名称',
    dataIndex: 'name',
    width: 100,
    minWidth:80,
    resizable: true
  },
  {
    title: '公司',
    dataIndex: 'company_id',
    width: 100,
    minWidth:80,
    resizable: true
  },
  {
    title: '组',
    dataIndex: 'clwkgroup_id',
    width: 100,
    minWidth:80,
    resizable: true
  },
  {
    title: '流水线',
    dataIndex: 'clwkline_id',
    width: 100,
    minWidth:80,
    resizable: true
  },
  {
    title: '创建时间',
    dataIndex: 'utc_create',
    width: 120,
    minWidth:80,
    resizable: true
  },
  {
    title: '修改时间',
    dataIndex: 'utc_update',
    width: 120,
    minWidth:80,
    resizable: true
  },
 
  {
    title: '创建人',
    dataIndex: 'creater',
    width:100,

  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    align: 'center',
    fixed: 'right'
  }
]);

interface DataItem {
  id?:number;
  key: string;
  uuid:string;
  name: string;
  company_id: number;
  clwkgroup_id: number;
  clwkline_id: number;

  utc_create?: string;
  utc_update?: string;
  creater?: string;
  
}
let dataSource = ref<DataItem[]>();
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
onBeforeMount(() => {
  getData(0, pagination.pageSize)

})

const getData = async (offset: number, limit: number) => {
  let rs = await doSql("clwkstation", offset, limit)
  const data: DataItem[] = []
  let tmpdata = rs.data_response.clwkstation
  tmpdata.forEach((item: any) => {
    item.key = item.id
    data.push(item)
  })
  dataSource.value = data
  // console.log(6666,dataSource.value);
}

const add = () => {
  let key: string = Math.random() + 'new'
  let newData: DataItem = {
    key: key,
    uuid:'未填写',
    name: '未命名',
    company_id: 1,
    clwkgroup_id: 1,
    clwkline_id: 1,

    utc_create: moment().format('YYYY-MM-DD HH:mm:SS'),
    utc_update: moment().format('YYYY-MM-DD HH:mm:SS'),
    creater: 'System'
  }
  dataSource.value.push(newData)
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  console.log('Editing data:', editableData[key]);
  console.log('Data source:', dataSource.value);
};
const save = async(key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);

  //保存sql
  if(editableData[key].id){
    let data = {
    id:editableData[key].id,
    uuid:editableData[key].uuid,
    name: editableData[key].name,
    company_id: editableData[key].company_id,
    clwkgroup_id: editableData[key].clwkgroup_id,
    clwkline_id: editableData[key].clwkline_id,

    version:0
  }
  let rs = await updatewkstation(data)
  // console.log(369,rs);
  if(rs.message=='success'){
    message.success("修改成功")
  }
  else{
    message.error("修改失败")
  }
  }
  else{
    let data = {
    uuid:editableData[key].uuid,
    name: editableData[key].name,
    company_id: editableData[key].company_id,
    clwkgroup_id: editableData[key].clwkgroup_id,
    clwkline_id: editableData[key].clwkline_id,

    // version:0
  }
  let rs = await addwkstation(data)
  // console.log(369,rs);
  if(rs.message=='success'){
    message.success("新增成功")
    getData((pagination.current-1)*pagination.pageSize,pagination.pageSize)
  }
  else{
    message.error("新增失败")
  }
  }
 
   
  delete editableData[key];

  
};
const cancel = (key: string) => {
  delete editableData[key];
};
const deleteData = async(key: string) => {
  let drow = dataSource.value.filter(item => key == item.key)
  let rs = await deleteRows('clwkstation',0,10,drow[0].id)
  console.log(rs);
  if(rs.message=='success'){
    message.success('删除成功')
    let data = dataSource.value.filter(item => key !== item.key)
    dataSource.value = data
  }
  else{
    message.error('删除失败')
  }
};

const pagination = reactive({
  current: 1,
  pageSize: 50,
  total: Infinity,
  simple: true
  // disabled:true
})

const changePage = (pageinfo: { current: number, pageSize: number, showQuickJumper: boolean, showSizeChanger: boolean, total: number, }) => {
  // console.log(364, pageinfo);
  if(!keywords.value || keywords.value==''){
    pagination.current = pageinfo.current
    let { current, pageSize } = pageinfo
    getData((current - 1) * pageSize, pageSize)
  }
  else{
    pagination.current = pageinfo.current
    let { current, pageSize } = pageinfo
    getDataWithKey((current - 1) * pageSize, pageSize)
  }
  
}
let keywords = ref<string>('')
const handleSearch = async(words:string)=>{
  keywords.value = words
  if(!words || words==''){
    getData(0, pagination.pageSize)
  }
  else{
    console.log(words);
    getDataWithKey(0,pagination.pageSize)
  }
}

const getDataWithKey = async(offset:number,limit:number)=>{
  let rs = await whereSql('clwkstation',offset,limit,'id asc',`uuid:lk:'${keywords.value}'`)
    const data: DataItem[] = []
    let tmpdata = rs.data_response.clwkstation
    tmpdata.forEach((item: any) => {
      item.key = item.id
      data.push(item)
    })
    dataSource.value = data
}

</script>

<template>
  <div style="background-color:  #007b52;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
    <div style="width: 200px;display: flex;">
      <div style="color: white;line-height: 40px;margin-right: 10px;">工位</div>
      <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
    </div>
    
    <InputSearch style="width: 300px;margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
  </div>
  <a-table :columns="columns" :data-source="dataSource" bordered :pagination="pagination" @change="changePage" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }"
     @resizeColumn="handleResize" style="width: auto;height: auto;">
    <template v-slot:bodyCell="{ column, record, text, index }">
      <template v-if="column.dataIndex == 'operation'">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a @click="save(record.key)">保存</a>
            <a @click="cancel(record.key)">取消</a>
          </span>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
            <a-popconfirm title="确定删除吗" @confirm="deleteData(record.key)" okText="确认" cancelText="取消">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
      <template v-for="col in ['uuid','name', 'company_id', 'clwkgroup_id', 'clwkline_id', 'train_data', 'train_result']">
        <template v-if="col == column.dataIndex">
          <div>
            <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][col]"
              style="margin: -5px 0" />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
