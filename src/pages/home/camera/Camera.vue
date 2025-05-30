<script setup lang='ts'>
import { PaginationProps, Table, TableColumnType, TableColumnsType,InputNumber, message } from 'ant-design-vue';
import {onBeforeMount, ref,reactive,UnwrapRef} from 'vue'
import { deleteRows, doSql, whereSql } from '../../../api/axios/axios';
import { ColumnsType } from 'ant-design-vue/es/table';
import { cloneDeep } from 'lodash-es';
import { handleResize } from '../../../api/others/function';
import moment from 'moment';
import {addCamera, updateCamera} from '../../../api/axios/clwkcamara/crud'
interface DataItem {
    key:string,
    id?:number,
    uuid:string,
    name:string,
    datafrom:string,
    datamean:string,
    param:string,
    company_id:number,
    clwkgroup_id:number,
    clwkline_id:number,
    clwkdanyuan_id:number,
    datatype:string,
    islast:number,
    utc_create?:string,
    utc_update?:string,
    creater?:string

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
    width: 100,
    resizable:true
  },
  {
    title: '摄像头名称',
    dataIndex: 'name',
    width: 120,
    resizable:true
  },
  {
    title: '数据来源',
    dataIndex: 'datafrom',
    width: 100,
    resizable:true
  },
  {
    title: '数据意义',
    dataIndex: 'datamean',
    width: 100,
    resizable:true
  },
  {
    title: '参数',
    dataIndex: 'param',
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
    title: '数据类型',
    dataIndex: 'datatype',
    width: 100,
    resizable:true
  },
  {
    title: '是否最后',
    dataIndex: 'islast',
    width: 100,
    resizable:true
  },
  {
    title: '创建时间',
    dataIndex: 'utc_create',
    width: 150,
    resizable:true
  },
  {
    title: '修改时间',
    dataIndex: 'utc_update',
    width: 150,
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
    width: 120,
    fixed:'right',
    align:'center'
  },
])

onBeforeMount(()=>{
    getData(0,pagination.pageSize)
})

const getData = async(offset:number,limit:number)=>{
    let rs = await doSql("clwkcamara", offset, limit)
    const data:DataItem[] = []
    console.log(456,rs);
    let tmpdata = rs.data_response.clwkcamara
    tmpdata.forEach((item:any)=>{
      item.key = item.id
      if(item.islast){
        item.islast = item.islast == true?1:0   
      }
      
      data.push(item)
    })
    dataSource.value=data
    console.log(963,data);
    
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
  let rs = await whereSql('clwkcamara',offset,limit,'id asc',`name:lk:'${keywords.value}'`)
    const data: DataItem[] = []
    let tmpdata = rs.data_response.clwkcamara
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
    datafrom:'未设置',
    datamean:'未设置',
    param: '未设置',
    company_id:1,
    datatype:'未设置',
    clwkgroup_id:1,
    clwkline_id:1,
    clwkdanyuan_id:1,
    islast:0,
    utc_create: moment().format('YYYY-MM-DD HH:mm:SS'),
    utc_update: moment().format('YYYY-MM-DD HH:mm:SS'),
    creater: 'System'
  }
  dataSource.value.push(newData)
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
//   console.log(321,editableData[key]);
  
};
const save = async(key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  //编辑保存sql
  if(editableData[key].id){
    let data = {
    id:editableData[key].id,
    uuid:editableData[key].uuid,
    name: editableData[key].name,
    datafrom: editableData[key].datafrom,
    datamean: editableData[key].datamean,
    param: editableData[key].param,
    datatype: editableData[key].datatype,
    company_id:editableData[key].company_id,
    clwkgroup_id:editableData[key].clwkgroup_id,
    clwkline_id:editableData[key].clwkline_id,
    clwkdanyuan_id:editableData[key].clwkdanyuan_id,
    islast:editableData[key].islast,
      version:0
    }
    const loading = message.loading('正在更新摄像头...', 0)
    try {
      let rs = await updateCamera(data)
      loading()
      if(rs.message=='success'){
        message.success("保存成功")
      } else {
        message.error(`保存失败: ${rs.message || '未知错误'}`)
      }
    } catch (error) {
      loading()
      console.error('更新摄像头错误:', error)
      
      // 提取更友好的错误消息
      let errorMsg = error.message
      if (errorMsg.includes('HTTP 500')) {
        errorMsg = '服务器内部错误，请联系管理员'
      } else if (errorMsg.includes('缺少必填字段')) {
        errorMsg = '请填写所有必填字段'
      } else if (errorMsg.includes('timeout')) {
        errorMsg = '请求超时，请检查网络连接'
      }
      
      message.error(`保存失败: ${errorMsg}`)
    }
  }
  else{
    let data = {
    uuid:editableData[key].uuid,
    name: editableData[key].name,
    datafrom: editableData[key].datafrom,
    datamean: editableData[key].datamean,
    param: editableData[key].param,
    datatype: editableData[key].datatype,
    islast:editableData[key].islast,
    company_id:editableData[key].company_id,
    clwkgroup_id:editableData[key].clwkgroup_id,
    clwkline_id:editableData[key].clwkline_id,
    clwkdanyuan_id:editableData[key].clwkdanyuan_id,
      version:0
    }
    const loading = message.loading('正在添加摄像头...', 0)
    try {
      let rs = await addCamera(data)
      loading()
      if(rs.message=='success'){
        message.success("新增成功")
        getData((pagination.current-1)*pagination.pageSize,pagination.pageSize)
      } else {
        message.error(`新增失败: ${rs.message || '未知错误'}`)
      }
    } catch (error) {
      loading()
      console.error('添加摄像头错误:', error)
      
      // 提取更友好的错误消息
      let errorMsg = error.message
      if (errorMsg.includes('HTTP 500')) {
        errorMsg = '服务器内部错误，请联系管理员'
      } else if (errorMsg.includes('缺少必填字段')) {
        errorMsg = '请填写所有必填字段'
      } else if (errorMsg.includes('timeout')) {
        errorMsg = '请求超时，请检查网络连接'
      }
      
      message.error(`新增失败: ${errorMsg}`)
    }
  }
  
  
  delete editableData[key];

};

