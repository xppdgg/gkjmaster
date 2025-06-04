<script setup lang='ts'>
import { InputNumber, PaginationProps, Select, SelectProps, Table, message } from 'ant-design-vue';
import {onBeforeMount, ref,reactive,UnwrapRef} from 'vue'
import { deleteRows, doSql } from '../../../api/axios/axios';
import { ColumnsType } from 'ant-design-vue/es/table';
import { cloneDeep } from 'lodash-es';
import { handleResize } from '../../../api/others/function';
import { addDataConf, getDataConf, getDataWhere, updateDataConf } from '../../../api/axios/cldataconf/crud'
import moment from 'moment';
import { userInfomation } from '../../../store/userinfo';

interface DataItem {
    key:string,
    id?:number,
    sensoruuid:string,
    name:string,
    param:string,
    web_param:string,
    clmodel_id?:number,
    model?:any,
    cl_store_freq:string,
    local_store_freq:string,
    isvalid:number,
    cltable:string,
    edtable:string,
    utc_create:string,
    utc_update:string,
    creater:string

}
const userii = userInfomation()
let pagination = reactive({
    total:Infinity,
    current:1,
    pageSize:50,
    simple:true
    
})

let dataSource = ref<DataItem[]>();
let modelOptions = ref([])
const columns= ref<ColumnsType>([
  {
    title: 'UUID',
    dataIndex: 'sensoruuid',
    width: 140,
    resizable:true
  },
  {
    title: '配置名称',
    dataIndex: 'name',
    ellipsis:true,
    width: 100,
    resizable:true
  },
  {
    title: '配置参数',
    dataIndex: 'param',
    width: 100,
    resizable:true
  },
  {
    title: '网络参数',
    dataIndex: 'web_param',
    width: 100,
    resizable:true
  },
  {
    title: '训练模型',
    dataIndex: 'model',
    width: 100,
    ellipsis:true,
    resizable:true
  },
  {
    title: '云保存频率',
    dataIndex: 'cl_store_freq',
    width: 100,
    resizable:true
  },
  {
    title: '边缘保存频率',
    dataIndex: 'local_store_freq',
    width: 100,
    resizable:true
  },
  {
    title: '是否有效',
    dataIndex: 'isvalid',
    width: 100,
    resizable:true
  },
  {
    title: '云存储表',
    dataIndex: 'cltable',
    width: 150,
    resizable:true
  },
  {
    title: '本地存储表',
    dataIndex: 'edtable',
    width: 160,
    resizable:true
  },
  // {
  //   title: '公司',
  //   dataIndex: 'company_id',
  //   width: 100,
  //   resizable:true
  // },
  // {
  //   title: '车间',
  //   dataIndex: 'clwkgroup_id',
  //   width: 100,
  //   resizable:true
  // },
  // {
  //   title: '生产线',
  //   dataIndex: 'clwkline_id',
  //   width: 100,
  //   resizable:true
  // },
  // {
  //   title: '单元',
  //   dataIndex: 'clwkdanyuan_id',
  //   width: 100,
  //   resizable:true
  // },
  {
    title: '创建时间',
    dataIndex: 'utc_create',
    width: 160,
    resizable:true
  },
  {
    title: '修改时间',
    dataIndex: 'utc_update',
    width: 160,
    resizable:true
  },
  {
    title: '创建者',
    dataIndex: 'creater',
    width: 100,
    resizable:true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
    fixed:'right',
    align:'center'
  },
])

onBeforeMount(()=>{
    getData(0,pagination.pageSize)
    getModels()
})

const getData = async(offset:number,limit:number)=>{
    let rs = await getDataConf(offset,limit)
    const data:DataItem[] = []
    // console.log(456,rs);
    let tmpdata = rs.data_response.cldataconf
    tmpdata.forEach((item:any)=>{
      item.cldataconf.key = item.cldataconf.id
      item.cldataconf.model = item.clmodel
      item.cldataconf.isvalid = item.cldataconf.isvalid==true?1:0
      data.push(item.cldataconf)
    })
    dataSource.value=data
}

