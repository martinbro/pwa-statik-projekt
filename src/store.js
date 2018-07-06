import Vue from 'vue'
import Vuex from 'vuex'
//Vuex requires Promise. If your supporting browsers do not implement Promise (e.g. IE), you can use a polyfill library, such as es6-promise
//npm install es6-promise --save # NPM
//Furthermore, add the below line into anywhere in your code before using Vuex:
import 'es6-promise/auto'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0,
    punktlast:[],
  },
  mutations: {
    increment: state => state.count++,
    decrement: state => state.count--,

    addPunktlast(state,obj) {
      state.punktlast.push(obj)
    }

  },
  actions: {

  }
})
