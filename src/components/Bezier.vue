<template>
  <div class="bezier">
      <p>Bezier.vue</p>
      <svg width="700" height="700" viewBox="0 -200 100 400" preserveAspectRatio="none">
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <path id="punktlasterSVG" :d = "getSnitkrafterSVG" fill="none" stroke="blue" stroke-width="0.1" />
       <!--path id="punktlast" d = "M20,20 L20,0 l-0.5,2 1,0 -0.5,-2" fill="blue" stroke="blue" stroke-width="0.1" />
       <!--path id="punktlast" :d = "punktlastF()" fill="red" stroke="red" stroke-width="0.1" >
       <path id="reaktanterSVG" :d = "reaktanterSVG" fill="red" stroke="red" stroke-width="0.1" />
       <text class="small" v-for="p in punktlaster" :x="p.x" :y="p.val" fill=red>{{p.navn}}</text/-->
    </svg>
    <p>næste</p>

    <div > <p> her: {{getSnitkrafterSVG}} </p></div>
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
import store from "@/store"
export default {
  name: 'HelloWorld',
  
  props: {
    },
   data: function() {
     return {
        punktlaster: store.state.punktlaster,
        // reaktanter: store.getters.getReaktanter,
        //snitkrafter: store.getters.getSnitkrafter,
        Q: [[0,0],
            [5,39.37250],
            [20,39.74],
            [30,79.11]
        ],
        Q1: [[0,0],
            [15,90],
            [30,0]
        ],
        
        Qlin: [
          [0,0,3], //x0, f(x0), f´(x0)
          [30,90, 3] ////x1, f(x1), f´(x1)
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
  },
  computed:{
    getSnitkrafter: function () {
      const arr=[]
      
      store.getters.getReaktanter.forEach((data)=>{
        arr.push({x:data.x,y:data.val,lasttype:"punktlast"})
      })
      this.punktlaster.forEach((data)=>{
        arr.push({x:data.x,y:data.val,lasttype:"punktlast"})
      })
      arr.sort((a,b)=>{return a.x-b.x })

       var sum = 0
       arr.forEach((data,index)=>{
         sum += data.y 
        
          arr[index].y=sum
       })

      return arr
    },
    getSnitkrafterSVG: function () {
      const output=["M 0,0"]
      var sumy = 0
      const sk =this.getSnitkrafter

      sk.forEach((data,index)=>{
      if(index>0){
        sumy = sumy + (data.x-sk[index-1].x)*sk[index-1].y/100*store.state.L
        output.push(` L ${data.x},${-sumy}`)
      }
     

    })
      return output.join(' ')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
