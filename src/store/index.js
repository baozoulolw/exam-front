import { createStore } from "vuex";
import persistedState from 'vuex-persistedstate' //首先引入

const store = createStore({
  state:() =>({
    userInfo:{},
    roleTree:[]
  }),
  mutations:{
    userInfo:(state,value) => {
      state.userInfo = value;
    },
    roleTree:(state,value) => {
      state.roleTree = value;
    },
  },
  actions:{
    setUserInfo:(ctx,value) => {
      ctx.commit('userInfo',value);
    },
    setRoleTree:(ctx,value) => {
      ctx.commit('roleTree',value);
    }
  },
  plugins: [persistedState ()]
})

export default store