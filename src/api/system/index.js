
import Axios from '@src/utils/request';
// 系统列表
export const getSystemList = data =>
    Axios({
        method: 'post',
        url: '/system/page',
        data
    });
// 删除系统
export const getdeleteSystem = data =>
    Axios({
        method: 'get',
        url: '/system/delete?id=' + data,
    });
// 新增系统
export const getAddSystem = data =>
    Axios({
        method: 'post',
        url: '/system/add',
        data
    });
// 获取系统管理员
export const getAdministrator = data =>
    Axios({
        method: 'post',
        url: '/system/listAdministrator',
        data
    });
// 更新系统
export const getsystemUpdate = data =>
    Axios({
        method: 'post',
        url: '/system/update',
        data
    });