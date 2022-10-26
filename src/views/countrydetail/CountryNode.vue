<script>
  import { provide, onMounted } from "vue";

  import Map from "@arcgis/core/Map";
  import SceneView from "@arcgis/core/views/SceneView";
  import MapView from "@arcgis/core/views/MapView";
  import TileInfo from "@arcgis/core/layers/support/TileInfo";
  import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
  import SpatialReference from "@arcgis/core/geometry/SpatialReference";
  import Extent from "@arcgis/core/geometry/Extent";
  import { BDmapInfo } from "../../utils/BDmap";
  import { useMenuStore } from "../../stores";
  import { ajaxPostJsonp } from "../../utils/ajaxService";
  import { locationPoint } from "../../utils/mapUtils";
  import ScaleBar from "@arcgis/core/widgets/ScaleBar";
  import Search from "@arcgis/core/widgets/Search";
  import Graphic from "@arcgis/core/Graphic";
  import * as watchUtils from "@arcgis/core/core/watchUtils";
  import { amap } from "../../utils/basemaps";
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
  import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol";
  import Camera from "@arcgis/core/Camera";
  import Point from "@arcgis/core/geometry/Point";
  import * as promiseUtils from "@arcgis/core/core/promiseUtils";
  import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

  export default {
    name: "CountryNode",
    props: {
      msg: String,
    },

    setup() {
      let spatialReference = {};

      let map = {};

      let layers = [];

      let view = {};

      let extent = {};

      spatialReference = BDmapInfo.spatialReferenceBD;

      map = new Map({
        basemap: amap,
      });
      map.add(
        new GraphicsLayer({
          id: "searchResultLayer",
        })
      );
      view = new MapView({
        map: map,
        spatialReference: spatialReference,
        // camera: new Camera({
        //   position: new Point({
        //     x: 114.335821, // lon
        //     y: 30.509956, // lat
        //     z: 40000, // 相机高度
        //   }),
        //   tilt: 0, //相机角度
        // }),
        center: [114.335821, 30.509956],
        zoom: 13,
        // extent: extent,
        viewingMode: "global", // local
      });


      provide("view", view); // 此处是为了让view能够跨组件通信，后代组件只需要通过 const view = inject('view')来获取到view，然后进行操作

      view.on("click", (event) => {
        console.log(event);
      });


      // 初始化页面完成后，再把 viewDiv 给到 view.container，这里运用的很巧妙，如果把 view 声明也放到这里面，则跨组件通信会有延迟，很难解决
      onMounted(() => {
        view.container = "viewDiv";
      });
      return {
        map,
        view,
      };
    },

    data() {
      return {
      };
    },

    methods: {
    },
  };
</script>

<template>
    <dv-border-box8
            :dur="5"
            :reverse="true"
            style="width: 78%; height: 100%; margin: 5px"
    >
        <div id="viewDiv"></div>
    </dv-border-box8>
</template>

<style scoped>
    #viewDiv {
        width: 96%;
        height: 96%;
        margin: 1%;
        margin-left: 2%;
        border: 3px solid blue;
        filter: brightness(0.88) contrast(1.22) grayscale(0) hue-rotate(360deg) opacity(1) saturate(1.1) sepia(0.54) invert(0.9);

    }
</style>
