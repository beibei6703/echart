import Axios from '@src/utils/request';
// 花名返回用户信息
export const getUserInfo = data => Axios({
  method: 'get',
  url: '/common/token',
  data
});

export const getAvatar = data => Axios({
  method: 'get',
  url: `/common/getAvatar?workCodes=${data}`
});
