// const roleConfig = () => import('@src/view/role-config');

const Laylout = () => import('@src/layout');
export const constantRoutes = [
  // {
  //   path: '/userimpower',
  //   name: 'userimpower',
  //   meta: {
  //     title: '授权管理'
  //   },
  //   component: userImpower
  // },
  
];

export const currentRoutes = [
  {
    path: '/',
    name: '首页',
    meta: {
      title: '系统'
    },
    children: [],
    component: Laylout
  }
];
