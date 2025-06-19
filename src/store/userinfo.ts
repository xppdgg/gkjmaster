import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

// 从 URL 参数获取用户信息的函数
const getUserInfoFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)
  
  return {
    companyid: urlParams.get('companyid') || '',
    company: urlParams.get('company') || '',
    login_user_id: urlParams.get('userid') || urlParams.get('username') || '',
    login_user: urlParams.get('userid') || urlParams.get('username') || '',
    userid: urlParams.get('userid') || urlParams.get('username') || '',
    login_user_name: urlParams.get('username') || '',
    role_name: urlParams.get('role_name') || '',
    roleid: urlParams.get('roleid') || '',
    uuid: urlParams.get('uuid') || '',
    uuidName: urlParams.get('uuidName') || '',
    token: urlParams.get('token') || '',
    tokenExpireTime: urlParams.get('tokenExpireTime') || '',
    refreshToken: urlParams.get('refreshToken') || '',
    refreshTokenExpireTime: urlParams.get('refreshTokenExpireTime') || '',
    isLogin: urlParams.get('token') ? true : false, // 如果有token就认为已登录
    clwkgroup_id: urlParams.get('clwkgroup_id') || '',
    clwkline_id: urlParams.get('clwkline_id') || '',
    clwkdanyuan_id: urlParams.get('clwkdanyuan_id') || '',
    clwkstation_id: urlParams.get('clwkstation_id') || '',
    clwkmachine_id: urlParams.get('clwkmachine_id') || ''
  }
}

// 从 cookie 获取用户信息的函数（保持原有逻辑作为备用）
const getUserInfoFromCookies = () => {
  // 获取用户ID，优先使用 login_user_id，如果不存在则尝试使用 login_user
  const userId = Cookies.get('login_user_id') || Cookies.get('login_user') || '1';
  
  return {
    companyid: Cookies.get('companyid') || '1',
    company: Cookies.get('company') || '天正',
    
    // 使用正确的字段名 login_user_id
    login_user_id: userId,
    // 保留 login_user 以兼容旧代码
    login_user: userId,
    // 添加 userid 作为别名，供 axios 配置使用
    userid: userId,
    
    login_user_name: Cookies.get('login_user_name') || 'admin',
    role_name: Cookies.get('role_name') || 'Admin',
    roleid: Cookies.get('roleid') || '1',
    uuid: Cookies.get('uuid') || '',
    uuidName: Cookies.get('uuidName') || '',
    token: Cookies.get('token') || '',
    tokenExpireTime: Cookies.get('tokenExpireTime') || '',
    refreshToken: Cookies.get('refreshToken') || '',
    refreshTokenExpireTime: Cookies.get('refreshTokenExpireTime') || '',
    isLogin: Cookies.get('isLogin') || false,
    clwkgroup_id: Cookies.get('clwkgroup_id') || '',
    clwkline_id: Cookies.get('clwkline_id') || '',
    clwkdanyuan_id: Cookies.get('clwkdanyuan_id') || '',
    clwkstation_id: Cookies.get('clwkstation_id') || '',
    clwkmachine_id: Cookies.get('clwkmachine_id') || ''
  }
}

// 合并获取用户信息的函数，优先从URL参数读取，然后从cookie读取
const getUserInfo = () => {
  const urlInfo = getUserInfoFromURL()
  const cookieInfo = getUserInfoFromCookies()
  
  // 合并信息，URL参数优先级更高
  const mergedInfo = { ...cookieInfo }
  
  // 只有当URL参数存在且不为空时才覆盖cookie值
  Object.keys(urlInfo).forEach(key => {
    if (urlInfo[key] && urlInfo[key] !== '') {
      mergedInfo[key] = urlInfo[key]
    }
  })
  
  return mergedInfo
}

export const userInfomation = defineStore('userInfomation', {
  state: () => {
    return {
      ...getUserInfo(),
      menuList: [],
      menuactive: ''
    }
  },
  actions: {
    setMenuactive(menuactive: string) {
      this.menuactive = menuactive
    },
    // 刷新用户信息方法，重新获取最新数据
    refreshUserInfo() {
      const userInfo = getUserInfo()
      
      // 更新 store 中的所有用户信息字段
      Object.keys(userInfo).forEach(key => {
        this[key] = userInfo[key];
      });
      
      console.log('用户信息已刷新', userInfo)
      return userInfo
    },
    // 新增：从URL参数更新用户信息
    updateFromURL() {
      const urlInfo = getUserInfoFromURL()
      
      // 只更新URL中存在的参数
      Object.keys(urlInfo).forEach(key => {
        if (urlInfo[key] && urlInfo[key] !== '') {
          this[key] = urlInfo[key]
        }
      })
      
      console.log('从URL参数更新用户信息', urlInfo)
      return urlInfo
    }
  }
})