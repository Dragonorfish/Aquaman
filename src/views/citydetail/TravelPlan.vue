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
import { dataToPlan, locationPoint } from "../../utils/mapUtils";
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
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "TravelPlan",
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
    view = new SceneView({
      map: map,
      spatialReference: spatialReference,
      camera: new Camera({
        position: new Point({
          x: 114.335821, // lon
          y: 30.509956, // lat
          z: 40000, // 相机高度
        }),
        tilt: 0, //相机角度
      }),
      center: [114.335821, 30.509956],
      zoom: 13,
      // extent: extent,
      viewingMode: "global", // local
    });

    const overviewMap = new Map({
      basemap: amap,
    });

    // 鹰眼图
    const overView = new MapView({
      container: "overviewDiv",
      spatialReference: spatialReference,
      map: overviewMap,
      center: [114.335821, 30.509956],
      zoom: 13,
      constraints: {
        rotationEnabled: false,
      },
    });

    // 移除默认的控制件
    overView.ui.components = [];

    overView.when(() => {
      view.when(() => {
        const extent3Dgraphic = new Graphic({
          geometry: null,
          symbol: {
            type: "simple-fill",
            color: [0, 0, 0, 0.5],
            outline: null,
          },
        });
        overView.graphics.add(extent3Dgraphic);

        reactiveUtils.watch(
          () => view.extent,
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
      });
    });

    provide("view", view); // 此处是为了让view能够跨组件通信，后代组件只需要通过 const view = inject('view')来获取到view，然后进行操作

    view.on("click", (event) => {
      console.log(event);
    });

    // 比例尺添加
    let scaleBar = new ScaleBar({
      view: view,
      style: "ruler",
      unit: "metric",
    });
    view.ui.add(scaleBar, {
      position: "bottom-left",
    });
    const extentDebouncer = promiseUtils.debounce(() => {
      if (view.stationary) {
        overView.goTo({
          center: view.center,
          scale:
            view.scale *
            2 *
            Math.max(
              view.width / overView.width,
              view.height / overView.height
            ),
        });
      }
    });
    // 初始化页面完成后，再把 viewDiv 给到 view.container，这里运用的很巧妙，如果把 view 声明也放到这里面，则跨组件通信会有延迟，很难解决
    onMounted(() => {
      view.container = "viewDiv";
      scaleBar.container = "scaleBar";
      overView.container = "overviewDiv";
    });
    return {
      map,
      overviewMap,
      view,
      overView,
      extentDebouncer,
    };
  },

  data() {
    return {
      searchResult: [],
      searchInfo: "",
      selectedLocation: "",
      selectedEndLocation: "",
      selectedStartLocation:"",
      dialogTableVisible:false,
      start:"",
      end:""
    };
  },

  methods: {
    querySearch(queryString, cb) {
      const queryData = {
        keywords: this.selectedLocation,
        city: "武汉",
        citylimit: true,
        key: "3f6c3a8351c552612650f2f57d7d7841",
      };
      ajaxPostJsonp(
        "https://restapi.amap.com/v3/place/text",
        queryData
      ).subscribe((response) => {
        this.searchResult = response.pois;
        const results = queryString
          ? this.searchResult.filter(this.createFilter(queryString))
          : this.searchResult;
        cb(results);
        console.log(response.pois, 111);
      });
      console.log(this.searchResult, 222);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.name.indexOf(queryString) === 0;
      };
    },
    handleSelect(item) {
      this.selectedLocation = JSON.parse(JSON.stringify(item)).name;
      this.selectedEndLocation = this.selectedLocation;
      const target = JSON.parse(JSON.stringify(item)).location.split(",");
      const longitude = Number(target[0]);
      const latitude = Number(target[1]);

      this.end=longitude+","+latitude;
      console.log(this.end,444)
      console.log(item, "333");
      const attributes = {
        name: item.name,
        address: item.address,
      };
      const goToHere={
        title: "去这里",
        id: "go_to_here"
      }
      let photoDiv='<div>地点名称:'+item.name+'</div>'+
              '<div>地址:'+item.address+'</div>'
      item.photos.forEach((item)=>{
        console.log(photoDiv,555)
          photoDiv+='<img style="height: 7em;width:9em;margin: 3px" src='+item.url+' alt="link photo" />'
      })
      const popupTemplate = {
        // autocasts as new PopupTemplate()
        title: "{Name}",
        content:photoDiv,
        //         [
        //   {
        //     type: "fields",
        //     fieldInfos: [
        //       {
        //         fieldName: "name",
        //       },
        //       {
        //         fieldName: "address",
        //       },
        //     ],
        //   },
        // ],+

        actions:[goToHere]
      };
      const pointGraphic = locationPoint(
        longitude,
        latitude,
        attributes,
        popupTemplate,
        "end"
      );

      this.view.popup.on('trigger-action', event => {
        if (event.action.id === 'go_to_here') {
          this.dialogTableVisible=true
          console.log(11223344556778)
        }
      })
      const graphicsLayers = this.map.allLayers.find(function (layer) {
        return layer.id === "searchResultLayer";
      });
      graphicsLayers.removeAll();
      // this.view.popup.close()
      graphicsLayers.add(pointGraphic);
      let cam = new Camera({
        position: new Point({
          x: longitude, // lon
          y: latitude, // lat
          z: 10000, // elevation in meters
        }),
        tilt: 0, // bird's eye view
      });
      this.view.goTo(cam);
      // this.view.goTo({
      //   target: pointGraphic,
      //   zoom: 13,
      //   heading: 48,
      //   tilt: 40
      // })
    },

    handleSelectStart(item) {
      this.view.popup.close()
      this.selectedLocation = JSON.parse(JSON.stringify(item)).name;
      this.selectedStartLocation=this.selectedLocation;
      const target = JSON.parse(JSON.stringify(item)).location.split(",");
      const longitude = Number(target[0]);
      const latitude = Number(target[1]);
      this.start=longitude+","+latitude;
      console.log(item, "333");
      let photoDiv='<div>地点名称:'+item.name+'</div>'+
              '<div>地址:'+item.address+'</div>'
      item.photos.forEach((item)=>{
        console.log(photoDiv,555)
        photoDiv+='<img style="height: 7em;width:9em;margin: 3px" src='+item.url+' alt="link photo" />'
      })
      const attributes = {
        name: item.name,
        address: item.address,
      };
      const popupTemplate = {
        // autocasts as new PopupTemplate()
        title: "{Name}",
        content:photoDiv,
        //         [
        //   {
        //     type: "fields",
        //     fieldInfos: [
        //       {
        //         fieldName: "name",
        //       },
        //       {
        //         fieldName: "address",
        //       },
        //     ],
        //   },
        // ],
      };
      const pointGraphic = locationPoint(
              longitude,
              latitude,
              attributes,
              popupTemplate,
              "start"
      );

      const graphicsLayers = this.map.allLayers.find(function (layer) {
        return layer.id === "searchResultLayer";
      });
      graphicsLayers.graphics.items.forEach((item,index,arr)=>{
        if (item.id==="end"){
          const end=item
          graphicsLayers.removeAll()
          graphicsLayers.add(end)
        }
      })
      graphicsLayers.add(pointGraphic);
      let cam = new Camera({
        position: new Point({
          x: longitude, // lon
          y: latitude, // lat
          z: 10000, // elevation in meters
        }),
        tilt: 0, // bird's eye view
      });

      this.view.goTo(cam);
      // this.view.goTo({
      //   target: pointGraphic,
      //   zoom: 13,
      //   heading: 48,
      //   tilt: 40
      // })
    },

    handleCancel(){
      this.dialogTableVisible = false
      this.view.popup.close()
      const graphicsLayers = this.map.allLayers.find(function (layer) {
        return layer.id === "searchResultLayer";
      });
      graphicsLayers.removeAll();
      this.selectedLocation=""
    },
    handlePlan(){
      this.dialogTableVisible = false;
      this.view.popup.close()
      const queryData = {
        origin:this.start,
        destination:this.end,
        show_fields:"polyline,cost",
        key: "3f6c3a8351c552612650f2f57d7d7841",
      };
      ajaxPostJsonp(
              "https://restapi.amap.com/v5/direction/driving",
              queryData
      ).subscribe((response) => {
        console.log(response.route.paths, 111);
        const graphicsLayers = this.map.allLayers.find(function (layer) {
          return layer.id === "searchResultLayer";
        });
        graphicsLayers.addMany(dataToPlan(response.route.paths))
      });
    }
  },
};
</script>

