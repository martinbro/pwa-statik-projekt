
<template>
  <div class="Last">
    <p>Lastfordeling</p>
     <p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </p>
    <svg width="700" height="700" viewBox="0 -50 100 100">
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <defs>
          <pattern id="pattern1"  x="1" y="0" width="2" height="50" patternUnits="userSpaceOnUse" >
            
             <line x1="0" y1="50" x2="0" y2="0" stroke-width="0.2" style=" ;stroke:#006600;"/>
             <!--path d="M3,0 v50 l-0.3,-2" stroke="red" fill="none" stroke-width="0.1"/-->
          </pattern>
       </defs>
       <!--path id="punktlast" d = "M20,20 L20,0 l-0.5,2 1,0 -0.5,-2" fill="blue" stroke="blue" stroke-width="0.1" />
       <!--path id="punktlast" :d = "punktlastF()" fill="red" stroke="red" stroke-width="0.1" /-->
       <path id="linjelasterSVG" :d = "linjelasterSVG" fill="url(#pattern1)" stroke="blue" stroke-width="0.1" />
       <path id="reaktanterSVG" :d = "reaktanterSVG" fill="red" stroke="red" stroke-width="0.1" />
       <path id="punktlasterSVG" :d = "punktlasterSVG" fill="blue" stroke="blue" stroke-width="0.1" />
       <text class="small" v-for="p in punktlaster" :x="p.x" :y="p.val" >{{p.navn}}</text>
    </svg>
  </div>
</template>

<script>
import * as math from "mathjs";
import store from "@/store";
export default {
  name: "Last",
  data: function() {
    return {
      punktlaster: store.state.punktlaster,
      reaktanter: store.getters.getReaktanter,
      linjelaster: store.state.linjelaster,
      L: store.state.L
    };
  },
  props: {},
  computed: {
    punktlasterSVG: function() {
      var str = "M0,0";
      this.punktlaster.forEach(data => {
        const dy = Math.sign(data.val) * 2;
        str += ` M${data.x},${data.val} L${
          data.x
        },0 l-0.5,${dy} 1,0 -0.5,${-dy}`;
      });
      // console.log(str);

      return str;
    },
    linjelasterSVG: function() {
      // const arr = [];
      // const out = ["M 0,0"];
      var str = "M 0,0";

      // store.getters.getLinielastAggregeret.forEach(data => {
      //   arr.push({ x: data.x, y: data.y });
      //   //arr.push({ x: data.x1, y: data.val });
      //   // str += ` M${data.x0},0  V${data.val} H${data.x1} V0 `
      // });
      // arr.sort((a, b) => {return a.x - b.x});
      //console.log("sorteret: ", arr);

       store.getters.getLinielastAggregeret.forEach(data => {
        str += ` H ${data.x} V${data.y}`;
      });

      return str;
    },

    reaktanterSVG: function() {
      var str = "M0,0";
      store.getters.getReaktanter.forEach(data => {
        const dy = Math.sign(data.val) * 2;
        str += ` M${data.x},${data.val} L${
          data.x
        },0 l-0.5,${dy} 1,0 -0.5,${-dy}`;
      });
      return str;
    }

  },
  methods: {
    increment() {
      store.commit("increment");
      store.commit("addPunktlaster", {
        navn: "F" + store.state.count,
        val: Math.sign(Math.random() - 0.7) * (Math.random() * 40 + 7),
        x: Math.random() * 97
      });
      // store.commit('updateR',this.beregnR )
     // console.log(store.getters.getReaktanter);
    },
    decrement() {
      const venstrep = Math.random()*80
      const højrep = Math.random()*(100-venstrep) + venstrep
      store.commit("increment");
      store.commit("addLinjelaster", {
        navn: "f" + store.state.count + "a",
        val: -Math.random()*3-1,
        x0: venstrep ,
        x1: højrep
      });
      // store.commit("addLinjelaster", {
      //   navn: "f" + store.state.count + "b",
      //   val: -1,
      //   x0: 50,
      //   x1: 80
      // });
      //console.log(store.getters.getReaktanter);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {
  fill: blue;
  font: 2px sans-serif;
}
.punktlasterSVG {
  fill: blue;
  stroke: blue;
}
</style>