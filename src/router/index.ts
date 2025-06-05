import { RouteRecordRaw, createRouter,createWebHistory } from "vue-router";
import HomeVue from "../pages/home/Home.vue";
import testVue from "../pages/test.vue";
import MyTableVue from "../pages/home/MyTable.vue";
import MyTreeVue from "../pages/home/MyTree.vue";
import ProductReVue from "../pages/home/ProductRe.vue";
import SensorSettingsVue from "../pages/home/sensorsetting/SensorSettings.vue";
import DatasensorVue from "../components/sensorDataconf/Datasensor.vue";
import DataCameraVue from "../components/cameraDataconf/DataCamera.vue";
import CameraSettingsVue from "../pages/home/camerasetting/CameraSettings.vue";
import ModelVue from "../pages/home/clmodel/Model.vue";
import CameraVue from "../pages/home/camera/Camera.vue";
import SensorVue from "../pages/home/sensor/Sensor.vue";
import CldataConfVue from "../pages/home/sys_setting/CldataConf.vue";
import TableAllVue from "../pages/home/tableall/TableAll.vue";
import UUIDVue from "../pages/home/uuid/UUID.vue";
import equipmentVue from "../pages/home/equipment/equipment.vue";
import newVue from "../pages/home/new/new.vue";
import danyuanVue from "../pages/home/danyuan/danyuan.vue";
import lineVue from "../pages/home/line/line.vue";
import bz1Vue from "../pages/home/bz1/bz1.vue";
import stationVue from "../pages/home/station/station.vue";
import groupVue from "../pages/home/group/group.vue";
const routes:Array<RouteRecordRaw> = [
    {
        path:'/home',
        name:'home',
        component:HomeVue,
        children:[
            {
                path:'content',
                name:'content',
                children:[
                    {
                        path:'workRecord',
                        name:'workRecord',
                        component:MyTableVue
                    },
                    {
                        path:'ProRecord',
                        name:'ProRecord',
                        component:ProductReVue
                    },
                    {
                        path:'sensorSettings',
                        name:'sensorSettings',
                        component:SensorSettingsVue
                    },
                    {
                        path:'cameraSettings',
                        name:'cameraSettings',
                        component:CameraSettingsVue
                    },
                    {
                        path:'model',
                        name:'model',
                        component:ModelVue
                    },
                    {
                        path:'camera',
                        name:'camera',
                        component:CameraVue
                    },
                    {
                        path:'danyuan',
                        name:'danyuan',
                        component:danyuanVue
                    },
                    {
                        path:'line',
                        name:'line',
                        component:lineVue
                    },
                    {
                        path:'station',
                        name:'station',
                        component:stationVue
                    },
                    {
                        path:'agreement',
                        name:'agreement',
                        component:bz1Vue
                    },
                    {
                        path:'group',
                        name:'group',
                        component:groupVue
                    },
                    {
                        path:'sensor',
                        name:'sensor',
                        component:SensorVue
                    },
                    {
                        path:'dataconf',
                        name:'dataconf',
                        component:CldataConfVue
                    },
                    {
                        path:'tableall',
                        name:'tableall',
                        component:TableAllVue
                    },
                    {
                        path:'uuid',
                        name:'uuid',
                        component:UUIDVue
                    },
                    {
                        path:'equipment',
                        name:'equipment',
                        component:equipmentVue
                    },
                    {
                        path:'new',
                        name:'new',
                        component:newVue
                    },
                    {
                        path:'/home',
                        redirect:'/home/content/workRecord',
                        
                    }

                ]
            },
        ]
    },
    {
        path:'/test',
        name:'test',
        component:testVue
    },

    {
        path:'/cldatasensor/:databaseName&:companyid&:roleid&:userid',
        name:'cldatasensor',
        component:DatasensorVue
    },
    {
        path:'/cldataimage/:databaseName&:companyid&:roleid&:userid',
        name:'cldataimage',
        component:DataCameraVue
    },

];
const router = createRouter({
    history:createWebHistory('ms'), //createWebHashHistory 这个是哈希路由
    routes
})

router.beforeEach((to)=>{
    // 直接设置默认用户信息，不需要登录
    sessionStorage.setItem('userinfo',JSON.stringify({
        "uuid": 1,
        "uuidName": "轮播列表",
        "clwkgroup_id": 2,
        "clwkline_id": 1,
        "clwkdanyuan_id": null,
        "clwkstation_id": null,
        "clwkmachine_id": null
    }))
    sessionStorage.setItem('user',JSON.stringify({
        "role": {
            "id": 1,
            "name": "车间管理员",
            "alias": null,
            "ge": null,
            "utc_last_login": null,
            "utc_last_request": null,
            "fast_request_count": null,
            "version": 0,
            "utc_create": "2023-12-06 12:03:43",
            "utc_update": null,
            "active": 1,
            "creater": "System",
            "updater": null
        },
        "company": {
            "id": 1,
            "name": "天正",
            "code": "TZ",
            "address": "乐清",
            "phone": null,
            "email": null,
            "alias": null,
            "version": 0,
            "utc_create": "2023-11-29 11:31:10",
            "utc_update": null,
            "active": 1,
            "creater": "System",
            "updater": null
        },
        "user": {
            "id": "1",
            "username": "admin",
            "password": null,
            "nickname": "管理员",
            "dep_id": 2,
            "pos_id": "410792368778907648",
            "company_id": 1,
            "role_id": 1,
            "role": null
        }
    }))
    
    // 根路径重定向到首页
    if(to.path=='/'){
        return "/home"
    }
})

export default router;