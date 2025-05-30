<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { onBeforeMount, reactive, ref, UnwrapRef } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { InputSearch, TableColumnsType, message } from 'ant-design-vue';

// API配置
const API_BASE_URL = 'http://1.94.37.31/hailiangweb-2.0';
const MODEL_API = `${API_BASE_URL}/clmodel`;

// 直接内置API方法
const BASE_API_PATH = 'companys/1/roles/1/login_users/1/windows/1/docs/1/action_docs/1/datas';

const doSql = async (table: string, offset: number, limit: number) => {
  const response = await axios.get(`${API_BASE_URL}/${BASE_API_PATH}/${table}`, {
    params: { offset, limit, type: 'sig', orderby: 'id desc' }
  });
  return response.data;
};

const whereSql = async (table: string, offset: number, limit: number, order: string, where: string) => {
  const response = await axios.get(`${API_BASE_URL}/${BASE_API_PATH}/${table}`, {
    params: { offset, limit, type: 'sig', orderby: `${order} ${where}` }
  });
  return response.data;
};

const deleteRows = async (table: string, offset: number, limit: number, id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/${BASE_API_PATH}/${table}/${id}`, {
    params: { offset, limit }
  });
  return response.data;
};

const updateModel = async (data: any) => {
  const response = await axios.put(`${MODEL_API}/update`, data);
  return response.data;
};

const addModel = async (data: any) => {
  const response = await axios.post(`${MODEL_API}/add`, data);
  return response.data;
};

// 内置工具方法 - 调整表格列宽
const handleResize = (w: number, _h: number, col: any) => {
  col.width = w;
};

const columns = ref<TableColumnsType>([
  {
    title: 'UUID',
    dataIndex: 'uuid',
    width: 100,
    resizable: true
  },
  {
    title: '模型名称',
    dataIndex: 'name',
    width: 100,
    minWidth: 80,
    resizable: true
  },
  {
    title: '模型参数',
    dataIndex: 'param',
    width: 120,
    minWidth: 80,
    resizable: true
  },
  {
    title: '训练数据',
    dataIndex: 'train_data',
    width: 120,
    minWidth: 80,
    resizable: true
  },
  {
    title: '训练结果',
    dataIndex: 'train_result',
    width: 100,
    minWidth: 80,
    resizable: true
  },
  {
    title: '创建时间',
    dataIndex: 'utc_create',
    width: 120,
    minWidth: 80,
    resizable: true
  },
  {
    title: '修改时间',
    dataIndex: 'utc_update',
    width: 120,
    minWidth: 80,
    resizable: true
  },
  {
    title: '创建人',
    dataIndex: 'creater',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    align: 'center',
    fixed: 'right'
  },
]);

interface DataItem {
  id?: number;
  key: string;
  uuid: string;
  name: string;
  param: string;
  train_data: string;
  train_result: string;
  utc_create?: string;
  utc_update?: string;
  creater?: string;
  version?: number;
}

let dataSource = ref<DataItem[]>([]);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

onBeforeMount(() => {
  getData(0, pagination.pageSize);
});

const getData = async (offset: number, limit: number) => {
  let rs = await doSql("clmodel", offset, limit);
  const data: DataItem[] = [];
  let tmpdata = rs.data_response.clmodel;
  tmpdata.forEach((item: any) => {
    item.key = item.id;
    data.push(item);
  });
  dataSource.value = data;
};

const add = () => {
  let key: string = Math.random() + 'new';
  let newData: DataItem = {
    key: key,
    uuid: '未填写',
    name: '未命名',
    param: '未设置',
    train_data: '未填写',
    train_result: '未填写',
    utc_create: moment().format('YYYY-MM-DD HH:mm:SS'),
    utc_update: moment().format('YYYY-MM-DD HH:mm:SS'),
    creater: 'System'
  };
  dataSource.value.push(newData);
};

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const save = async (key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);

  if (editableData[key].id) {
    let data = {
      id: editableData[key].id,
      uuid: editableData[key].uuid,
      name: editableData[key].name,
      param: editableData[key].param,
      train_data: editableData[key].train_data,
      train_result: editableData[key].train_result,
      version: 0
    };
    let rs = await updateModel(data);
    if (rs.message == 'success') {
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
  } else {
    let data = {
      uuid: editableData[key].uuid,
      name: editableData[key].name,
      param: editableData[key].param,
      train_data: editableData[key].train_data,
      train_result: editableData[key].train_result,
    };
    let rs = await addModel(data);
    if (rs.message == 'success') {
      message.success("新增成功");
      getData((pagination.current - 1) * pagination.pageSize, pagination.pageSize);
    } else {
      message.error("新增失败");
    }
  }
  delete editableData[key];
};

const cancel = (key: string) => {
  delete editableData[key];
};

const deleteData = async (key: string) => {
  let drow = dataSource.value.filter(item => key == item.key);
  if (!drow[0].id) {
    message.error('无法删除: 缺少ID');
    return;
  }
  let rs = await deleteRows('clmodel', 0, 10, drow[0].id);
  if (rs.message == 'success') {
    message.success('删除成功');
    let data = dataSource.value.filter(item => key !== item.key);
    dataSource.value = data;
  } else {
    message.error('删除失败');
  }
};

const pagination = reactive({
  current: 1,
  pageSize: 50,
  total: Infinity,
  simple: true
});

const changePage = (pageinfo: { current: number, pageSize: number }) => {
  pagination.current = pageinfo.current;
  let { current, pageSize } = pageinfo;
  getData((current - 1) * pageSize, pageSize);
};

let keywords = ref<string>('');
const handleSearch = async (words: string) => {
  keywords.value = words;
  if (!words || words == '') {
    getData(0, pagination.pageSize);
  } else {
    getDataWithKey(0, pagination.pageSize);
  }
};

const getDataWithKey = async (offset: number, limit: number) => {
  let rs = await whereSql('clmodel', offset, limit, 'id', `asc uuid:lk:'${keywords.value}'`);
  const data: DataItem[] = [];
  let tmpdata = rs.data_response.clmodel;
  tmpdata.forEach((item: any) => {
    item.key = item.id;
    data.push(item);
  });
  dataSource.value = data;
};
</script>

<template>
  <div style="padding: 20px;">
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
      <a-button type="primary" @click="add">新增模型</a-button>
      <InputSearch 
        style="width: 300px;" 
        placeholder="请输入关键词查询" 
        enter-button 
        @search="handleSearch"
      />
    </div>
    <a-table 
      :columns="columns" 
      :data-source="dataSource" 
      bordered 
      :pagination="pagination" 
      @change="changePage" 
      :scroll="{ x: 1500, y: 'calc(100vh - 250px)' }"
      @resizeColumn="handleResize"
    >
      <template v-slot:bodyCell="{ column, record, text }">
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
        <template v-for="col in ['uuid','name', 'param', 'train_data', 'train_result']">
          <template v-if="col == column.dataIndex">
            <div>
              <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][col]" />
              <template v-else>{{ text }}</template>
            </div>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
