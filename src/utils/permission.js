/**
 * @description: 判断是否有权限渲染
 * @param {Array} permissions 权限列表 {String} key
 * @param {String} key 需要验证的权限
 * @return: true or false
 */
import store from '../store';

export const ifRender = (key) => {
  let permissions = store.getters.permissions;
  return permissions.includes(key);
};
