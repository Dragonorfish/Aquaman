<template>

  <div class="shape">
    <div class="moon">
      <div class="corona">
          <span style="display:flex;flex-direction: column"  title="404">
            404
            <div class="back_to_home" @click="backToHome">
              返回首页
            </div>
          </span>
      </div>
    </div>
  </div>

</template>

<script setup>
  import router from "../../router";
  function backToHome() {
    router.push("/home")
  }
</script>

<style scoped>
  .shape{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  .moon {
    position: relative;
    margin: auto;
    background: black;
    width: 30rem;
    height: 30rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .corona {
    top: 0;
    width: 30rem;
    height: 30rem;
    border-radius: 50%;
    box-shadow: 0px 0px 22px 30px #d3540090;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    color: silver;
    font-size: 140px;
    font-family: 'Fira Mono', monospace;
    letter-spacing: -7px;
    animation: glitch 1s linear infinite;
  }
  .back_to_home{
    font-size: 30px;
    text-align: center;
    cursor: url("src/assets/pointer1.cur"),auto;
  }

  @keyframes glitch {
    2%,
    64% {
      transform: translate(2px, 0) skew(0deg);
    }
    4%,
    60% {
      transform: translate(-2px, 0) skew(0deg);
    }
    62% {
      transform: translate(0, 0) skew(5deg);
    }
  }

  span:before,
  span:after {
    content: attr(title);
    position: absolute;
    left: 0;
  }

  span:before {
    animation: glitchTop 1s linear infinite;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }

  @keyframes glitchTop {
    2%,
    64% {
      transform: translate(2px, -2px);
    }
    4%,
    60% {
      transform: translate(-2px, 2px);
    }
    62% {
      transform: translate(13px, -1px) skew(-13deg);
    }
  }

  span:after {
    animation: glitchBotom 1.5s linear infinite;
    clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  }

  @keyframes glitchBotom {
    2%,
    64% {
      transform: translate(-2px, 0);
    }
    4%,
    60% {
      transform: translate(-2px, 0);
    }
    62% {
      transform: translate(-22px, 5px) skew(21deg);
    }
  }
</style>
