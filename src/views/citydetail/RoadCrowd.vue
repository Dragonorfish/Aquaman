<template>
    <div class="whole_body">
        <el-tabs
                stretch="true"
                v-model="activeName"
                class="demo-tabs"
                @tab-click="handleClick"

        >
            <el-tab-pane label="全部道路" name="allRoad"></el-tab-pane>
            <el-tab-pane label="高速道路" name="fastRoad"></el-tab-pane>
            <el-tab-pane label="普通道路" name="nomalRoad"></el-tab-pane>
        </el-tabs>
        <div class="tab_content">
            <dv-scroll-board :config="config" style="height: 100%;width: 50%"  @mouseover="" @click="" />
            <div id="data_map"></div>
        </div>
    </div>
</template>
<script>
  import { BDmapInfo } from "../../utils/BDmap";
  import Map from "@arcgis/core/Map";
  import { amap } from "../../utils/basemaps";
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
  import SceneView from "@arcgis/core/views/SceneView";
  import Camera from "@arcgis/core/Camera";
  import Point from "@arcgis/core/geometry/Point";
  import { onMounted } from "vue";
  import { ajaxPostJsonp } from "../../utils/ajaxService";
  import { useMenuStore } from "../../stores";
  import { useAreaDataStore } from "../../stores/modules/dataBase";
  import { dataToPolyline, dataToTable } from "../../utils/mapUtils";
  import Graphic from "@arcgis/core/Graphic";
  import MapView from "@arcgis/core/views/MapView";

  export default {
    name: "RoadCrowd",

    setup(){
      let spatialReference = {};

      let map = {};

      let layers = [];

      let view = {};

      let data = [];

      spatialReference = BDmapInfo.spatialReferenceBD;

      map = new Map({
        basemap: amap,
      });
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
      onMounted(() => {
        view.container = "data_map";
      });
      const areaDataStore = useAreaDataStore();
      let allRoadData = JSON.parse(JSON.stringify(areaDataStore.allRoadData));
      let fastRoadData=JSON.parse(JSON.stringify(areaDataStore.fastRoadData));
      let nomalRoadData=JSON.parse(JSON.stringify(areaDataStore.nomalRoadData));
      console.log(allRoadData)
      map.add(dataToPolyline(allRoadData));
      view.goTo(dataToPolyline(allRoadData).graphics.items)
      return {
        map,
        view,
        allRoadData,
        selectedData:allRoadData,
        fastRoadData,
        nomalRoadData
      };
    },

    data(){
      const length=this.selectedData.length
      const tableData=dataToTable(this.selectedData,0)
      return{
        activeName:"allRoad",
        config:{
          header: ['道路名称', '拥堵延时指数','速度','旅行时间','延时时间'],
          data: tableData,
          indexHeader:'排名',
          index: true,
          columnWidth: [120],
          align: ['center'],
          rowNum:length,
          headerBGC:"#1f486e",
          oddRowBGC:"transparent",
          evenRowBGC:"transparent"
        }
      }
    },

    methods: {
      handleClick(tab, event) {
        console.log(tab.props.name)
        if (tab.props.name==="allRoad"){
          this.selectedData=this.allRoadData;
        }
        if (tab.props.name==="fastRoad"){
          this.selectedData=this.fastRoadData
        }
        if (tab.props.name==="nomalRoad"){
          this.selectedData=this.nomalRoadData
        }
        this.config.data=dataToTable(this.selectedData,0);
        this.config.rowNum=this.selectedData.length
        let graphicsLayers = this.map.allLayers.find(function (layer) {
          return layer.id === "searchResultLayer";
        });
        this.map.layers.remove(graphicsLayers)
        graphicsLayers=dataToPolyline(this.selectedData)
        this.map.layers.add(graphicsLayers)
        this.view.goTo(graphicsLayers.graphics.items)
      }
    }
  };




</script>
<style>
    .whole_body{
        display: flex;
        flex-direction: column;
        width: 81%;
    }
    .demo-tabs {
        padding: 20px;
        font-size: 32px;
        height: 10vh;
        width: 50%;
    }
    .el-tabs__item{
        color: #06c;
        font-weight: 600;
        font-size: 20px;
    }
    .tab_content{
        height: 100%;
        width: 100%;
        left: 2vh;
        display: flex;
        flex-direction: row;
    }
    .header{
        border: 1px #013968 solid;
    }
    .row-item{
        border: 1px #013968 solid;
    }
    #data_map{
        border: 6px #013968 solid;
        width: 40%;
        height:80%;
        margin-left: 5%;
    }


</style>
