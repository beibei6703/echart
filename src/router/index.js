import Vue from 'vue';
import Router from 'vue-router';
// 按需加载组件
const Laylout = () => import('@src/layout');
const oaRequired = () => import('@src/view/OA/oaRequired.vue');
const OAflow = () => import('@src/view/OA/OAflow.vue');
const systemInfo = () => import('@src/view/system/systemInfo.vue');
const menuManage = () => import('@src/view/system/menuManage.vue');
const systemlist = () => import('@src/view/system/systemlist.vue');
Vue.use(Router);
export const constantRoutes = [
    {
        path: '/',
        name: '',
        meta: {
            title: '报表系统'
        },
        component: Laylout,
        children: [
            {
                path: '/oaRequired',
                name: 'OA需求报表',
                mate: {
                    title: 'OA系统需求报表'
                },
                component: oaRequired
            },
            {
                path: '/systemlist',
                name: '系统列表',
                mate: {
                    title: '系统列表'
                },
                component: systemlist
            },
            {
                path: '/OAflow',
                name: 'OA系统流程数据报表',
                mate: {
                    title: 'OA系统流程数据报表-业务集成类'

                },
                component: OAflow
            },
           
            {
                path: '/systemInfo',
                name: '系统信息',
                mate: {
                    title: '系统信息'

                },
                component: systemInfo
            },
            {
                path: '/menuManage',
                name: '菜单管理',
                mate: {
                    title: '菜单管理'

                },
                component: menuManage
            },

            {
                path: '/systemlist',
                name: '系统列表',
                mate: {
                    title: '系统列表'

                },
                component: systemlist
            }

        ]
    }
];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
