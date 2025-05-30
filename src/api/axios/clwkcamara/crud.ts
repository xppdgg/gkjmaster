import axios from "axios";
import { userInfomation } from "../../../store/userinfo";
import { baseUrl } from "../axios.config";

export const updateCamera = async(data:{})=>{
    const userii = userInfomation();
    return axios({
        url:baseUrl(userii.companyid,userii.roleid,userii.userid,"clwkcamara",0,1),
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

export const addCamera = async(data: {})=>{
    // 验证必填字段
    const requiredFields = ['uuid', 'name', 'datafrom', 'datamean', 'param', 'datatype'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
    }

    const userii = userInfomation();
    const url = baseUrl(userii.companyid,userii.roleid,userii.userid,"clwkcamara",0,1);
    
    console.log('添加摄像头请求:', {
        url,
        method: 'POST',
        data
    });

    try {
        const response = await axios({
            url,
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            data,
            timeout: 10000 // 10秒超时
        });
        
        if (!response.data || response.data.message !== 'success') {
            throw new Error(response.data?.message || '服务器返回未知错误');
        }
        
        console.log('添加摄像头成功:', response.data);
        return response.data;
    } catch (err) {
        const errorInfo = {
            request: { url, method: 'POST', data },
            response: err.response ? {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            } : null,
            error: {
                message: err.message,
                stack: err.stack
            }
        };
        
        console.error('添加摄像头失败:', errorInfo);
        
        // 格式化错误消息
        let errorMessage = '添加摄像头失败: ';
        if (err.response) {
            errorMessage += `HTTP ${err.response.status} - `;
            if (err.response.data?.message) {
                errorMessage += err.response.data.message;
            } else {
                errorMessage += '服务器错误';
            }
        } else if (err.request) {
            errorMessage += '请求未收到响应';
        } else {
            errorMessage += err.message;
        }
        
        throw new Error(errorMessage);
    }
}
