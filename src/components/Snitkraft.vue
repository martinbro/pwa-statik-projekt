
<template>
  <div class="Snitkraft">
    <pre>{{getlaster}}</pre> 
    <p>Snitkræfter</p>
    <svg width="700" height="700" viewBox="0 -50 100 100">
       <path id="punktlast" :d = "punktlasterSVG()" fill="yellow" stroke="purple" stroke-width="0.1" />
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <text class="small" v-for="(p,index) in arr" :x="p.x" :y="-p.y" fill=red>{{p.y}}</text>
    </svg>
  </div>
</template>

<script>
import * as math from "mathjs"
import store from "@/store"
export default {
  name: 'Snitkraft',
  data: function() {
    return {
      punktlaster: store.state.punktlaster,
      linjelaster: store.state.linjelaster,
      //reaktanter: store.state.reaktanter,
      arr:[]
    }
  },
  props: {
  },
  computed:{
    getpunktlaster: function () {
      this.arr.splice(0)
      store.getters.getReaktanter.forEach((data)=>{
        this.arr.push({x:data.x,y:data.val,lasttype:"punktlast"})
      })
      this.punktlaster.forEach((data)=>{
        this.arr.push({x:data.x,y:data.val,lasttype:"punktlast"})
      })
      this.arr.sort((a,b)=>{return a.x-b.x })
      this.arr.forEach((data,index)=>{
        
        if (index>0) {
        data.y += this.arr[index-1].y
        } 
      })

      //store.commit('updateSnitkraft',this.arr)

      return this.arr

    },
    getlaster: function () {
      const arr = []
      const out =[]
      //Reaktanter
      store.getters.getReaktanter.forEach((data)=>{
      arr.push({x:data.x,y:data.val,lasttype:"punktlast",navn:data.navn, svg:`H ${data.x} v ${data.val}`})
      })
      //punktlaster
      this.punktlaster.forEach((data)=>{
        arr.push({x:data.x,y:data.val,lasttype:"punktlast",navn:data.navn,svg:`H ${data.x} v ${data.val}`})
      })
      // //linielaster (nye endepunkter pkt tilføjes)
      // this.linjelaster.forEach((data,index)=>{
      //   arr.push({x:data.x0,y:0,lasttype:"linjelaststart",navn:data.navn,svg:"l"})
      //   arr.push({x:data.x1,y:data.val*Math.abs(data.x1-data.x0),lasttype:"linjelastslut",navn:"",svg:})
      // })

      arr.sort((a,b)=>{return a.x-b.x })
      // arr.forEach((pktlast)=>{
      //   if (pktlast.x < linlast.x0 && pktlast.x < linlast.x1 ) {
      //   }
      // })

      this.linjelaster.forEach((linlast)=>{
        var flag1 = true
        var flag2 = true
        arr.forEach((pktlast,index)=>{
          if (pktlast.x > linlast.x1 && flag2) {
            arr.splice(index, 0,{x:linlast.x1,y:0,lasttype:"linjelaststop",navn:linlast.navn,svg:"l"} );
  
             flag2=false       
          }
          if (pktlast.x > linlast.x0 && flag1) {
            arr.splice(index, 0,{x:linlast.x0,y:0,lasttype:"linjelaststart",navn:linlast.navn,svg:"l"} )
              flag1=false       
          }
        })
      })
      

      //store.commit('updateSnitkraft',this.arr)
      return arr
    },



    


  },
  methods:{
        punktlasterSVG:function (){
      var str = "M0,0"
      this.getpunktlaster.forEach((data,index) => {

        if (index<1) {
          str += `M${data.x},0 V${-data.y} `   
        } else {
          str += ` H${data.x}  V${-data.y} `   
        }
      })
       return str +" H0"
    },
    punktlastText:function (data){
      
      
      return ""
    },
      punktlastF:function () {
          const data = {val:-30,x:40}
          const dy = Math.sign(data.val)*2
           return `M${data.x},${data.val} L${data.x},0 l-0.5,${dy} 1,0 -0.5,${-dy}`
          
      }
    
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {fill:blue; font: 2px sans-serif; }

</style>