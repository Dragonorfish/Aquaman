<template>
    <div class="back_active_pic">
        <div class="layer" id="layer_12" style="height: 100%;left: -700px">
            <img height="300"
                 src="/src/assets/static/12.png">
        </div>
        <div class="layer" id="layer_11">
            <img src="/src/assets/static/11.png">
        </div>
        <div class="layer" id="layer_10" style="top: 40px;">
            <img style="transform: scaleY(1.3)" src="/src/assets/static/10.png">
        </div>
        <div class="layer" id="layer_9" style="top: 50px;left: -650px">
            <img
                 src="/src/assets/static/9.png">
        </div>
        <div class="layer" id="layer_8" style="z-index:30;top:20px;left: -600px">
            <img
                 src="/src/assets/static/8.png">
        </div>
        <div class="layer" id="layer_7" style="left: 500px;z-index: 50">
            <img src="/src/assets/static/7.png">
        </div>
        <div class="layer" id="layer_6" style="z-index:20;top: 40px;left: -440px">
            <img src="/src/assets/static/6.png">
        </div>
        <div class="layer" id="layer_5" style="left:900px;top:120px">
            <img src="/src/assets/static/5.png">
        </div>
        <div class="layer" id="layer_4" style="top: 270px;left: 1200px">
            <img src="/src/assets/static/4.png">
        </div>
        <div class="layer" id="layer_3" style="z-index:10;top: 200px;left: 150px">
            <img width="200" src="/src/assets/static/3.png">
        </div>
        <div class="layer" id="layer_2" style="top: 230px;left: 230px;">
            <img width="100" src="/src/assets/static/2.png">
        </div>
        <div class="layer" id="layer_1" style="top: 145px;left: 250px">
            <img width="1000" src="/src/assets/static/1.png">
        </div>
    </div>
</template>

<script setup>
    import {ref,nextTick} from "vue"
    let elenments=[];
    let initStatus=[];
    let initing=false;
    nextTick(()=>{
      elenments=[
        document.getElementById("layer_1").style,
        document.getElementById("layer_2").style,
        document.getElementById("layer_3").style,
        document.getElementById("layer_4").style,
        document.getElementById("layer_5").style,
        document.getElementById("layer_6").style,
        document.getElementById("layer_7").style,
        document.getElementById("layer_8").style,
        document.getElementById("layer_9").style,
        document.getElementById("layer_10").style,
        document.getElementById("layer_11").style,
        document.getElementById("layer_12").style,
      ]
      initStatus=elenments.map((e)=>{
        return {left:e.left,top:e.top}
      })
    })

    window.addEventListener("mousemove",(e)=>{
      if (!initing){
        move(e.movementX);
      }
    })

    function initLocation() {
      initing=true;
      elenments.forEach((elenment,index)=>{
        elenment.transition="left,top,0.2s"
        elenment.left=initStatus[index].left;
        elenment.top=initStatus[index].top
      })
      const timeout=setTimeout(()=>{
        elenments.forEach((elenment)=>{
          elenment.transition="";
        })
        initing=false;
        clearTimeout(timeout);
      },200)
    }

    let timer=null;
    function move(x) {
      elenments[0].left=Number(
        elenments[0].left.slice(
          0, elenments[0].left.indexOf("px"))
        )+x/20+"px";
      elenments[1].left=Number(
        elenments[1].left.slice(
          0, elenments[1].left.indexOf("px"))
      )+x/20*0.5+"px";
      elenments[2].left=Number(
        elenments[2].left.slice(
          0, elenments[2].left.indexOf("px"))
      )+x/20*2.7+"px";
      elenments[3].left=Number(
        elenments[3].left.slice(
          0, elenments[3].left.indexOf("px"))
      )+x/20+"px";
      elenments[4].left=Number(
        elenments[4].left.slice(
          0, elenments[4].left.indexOf("px"))
      )+x/20*1.8+"px";
      elenments[4].top=Number(
        elenments[4].top.slice(
          0, elenments[4].top.indexOf("px"))
      )-x/20*0.3+"px";
      elenments[5].left=Number(
        elenments[5].left.slice(
          0, elenments[5].left.indexOf("px"))
      )+x/20*1.5+"px";
      elenments[6].left=Number(
        elenments[6].left.slice(
          0, elenments[6].left.indexOf("px"))
      )+x/20*3+"px";
      elenments[7].left=Number(
        elenments[7].left.slice(
          0, elenments[7].left.indexOf("px"))
      )+x/20*3+"px";
      elenments[8].left=Number(
        elenments[8].left.slice(
          0, elenments[8].left.indexOf("px"))
      )+x/20*0.7+"px";
      elenments[9].left=Number(
        elenments[9].left.slice(
          0, elenments[9].left.indexOf("px"))
      )+x/20*0.2+"px";
      elenments[10].left=Number(
        elenments[10].left.slice(
          0, elenments[10].left.indexOf("px"))
      )+x/20*0.4+"px";
      elenments[11].left=Number(
        elenments[11].left.slice(
          0, elenments[11].left.indexOf("px"))
      )+"px";



        if (timer===null){
          timer=setTimeout(()=>{
            initLocation();
            clearTimeout(timer);
            timer=null;
          },500)
        }
    }
</script>

<style scoped>
    .back_active_pic{
        width: 100%;
        position: relative;
        height: 100%;
        overflow: hidden;
    }
    .layer{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
    }
    .layer img{
        object-fit: contain;
    }
</style>