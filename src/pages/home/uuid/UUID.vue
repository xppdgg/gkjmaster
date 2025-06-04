<script setup lang='ts'>
import { InputNumber, PaginationProps, Table, message } from 'ant-design-vue';
import {onBeforeMount, ref,reactive,UnwrapRef} from 'vue'
import { deleteRows, doSql, whereSql } from '../../../api/axios/axios';
import { ColumnsType } from 'ant-design-vue/es/table';
import { ceil, cloneDeep } from 'lodash-es';
import {addUUID,updateUUID} from '../../../api/axios/uuid/crud'
import moment from 'moment';
interface DataItem {
    key:string,
    id?:number,
    name:string,
    uuid:string,
    utc_create:string,
    utc_update:string,
    creater:string

}

let pagination = reactive({
    total:Infinity,
    current:1,
    pageSize:100,
    simple:true
    
})

let dataSource = ref<DataItem[]>();

const columns:ColumnsType = [
  {
    title: 'UUID',
    dataIndex: 'uuid',
    width: 100,
  },
  {
    title: 'UUID名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'utc_create',
    width: 150,
  },
  {
    title: '修改时间',
    dataIndex: 'utc_update',
    width: 150,
  },
  {
    title: '创建者',
    dataIndex: 'creater',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    fixed:'right',
    align:'center'
  },
]

onBeforeMount(()=>{
    getData(0,pagination.pageSize)
})

const getData = async(offset:number,limit:number)=>{
    let rs = await doSql("uuid", offset, limit)
    console.log(655,rs);
    
    const data:DataItem[] = []
    let tmpdata = rs.data_response.uuid
    tmpdata.forEach((item:any)=>{
      item.key = item.id  
      data.push(item)
    })
    // console.log(654,data);
    
    dataSource.value=data
}

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
    let rs = await whereSql('uuid',offset,limit,'id asc',`name:lk:'${keywords.value}'`)
    const data: DataItem[] = []
    let tmpdata = rs.data_response.uuid
    tmpdata.forEach((item: any) => {
      item.key = item.id
      item.isvalid = item.isvalid==true?1:0
      data.push(item)
    })
    dataSource.value = data
}

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const add = ()=>{
  let key:string = Math.random()+'table'
  let newData:DataItem = {
      key:  key,
      name:'未设置',
      uuid:'',
      utc_create:moment().format('YYYY-MM-DD HH:mm:SS'),
      utc_update:moment().format('YYYY-MM-DD HH:mm:SS'),
      creater:'System'
  }
  dataSource.value.push(newData)
  if(dataSource.value.length>=pagination.pageSize){
    pagination.current= pagination.current+1
  }
  
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = async(key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  
  //编辑保存sql
  if(editableData[key].id){
    let data = {
    id:editableData[key].id,
    name: editableData[key].name,
    uuid: editableData[key].uuid,
    version:0
  }
  let rs = await updateUUID(data)
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
    name: editableData[key].name,
    uuid: editableData[key].uuid,
    // version:0
  }
  let rs = await addUUID(data)
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
  let rs = await deleteRows('uuid',0,10,drow[0].id)
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

</script>

<template>
    <div >
      <div style="background-color:  #007b52;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
        <div style="width: 200px;display: flex;">
          <div style="color: white;line-height: 40px;margin-right: 10px;">UUID</div>
          <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
        </div>
        <a-input-search style="width: 300px;margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
      </div>
        <Table :data-source="dataSource" :columns="columns" :pagination="pagination" @change="changePage" 
        :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }">
            <template v-slot:bodyCell="{column, record, text,index}">
            <template v-if="column.dataIndex == 'operation'">
              <div class="ed">
                <span v-if="editableData[record.key]">
                  <a @click="save(record.key)">保存</a>
                  <!-- <a-popconfirm title="确定取消吗" @confirm="cancel(record.key)" okText="确认"> -->
                    <a @click="cancel(record.key)">取消</a>
                  <!-- </a-popconfirm> -->
                </span>
                <span v-else>
                  <a @click="edit(record.key)">编辑</a>
                  <a-popconfirm title="确定删除吗" @confirm="deleteData(record.key)" okText="确认" cancelText="取消">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
            <template v-for="col in ['name', 'uuid']">
                <template v-if="col == column.dataIndex">
                    <div>
                      <a-input
                        v-if="editableData[record.key] && col!='isvalid'"
                        v-model:value="editableData[record.key][col]"
                        style="margin: -5px 0"
                      />
                      <InputNumber v-else-if="editableData[record.key] && col=='isvalid'" 
                        v-model:value="editableData[record.key][col]"
                        min="0" max="1" placeholder="1为是,0为否"/>
                      <template v-else>
                        {{ text }}
                      </template>
                    </div>
                </template>
            </template>
        </template>
        </Table>
    </div>
</template>

<style lang='scss' scoped>
 .ed a {
   margin-right: 8px;
 }
</style>