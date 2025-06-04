import axios from "axios";
import { userInfomation } from "../../../store/userinfo";
import { baseUrl } from "../axios.config";

export const updateEquipment = async(data:{})=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"cldatasensor1_d5",0,1),
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

export const addEquipment = async(data:{})=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"cldatasensor1_d5",0,1),
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

export const getEquipment = async(offset:number,limit:number)=>{
    const userii = userInfomation()
    return axios({
        url:`http://1.94.37.31/hailiangweb-2.0/companys/${userii.companyid}/roles/${userii.roleid}/login_users/${userii.userid}/windows/1/docs/1/action_docs/1/datas/equipment?offset=${offset}&limit=${limit}&type=fk&where=company_id:eq:${userii.companyid}`,
        method:'get',
        headers:{
            "Content-Type":"text/html;charset=UTF-8"
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}

export const getEquipmentWhere = async(offset:number,limit:number,keywords:string)=>{
    const userii = userInfomation()
    return axios({
        url:`http://1.94.37.31/hailiangweb-2.0/companys/${userii.companyid}/roles/${userii.roleid}/login_users/${userii.userid}/windows/1/docs/1/action_docs/3/datas/cldatasensor?offset=${offset}&limit=${limit}&type=fk&where=${keywords}`,
        method:'get',
        headers:{
            "Content-Type":"text/html;charset=UTF-8"
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}
