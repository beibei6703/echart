import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
// 添加请求拦截器
axios.interceptors.request.use(
    function(config) {
        // 在发送请求之前做些什么
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        const { code, message, success } = response;
        const Domain = window.location.href.split('.')[0];
        const twoDomain = Domain.split('//')[1];
        // const twoDomain = window.location.href.split('.')[1];
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
    },
    function(error) {
        // 对响应错误做点什么
        // Message.error(error.response.data.message || 'Has Error');
       
        const twoDomain = window.location.href.split('.')[1];
        if (error.response.data.code === 10001 &&
            (twoDomain === 'test' || twoDomain === 'api')) {
            setTimeout(() => {
                window.location.href = `//www.${window.location.href.split('.')[1]}.com`;
            }, 800);
        }
        return Promise.reject(error);
    }
);
export default params => {
    axios.defaults.withCredentials = true;
    const { url, method, data, headers } = params;
    let currentParams = {};
    if (method === 'get') {
        currentParams = {
            params: data
        };
    } else if (method === 'post') {
        if (headers) {
            currentParams = {
                data: data
            };
        } else {
            currentParams = {
                data: qs.stringify(data)
            };
        }
    } else {
        currentParams = {
            params: data
        };
    }
    return axios(
        Object.assign(
            {
                url: url,
                method: method,
                headers
            },
            currentParams
        )
    );
};
