import axios from "axios";
import { userInfomation } from "../../../store/userinfo";
import { baseUrl } from "../axios.config";

export const updateProduct = async(data:any)=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"clproduct",0,1),
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

export const addProduct = async(data:{})=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"clproduct",0,1),
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