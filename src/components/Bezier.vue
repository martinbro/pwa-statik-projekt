<template>
  <div class="bezier">
      <p>Bezier.vue</p>
      <svg viewBox="0 -100 100 100">
            
            <circle v-for="(q,index) in Q" v-bind:cx="Q[index][0]" v-bind:cy="-q[1]" r="0.5"></circle>
            
        <path  :d = "cubicBezier(Q)" fill="none" stroke="red" stroke-width="0.2" />
        <path  :d = "cubicBezierLiniesegment(Qlin)" fill="none" stroke="black" stroke-width="0.2" />
        <path  :d = "quadraticBezier(Q1)" fill="none" stroke="blue" stroke-width="0.1" />
      </svg>
    <p>{{cubicBezierLiniesegment(Qlin)}}</p>
    <p>{{cubicBezier(Q)}}</p>
  </div>
</template>

<script>
import * as math from 'mathjs'
export default {
  name: 'HelloWorld',
  props: {
  },
   data: function() {
      return {
        Q: [[0,70],
            [20,67.6],
            [40,50.8],
            [60,5.2]
        ],
        Q1: [[0,70],
            [40,50.8],
            [60,5.2]
        ],
        Qlin: [
          [0,70,0], //x0, f(x0), f´(x0)
          [60,5.2,-3.24] ////x0, f(x0), f´(x0)
        ],
      
        // punkter: [
        //     {x:0, y:1},
        //     {x:10, y:40},
        //     {x:20, y:42},
        //     {x:30, y:81},
        // ]
      }
  },
  methods:{
    quadraticBezier: function(Q) {
           
        
        const A = [ 
            [ 1, 0, 0],
            [ -0.5, 2, -0.5],
            [ 0, 0, 1 ]
        ]
        
        const p =  math.multiply(A, Q)
        
        const kurve = `M ${p[0][0]},${-1*p[0][1]} Q${p[1][0]},${-1*p[1][1]} ${p[2][0]},${-1*p[2][1]}  `
        
        return kurve 

      },
    cubicBezier: function(Q) {
      
      
      const A = [ 
        [ 1, 0, 0, 0],
          [ -5/6, 3, -1.5, 1/3],
          [ 1/3, -1.5, 3, -5/6],
          [ 0, 0, 0, 1 ]
        ]
        const p =  math.multiply(A, Q)
        
        const kurve = `M ${p[0][0]},${-1*p[0][1]} C${p[1][0]},${-1*p[1][1]} ${p[2][0]},${-1*p[2][1]} ${p[3][0]},${-1*p[3][1]} `
        
        return kurve 

      
      },
      cubicBezierLiniesegment: function(p) {

        //P´(0)=3(P(1)-P(0)) => P(1)=1/3*P´(0) + P(0)
        //P´(1)=3(P(3)-P(2))  => P(2)= -1/3*P´(0) + P(3)
        //http://graphics.stanford.edu/courses/cs148-09-fall/lectures/splines.pdf
        const p1x = 1/3*(p[1][0]-p[0][0]) + p[0][0]
        const p1y = 1/3*p[0][2]*(p[1][0]-p[0][0]) + p[0][1]
        const p2x = -1/3*(p[1][0]-p[0][0]) + p[1][0]
        const p2y = -1/3* p[1][2]*(p[1][0]-p[0][0]) + p[1][1]
        const kurve1 = `M ${p[0][0]},${-1*p[0][1]} C${p1x},${-1*p1y} ${p2x},${-1*p2y} ${p[1][0]},${-1*p[1][1]} `
        
        return kurve1 

      
      },
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
