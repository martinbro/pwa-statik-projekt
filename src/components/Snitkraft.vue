
<template>
  <div class="Snitkraft">
    <p>Snitkræfter</p>
    <svg width="700" height="700" viewBox="0 -50 100 100">
       <path id="punktlast" :d = "punktlasterSVG" fill="yellow" stroke="purple" stroke-width="0.1" />
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <text class="small" v-for="(p,index) in arr" :x="p.x" :y="p.val" fill=red>F{{index+1}}</text>
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
    punktlasterSVG:function (){
      //const dat = store.state.punktlast
      var str = "M0,0"
      var vektorsum=0
      this.arr = this.reaktanter.concat(this.punktlaster)
      this.arr.sort((a,b)=>{return a.x-b.x })
      this.arr.forEach((data,index) => {
        //console.log(data,index);
        //vektorsum += -data.val
        data.val = vektorsum
        if (index<1) {
          str += `M${data.x},0 H${data.val} `   
        } else {
          str += `H${data.x}  V${vektorsum} `   
        }
        
        //punktlastText(data)
      })
      // if(this.punktlaster.length >2){
        
        //   this.punktlaster.sort((a,b)=>{return a.x-b.x });
        
      // }
       // console.log(str);
      return str +" H0"
    }
    


    


  },
  methods:{
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