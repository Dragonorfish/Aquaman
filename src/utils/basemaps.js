import Basemap from "@arcgis/core/Basemap";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import { BDmapInfo } from "../utils/BDmap";

// 高德地图
// 从第三方地图服务中获取地图瓦片
const amapBaseLayer = new WebTileLayer({
  urlTemplate:
    "https://webrd0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  subDomains: ["1", "2", "3", "4"],
  copyright: `地图瓦片由<a href="https://ditu.amap.com/">高德地图</a>提供`,
});

// 使用 WebTileLayer 创建底图
const amap = new Basemap({
  baseLayers: [amapBaseLayer],
  title: "高德地图",
  id: "amap",
  // 底图切换开关上的缩略图
  thumbnailUrl:
    "https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=26795&y=13465&z=15",
});

// 百度地图
const mapInfo = BDmapInfo();

const bdmap = new Basemap({
  baseLayers: [mapInfo.baiduLayer],
  title: "百度地图",
  id: "bdmap",
  thumbnailUrl:
    "https://maponline0.bdimg.com/tile/?qt=vtile&x=774&y=216&z=12&styles=pl&udt=20220913&scaler=1&showtext=1",
});

// Stamen Terrain Map
const stamenBaseLayer = new WebTileLayer({
  urlTemplate:
    "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png",
  subDomains: ["a", "b", "c", "d"],
  copyright: `Map tiles by <a href="http://stamen.com/">Stamen Design</a>,
               under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
               Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>,
               under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.`,
});

const stamen = new Basemap({
  baseLayers: [stamenBaseLayer],
  title: "Terrain",
  id: "terrain",
  thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png",
});

// OSM
const osmBaseLayer = new WebTileLayer({
  urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  copyright: `Map tiles by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>`,
});

const osm = new Basemap({
  baseLayers: [osmBaseLayer],
  title: "OSM",
  id: "osm",
  thumbnailUrl: "https://tile.openstreetmap.org/12/3227/2033.png",
});

// TODO 天地图

export { amap, stamen, osm, bdmap };
