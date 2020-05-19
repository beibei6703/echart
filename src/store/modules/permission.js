// import { constantRoutes } from '@src/router/permissions.js';
// import { getPermission } from '@src/api/permission';
const state = {
    accessedRoutes: [],
    permissions: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.accessedRoutes = routes;
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions;
    }
};
function filterAsyncRoutes(constantRoutes, permissions) {
    let accessedRoutes = [];
    constantRoutes.forEach(item => {
        if (permissions.includes(item.path)) {
            accessedRoutes.push(item);
        }
    });
    return accessedRoutes;
}

const actions = {
    generateRoutes({ commit }, permissions) {
        return new Promise(resolve => {
            let accessedRoutes;
            accessedRoutes = filterAsyncRoutes(constantRoutes, permissions);
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes);
        });
    },
    getPermission({ commit }, workCodes) {
        return new Promise((resolve, reject) => {
            getPermission(workCodes)
                .then(response => {
                    const { data } = response;
                    // 初始化权限
                    const formatPermissions = [];
                    data.data &&
                        data.data.forEach(item => {
                            formatPermissions.push(item.menuValue);
                        });
                    commit('SET_PERMISSIONS', formatPermissions);
                    resolve(formatPermissions);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
