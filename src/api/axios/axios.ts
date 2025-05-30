import axios from "axios";
import { WhereUrl, baseUrl, orderUrl, scUrl } from "./axios.config";
import { userInfomation } from "../../store/userinfo";
export const login = async(username:string,password:string)=>{
    return axios({
        url:`/api/login?name=${username}&pwd=${password}`,
        method:'POST',
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

export const doSql = async(databaseName:string, offset:number,limit:number)=>{  //查询sql
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit),
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

export const addSql = async(databaseName:string, offset:number,limit:number,data:any)=>{  //增加数据sql
    const userii = userInfomation();    
    // console.log({...data});
    // console.log(777,userii.companyid,userii.roleid);
    // return {message:"success"}
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit,data),
        method:'post',
        headers:{
            "Content-Type":"application/json"
        },
        data:{
            ...data
        },
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}

export const whereSql =async (databaseName:string, offset:number,limit:number=10,orderby:string,where?:string) => {
    const userii = userInfomation();
    // console.log(635,WhereUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit,orderby=orderby,where=where));
    
    return axios({
        url:WhereUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit,orderby=orderby,where=where),
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

export const  orderSql = async(databaseName:string, offset:number,limit:number=10,orderby:string)=>{
    const userii = userInfomation();
    console.log(orderUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit,orderby=orderby));
    
    return axios({
        url:orderUrl(userii.companyid,userii.roleid,userii.userid,databaseName,offset,limit,orderby=orderby),
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

export const getscSql =async (companyid:number,roleid:number,userid:number,action_docsid:number,databaseName:string, offset:number,limit:number) => {
    const userii = userInfomation();
    // console.log(666,scUrl(companyid,roleid,userid,action_docsid,"cldatasensor",offset,limit));
    return axios({
        url:scUrl(companyid,roleid,userid,action_docsid,databaseName,offset,limit,),
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

export const getscSqlWithStatus =async (companyid:number,roleid:number,userid:number,action_docsid:number,databaseName:string, offset:number,limit:number,status:string) => {
    const userii = userInfomation();
    // console.log(666,scUrl(companyid,roleid,userid,action_docsid,"cldatasensor",offset,limit));
    return axios({
        url:`${scUrl(companyid,roleid,userid,action_docsid,databaseName,offset,limit)}&where=state:lk:'${status}'`,
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


export const deleteRows = async(databaseName:string, offset:number,limit:number,deleteId:number)=>{
    if(deleteId === undefined || deleteId === null) {
        throw new Error('deleteId cannot be undefined or null');
    }
    const userii = userInfomation();
    let str = `/api/companys/${userii.companyid}/roles/${userii.roleid}/login_users/${userii.userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}/532,${deleteId},533/versions/532,0,533?offset=${offset}&limit=${limit}&type=sig`
    return axios({
        url:str,
        method:'delete',
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


interface product {
    uuid:string;
    name:string;
    code:string;
    company_id:number,
    roleid: number,
    clwkgroup_id:number,
    clwkline_id:number,
    clwkdanyuan_id:number,	
    clwkstation_id:number,
    clwkmachine_id:number,
    logid:number,  //usreid
    str0:string, //username
    tm0?:string,
    int_g0:number, //合格数量
    int_g1:number,//异常数量
    int_g2:number//校对合格数量
}

export const addProductSql =async (addproduct:product) => {
    let addData:{[key:string]:any} = {}
    let p:{[key:string]:any} = addproduct
    p.roleid=null;
    for (let x in p){
        if(p[x]!=null){
            addData[x] = p[x]
        }
    }
    return axios({
        method:'post',
        url:`/api/companys/${addproduct.company_id}/roles/1/login_users/${addproduct.logid}/windows/1/docs/1/action_docs/1/datas/clproductrecord?offset=0&limit=10&type=sig`,
        data:{
            ...addData
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}

interface FormState {
    id:number,
    uuid: string;
    str2: string; //订单号
    proname: string;
    code: '';
    int_g0: number;
    int_g1: number;
    int_g2: number;
    utc_create: string,
    tm0: string,
    // utc_create1:Ref<moment.Moment>
  }
export const updateProductSql = async (updateProduct:any) => {
    const userii = userInfomation()
    let addData:{[key:string]:any} = {}
    for (let x in updateProduct){
        if(updateProduct[x]!=null){
            addData[x] = updateProduct[x]
        }
    }
    return axios({
        method:'put',
        url:`/api/companys/${userii.companyid}/roles/${userii.roleid}/login_users/${userii.userid}/windows/1/docs/1/action_docs/1/datas/clproductrecord?offset=0&limit=10&type=sig`,
        data:{
            ...addData
        }
    }).then((res)=>{
        return res.data
    }).catch((err)=>{
        console.log(err);
        return err;
    })
}
