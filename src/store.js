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
    linjelaster:[],
    reaktanter:[
      {navn:"R1",val:0,x:0},
      {navn:"R2",val:0,x:100},
    ],
    // snitkraftsArr:[],
    // snitkraftsnulpunkter:[],

    momenter:[],
  },
  getters: {
 
    getSumLast: state =>{
      var s = 0
      //if(state.punktlast.length>-1) 
      state.punktlaster.forEach(element => {
        s += element.val
      })
      return s
    },
    getReaktanter: state =>{
      
      //finder R2 ved at tage moment om R1
      var sum = 0
      var sumLast = 0
      const distR1 = state.reaktanter[0].x/100*state.L
      state.punktlaster.forEach(element => {
        sum += element.val*(element.x/100*state.L-distR1)
        sumLast += element.val
      });
      state.linjelaster.forEach(element =>{
        sumLast += Math.abs(element.x0 - element.x1)*element.val
        sum += Math.abs(element.x0 - element.x1)*element.val*(((element.x0 + element.x1)/2)/100*state.L-distR1)

      })
      //R2*L+(F1*x1+F2*x2+...)=0 <=>R2*L+sum=0 <=>
      const r2=-sum/state.L 
      //R1+R2+F1+F2+...=0 <=>
      const r1= -(sumLast+r2)
     return [
       {navn:"R1",val:r1,x:0},
       {navn:"R2",val:r2,x:100}]
      },
  },
  mutations: {
    increment: state => state.count++,
    decrement: state => state.count--,

    addPunktlaster:(state,obj)=>{
      //indlæser punktlasterne
      state.punktlaster.push(obj)
    },
    addLinjelaster:(state,obj)=>{
      //indlæser punktlasterne
      state.linjelaster.push(obj)
    },

    updateR:(state,obj)=>{
      state.reaktanter[0].val = obj.R1val
      state.reaktanter[1].val = obj.R2val
    },
    // updateSnitkraft:(state,obj)=>{
    //   state.snitkraftsArr.splice(0)
    //   state.snitkraftsArr.push(obj)
    // },
  },
  actions: {

  }
})
