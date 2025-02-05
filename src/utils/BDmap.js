import TileInfo from "@arcgis/core/layers/support/TileInfo";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Extent from "@arcgis/core/geometry/Extent";

const spatialReferenceBD = new SpatialReference({ wkid: 102100 });

const extent = new Extent({
  xmin: 15193921.625831576,
  ymin: 4250974.8802663395,
  xmax: 15200566.551714038,
  ymax: 4245186.048502921,
  spatialReference: spatialReferenceBD,
});

const tileInfoBD = new TileInfo({
  rows: 256,
  cols: 256,
  compressionQuality: 0,
  origin: {
    x: -20037508.342787,
    y: 20037508.342787,
  },
  spatialReference: spatialReferenceBD,
  lods: [
    {
      level: 0,
      resolution: 156543.033928,
      scale: 591657527.591555,
    },
    {
      level: 1,
      resolution: 78271.5169639999,
      scale: 295828763.795777,
    },
    {
      level: 2,
      resolution: 39135.7584820001,
      scale: 147914381.897889,
    },
    {
      level: 3,
      resolution: 19567.8792409999,
      scale: 73957190.948944,
    },
    {
      level: 4,
      resolution: 9783.93962049996,
      scale: 36978595.474472,
    },
    {
      level: 5,
      resolution: 4891.96981024998,
      scale: 18489297.737236,
    },
    {
      level: 6,
      resolution: 2445.98490512499,
      scale: 9244648.868618,
    },
    {
      level: 7,
      resolution: 1222.99245256249,
      scale: 4622324.434309,
    },
    {
      level: 8,
      resolution: 611.49622628138,
      scale: 2311162.217155,
    },
    {
      level: 9,
      resolution: 305.748113140558,
      scale: 1155581.108577,
    },
    {
      level: 10,
      resolution: 152.874056570411,
      scale: 577790.554289,
    },
    {
      level: 11,
      resolution: 76.4370282850732,
      scale: 288895.277144,
    },
    {
      level: 12,
      resolution: 38.2185141425366,
      scale: 144447.638572,
    },
    {
      level: 13,
      resolution: 19.1092570712683,
      scale: 72223.819286,
    },
    {
      level: 14,
      resolution: 9.55462853563415,
      scale: 36111.909643,
    },
    {
      level: 15,
      resolution: 4.77731426794937,
      scale: 18055.954822,
    },
    {
      level: 16,
      resolution: 2.38865713397468,
      scale: 9027.977411,
    },
    {
      level: 17,
      resolution: 1.19432856685505,
      scale: 4513.988705,
    },
    {
      level: 18,
      resolution: 0.597164283559817,
      scale: 2256.994353,
    },
    {
      level: 19,
      resolution: 0.298582141647617,
      scale: 1128.497176,
    },
  ],
});

const bdBaseLayer = new WebTileLayer({
  id: "baiduLayer",
  title: "baiduLayer",
  urlTemplate:
    //'http://api1.map.bdimg.com/customimage/tile?&x={col}&y={row}&z={level}&scale=1&ak=E4805d16520de693a3fe707cdc962045&customid=midnight',
    "https://maponline{subDomain}.bdimg.com/tile/?qt=vtile&x={row}&y={col}&z={level}&styles=pl&scaler=1&udt=20220830&from=jsapi2_0",
  tileInfo: tileInfoBD,
  subDomains: ["0", "1", "2", "3"],
  copyright: `地图瓦片由<a href="https://map.baidu.com/">百度地图</a>提供`,
});

const BDmap = {
  spatialReferenceBD: spatialReferenceBD,
  extent: extent,
  tileInfoBD: tileInfoBD,
  baiduLayer: bdBaseLayer,
};

export const BDmapInfo = () => {
  BDmap.baiduLayer.getTileUrl = function (level, row, col) {
    let url = "";
    let zoom = level - 1;
    const offsetX = Math.pow(2, zoom);
    const offsetY = offsetX - 1;
    const numX = col - offsetX;
    const numY = -row + offsetY;
    zoom = level + 1;
    const num = ((col + row) % 8) + 1;
    url =
      "http://online" +
      num +
      ".map.bdimg.com/tile/?qt=tile&x=" +
      numX +
      "&y=" +
      numY +
      "&z=" +
      zoom +
      "&styles=pl&scaler=1&udt=20141103";
    // "https://maponline1.bdimg.com/tile/?qt=vtile&x=" + numX + "&y=" + numY + "&z=" + zoom + "&styles=pl&scaler=1&udt=20220830&from=jsapi2_0";
    // "http://api1.map.bdimg.com/customimage/tile?&x=" + numX + "&y=" + numY + "&z=" + zoom + "&scale=1&ak=E4805d16520de693a3fe707cdc962045&customid=midnight";
    return url;
  };

  return BDmap;
};