<template>

  <!--  路径规划弹窗-->
  <el-dialog v-model="dialogTableVisible" title="设置起点及出行方式">
    <div id="startSearchBox">
      <el-autocomplete
              value-key="name"
              v-model="this.selectedLocation"
              :fetch-suggestions="querySearch"
              clearable="true"
              :trigger-on-focus="false"
              class="inline-input w-50"
              placeholder="输入你要查询的地点"
              @select="handleSelectStart"
              @change="querySearch"
      >
        <template #default="{ item }">
          <div class="value" style="line-height: 2em">{{ item.name }}</div>
          <span
                  class="link"
                  style="font-size: 10px; color: darkgray; line-height: 2em"
          >{{ item.address }}</span
          >
        </template>
      </el-autocomplete>
    </div>
    <el-button class="searchButton" @click="handleCancel">取消</el-button>
    <el-button class="searchButton" type="primary" @click="handlePlan">规划路径</el-button>
  </el-dialog>


  <dv-border-box8
    :dur="5"
    :reverse="true"
    style="width: 78%; height: 100%; margin: 5px"
  >
    <div id="viewDiv"></div>
    <div id="scaleBar"></div>
    <div id="overviewDiv"><div id="extentDiv"></div></div>
    <div id="searchBox">
      <el-autocomplete
        value-key="name"
        v-model="this.selectedLocation"
        :fetch-suggestions="querySearch"
        clearable="true"
        :trigger-on-focus="false"
        class="inline-input w-50"
        placeholder="输入你要查询的地点"
        @select="handleSelect"
        @change="querySearch"
      >
        <template #default="{ item }">
          <div class="value" style="line-height: 2em">{{ item.name }}</div>
          <span
            class="link"
            style="font-size: 10px; color: darkgray; line-height: 2em"
            >{{ item.address }}</span
          >
        </template>
      </el-autocomplete>
    </div>
  </dv-border-box8>
</template>

<style scoped>
#searchBox {
  position: absolute;
  right: 4%;
  top: 3%;
}

#overviewDiv {
  position: absolute;
  bottom: 7%;
  right: 3%;
  width: 250px;
  height: 180px;
  border: 1px solid black;
  z-index: 1;
  overflow: hidden;
}

#extentDiv {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 2;
}

#viewDiv {
  width: 96%;
  height: 96%;
  margin: 1%;
  margin-left: 2%;
  border: 3px solid blue;
}

  .searchButton{
    margin: 2vh;
  }

  .el-dialog__body{
    padding: 5px;
  }
</style>
