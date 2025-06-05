<template>
  <a-layout style="position: absolute;width: 100%;height: 100%;">
    <a-layout-sider  collapsed-width="30" theme="light" v-model:collapsed="collapsed" 
      style="border-right: 2px solid rgb(237, 237, 237);overflow: auto;" >
      <div style="width: 100%;text-align: center;margin: 0px 0;background-color: #3b8f73;height: 30px;line-height: 30px;color: white;">
        车间列表</div>
      <MyTree :changeKey="changeMenukey" :selectedKeys="selectedKeys1"/>

    </a-layout-sider>
    <a-layout style="height: auto;background-color: rgb(255, 255, 255);">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }" >
          <a-sub-menu title="记录" key="01">
            <!-- <template #icon>
              <DownOutlined />
            </template> -->
            <a-menu-item key="0">工作记录</a-menu-item>
            <a-menu-item key="1">产品记录</a-menu-item>
          </a-sub-menu>
          <a-sub-menu title="设备" key="456">
            <a-menu-item key="4">模型</a-menu-item>
            <a-menu-item key="5">摄像头</a-menu-item>
            <a-menu-item key="6">传感器</a-menu-item>
            <a-menu-item key="11">单元</a-menu-item>
            <a-menu-item key="12">生产线</a-menu-item>
            <a-menu-item key="13">协议</a-menu-item>
            <a-menu-item key="14">工位</a-menu-item>
            <a-menu-item key="15">车间</a-menu-item>
          </a-sub-menu>
          <SubMenu title="设置" key="789">
            <a-menu-item key="7">系统设置</a-menu-item>
            <a-menu-item key="8">表格</a-menu-item>
            <a-menu-item key="9">UUID总表</a-menu-item>
          </SubMenu>
          <SubMenu title="图片与数据" key="23" @title-click="()=>{message.warn('请点击左侧列表传感器')}">
            <a-menu-item key="2" style="pointer-events: none;">传感器</a-menu-item>
            <a-menu-item key="3" style="pointer-events: none;">摄像头</a-menu-item>
            <a-menu-item key="10" >装备数据库</a-menu-item>
          </SubMenu>
        
        </a-menu>
        <div style="position: absolute;top: 0;right: 0;">
         
          <a-button danger @click="handleClick">
           <template #icon><LoginOutlined /></template>
            退出系统
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '0px 0px' }">
            <RouterView></RouterView>      
      </a-layout-content>
      <!-- <a-layout-footer style="text-align: center">
          @Get Right By Yuki
        </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import MyTree from './MyTree.vue'
import { RouterView, useRouter } from 'vue-router';
import {DownOutlined, LoginOutlined, MailOutlined} from '@ant-design/icons-vue'
import { userInfomation } from '../../store/userinfo';
import { SubMenu, message } from 'ant-design-vue';
const router = useRouter();
const userii = userInfomation()
let menukey = sessionStorage.getItem("menukey")?[sessionStorage.getItem("menukey")]:["0","01"]
let selectedKeys1:any = ref(menukey);
const collapsed = ref<boolean>(false)


const changeKey = (selectedKeys:any,uuid?:string)=>{
    console.log(887,selectedKeys,uuid);
    selectedKeys1.value = selectedKeys
    sessionStorage.setItem("menukey",selectedKeys1.value[0])
    if(selectedKeys[0]=='0'){
      router.push('/home/content/workRecord')
    }
    else if(selectedKeys[0]=='1'){
      router.push('/home/content/proRecord')
    }
    else if(selectedKeys[0]=='4'){
      router.push(`/home/content/model`)
    }
    else if(selectedKeys[0]=='5'){
      router.push(`/home/content/camera`)
    }
    else if(selectedKeys[0]=='6'){
      router.push(`/home/content/sensor`)
    }
    else if(selectedKeys[0]=='7'){
      router.push(`/home/content/dataconf`)
    }
    else if(selectedKeys[0]=='8'){
      router.push(`/home/content/tableall`)
    }
    else if(selectedKeys[0]=='9'){
      router.push(`/home/content/uuid`)
    }
    else if(selectedKeys[0]=='10'){
      router.push(`/home/content/equipment`)
    }
    else if(selectedKeys[0]=='11'){
      router.push(`/home/content/danyuan`)
    }
    else if(selectedKeys[0]=='12'){
      router.push(`/home/content/line`)
    }
    else if(selectedKeys[0]=='13'){
      router.push(`/home/content/agreement`)
    }
    else if(selectedKeys[0]=='14'){
      router.push(`/home/content/station`)
    }
    else if(selectedKeys[0]=='15'){
      router.push(`/home/content/group`)
    }
}

const changeMenukey = (selectedKeys:any,uuid?:string)=>{
  console.log(888,selectedKeys);
    selectedKeys1.value = selectedKeys
    sessionStorage.setItem("menukey",selectedKeys1.value[0])
    if(selectedKeys[0]=='2'){
      router.push(`/home/content/sensorSettings?uuid=${uuid}`)
    }
    else if(selectedKeys[0]=='3'){
      router.push(`/home/content/cameraSettings?uuid=${uuid}`)
    }
    else if(selectedKeys[0]=='4'){
      router.push(`/home/content/plcSettings?uuid=${uuid}`)
    }
}

// const clickTopMenu = (a,b,c)=>{
//   console.log(69,a,b,c);
  
// }

watch(
  selectedKeys1,
  ()=>{
    // console.log(88,selectedKeys1.value);
    changeKey(selectedKeys1.value)
  }
)

const handleClick = ()=>{
    // 直接重新加载页面，不需要登录
    window.location.reload()
    message.success("系统已刷新")
}


</script>



<style scoped>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
  