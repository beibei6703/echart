import Axios from '@src/utils/request';

// 用户组查询
export const getuserGrounp = data => Axios({
  method: 'post',
  url: '/group/selectGroup',
  data
});
