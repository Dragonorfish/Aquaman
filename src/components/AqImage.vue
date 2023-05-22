<template>
    <div class="aq_image_body" @click="ImgClick">
        <img style="object-fit: contain;width: 100%;height: 100%;" :src="url"/>
    </div>
</template>

<style scoped>
    .aq_image_body {
        width: 100%;
        height: 100%;
    }
</style>

<script setup>
  import { onMounted } from "vue";

  const props = defineProps({
    url: {
      type: String,
      default: ""
    }
  });
  let currentScale=1
  let currentRotate=0

  const element = document.createElement("div");
  element.className = "big_img_body";

  const headerElement = document.createElement("div");
  headerElement.className = "img_header";
  headerElement.style.width = "100%";
  headerElement.style.height = "50px";
  headerElement.style.marginTop = "2rem";
  headerElement.style.zIndex="100"
  const quitButton = document.createElement("div");
  quitButton.style.width = "50px";
  quitButton.style.height = "50px";
  quitButton.style.opacity = 0.8;
  quitButton.style.borderRadius = "50%";
  quitButton.style.marginLeft = "90%";
  quitButton.style.lineHeight = "50px";
  quitButton.style.textAlign = "center";
  quitButton.style.fontSize = "20px";
  quitButton.style.fontWeight = "600";
  quitButton.style.cursor = "url('/src/assets/pointer1.cur'),auto";
  quitButton.onclick = quitClick;
  const closeImg = document.createElement("img");
  closeImg.className = "img_icon";
  closeImg.style.width = "50px";
  closeImg.style.height = "50px";
  closeImg.src = "/src/assets/svgs/close.svg";
  quitButton.appendChild(closeImg);
  headerElement.appendChild(quitButton);


  element.appendChild(headerElement);
  const imgElement = document.createElement("img");
  imgElement.className = "big_img";
  imgElement.src = props.url;
  imgElement.style.width = "60%";
  imgElement.style.height = "60%";
  imgElement.style.objectFit = "contain";
  imgElement.style.transition="transform 0.3s"
  element.appendChild(imgElement);
  const footerElement = document.createElement("div");
  footerElement.className = "img_footer";
  const scaleUp = document.createElement("img");
  scaleUp.className = "img_icon";
  scaleUp.src = "/src/assets/svgs/scaleup.svg";
  scaleUp.style.cursor = "url('/src/assets/pointer1.cur'),auto";
  scaleUp.onclick = scaleUpClick;
  footerElement.appendChild(scaleUp);
  const scaleDown = document.createElement("img");
  scaleDown.className = "img_icon";
  scaleDown.src = "/src/assets/svgs/scaledown.svg";
  scaleDown.style.cursor = "url('/src/assets/pointer1.cur'),auto";
  scaleDown.onclick = scaleDownClick;
  footerElement.appendChild(scaleDown);
  const turnLeft = document.createElement("img");
  turnLeft.className = "img_icon";
  turnLeft.src = "/src/assets/svgs/turnleft.svg";
  turnLeft.style.cursor = "url('/src/assets/pointer1.cur'),auto";
  turnLeft.onclick=turnLeftClick;
  footerElement.appendChild(turnLeft);
  const turnRight = document.createElement("img");
  turnRight.className = "img_icon";
  turnRight.src = "/src/assets/svgs/turnright.svg";
  turnRight.style.cursor = "url('/src/assets/pointer1.cur'),auto";
  turnRight.onclick=turnRightClick;
  footerElement.appendChild(turnRight);
  element.appendChild(footerElement);

  function ImgClick() {
    document.getElementById("app").appendChild(element);
  }

  function quitClick() {
    document.getElementById("app").removeChild(element);
    currentScale=1;
    currentRotate=0;
  }

  function scaleUpClick(e) {if (currentScale<=2){currentScale+=0.1;}setStatus(e);}

  function scaleDownClick(e) {if (currentScale>0.4){currentScale-=0.1;}setStatus(e);}

  function turnLeftClick(e) {currentRotate-=90;setStatus(e);}

  function turnRightClick(e) {currentRotate+=90;setStatus(e);}

  function setStatus(e) {
    e.srcElement.parentElement.parentElement.
    getElementsByClassName("big_img")[0].
      style.transform = "scale("+currentScale+") rotate("+currentRotate+"deg)";
  }
</script>

