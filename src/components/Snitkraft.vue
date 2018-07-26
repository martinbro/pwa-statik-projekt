
<template>
  <div class="Snitkraft">
    <pre>{{momenterSVG()}}</pre> 
    <p>Snitkræfter</p>
    <svg width="700" height="700" viewBox="0 -500 100 1000" preserveAspectRatio="none">
       <path id="punktlast" :d = "punktlasterSVG()" fill="yellow" stroke="purple" stroke-width="0.1" />
       <path id="momenter" :d = "momenterSVG()" fill="none" :stroke="momenterSVG().stroke" stroke-width="0.1" />
       <path id="bjaelke" d = "M0,0 L100,0" fill="none" stroke="black" stroke-width="1" />
       <!--text class="small" v-for="(p,index) in punktlastText" :x="p.x" :y="-p.y" fill=red>{{p.y}}</text-->
    </svg>
    <pre>{{momenter}}</pre> 

  </div>
</template>

<script>
import * as math from "mathjs"
import store from "@/store"
export default {
  name: 'Snitkraft',
  data: function() {
    return {
      //snitkrafter: store.getters.getSnitkraftAggregeret,
      //linjelaster: store.state.linjelaster,
      //reaktanter: store.state.reaktanter,
      //arr:[]
    }
  },
  props: {
  },
  computed:{
    snitkrafter: function() {
      return store.getters.getSnitkraftAggregeret
    },
    momenter: function() {
      const arr=[{x:0,y:0,dydx:0,type:"L",svg:"M 0,0"}]
      const sk=store.getters.getSnitkraftAggregeret
      const elem = [[0],[0]]
      var dx = 0
      var dA = 0

      sk.forEach((data,index)=>{
        //integrerer snitkræfter
        if(index>0){
          dx = (data.x-sk[index-1].x)
           // y(x-1) * dx + 0.5 * y'(x-1)* dx^2 
          dA = (sk[index-1].y * dx + 0.5 * sk[index-1].dydx * dx * dx)/100*store.state.L

          elem[0][0]=sk[index-1].x
          elem[0][1]=arr[index-1].y
          elem[0][2]=sk[index-1].y/100*store.state.L
          elem[1][0]=sk[index].x
          elem[1][1]=arr[index-1].y + dA
          elem[1][2]=sk[index].yleft/100*store.state.L

          switch(sk[index-1].type) {
            case "L":
           
              arr.push({
                x:data.x,
                 y:dA + arr[index-1].y, 
                 type:"C",
                 svg: this.cubicBezierLiniesegment(elem),
                 stroke:"red"
              })     
              break;

            case "E":
              arr.push({
                x:data.x,
                y:dA + arr[index-1].y, 
                type:"L",
                svg: `L ${data.x},${-(dA + arr[index-1].y)}`,
                stroke:"blue"
              })     
              break;

            default:
              console.log("Hva fanden ???");
          }
        }
      })
      return arr
    }
   
  },
  methods:{
    quadradicBezierLiniesegment: function(p) {
      //input: [
        //   [0,0,3], //x0, f(x0), f´(x0)
        //   [30,90] ////x1, f(x1)
        // ],
        const x0 = p[0][0]
        const y0 = p[0][1]
        const ydot = p[0][2]
        const x2 = p[1][0]
        const y2 = p[1][1]
        const y1 = 0.5*(x2-x0)*ydot + y0
        const x1 = 0.5*(x2-x0)*1 + x0
       return ` M ${x0} ${-y0} Q  ${x1} ${-y1} , ${x2} ${-y2}`      
      },
    cubicBezierLiniesegment: function(p) {
        //input: [
        //   [0,0,3], //x0, f(x0), f´(x0)
        //   [30,90, 3] ////x1, f(x1), f´(x1)
        // ],
        //Metode:
        //P´(0)=3(P(1)-P(0)) => P(1)=1/3*P´(0) + P(0)
        //P´(1)=3(P(3)-P(2))  => P(2)= -1/3*P´(0) + P(3)
        //http://graphics.stanford.edu/courses/cs148-09-fall/lectures/splines.pdf
        const p1x = 1/3*(p[1][0]-p[0][0]) + p[0][0]
        const p1y = 1/3*p[0][2]*(p[1][0]-p[0][0]) + p[0][1]
        const p2x = -1/3*(p[1][0]-p[0][0]) + p[1][0]
        const p2y = -1/3* p[1][2]*(p[1][0]-p[0][0]) + p[1][1]
        const kurve1 = ` M ${p[0][0]},${-1*p[0][1]} C ${p1x},${-1*p1y} ${p2x},${-1*p2y} ${p[1][0]},${-1*p[1][1]} `
        
        return kurve1 
      },
    punktlasterSVG:function (){
      const str = ["M0,0"]
      this.snitkrafter.forEach((data,index) => {
        str.push(`L ${data.x},${-data.yleft}  ${data.x},${-data.y}`)
      })
       return str.join(" ")
    },
    momenterSVG: function () {
      const arr=["M0,0"]
      this.momenter.forEach((d)=>{
        arr.push(d.svg)

      })
console.log(arr)
      return arr.join(" ")
    },
    punktlastText:function (data){
      
      
      return [{x:"F?"}]
    },
      // punktlastF:function () {
      //     const data = {val:-30,x:40}
      //     const dy = Math.sign(data.val)*2
      //      return `M${data.x},${data.val} L${data.x},0 l-0.5,${dy} 1,0 -0.5,${-dy}`
          
      // }
    
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {fill:blue; font: 2px sans-serif; }
.momenter {stroke:coral}
</style>