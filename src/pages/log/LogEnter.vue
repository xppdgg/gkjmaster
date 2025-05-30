<script setup lang='ts'>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { addSql, doSql, login } from '../../api/axios/axios';
import router from '../../router';
import { message } from 'ant-design-vue';
import { userInfomation } from '../../store/userinfo';
import { cluserRedata } from './cluserrecord';
const userii = userInfomation();
const uuids: any = ref([]);

const userInfo: { [key: string]: any } = reactive<Object>({uuid: '', uuidName: '', 
                clwkgroup_id:null as null |number,
                clwkline_id:null as null |number,
                clwkdanyuan_id:null as null |number,	
                clwkstation_id:null as null |number,
                clwkmachine_id:null as null |number, 
            })

const getuuids = async () => {
    let rs = await doSql("uuid", 0, 100)
    // console.log(rs);

    uuids.value = rs.data_response.uuid
}
onBeforeMount(() => {
    getuuids()

})

watch(
    () => uuids.value,
    () => {
        userInfo.uuid = uuids.value[0].id
        userInfo.uuidName =uuids.value[0].name
    },
    { deep: true }
)

const enter = async () => {
    //向cluserrecord发送上岗信息
    cluserRedata.name = userInfo.uuidName
    cluserRedata.company_id = userii.companyid
    cluserRedata.logid = userii.userid
    cluserRedata.int0 = 1; //上岗
    cluserRedata.str0 = userii.username
    cluserRedata.uuid = userInfo.uuid
    //
    userii.uuid=userInfo.uuid
    userii.uuidName = userInfo.uuidNama
    //
    
    uuids.value.map((item:any)=>{
        if(item.id == userInfo.uuid){
            cluserRedata.clwkgroup_id = item.clwkgroup_id 
            cluserRedata.clwkline_id  = item.clwkline_id 
            cluserRedata.clwkdanyuan_id=item.clwkdanyuan_id
            cluserRedata.clwkstation_id=item.clwkstation_id
            cluserRedata.clwkmachine_id=item.clwkmachine_id
        }
    })
            userInfo.clwkgroup_id =cluserRedata.clwkgroup_id 
            userInfo.clwkline_id =cluserRedata.clwkline_id  
            userInfo.clwkdanyuan_id=cluserRedata.clwkdanyuan_id
            userInfo.clwkstation_id=cluserRedata.clwkstation_id
            userInfo.clwkmachine_id=cluserRedata.clwkmachine_id

            userii.clwkgroup_id =cluserRedata.clwkgroup_id 
            userii.clwkline_id =cluserRedata.clwkline_id  
            userii.clwkdanyuan_id=cluserRedata.clwkdanyuan_id
            userii.clwkstation_id=cluserRedata.clwkstation_id
            userii.clwkmachine_id=cluserRedata.clwkmachine_id

            sessionStorage.setItem("userinfo",JSON.stringify(userInfo))
            sessionStorage.setItem("menukey","0")
    let logData: { [key: string]: any } = {}
    for (let x in cluserRedata) {
        if (cluserRedata[x] != null) {
            logData[x] = cluserRedata[x]
        }
    }

    let rs = await addSql("cluserrecord",0,10,logData)
    if(rs.message=="success"){
        router.push("/home")
        message.success("进入成功") 
    }
  
}


const setUserStation = (e: any) => {
    // userInfo.uuid = e.target.value
    let value: string = e.target.value as string
    let value1: string[] = value.split(",")
    userInfo.uuid = value1[0]
    userInfo.uuidName = value1[1]
    // console.log(userInfo);
    
}


</script>
<template>
    <div class="body">
        <div class="container right-panel-active"><!-- Sign Up -->
            <div class="container__form container--signup">
                <div id="form1" class="form">
                    <h3 class="form__title" style="color: black;">选择</h3>
                    <label>公司：<input type="company" placeholder="company"
                            style="width: 200px;height: 30px;border:none;border-radius: 5px;" readonly name="company"
                            :value="userii.companyname" /></label>
                    <label style="margin-top: 10px;">角色：<input type="role" placeholder="role"
                            style="width: 200px;height: 30px;border:none;border-radius: 5px;" readonly name="role"
                            :value="userii.rolename" /></label>
                    <div style="margin-top: 10px;">
                        <span>岗位：</span>
                        <select title="岗位" style="width: 200px;height: 30px;border:none;border-radius: 5px;"
                            :onchange="setUserStation">
                            <option v-for="{ uuid, name } in uuids" :key="uuid" :value="`${uuid},${name}`">{{ name }}
                            </option>
                        </select>
                    </div>
                    <button class="btn" @click="enter">进入</button>
                </div>
            </div><!-- Sign In -->
            <div class="container__overlay">
                <div class="overlay">
                    <div class="overlay__panel overlay--left">
                        <button class="btn" id="signIn">欢迎您，尊贵的用户</button>
                    </div>
                    <div class="overlay__panel overlay--right">
                        <button class="btn" id="signUp">暂时未开放</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>@import url("../../css/log/log.css");</style>