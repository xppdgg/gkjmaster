<template>
    <div style="background-color: #3b8f73;height: 40px;display: flex;justify-content: space-between;padding: 0 30px;">
        <!-- <a-button style="width: 100px;margin-top: 3px;" :type="'primary'">新增记录</a-button>
        <a-input-search style="width: 300px;margin-top: 3px;" placeholder="input search text" enter-button /> -->
    </div>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }" :pagination="pagination"
    @change="changePage"
    >
        <template v-slot:bodyCell="{ column, record, index }">
            <template v-if="column.key == 'cltable'">
                <span><a @click="jumpNew(record.cltable)">{{ record.cltable }}</a></span>
            </template>
            <template v-if="column.key == 'edtable'">
                <span><a>{{ record.edtable }}</a></span>
            </template>
            <template v-if="column.key == 'operation'">
                <div style="display: flex;justify-content: space-between;">
                    <a-button type="primary" :disabled="record.isvalid != 0 ? false : true"
                        @click="() => { updateOpen = true }">修改</a-button>
                    <a-button danger :disabled="record.isvalid != 0 ? false : true">删除</a-button>
                </div>
            </template>
        </template>
    </a-table>
    <a-modal title="修改传感器数据" v-model:open="updateOpen" @ok="() => { updateSensor }" :footer="[]" wrapClassName="full-modal">
        <UpdateSensor></UpdateSensor>
    </a-modal>
</template>
<script lang="ts" setup>
import { message, type Select, type TableColumnsType } from 'ant-design-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { doSql, whereSql } from '../../../api/axios/axios';
import { userInfomation } from '../../../store/userinfo';
import { useRoute } from 'vue-router';
import UpdateSensor from '../../../components/sensorDataconf/UpdateSensor.vue'
import router from '../../../router/index'
const columns: TableColumnsType = [
    { title: 'UUID', width: 100, dataIndex: 'sensoruuid', key: 'sensoruuid', fixed: 'left' },
    { title: '云数据', dataIndex: 'cltable', key: 'cltable', width: 150 },
    // { title: '角色', width: 100, dataIndex: 'rolename', key: 'rolename', fixed: 'left' },
    { title: '传感器数据', dataIndex: 'name', key: 'name', width: 150 },
    { title: '条码', dataIndex: 'code', key: 'code', width: 150 },
    { title: '开始时间', dataIndex: 'utc_create', key: 'utc_create', width: 150 },
    { title: '结束时间', dataIndex: 'tm0', key: 'tm0', width: 150 },
    { title: '本地数据', dataIndex: 'edtable', key: 'edtable', width: 150 },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 130,
    },
];
const userii = userInfomation();
const route = useRoute()
let data = ref([])
const updateOpen = ref<boolean>(false)


const getSensor = async (offset:number,limit:number) => {
    let rs = await whereSql("cldataconf", offset, limit, "id asc", `sensoruuid:eq:'${route.query.uuid}'`)
    console.log(99, rs);
    data.value = rs.data_response.cldataconf
    if(data.value.length==0){
        message.error('此传感器下无配置信息')
    }
}
const updateSensor = () => {
    updateOpen.value = !updateOpen.value
}
const jumpNew = (param:string)=>{
    const newpage = router.resolve({ name: 'cldatasensor',params:{databaseName:param,companyid:userii.companyid as number,roleid:userii.roleid as number,userid:userii.userid as number} });
    window.open(newpage.href,"_blank")
}


watch(
    () => route.query,
    () => {
        if(route.name=='sensorSettings'){
            getSensor(0,10)    
        }
        
    },
    { deep: true,
        // immediate:false
     }
)



onBeforeMount(() => {
    //将传感器的数据查看
    getSensor(0,10)
})


const pagination = ref({
    total: 500,
    // showTotal: () => `共 ${} 条`,
    showSizeChanger:false,
    pageSize:10,
    showQuickJumper:true
})

const changePage = (pageinfo:{current:number, pageSize: number,showQuickJumper:boolean,showSizeChanger:boolean,total: number,})=>{
    console.log(987,pageinfo);
    let {current,pageSize} = pageinfo
    getSensor((current-1)*10,pageSize)
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
    