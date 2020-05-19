// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import '@src/styles/index.less';
import router from './router';
import store from './store';
import VueRouter from 'vue-router';
// import 'element-ui/lib/theme-chalk/index.css';
import { successMsg, errorMsg } from '@src/utils/message.js';
import './permission';
const routerPush = VueRouter.prototype.push; // permission control
Vue.use(ElementUI);

Vue.config.productionTip = false;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
};
Vue.prototype.successMsg = successMsg;
Vue.prototype.errorMsg = errorMsg;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
