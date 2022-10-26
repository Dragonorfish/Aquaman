<!-- 在两个地图之间切换的组件 -->

<script setup>
import Map from "@arcgis/core/Map";
import Basemap from "@arcgis/core/Basemap";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import SceneView from "@arcgis/core/views/SceneView";
import { onMounted } from "vue";
import { amap, stamen, bdmap } from "../utils/basemaps";

const map = new Map({
  basemap: amap,
});

const initCamera = {
  heading: 124.7,
  tilt: 82.9,
  position: {
    latitude: 30.5906,
    longitude: 114.3073,
    z: 1990,
  },
};

const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: initCamera,
});

view.when(() => {
  // 添加地图底图切换开关
  const toggle = new BasemapToggle({
    visibleElements: {
      title: true,
    },
    view: view,
    nextBasemap: bdmap,
  });

  // 将切换开关放置到视图右上角
  view.ui.add(toggle, "top-right");
});

onMounted(() => {
  view.container = "viewDiv";
});
</script>

<template>
  <div id="viewDiv"></div>
</template>

<style scoped>
#viewDiv {
  padding: 0;
  margin: 0;
  height: 80vh;
  width: 100vw;
}
</style>
