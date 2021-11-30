import { createStore } from "vuex";

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
  }
})

export default store