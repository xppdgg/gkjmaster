<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { onBeforeMount, reactive, ref, UnwrapRef } from 'vue';
import moment from 'moment';
import { InputSearch, TableColumnsType, message } from 'ant-design-vue';
import axios from 'axios';

// 内联所需的API函数
const userInfomation = () => {
  // 从sessionStorage获取用户信息，如果不存在则提供默认值
  try {
    const userii = JSON.parse(sessionStorage.getItem("user") || '{"user":{"username":"default","id":"1"},"role":{"id":1},"company":{"id":1}}');
    return {
      username: userii?.user.username,
      roleid: userii?.role.id,
      companyid: userii?.company.id,
      userid: userii?.user.id
    };
  } catch (e) {
    console.error('获取用户信息失败', e);
    return { username: 'default', roleid: 1, companyid: 1, userid: '1' };
  }
};

// 内联API URL构建函数
const baseUrl = (companyid, roleid, userid, databaseName, offset = 0, limit = 10) => {
  return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig`;
};

const WhereUrl = (companyid, roleid, userid, databaseName, offset = 0, limit = 10, orderby = 'id asc', where) => {
  return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig&orderby=${orderby}&where=${where}`;
};

// 内联API请求函数
const doSql = async (databaseName, offset, limit) => {
  const userii = userInfomation();
  return axios({
    url: baseUrl(userii.companyid, userii.roleid, userii.userid, databaseName, offset, limit),
    method: 'get',
    headers: {
      "Content-Type": "text/html;charset=UTF-8"
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

const whereSql = async (databaseName, offset, limit = 10, orderby, where) => {
  const userii = userInfomation();
  return axios({
    url: WhereUrl(userii.companyid, userii.roleid, userii.userid, databaseName, offset, limit, orderby, where),
    method: 'get',
    headers: {
      "Content-Type": "text/html;charset=UTF-8"
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

const deleteRows = async (databaseName, offset, limit, id) => {
  const userii = userInfomation();
  return axios({
    url: `${baseUrl(userii.companyid, userii.roleid, userii.userid, databaseName, offset, limit)}/${id}`,
    method: 'delete',
    headers: {
      "Content-Type": "application/json"
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

const updateModel = async (data) => {
  const userii = userInfomation();
  return axios({
    url: baseUrl(userii.companyid, userii.roleid, userii.userid, "clmodel", 0, 1),
    method: 'put',
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      ...data
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

const addModel = async (data) => {
  const userii = userInfomation();
  return axios({
    url: baseUrl(userii.companyid, userii.roleid, userii.userid, "clmodel", 0, 1),
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      ...data
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

// 内联工具函数
const handleResize = (w, col) => {
  if (col) {
    col.width = w;
  }
};

// 表格列定义
const columns = ref([
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
  version?: number
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

  // 保存sql
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
  let rs = await deleteRows('clmodel', 0, 10, drow[0].id);
  console.log(rs);
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

const changePage = (pageinfo: { current: number, pageSize: number, showQuickJumper: boolean, showSizeChanger: boolean, total: number, }) => {
  if (!keywords.value || keywords.value == '') {
    pagination.current = pageinfo.current;
    let { current, pageSize } = pageinfo;
    getData((current - 1) * pageSize, pageSize);
  } else {
    pagination.current = pageinfo.current;
    let { current, pageSize } = pageinfo;
    getDataWithKey((current - 1) * pageSize, pageSize);
  }
};

let keywords = ref<string>('');
const handleSearch = async (words: string) => {
  keywords.value = words;
  if (!words || words == '') {
    getData(0, pagination.pageSize);
  } else {
    console.log(words);
    getDataWithKey(0, pagination.pageSize);
  }
};

const getDataWithKey = async (offset: number, limit: number) => {
  let rs = await whereSql('clmodel', offset, limit, 'id asc', `uuid:lk:'${keywords.value}'`);
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
  <div style="background-color: #007b52; height: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
    <div style="width: 200px; display: flex;">
      <div style="color: white; line-height: 40px; margin-right: 10px;">模型</div>
      <a-button style="width: 80px; margin-top: 3px;" :type="'primary'" @click="add">新增</a-button>
    </div>
    
    <InputSearch style="width: 300px; margin-top: 3px;" placeholder="请输入关键词查询" enter-button @search="handleSearch"/>
  </div>
  <a-table :columns="columns" :data-source="dataSource" bordered :pagination="pagination" @change="changePage" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }"
     @resizeColumn="handleResize" style="width: auto; height: auto;">
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
      <template v-for="col in ['uuid','name', 'param', 'train_data', 'train_result']">
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