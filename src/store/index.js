import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        openTab: [],  // 已打开的标签页
        activeIndex: '/'
    },
    mutations: {
        // 添加tabs
        add_tabs (state, data) {
            this.state.openTab.push(data);
        },
        // 删除tabs
        del_tabs (state, route) {
            let index = 0;
            for (let option of state.openTab) {
            if (option.route === route) {
                break;
            }
            index++;
            }
            this.state.openTab.splice(index, 1);
        },
        // 设置当前激活的tab
        set_active_index (state, index) {
            this.state.activeIndex = index;
        }
    },
    actions:{
        addFunc(context,data){
            context.commit('add_tabs',data)
        },
        delFunc(context,route){
            context.commit('del_tabs',route)
        },
        setFunc(context,index){
            context.commit('set_active_index',index)
        }
    }
})

export default store
