<script setup lang='ts'>
import { PaginationProps, Table, TableColumnsType, message, InputNumber } from 'ant-design-vue';
import {onBeforeMount, ref,reactive,UnwrapRef} from 'vue'
import { deleteRows, doSql, whereSql } from '../../../api/axios/axios';
import { ColumnsType } from 'ant-design-vue/es/table';
import { cloneDeep } from 'lodash-es';
import {} from '../../../api/axios/clwksensor/crud'
import {updateSensor,addSensor} from '../../../api/axios/clwksensor/crud'
import { handleResize } from '../../../api/others/function';
import moment from 'moment';

interface DataItem {
    key:string,
    id?:number,
    uuid:string,
    name:string,
    datafrom:string,
    datamean:string,
    datatype:string,
    ip:string,
    port:number,
    bz1:string,
    company_id:number,
    clwkgroup_id:number,
    clwkline_id:number,
    clwkdanyuan_id:number,
    utc_create:string,
    utc_update:string,
    creater:string
}

let pagination = reactive({
    total:Infinity,
    current:1,
    pageSize:50,
    simple:true
})

let dataSource = ref<DataItem[]>();

const columns = ref<TableColumnsType>([
  {
    title: 'UUID',
    dataIndex: 'uuid',
    width: 120,
    resizable:true
  },
  {
    title: '传感器名称',
    dataIndex: 'name',
    width: 100,
    ellipsis: true,
    resizable:true
  },
  {
    title: '放置单位',
    dataIndex: 'datafrom',
    width: 100,
    resizable:true
  },
  {
    title: '输出数据含义',
    dataIndex: 'datamean',
    width: 120,
    resizable:true
  },
  {
    title: '数据类型',
    dataIndex: 'datatype',
    width: 120,
    resizable:true
  },
  {
    title: 'ip号',
    dataIndex: 'ip',
    width: 120,
    resizable:true
  },
  {
    title: '端口',
    dataIndex: 'port',
    width: 100,
    resizable:true
  },
  {
    title: '输出类型',
    dataIndex: 'bz1',
    width: 100,
    resizable:true
  },
  {
    title: '公司',
    dataIndex: 'company_id',
    width: 100,
    resizable:true
  },
  {
    title: '分组',
    dataIndex: 'clwkgroup_id',
    width: 100,
    resizable:true
  },
  {
    title: '线路',
    dataIndex: 'clwkline_id',
    width: 100,
    resizable:true
  },
  {
    title: '单元',
    dataIndex: 'clwkdanyuan_id',
    width: 100,
    resizable:true
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
    width: 140,
    fixed:'right',
    align:'center'
  },
])

onBeforeMount(()=>{
    getData(0,pagination.pageSize)
})

const getData = async(offset:number,limit:number)=>{
    let rs = await doSql("clwksensor", offset, limit)
    const data:DataItem[] = []
    console.log(456,rs);
    let tmpdata = rs.data_response.clwksensor
    tmpdata.forEach((item:any)=>{
      item.key = item.id  
      data.push(item)
    })
    dataSource.value=data
}

const changePage = (pageinfo: { current: number, pageSize: number, showQuickJumper: boolean, showSizeChanger: boolean, total: number, }) => {
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
  let rs = await whereSql('clwksensor',offset,limit,'id asc',`name:lk:'${keywords.value}'`)
    const data: DataItem[] = []
    let tmpdata = rs.data_response.clwksensor
    tmpdata.forEach((item: any) => {
      item.key = item.id
      data.push(item)
    })
    dataSource.value = data
}

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const add = ()=>{
  let key: string = Math.random() + 'new'
  let newData: DataItem = {
    key: key,
    uuid:'未填写',
    name: '未命名',
    datafrom: '未设置',
    datamean: '未设置',
    datatype: '未设置',
    ip: '未填写',
    port: 0,
    bz1:'未填写',
    company_id: 1,
    clwkgroup_id: 1,
    clwkline_id: 1,
    clwkdanyuan_id: 1,
    utc_create: moment().format('YYYY-MM-DD HH:mm:SS'),
    utc_update: moment().format('YYYY-MM-DD HH:mm:SS'),
    creater: 'System'
  }
  dataSource.value.push(newData)
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const save = async(key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  
  if(editableData[key].id){
    let data = {
      id:editableData[key].id,
      uuid:editableData[key].uuid,
      name: editableData[key].name,
      datafrom:editableData[key].datafrom,
      datamean:editableData[key].datamean,
      datatype:editableData[key].datatype,
      ip: editableData[key].ip,
      port: editableData[key].port,
      bz1:editableData[key].bz1,
      company_id: editableData[key].company_id,
      clwkgroup_id: editableData[key].clwkgroup_id,
      clwkline_id: editableData[key].clwkline_id,
      clwkdanyuan_id: editableData[key].clwkdanyuan_id,
      version:0
    }
    let rs = await updateSensor(data)
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
      datafrom:editableData[key].datafrom,
      datamean:editableData[key].datamean,
      datatype:editableData[key].datatype,
      ip: editableData[key].ip,
      port: editableData[key].port,
      bz1:editableData[key].bz1,
      company_id: editableData[key].company_id,
      clwkgroup_id: editableData[key].clwkgroup_id,
      clwkline_id: editableData[key].clwkline_id,
      clwkdanyuan_id: editableData[key].clwkdanyuan_id
    }
    let rs = await addSensor(data)
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
  let rs = await deleteRows('clwksensor',0,10,drow[0].id)
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
    <div>
      <div style="background-color:  #007b52;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
        <div style="width: 200px;display: flex;">
          <div style="color: white;line-height: 40px;margin-right: 10px;">传感器</div>
          <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
        </div>
        <a-input-search style="width: 300px;margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
      </div>
        <Table :data-source="dataSource" :columns="columns" :pagination="pagination" @change="changePage" :scroll="{ x: 1700, y: 'calc(100vh - 223px)' }" 
          @resize-column="handleResize">
            <template v-slot:bodyCell="{column, record, text,index}">
            <template v-if="column.dataIndex == 'operation'">
              <div class="ed">
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
            <template v-for="col in ['uuid', 'name', 'datafrom','datamean','datatype','ip','port','bz1','company_id','clwkgroup_id','clwkline_id','clwkdanyuan_id']">
                <template v-if="col == column.dataIndex">
                    <div>
                      <a-input
                        v-if="editableData[record.key] && !['company_id','clwkgroup_id','clwkline_id','clwkdanyuan_id'].includes(col)"
                        v-model:value="editableData[record.key][col]"
                        style="margin: -5px 0"
                      />
                      <InputNumber 
                        v-else-if="editableData[record.key] && ['company_id','clwkgroup_id','clwkline_id','clwkdanyuan_id'].includes(col)"
                        v-model:value="editableData[record.key][col]"
                        style="width: auto;margin: -5px 0"
                      />
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
  .ed a{
    margin-right: 8px;
  }
</style>
