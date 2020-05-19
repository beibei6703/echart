
import Axios from '@src/utils/OArequest.js';
// D:\hh\statement\src\utils\OArequest.js
// oa流程类别
export const getprocessType = data =>
    Axios({
        method: 'post',
        url: '/oa/workFlow/findWorkFlowType',
        data
    });
// oa 流程数据
export const getprocessData = data =>
    Axios({
        method: 'get',
        url: '/oa/workFlow/findWorkFlowData?' + data,
        data
    });
// 根据流程类别查询类别下面所有的流程
export const getAllprocess = data =>
    Axios({
        method: 'post',
        url: '/oa/workFlow/findWorkFlowByType',
        data
    });
// 流程节点耗时
export const getprocessNodeTime = data =>
    Axios({
        method: 'post',
        url: '/oa/workFlow/findWorkFlowNodeTime',
        data
    });
// 获取oa所有数据
export const getOAdata = data =>
    Axios({
        method: 'get',
        url: '/oa/dashBoard',
        data
    });
// 需求明细
export const getOADetail = data =>
    Axios({
        method: 'post',
        url: '/oa/prdList',
        data
    });
// 查找oa需求名称
export const findDemandName = data =>
    Axios({
        method: 'get',
        url: '/oa/findToDoMatterName',
        data
    });