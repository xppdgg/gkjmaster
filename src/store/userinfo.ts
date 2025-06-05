import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

// 从 cookie 获取用户信息的函数
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

export const userInfomation = defineStore('userInfomation', {
  state: () => {
    return {
      ...getUserInfoFromCookies(),
      menuList: [],
      menuactive: ''
    }
  },
  actions: {
    setMenuactive(menuactive: string) {
      this.menuactive = menuactive
    },
    // 刷新用户信息方法，从 cookie 重新获取最新数据
    refreshUserInfo() {
      const userInfo = getUserInfoFromCookies()
      
      // 更新 store 中的所有用户信息字段
      Object.keys(userInfo).forEach(key => {
        this[key] = userInfo[key];
      });
      
      console.log('用户信息已从 cookie 刷新', userInfo)
      return userInfo
    }
  }
})