const cancel = (key: string) => {
  delete editableData[key];
};
const deleteData = async(key: string) => {
  let drow = dataSource.value.filter(item => key == item.key)
  if(!drow[0]?.id) {
    message.error('无法删除：缺少ID');
    return;
  }
  try {
    let rs = await deleteRows('clwkcamara',0,10,drow[0].id)
    console.log(rs);
    if(rs.message=='success'){
      message.success('删除成功')
      let data = dataSource.value.filter(item => key !== item.key)
      dataSource.value = data
    }
    else{
      message.error('删除失败')
    }
  } catch (error) {
    console.error(error);
    message.error(`删除失败: ${error.message}`);
  }
};

</script>

<template>
    <div>
      <div style="background-color:  #007b52;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
        <div style="width: 200px;display: flex;">
          <div style="color: white;line-height: 40px;margin-right: 10px;">摄像头</div>
          <a-button style="width: 80px;margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
        </div>
        <a-input-search style="width: 300px;margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
      </div>
        <Table :data-source="dataSource" :columns="columns" :pagination="pagination" @change="changePage" :scroll="{ x: 1700, y: 'calc(100vh - 223px)' }"
          @resize-column="handleResize">
            <template v-slot:bodyCell="{column, record, text,index}">
            <template v-if="column.dataIndex == 'operation'">
              <div class="editable-row-operations">
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
            <template v-for="col in ['uuid','name', 'datafrom', 'datamean','param','company_id','clwkgroup_id','clwkline_id','clwkdanyuan_id','datatype','islast']">
                <template v-if="col == column.dataIndex">
                    <div>
                      <a-input
                        v-if="editableData[record.key] && col!=='islast' && col!=='company_id' && col!=='clwkgroup_id' && col!=='clwkline_id' && col!=='clwkdanyuan_id'"
                        v-model:value="editableData[record.key][col]"
                        style="margin: -5px 0"
                      />
                      <InputNumber v-else-if="editableData[record.key] && (col=='islast' || col=='company_id' || col=='clwkgroup_id' || col=='clwkline_id' || col=='clwkdanyuan_id')"
                        v-model:value="editableData[record.key][col]"
                        style="width: auto;margin: -5px 0" placeholder="1为是,0为否"
                        min="0" max="1"
                      ></InputNumber>
                      <!-- <span v-else-if="editableData[record.key] && col=='islast'">{{ editableData[record.key][col] }}</span> -->
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
.editable-row-operations a {
  margin-right: 8px;
}
</style>
