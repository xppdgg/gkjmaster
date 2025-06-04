<script setup lang='ts'>
import { Table, TableColumnType, TablePaginationConfig,Image, Button, Modal } from 'ant-design-vue';
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { doSql,getscSql, getscSqlWithStatus } from '../../api/axios/axios';
import Player from 'xgplayer/es/player';
import FlvPlayer from 'xgplayer-flv.js'

const route = useRoute();
const columns:TableColumnType[] = [
    { title: '名称', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: '数据', width: 150, dataIndex: 'data', key: 'data'},
    { title: '状态', width: 150, dataIndex: 'state', key: 'state'},
    { title: '资源', width: 100, dataIndex: 'cloudurl', key: 'cloudurl'},
    {title:'时间',width:100,dataIndex:'utc_create',key:'utc_create'}
]
const data = ref<[]>([]);
const getAllData =async (offset:number,limit:number) => {
    let companyid:number = route.params.companyid as unknown as number 
    let roleid:number = route.params.roleid as unknown as number 
    let userid:number = route.params.userid as unknown as number 
    let databaseName:string = route.params.databaseName as string
    let action_docsid:number = parseInt(databaseName.split("_")[1].slice(1)) 
    let rs = await getscSql(companyid,roleid,userid,action_docsid,"cldataimage",offset,limit)
    console.log(rs);   //url
    data.value = rs.data_response.cldataimage
}

const getDataWithState =  async(offset:number,limit:number)=>{
    let companyid:number = route.params.companyid as unknown as number 
    let roleid:number = route.params.roleid as unknown as number 
    let userid:number = route.params.userid as unknown as number 
    let databaseName:string = route.params.databaseName as string
    let action_docsid:number = parseInt(databaseName.split("_")[1].slice(1)) 
    let rs = await getscSqlWithStatus(companyid,roleid,userid,action_docsid,"cldataimage",offset,limit,status.value)
    console.log(rs);   //url
    data.value = rs.data_response.cldataimage
}

onBeforeMount(() => {
    getAllData(0,50)
})

const pagination = ref({
    total: Infinity,
    // showTotal: () => `共 ${} 条`,
    showSizeChanger:false,
    pageSize:50,
    showQuickJumper:true,
    simple:true
})

const changePage = (pageinfo:any)=>{
    console.log(987,pageinfo);
    let {current,pageSize} = pageinfo
    if(status.value == ''){
        getAllData((current-1)*pageSize,pageSize)    
    }
    else if(status.value == 'G'){
        getDataWithState((current-1)*pageSize,pageSize)
    }
    else if(status.value == 'NG'){
        getDataWithState((current-1)*pageSize,pageSize)
    }
    
}


const isVisible = ref<boolean>(false)
const status = ref<string>('')
const url = ref<string>('')
</script>
<template>
    <div>
        <div style="position: absolute;left: 20px;top:8px;color: aliceblue;">
            <Button  @click="()=>{status='G';getDataWithState(0,50)}" style="margin-right: 5px;">G</Button>
            <Button  @click="()=>{status='NG';getDataWithState(0,50)}" type="dashed" style="margin-right: 5px;">NG</Button>
            <Button  @click="()=>{status='';getAllData(0,50)}" size="middle">全部</Button>
        </div>
        <div style="background-color: black;height: 50px;text-align: center;color: antiquewhite;line-height: 50px;">
           <span>{{ route.params.databaseName  }}<span style="font-size: 10px;">(点击资源可预览)</span></span> 
        </div>
        <Table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 'calc(100vh - 223px)' }" :pagination="pagination"
        @change="changePage" bordered>
            <template v-slot:bodyCell="{ column, record, index }">
                <template v-if="column.key=='cloudurl'">
                    <span style="cursor: pointer;color: blue;"   :onclick="()=>{isVisible=true;url=record.cloudurl;}">{{ record.cloudurl }}</span>
                </template>
            </template>
        </Table>
    </div>
    <!-- <div :id="'mm'" style="width: 500px;height: 400px;"></div> -->
    <Modal title="预览(可点击图片)" v-model:open="isVisible" :footer="null">
        <Image :src="url"></Image>
        <!-- <video :src="url" controls></video> -->
        <!-- <a :href="url">{{ url }}</a> -->
        <!-- <div :id="'mm'" style="width: 500px;height: 400px;"></div> -->
    </Modal>
</template>
<style lang='scss' scoped>
</style>