import { getprocessType } from '@src/api/oa/index.js';
import { getMenuList } from '@src/api/menu/index.js';
import { getSystemList } from '@src/api/system/index.js';
const process = {
    state: {
        typeId: null,
        allProcess: [],
        type: '',
        systemMenuList: []

    },
    mutations: {
        getProcessAll(state, payload) {
            state.allProcess = payload;
        },
        getTypeId(state, payload) {
            state.typeId = payload;
        },
        changeType(state, payload) {
            state.type = payload;
        },
        changeSysemNull(state) {
            state.systemMenuList = [];
        },
        changeSysem(state, payload) {
            state.systemMenuList = payload;
        }

    },
    actions: {
        getProcessTypes(store, parms) {
            getprocessType(parms).then(res => {
                const data = res.data;
                if (data.success) {
                    store.commit("getProcessAll", data.data);
                }
            });
        },
        getsystems({ commit }) {
            commit('changeSysemNull', []);
            getSystemList({}).then(res => {
                const data = res.data;
                var arr = [];
                var systemMenus = [];
                var children = [];
                if (data.success && data.data.list) {
                    data.data.list.forEach((item, index) => {
                        if (item.isEnable === 1) {
                            systemMenus.push({
                                name: item.name,
                                isEnable: item.isEnable,
                                address: item.address,
                            });
                            const parms = {
                                systemId: item.id
                            };
                            getMenuList(parms).then(res => {
                                const resdata = res.data;
                                children = [];
                                if (resdata.success && resdata.data.list) {
                                    arr = resdata.data.list;
                                    for (var i = 0; i < arr.length; i++) {
                                        if (arr[i].level === 1) {
                                            children.push({
                                                id: arr[i].id,
                                                name: arr[i].name,
                                                address: arr[i].address,
                                                level: arr[i].level
                                            })
                                            // children.push(arr[i]);
                                        }
                                    }
                                    systemMenus[index].children = children;
                                    systemMenus[index].children.forEach((e, index1) => {
                                        const parmsdata = {
                                            parentId: e.id
                                        };
                                        getMenuList(parmsdata).then(res => {
                                            const data2 = res.data;
                                            if (data2.success && data2.data.list) {
                                                e.children = data2.data.list;
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                    const defaultRouter = {
                        name: '系统设置',
                        address: '',
                        children: [{
                            level: 1,
                            name: '系统列表',
                            address: 'https://report.api.com/#/systemlist',
                            children: []
                        }, {
                            level: 1,
                            name: '菜单管理',
                            address: 'https://report.api.com/#/menuManage',
                            children: []
                        }]
                    }
                    systemMenus.push(defaultRouter);
                    commit('changeSysem', systemMenus);
                }
            });
        }
    }
};
export default process;