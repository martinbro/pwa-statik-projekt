<template>
  <div class="statik">
    <h1>Statik</h1>
    <p>{{ count }}</p>
  <p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </p>
    <p>så skal der regnes</p>
    <p>{{val()}}</p>
    <bezier></bezier>
  </div>
</template>

<script>
// @ is an alias to /src
import bezier from "@/components/Bezier.vue";
import store from "@/store";

import * as math from "mathjs";

export default {
  name: "statik",
  components: {
    bezier
  },
  data: function() {
    return {};
  },
  computed: {
    count () {
	    return store.state.count
    }
  },
  methods: {
    increment () {
      store.commit('increment')
      store.commit('addPunktlast',{navn:"F1",val:10,x:3})

    },
    decrement () {
    	store.commit('decrement')
    },
    val: function() {
      //   const t1 = 0
      //   const t2 = 1/3
      //   const t3 = 2/3
      //   const t4 = 1

      // const s1 = 0
      // const s2 = 1/2
      // const s3 = 1
      //   const s4 = 1

      // const M = [
      //       [1, 0, 0, 0],
      //       [-3, 3, 0, 0],
      //       [3, -6, 3, 0],
      //       [-1, 3, -3, 1]
      // ]

      //  const M = [
      //       [1, 0, 0],
      //       [-2, 2, 0],
      //       [1, -2, 1]
      // ]

      // const M1 = [
      //     [-1, 3, -3, 1],
      //     [3, -6, 3, 0],
      //     [-3, 3, 0, 0],
      //     [1, 0, 0, 0]
      // ]
      // const T = math.matrix([
      //     [1, s1, s1*s1, s1*s1*s1],
      //     [1, s2, s2*s2, s2*s2*s2],
      //     [1, s3, s3*s3, s3*s3*s3],
      //     [1, s4, s4*s4, s4*s4*s4],
      // ])
      // const T = math.matrix([
      //     [1, s1, s1*s1],
      //     [1, s2, s2*s2],
      //     [1, s3, s3*s3],

      // ])

      // const TtT =  math.multiply(math.transpose(T),T)
      // const TtTinvTt = math.multiply(math.inv(TtT),math.transpose(T))
      // const A = math.multiply(math.inv(M),TtTinvTt)
      // const A = [
      //     [ 1, 0, 0, 0],
      //     [ -5/6, 3, -1.5, 1/3],
      //     [ 1/3, -1.5, 3, -5/6],
      //     [ 0, 0, 0, 1 ]
      // ]
      const A = [[1, 0, 0], [-0.5, 2, -0.5], [0, 0, 1]];

      const Q = [[0, 0], [10, 38.51851852], [20, 41.48148148], [30, 80]];

      return A;
    }
  }
};
</script>