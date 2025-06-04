<script setup lang='ts'>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { addSql, login } from '../../api/axios/axios';
import router from '../../router';
import { message } from 'ant-design-vue';
import {cluserRedata} from './cluserrecord'
import { userInfomation } from '../../store/userinfo';
const userInfo:{[key: string]: any} = reactive<Object>({username: '', password: '' })

const log = async () => {
    const { username, password } = userInfo
    let res = await login(username, password)    
    let userii = userInfomation()
    if (res.message == 'success') {
        //登陆成功后向cluserrecord发送登录的信息
        cluserRedata.name = null
        cluserRedata.company_id = res.data_response.company.id
        cluserRedata.logid = parseInt(res.data_response.user.id)
        cluserRedata.int0 = 0;
        cluserRedata.str0 = userInfo.username

        userii.roleid= res.data_response.role.id
        userii.companyid=res.data_response.company.id
        userii.userid=res.data_response.user.id

        let logData:{[key:string]:any} = {}
        for (let x in cluserRedata){
            if(cluserRedata[x]!=null){
                logData[x] = cluserRedata[x]
            }
        }
        
        let rs = await addSql("cluserrecord",0,10,logData)       
        if(rs.message=="success"){
            sessionStorage.setItem("user",JSON.stringify(res.data_response))
            let userii = res.data_response
            const useriii = userInfomation()
                useriii.username= userii?.user.username,
                useriii.roleid= userii?.role.id,
                useriii.companyid=userii?.company.id,
                useriii.userid=userii?.user.id,
                useriii.rolename=userii?.role.name,
                useriii.nickname=userii?.user.nickname,
                useriii.companyname=userii?.company.name,
            router.push('/logEnter')
        }else{
            message.error("登录失败，请检查用户名和密码")
        }
   
    }else{
        message.error("用户名或密码错误")
    }
}

const setUsername: Function = (e: any) => {
    userInfo.username = e.target.value
    // console.log(userInfo);
}
const setUserPass: Function = (e: any) => {
    userInfo.password = e.target.value
    // console.log(userInfo);
}



</script>
<template>
    <div class="body">
        <div class="container right-panel-active"><!-- Sign Up -->
            <div class="container__form container--signup">
                <div id="form1" class="form">
                    <h3 class="form__title" style="color: black;">登录系统</h3>
                    <label style="margin-bottom: 10px;">用户名：<input type="text" placeholder="Username" name="username" style="width: 200px;height: 30px;border:none;border-radius: 5px;" :onchange="setUsername" /></label>
                    <label for="">密码：<input type="password" placeholder="Password" name="password" style="width: 200px;height: 30px;border:none;border-radius: 5px;margin-left: 15px;" :onchange="setUserPass" /></label>
                    <button class="btn" @click="log()">登录</button>
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
<style>
@import url("../../css/log/log.css");
</style>