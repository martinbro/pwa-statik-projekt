<template>
  <div class="bezier">
      <p>Bezier.vue</p>
      <svg  viewBox="0 -100 200 100" preserveAspectRatio="none">
            
            <circle v-for="q in Q" :cx="q[0]" :cy="-q[1]" r="0.5" stroke="orange" stroke-width="0.1" fill="none" />
            
        <path  :d = "cubicBezier(Q)" fill="none" stroke="red" stroke-width="0.1" />
        <path  :d = "cubicBezierLiniesegment(Qlin)" fill="none" stroke="black" stroke-width="0.1" />
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
        Q: [[0,0],
            [5,39.37250],
            [20,39.74],
            [30,79.11]
        ],
        Q1: [[0,0],
            [10,49.97],
            [30,79.11]
        ],
        Qlin: [
          [5,39.37250,4.5395], //x0, f(x0), f´(x0)
          [30,79.11, 10.077] ////x0, f(x0), f´(x0)
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
        const s1 = 0
        const s2 = (Q[1][0]-Q[0][0])/(Q[3][0]-Q[0][0])
        const s3 = (Q[2][0]-Q[0][0])/(Q[3][0]-Q[0][0])
        const s4 = 1
        
        const M = [
              [1, 0, 0, 0],
              [-3, 3, 0, 0],
              [3, -6, 3, 0],
              [-1, 3, -3, 1]
        ]

        const T = [
            [1, s1, s1*s1, s1*s1*s1],
            [1, s2, s2*s2, s2*s2*s2],
            [1, s3, s3*s3, s3*s3*s3],
            [1, s4, s4*s4, s4*s4*s4],
        ]
        
        const TtT =  math.multiply(math.transpose(T),T)
        const TtTinvTt = math.multiply(math.inv(TtT),math.transpose(T))
        const A = math.multiply(math.inv(M),TtTinvTt)
      
      // const A = [ 
      //   [ 1, 0, 0, 0],
      //     [ -5/6, 3, -1.5, 1/3],
      //     [ 1/3, -1.5, 3, -5/6],
      //     [ 0, 0, 0, 1 ]
      //   ]
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
