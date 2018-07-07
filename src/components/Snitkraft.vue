
<template>
  <div class="Snitkraft">
    <p>Snitkræfter</p>
    <svg width="700" height="700" viewBox="0 -50 100 100">
       <path id="punktlast" :d = "punktlasterSVG()" fill="yellow" stroke="purple" stroke-width="0.1" />
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <text class="small" v-for="(p,index) in arr" :x="p.x" :y="p.y" fill=red>F{{index+1}}</text>
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
      reaktanter: store.state.reaktanter,
      arr:[]
    }
  },
  props: {
  },
  computed:{
    getpunktlaster: function () {
      this.arr.splice(0)
      this.reaktanter.forEach((data)=>{
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
      store.commit('updateSnitkraft',this.arr)
      return this.arr
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