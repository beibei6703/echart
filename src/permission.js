import router, { resetRouter } from './router';
import store from './store';
import { Message } from 'element-ui';
// import { currentRoutes } from './router/permissions';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import docCookies from '@src/utils/cookie';
import Axios from '@src/utils/requestFormData';

NProgress.configure({ showSpinner: false }); // NProgress Configuration
router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    // set page title
    document.title = to.meta.title || '报表系统';

    // determine whether the user has logged in
    const hasToken = docCookies.getItem('JESSIONID');
    if (hasToken && (hasToken !== null && hasToken !== undefined)) {
        // store.dispatch('getsystems');
        const parms = {
            id: 0
        };
        // 获取所以的流程
        store.dispatch('getProcessTypes', parms);
        // determine whether the user has obtained his permission roles through getInfo
        // const hasPermissions = store.getters.permissions && store.getters.permissions.length > 0;
        var formData = new FormData();
        formData.append('mark', '88b63eb5-46c1-48d9-ab4d-a3b9f504ef2f');
        Axios({
            method: 'post',
            url: '//ww.api.com/authority_system/permission/getMenuByworkCodeAndSystemId',
            // url: '//ww.test.com/authority_system/permission/getMenuByworkCodeAndSystemId',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            const data = res.data;
            const Domain = window.location.href.split('.')[0];
            const twoDomain = Domain.split('//')[1];
            const { code, success } = data;
            if (success === false && code === 10010 && twoDomain === 'oareport') {
                Message.error('请登录www!');
                setTimeout(() => {
                    window.location.href = `https://www.api.com?backUrl=http://oareport.api.com`;
                }, 800);
                return;
            }
            if (success === false && code === 10010 && twoDomain === 'report') {
                Message.error('请登录www!');
                setTimeout(() => {
                    window.location.href = `https://www.api.com?backUrl=http://report.api.com`;
                }, 800);
                return;
            }
            if (data.success && data.code === 0) {
                if (data.message !== '没有关联的菜单') {
                    let menus = data.data;
                    if (data.data && data.data.length > 0) {
                        menus.forEach((item, index) => {
                            if (item.menuValue === '/systemSeting') {
                                store.commit('showSystem', true);
                            }
                        });
                        next();
                    } else {
                        store.commit('showSystem', false);
                    // const Domain = window.location.href.split('.')[0];
                    // const twoDomain = Domain.split('//')[1];
                    // window.location.href = `${twoDomain}.api.com`;
                    }
                } else {
                    store.commit('showSystem', false);
                }
            }
        }, error => {
            store.commit('showSystem', false);
            Message.error(error || 'Has Error');
            NProgress.done();
        });
        next();
    } else {
        resetRouter(); // 重置路由
        // 如果是线上或者测试环境才跳转 ;
        const Domain = window.location.href.split('.')[0];
        const twoDomain = Domain.split('//')[1];
        if (twoDomain === 'oareport') {
            window.location.href = `//www.test.com`;
        }
        if (twoDomain === 'report') {
            window.location.href = `//www.api.com`;
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
