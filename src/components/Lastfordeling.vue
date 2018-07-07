
<template>
  <div class="Last">
    <p>Lastfordeling</p>
     <p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </p>
    <svg width="700" height="700" viewBox="0 -50 100 100">
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <!--path id="punktlast" d = "M20,20 L20,0 l-0.5,2 1,0 -0.5,-2" fill="blue" stroke="blue" stroke-width="0.1" />
       <!--path id="punktlast" :d = "punktlastF()" fill="red" stroke="red" stroke-width="0.1" /-->
       <path id="punktlasterSVG" :d = "punktlasterSVG" fill="blue" stroke="blue" stroke-width="0.1" />
       <path id="reaktanterSVG" :d = "reaktanterSVG" fill="red" stroke="red" stroke-width="0.1" />
       <text class="small" v-for="p in punktlaster" :x="p.x" :y="p.val" fill=red>{{p.navn}}</text>
    </svg>
  </div>
</template>

<script>
import * as math from "mathjs"
import store from "@/store"
export default {
  name: 'Last',
  data: function() {
    return {
      punktlaster: store.state.punktlaster,
      reaktanter: store.state.reaktanter,
      L: store.state.L
    }
  },
  props: {
  },
  computed:{
    punktlasterSVG:function (){
      var str = "M0,0"  
      this.punktlaster.forEach(data => {
        const dy = Math.sign(data.val)*2
        str += ` M${data.x},${data.val} L${data.x},0 l-0.5,${dy} 1,0 -0.5,${-dy}`   
      })
      console.log(str);
      
       return str
    },
    reaktanterSVG:function (){
      var str = "M0,0"  
      this.reaktanter.forEach(data => {
        const dy = Math.sign(data.val)*2
        str += ` M${data.x},${data.val} L${data.x},0 l-0.5,${dy} 1,0 -0.5,${-dy}`   
      })
       return str
    },
    
    beregnR () {
      //finder R2 ved at tage moment om R1
      var sum=0
      const distR1 = this.reaktanter[0].x/100*this.L
      this.punktlaster.forEach(element => {
        sum += element.val*(element.x/100*this.L-distR1)
      });
      //R2*L+(F1*x1+F2*x2+...)=0 <=>R2*L+sum=0 <=>
      const r2=-sum/this.L 
      //R1+R2+F1+F2+...=0 <=>
      const r1= -(store.getters.getSumLast+r2)
     return {R1val:r1,R2val:r2}

    }

  },
  methods:{

    increment () {
      store.commit('increment')
      store.commit('addPunktlaster',{navn:"F"+store.state.count,val:((Math.sign( Math.random()-0.7))*(Math.random()*40+7)),x:Math.random()*97})
      store.commit('updateR',this.beregnR )
    },
    decrement () {
    	store.commit('decrement')
    }
    
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {fill:blue; font: 2px sans-serif; }
.punktlasterSVG{fill:blue; stroke: blue}

</style>