import Axios from '@src/utils/request';
// 系统列表
export const getMenuList = data =>
    Axios({
        method: 'post',
        url: '/menu/page',
        data
    });
// 添加菜单
export const getMenuAdd = data =>
    Axios({
        method: 'post',
        url: '/menu/add',
        data
    });
// 更新菜单
export const getMenuUpdate = data =>
    Axios({
        method: 'post',
        url: '/menu/update',
        data
    });
// 删除菜单
export const getMenudelete = data =>
    Axios({
        method: 'get',
        url: '/menu/delete?id=' + data,
    });