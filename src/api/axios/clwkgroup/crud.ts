import axios from "axios";
import { userInfomation } from "../../../store/userinfo";
import { baseUrl } from "../axios.config";

interface group {
    id:number;
    uuid:string;
    name: string;
    company_id: number;
    clwkgroup_id: number;
    clwkline_id: number;
    train_data: string;
    train_result: string;
    version:number
}

export const updatewkgroup = async(data:any)=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"clwkgroup",0,1),
        method:'put',
        headers:{
            "Content-Type":"application/json"
        },
        data:{
            ...data
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}

export const addwkgroup = async(data:{})=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"clwkgroup",0,1),
        method:'post',
        headers:{
            "Content-Type":"application/json"
        },
        data:{
            ...data
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}

