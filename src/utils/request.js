import axios from 'axios';
import Vue from 'vue';
import { walkTreeNode } from 'element-ui/packages/table/src/util';
import de from 'element-ui/src/locale/lang/de';
import ElementUI from 'element-ui';


const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: '/ruleEngine',
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject();
    }
);


service.interceptors.response.use(
    response => {
        if (response.data.code === '0000') {
            return response.data;
        } else {
            let err=ElementUI.Message({
                message: response.data.message,
                type: 'error'
            });
            return Promise.reject(response);
        }
    },
    error => {
        ElementUI.Message({
            message: error,
            type: 'error'
        });
        return Promise.reject(error);
    }
);

export default service;
