export const baseUrl: Function = (companyid: number, roleid: number, userid: number, databaseName: string, offset:number=0, limit: number=10): String => {
    return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig`
}


export const WhereUrl:Function = (companyid: number, roleid: number, userid: number, databaseName: string, offset:number=0, limit: number=10,orderby:string='id asc',where:string): String => {
    return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig&orderby=${orderby}&where=${where}`
}

export const orderUrl:Function = (companyid: number, roleid: number, userid: number, databaseName: string, offset:number=0, limit: number=10,orderby:string='id asc',)=>{
    return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/1/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig&orderby=${orderby}`
}

export const scUrl:Function = (companyid: number, roleid: number, userid: number,action_docsid:number, databaseName: string, offset:number=0, limit: number=10,orderby:string = 'id desc')=>{
    return `/api/companys/${companyid}/roles/${roleid}/login_users/${userid}/windows/1/docs/1/action_docs/${action_docsid}/datas/${databaseName}?offset=${offset}&limit=${limit}&type=sig&orderby=${orderby}`
}
