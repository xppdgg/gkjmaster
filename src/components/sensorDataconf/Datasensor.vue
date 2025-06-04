<script setup lang='ts'>
import { Button, Image, Modal, RadioButton, RadioGroup, Switch, Table, TableColumnType, TablePaginationConfig } from 'ant-design-vue';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { doSql,getscSql, getscSqlWithStatus } from '../../api/axios/axios';
import test from '../../pages/test.vue';
import Chart from '../sensorDataChart/Chart.vue';
import ThreeChart from '../sensorDataChart/ThreeChart.vue';

const route = useRoute();
const columns:TableColumnType[] = [
    { title: '序号', width: 100, dataIndex: 'id', key: 'id', fixed: 'left' },
    { title: '数据', width: 150, dataIndex: 'data', key: 'data',ellipsis:true},
    { title: '状态', width: 150, dataIndex: 'state', key: 'state'},
    { title: '资源', width: 100, dataIndex: 'url', key: 'url'},
    {title:'时间',width:100,dataIndex:'utc_create',key:'utc_create'}
]
const data = ref<[]>([]);
const getAllData =async (offset:number,limit:number) => {
    let companyid:number = route.params.companyid as unknown as number 
    let roleid:number = route.params.roleid as unknown as number 
    let userid:number = route.params.userid as unknown as number 
    let databaseName:string = route.params.databaseName as string
    let action_docsid:number = parseInt(databaseName.split("_")[1].slice(1)) 
    let rs = await getscSql(companyid,roleid,userid,action_docsid,"cldatasensor",offset,limit)
    console.log(rs);   //url
    data.value = rs.data_response.cldatasensor
        
}

const getDataWithState =  async(offset:number,limit:number)=>{
    let companyid:number = route.params.companyid as unknown as number 
    let roleid:number = route.params.roleid as unknown as number 
    let userid:number = route.params.userid as unknown as number 
    let databaseName:string = route.params.databaseName as string
    let action_docsid:number = parseInt(databaseName.split("_")[1].slice(1)) 
    let rs = await getscSqlWithStatus(companyid,roleid,userid,action_docsid,"cldatasensor",offset,limit,status.value)
    console.log(798,rs);   //url
    data.value = rs.data_response.cldatasensor
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

const isThreeDemension = (data:string)=>{
    // console.log(data[data.length-1]==')');
    return data[0]=='(' && data[data.length-1]==')'
}

const isVisible = ref<boolean>(false)
const isVisible1 = ref<boolean>(false)
const status = ref<string>('')
const url = ref<string>('')
const dataString = ref<string>('')
const demension = ref<string>('0')
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
                <template v-if="column.key=='url'">
                    <span  style="cursor: pointer;color: blue;" :onclick="()=>{isVisible=true;url=record.url}">{{ record.url }}</span>
                </template>
                <template v-if="column.key=='data'">
                    <div v-if=" isThreeDemension(record['data'])">
                        <span style="cursor: pointer;color: blue;" :onclick="()=>{isVisible1=true;dataString=record.data}">{{ record['data'] }}</span>
                    </div>
                </template>
            </template>
        </Table>
    </div>
    <Modal title="预览(可点击图片)" v-model:open="isVisible" :footer="null">
        <Image :src="url"></Image>
    </Modal>
    <Modal title='预览数据' style="width: fit-content;height: fit-content;top: 0;" v-model:open="isVisible1" :footer="null" :destroy-on-close="true">
        <div style="position:absolute;top: 20px;left: 100px;width: 150px;display: flex;justify-content: center;z-index: 9;">
            <!-- <Button type="primary" style="margin-right: 8px;" @click="()=>{demension=0;}">二维</Button>
            <Button type="dashed" @click="()=>{demension=1}">三维</Button> -->
            <RadioGroup v-model:value="demension" button-style="solid" >
                <RadioButton value='0'>二维</RadioButton>
                <RadioButton value='1'>三维</RadioButton>
            </RadioGroup>
        </div>
        <Chart :datastring="dataString" v-if="demension=='0'"></Chart>
        <ThreeChart :datastring="dataString" v-if="demension=='1'"></ThreeChart>
    </Modal>
</template>
<style lang='scss' scoped>
</style>