<!-- 鹰眼图 -->

<script setup>
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import { onMounted } from "vue";

// 底图，用于主视图
const mainMap = new Map({
  basemap: "hybrid",
  ground: "world-elevation",
});

// 鹰眼图
const overviewMap = new Map({
  basemap: "topo-vector",
});

// 主视图
const mainView = new SceneView({
  container: "viewDiv",
  map: mainMap,
  camera: {
    position: {
      spatialReference: {
        latestWkid: 3857,
        wkid: 102100,
      },
      x: 925151,
      y: 5956309,
      z: 3871,
    },
    heading: 203,
    tilt: 72,
  },
});

// 鹰眼图
const mapView = new MapView({
  container: "overviewDiv",
  map: overviewMap,
  constraints: {
    rotationEnabled: false,
  },
});

// 移除默认的控制件
mapView.ui.components = [];

mapView.when(() => {
  mainView.when(() => {
    mapViewSetup();
  });
});

const extentDebouncer = promiseUtils.debounce(() => {
  if (mainView.stationary) {
    mapView.goTo({
      center: mainView.center,
      scale:
        mainView.scale *
        2 *
        Math.max(
          mainView.width / mapView.width,
          mainView.height / mapView.height
        ),
    });
  }
});

function mapViewSetup() {
  const extent3Dgraphic = new Graphic({
    geometry: null,
    symbol: {
      type: "simple-fill",
      color: [0, 0, 0, 0.5],
      outline: null,
    },
  });
  mapView.graphics.add(extent3Dgraphic);

  reactiveUtils.watch(
    () => mainView.extent,
    (extent) => {
      // 同步鹰眼图
      extentDebouncer().then(() => {
        extent3Dgraphic.geometry = extent;
      });
    },
    {
      initial: true,
    }
  );
}

onMounted(() => {
  mainView.container = "viewDiv";
  mapView.container = "overviewDiv";
});
</script>

<template>
  <div id="viewDiv"></div>
  <div id="overviewDiv"><div id="extentDiv"></div></div>
</template>

<style scoped>
#viewDiv {
  padding: 0;
  margin: 0;
  height: 80vh;
  width: 100vw;
}

#overviewDiv {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 300px;
  height: 200px;
  border: 1px solid black;
  z-index: 1;
  overflow: hidden;
}

#extentDiv {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 2;
}
</style>
