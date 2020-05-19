import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
const service = axios.create({
    // baseURL: 'http://oareport.api.com'
    baseURL: '/'
    // withCredentials: true
})
// request拦截器
service.interceptors.request.use(config => {
    return config;
}, error => {
    console.log('requestError: ', error);
    Promise.reject(error);
})

// respone拦截器
// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const { code, message, success } = response.data;
    const Domain = window.location.href.split('.')[0];
    const twoDomain = Domain.split('//')[1];
    if (success === false && code === 10010 && twoDomain === 'oareport') {
        Message.error(message || 'Has Error');
        setTimeout(() => {
            window.location.href = `//www.test.com`;
        }, 800);
    }
    if (success === false && code === 10010 && twoDomain === 'report') {
        Message.error(message || 'Has Error');
        setTimeout(() => {
            window.location.href = `//www.api.com`;
        }, 800);
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;

