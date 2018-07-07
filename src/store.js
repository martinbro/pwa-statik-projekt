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
    L:10,
    punktlaster:[],
    reaktanter:[
      {navn:"R1",val:0,x:0},
      {navn:"R2",val:0,x:100},
    ]
   // sortedpunktlast:[],
  },
  getters: {
    // getpunktlast: state => {
    //   var merge = state.punktlast.concat(state.reaktanter)
    //   return merge.sort((a,b)=>{return a.x-b.x })
    // },
    getSumLast: state =>{
      var s = 0
      //if(state.punktlast.length>-1) 
      state.punktlaster.forEach(element => {
        s += element.val
      })
      return s
    }
  },
  mutations: {
    increment: state => state.count++,
    decrement: state => state.count--,

    addPunktlaster:(state,obj)=>{state.punktlaster.push(obj)},
    updateR:(state,obj)=>{
      state.reaktanter[0].val = obj.R1val
      state.reaktanter[1].val = obj.R2val

      //console.log(state.reaktanter[0].val);
      // console.log("her",state.reaktanter[0].val, ", ",obj.R1val);
      
    }
  },
  actions: {

  }
})
