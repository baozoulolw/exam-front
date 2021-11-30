import { createStore } from "vuex";
import persistedState from 'vuex-persistedstate' //首先引入

const store = createStore({
  state:() =>({
    userInfo:{}
  }),
  mutations:{
    userInfo:(state,value) => {
      state.userInfo = value;
    }
  },
  actions:{
    setUserInfo:(ctx,value) => {
      ctx.commit('userInfo',value);
    }
  },
  plugins: [persistedState ()] 
})

export default store