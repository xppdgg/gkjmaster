import { defineStore } from "pinia";

interface userinfo {
    username:string,
    roleid:number,
    companyid:number,
    userid:string
}


export const userInfomation = defineStore("userinfo",
    {
        state:()=>{
            let userii = JSON.parse(sessionStorage.getItem("user") as string)
            let userinfo = JSON.parse(sessionStorage.getItem("userinfo") as string)
            return {
                username: userii?.user.username,
                roleid: userii?.role.id,
                companyid:userii?.company.id,
                userid:userii?.user.id,
                rolename:userii?.role.name,
                nickname:userii?.user.nickname,
                companyname:userii?.company.name,
                uuid:userinfo?.uuid,
                uuidName:userinfo?.uuidName,
                startTime: '' as string,
                EndTime:'' as string,
                clwkgroup_id:userinfo?.clwkgroup_id,
                clwkline_id:userinfo?.clwkline_id,
                clwkdanyuan_id:userinfo?.clwkdanyuan_id,	
                clwkstation_id:userinfo?.clwkstation_id,
                clwkmachine_id:userinfo?.clwkmachine_id,
            
            }
        },
        getters:{

        },
        actions:{

        }
    }

);