const getModels = async()=>{
    let rs = await doSql('clmodel',0,100)
    let tmpdata = rs.data_response.clmodel
    tmpdata.forEach((item:any)=>{
        item.value = item.id
        item.label = item.name        
        modelOptions.value.push(item)
    })

    console.log(777,modelOptions.value);
    

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
    let rs = await getDataWhere(offset,limit,`name:lk:'${keywords.value}'`)
    const data: DataItem[] = []
    let tmpdata = rs.data_response.cldataconf
    tmpdata.forEach((item:any)=>{
      item.cldataconf.key = item.cldataconf.id
      item.cldataconf.model = item.clmodel
      item.cldataconf.isvalid = item.cldataconf.isvalid==true?1:0
      data.push(item.cldataconf)
    })
    dataSource.value = data
}

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const add = ()=>{
  let key: string = Math.random() + 'new'
  let newData: DataItem = {
    key: key,
    sensoruuid:'未填写',
    name: '未命名',
    param: '未设置',
    web_param:'未设置',
    clmodel_id:1,
    // model:modelOptions.value[0],
    cl_store_freq: '未填写',
    local_store_freq: '未填写',
    isvalid:1,
    cltable:'无',
    edtable:'无',
    utc_create: moment().format('YYYY-MM-DD HH:mm:SS'),
    utc_update: moment().format('YYYY-MM-DD HH:mm:SS'),
    creater: 'System'
  }
  dataSource.value.push(newData)
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  console.log(321,editableData[key]);
  
};
const save = async(key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  
  editableData[key].model = modelOptions.value.filter(item => editableData[key].clmodel_id===item.id)
  
  //编辑保存sql
  if(editableData[key].id){
    let data = {
      id:editableData[key].id,
      sensoruuid:editableData[key].sensoruuid,
      name: editableData[key].name,
      param: editableData[key].param,
      web_param:editableData[key].web_param,
      clmodel_id:editableData[key].clmodel_id,
      cl_store_freq: editableData[key].cl_store_freq,
      local_store_freq: editableData[key].local_store_freq,
      isvalid:editableData[key].isvalid,
      cltable:editableData[key].cltable,
      edtable:editableData[key].edtable,
      version:0
    }
    let rs = await updateDataConf(data)
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
      sensoruuid:editableData[key].sensoruuid,
      name: editableData[key].name,
      param: editableData[key].param,
      web_param:editableData[key].web_param,
      clmodel_id:editableData[key].clmodel_id,
      cl_store_freq: editableData[key].cl_store_freq,
      local_store_freq: editableData[key].local_store_freq,
      isvalid:editableData[key].isvalid,
      cltable:editableData[key].cltable,
      edtable:editableData[key].edtable,
      company_id:userii.companyid,
      clwkgroup_id:userii.clwkgroup_id,
      clwkline_id:userii.clwkline_id,
      clwkdanyuan_id:userii.clwkdanyuan_id
    }
    let postData = {}
    for(let key in data){
      if(data[key]!=null){
        postData[key]=data[key]
      }
    }

    let rs = await addDataConf(postData)
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
  let rs = await deleteRows('cldataconf',0,10,drow[0].id)
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
          <div style="color: white;line-height: 40px;margin-right: 10px;">系统设置</div>
          <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
        </div>
        <a-input-search style="width: 300px;margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
      </div>
        <Table :data-source="dataSource" :columns="columns" :pagination="pagination" @change="changePage" :scroll="{ x: 2100, y: 'calc(100vh - 223px)' }"
          @resize-column="handleResize" bordered>
            <template v-slot:bodyCell="{column, record, text,index}">
            <!-- <template v-if="column.dataIndex == 'model'">
                {{ text.name }}
            </template> -->
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
            <template v-for="col in ['sensoruuid', 'name','param','web_param','model','cl_store_freq','local_store_freq','bz1','isvalid','cltable','edtable']">
                <template v-if="col == column.dataIndex">
                    <div>
                      <a-input
                        v-if="editableData[record.key] && col!='model' && col!='isvalid'"
                        v-model:value="editableData[record.key][col]"
                        style="margin: -5px 0"
                      />
                      <Select v-else-if="editableData[record.key] && col=='model'" 
                        v-model:value="editableData[record.key].clmodel_id"  :options="modelOptions" placeholder="请点击选择"></Select>
                      <InputNumber v-else-if="editableData[record.key] && col=='isvalid'" v-model:value="editableData[record.key][col]" 
                        min="0" max="1" placeholder="1为是,0为否" />
                      <template v-else-if="!editableData[record.key] && col == 'model'">
                        {{ modelOptions.filter((item)=>item.id == record.clmodel_id)[0]?.name }}
                      </template>
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