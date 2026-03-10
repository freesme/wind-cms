/**
 * 环境变量使用示例
 * 
 * 这个文件展示了如何在项目中使用环境变量配置
 */

import {env, validateEnv} from '@/config/env';

/**
 * 1. 基础使用
 */
export function basicUsage() {
 // 读取 API 地址
 console.log('API Base URL:', env.apiBaseUrl);

 // 读取应用标题
 console.log('App Title:', env.appTitle);

 // 检查是否启用 Mock
 if (env.enableMock) {
  console.log('Mock is enabled');
 }
}

/**
 * 2. 环境判断
 */
export function environmentCheck() {
 if (env.isDev) {
  console.log('开发环境 - 启用调试功能');
 }

 if (env.isProd) {
  console.log('生产环境 - 禁用调试功能');
 }
}

/**
 * 3. 在 API 客户端中使用
 */
export function createApiClient() {
 const baseURL = env.apiBaseUrl;
 
 // 使用 axios 或其他 HTTP 客户端
 // const apiClient = axios.create({
 //   baseURL,
 //   timeout: 5000,
 // });
 
 return {baseURL};
}

/**
 * 4. 在认证服务中使用
 */
export function authService() {
 const tokenKey = env.tokenKey;
 const refreshTokenKey = env.refreshTokenKey;
 
 // 存储 token
 const setToken = (token: string) => {
  localStorage.setItem(tokenKey, token);
 };
 
 // 获取 token
 const getToken = () => {
  return localStorage.getItem(tokenKey);
 };
 
 return {setToken, getToken, tokenKey, refreshTokenKey};
}

/**
 * 5. 在生产环境验证环境变量
 */
export function initializeApp() {
 // 在生产环境启动时验证必需的环境变量
 if (env.isProd) {
   try {
     validateEnv();
    console.log('环境变量验证通过');
   } catch (error) {
    console.error('环境变量配置错误:', error);
     throw error;
   }
 }
}

/**
 * 6. 在 React 组件中使用
 */
export function ExampleComponent() {
 // 注意：NEXT_PUBLIC_* 开头的环境变量可以在客户端直接使用
 // 其他环境变量只能在服务端使用
 
 return (
   <div>
     <h1>{env.appTitle}</h1>
     <p>当前环境：{env.nodeEnv}</p>
     <p>API 地址：{env.apiBaseUrl}</p>
   </div>
 );
}
