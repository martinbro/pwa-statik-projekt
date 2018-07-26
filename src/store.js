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
      //formodenlig forældet
      var s = 0
      //if(state.punktlast.length>-1) 
      state.punktlaster.forEach(element => {
        s += element.val
      })
      return s
    },

    getReaktanter: state =>{
      //formodenlig forældet
      //finder R2 ved at tage moment om R1
      var sum = 0
      var sumLast = 0
      const distR1 = state.reaktanter[0].x
      state.punktlaster.forEach(element => {
        sum += element.val*(element.x-distR1)
        sumLast += element.val
      });
      state.linjelaster.forEach(element =>{
        sumLast += Math.abs(element.x0 - element.x1)*element.val
        sum += Math.abs(element.x0 - element.x1)*element.val*(((element.x0 + element.x1)/2)-distR1)

      })
      //R2*L+(F1*x1+F2*x2+...)=0 <=>R2*L+sum=0 <=>
      const r2=-sum/100
      //R1+R2+F1+F2+...=0 <=>
      const r1= -(sumLast+r2)
     return [
       {navn:"R1",val:r1,x:state.reaktanter[0].x},
       {navn:"R2",val:r2,x:state.reaktanter[1].x}]
      },
    getAlleEnkeltkrafterSorteret: state =>{
      //finder R2 ved at tage moment om R1
      var sum = 0
      var sumLast = 0
      const arr = []
      const distR1 = state.reaktanter[0].x
      state.punktlaster.forEach((element)=> {
        arr.push(element)
        sum += element.val*(element.x-distR1)
        sumLast += element.val
      });
      state.linjelaster.forEach(element =>{
        sumLast += Math.abs(element.x0 - element.x1)*element.val
        sum += Math.abs(element.x0 - element.x1)*element.val*(((element.x0 + element.x1)/2)-distR1)
      })
      //R2*L+(F1*x1+F2*x2+...)=0 <=>R2*L+sum=0 <=>
      const r2=-sum/100
      //R1+R2+F1+F2+...=0 <=>
      const r1= -(sumLast+r2)
      arr.push( {navn:"R1", val:r1, x:state.reaktanter[0].x } )
      arr.push( {navn:"R2",val:r2,x:state.reaktanter[1].x})
      arr.sort((a, b) => {return a.x - b.x})
     return arr
    },

    getLinielastAggregeret: state =>{
      //kan udvides til ramps
      const arr = []
      const out = []
      var sumy = 0
      
      state.linjelaster.forEach((linlast,index) =>{
        //indlæser alle hendelser/ændringer
        arr.push({x:linlast.x0, y:linlast.val, nr:index})
        arr.push({x:linlast.x1, y:-linlast.val, nr:index})
      })
      //sortere 
      arr.sort((a, b) => {return a.x - b.x})
      arr.forEach((data,index) =>{
        sumy += data.y
        if(index>0){
          if(arr[index-1].x == data.x){
            out.pop()
          } 
        } 
        out.push({x:data.x, y:sumy, nr:data.nr})
      })
      return out
    },

    getSnitkraftAggregeret: (state, getters) =>{
      //laver først et linjeelement
      const linielast = getters.getLinielastAggregeret
      const enkeltKraft = getters.getAlleEnkeltkrafterSorteret
      const arr = []
      const out = []
      const param = {dydx:0}
     

      // Enkeltkrafter indlæses 
      enkeltKraft.forEach(kraft =>{
        arr.push({x:kraft.x,yleft:0, y:kraft.val , dydx:0, type:"E"})
      })

      linielast.forEach(elemen => {

        arr.push({x:elemen.x, yleft:0, y:0, dydx:elemen.y, type:"L"})
      })
      
      //sortere 
      arr.sort((a, b) => {return a.x - b.x})
      
      //linieelemet beregnes
      arr.forEach((data,index) => {
        if(data.type == "L"){
          param.dydx = data.dydx
        }
        if(0<index){
          //opdatere linieelementet
          data.dydx = param.dydx
         // data.dydxleft = arr[index-1].dydx
         

           data.yleft = arr[index-1].y + arr[index-1].dydx*(data.x-arr[index-1].x)
         
          data.y = arr[index-1].y + data.y + arr[index-1].dydx*(data.x-arr[index-1].x)
        }

      })
      arr.forEach((data,index) => {
        //kontrollerer for nulpunkter
        out.push(data)
        if ((index>0 && data.y*arr[index-1].y)<0 && data.x<100) {
          console.log('Nulpunkt detekteret mellem ', arr[index-1].x, data.x, "index", index);
          //finder nulpunkt
          switch(data.type) {
            case "L":
            //dy/dx=f´(x) <=> (0-y(x-1)-0)=f´(x-1) * dx <=>
              //console.log("Nulpunktet:",-arr[index-1].y/arr[index-1].dydx + arr[index-1].x);
              param.nulpunkt= -arr[index-1].y/arr[index-1].dydx + arr[index-1].x
              //arr[index-1].nulpunkt = param.nulpunkt

             // arr.push({x:arr[index-1].x, y:arr[index-1].y,  dydx:arr[index-1].dydx, type:"L"})
              param.y = arr[index-1].y+arr[index-1].dydx*(param.nulpunkt-arr[index-1].x)
              out.push({x:param.nulpunkt,yleft:param.y ,y:param.y,  dydx:arr[index-1].dydx, type:"L",nulpunkt:param.nulpunkt})
              //
              break;

            case "E":
                
                break;

            default:
              console.log("Hva fanden ???");
                
        }

        } 
        out.sort((a, b) => {return a.x - b.x})

      })
      return out
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
