// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { ajaxPostJsonp } from "./ajaxService";
import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { formateSeconds } from "./utilsService";

//源坐标类型：
// 1：GPS标准坐标；
// 2：搜狗地图坐标；
// 3：火星坐标（gcj02），即高德地图、腾讯地图和MapABC等地图使用的坐标；
// 4：3中列举的地图坐标对应的墨卡托平面坐标;
// 5：百度地图采用的经纬度坐标（bd09ll）；
// 6：百度地图采用的墨卡托平面坐标（bd09mc）;
// 7：图吧地图坐标；
// 8：51地图坐标；
// 目标坐标类型：
// 3：火星坐标（gcj02），即高德地图、腾讯地图及MapABC等地图使用的坐标；
// 5：百度地图采用的经纬度坐标（bd09ll）；
// 6：百度地图采用的墨卡托平面坐标（bd09mc）；
//   async function coordTransform(crood, from, to) {
//     let result = { x: 0, y: 0 }
//     const _url = "https://api.map.baidu.com/geoconv/v1/";
//     const _body = {
//       coords: crood,
//       from,
//       to,
//       ak: "0NxjAFyocgVbEU09zOVmIgm6WOOqnHXT"
//     }
//     // eslint-disable-next-line class-methods-use-this
//    ajaxPostJsonp(_url, _body).subscribe((response)=>
//     {
//       result = response.result[0]
//       if (to === 6) {
//         result.x += 11802600;
//         result.y += 690628.263;
//       }
//       sessionStorage.removeItem("coordTransItem")
//       sessionStorage.setItem("coordTransItem",JSON.stringify(result))
//     }
//   )
// }
export function locationPoint(
  longitude,
  latitude,
  attributes,
  popupTemplate,
  type
) {
  let point = {
    type: "point", // autocasts as new Point()
    longitude: longitude,
    latitude: latitude,
  };
  let url = "";
  if (type === "end") {
    url =
      "https://aquaman-1314140460.cos.ap-beijing.myqcloud.com/aquamanIcon/end.png";
  } else {
    url =
      "https://aquaman-1314140460.cos.ap-beijing.myqcloud.com/aquamanIcon/start.png";
  }
  var symbol = {
    type: "picture-marker",
    url: url,
    width: "30px",
    height: "30px",
    outline: {
      style: "solid",
    },
  };

  let pointGraphic = new Graphic({
    id: type,
    geometry: point,
    symbol: symbol,
    attributes: attributes,
    popupTemplate: popupTemplate,
  });
  return pointGraphic;
}

export function dataToTable(dataArr, type) {
  let data = [];
  if (type === 1) {
    dataArr.forEach((item) => {
      data.push([item.name, item.index, item.speed]);
    });
  } else {
    dataArr.forEach((item) => {
      data.push([
        item.name,
        item.index,
        item.speed,
        item.travelTime,
        item.delayTime,
      ]);
    });
  }

  console.log(dataArr);
  return data;
}

export function dataToPolygon(dataArr) {
  let pointArr = [];
  let graphicsLayers = new GraphicsLayer({
    id: "searchResultLayer",
  });
  const color = [
    [52, 176, 0, 0.7],
    [254, 203, 0, 0.7],
    [223, 1, 0, 0.7],
    [142, 14, 11, 0.7],
  ];

  dataArr.forEach((area) => {
    let colorIndex = 0;
    if (area.index >= 1.5) {
      colorIndex = 1;
      if (area.index >= 1.8) {
        colorIndex = 2;
        if (area.index >= 2.1) {
          colorIndex = 3;
        }
      }
    }
    let polygonAtt = {
      Name: area.name,
      Index: area.index,
      Speed: area.speed,
    };
    area.coords.forEach((polygon) => {
      pointArr = [];
      polygon[0].forEach((point) => {
        pointArr.push([point.lon, point.lat]);
      });
      const areaPolygon = {
        type: "polygon",
        rings: pointArr,
      };
      const simpleFillSymbol = {
        type: "simple-fill",
        color: color[colorIndex], // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };
      const polygonGraphic = new Graphic({
        geometry: areaPolygon,
        symbol: simpleFillSymbol,
        attributes: polygonAtt,
      });
      graphicsLayers.add(polygonGraphic);
    });
  });
  console.log(graphicsLayers.graphics.items);
  return graphicsLayers;
}

export function dataToPolyline(dataArr) {
  let pointArr = [];
  let graphicsLayers = new GraphicsLayer({
    id: "searchResultLayer",
  });
  const color = [
    [52, 176, 0, 0.7],
    [254, 203, 0, 0.7],
    [223, 1, 0, 0.7],
    [142, 14, 11, 0.7],
  ];
  console.log(dataArr);
  dataArr.forEach((area) => {
    let colorIndex = 0;
    if (area.index >= 1.5) {
      colorIndex = 1;
      if (area.index >= 1.8) {
        colorIndex = 2;
        if (area.index >= 2.1) {
          colorIndex = 3;
        }
      }
    }
    let polylineAtt = {
      Name: area.name,
      Index: area.index,
      Speed: area.speed,
      TravelTime: area.travelTime,
      DelayTime: area.delayTime,
    };
    pointArr = [];
    area.coords.forEach((point) => {
      pointArr.push([point.lon, point.lat]);
    });
    const areaLine = {
      type: "polyline",
      paths: pointArr,
    };
    const simpleLineSymbol = {
      type: "simple-line",
      color: color[colorIndex], // Orange, opacity 80%
      width: 4,
    };
    const polylineGraphic = new Graphic({
      geometry: areaLine,
      symbol: simpleLineSymbol,
      attributes: polylineAtt,
    });
    graphicsLayers.add(polylineGraphic);
  });
  console.log(graphicsLayers.graphics.items);
  return graphicsLayers;
}

export function dataToPlan(dataArr) {
  let pointArr = [];
  let polylineArr = [];
  const color = [
    [52, 176, 0, 0.7],
    [254, 203, 0, 0.7],
    [223, 1, 0, 0.7],
  ];
  let colorIndex = 0;
  console.log(dataArr);
  dataArr.forEach((path) => {
    pointArr = [];
    let time = formateSeconds(path.cost.duration);
    let pathAtt = {
      time: time[0] + "小时" + time[1] + "分",
      distance:
        parseInt(path.distance) >= 1000
          ? parseFloat(parseInt(path.distance) / 100 + "") / 10 + "公里"
          : path.distance + "米",
      trafficLight: path.cost.traffic_lights,
    };
    let pointsStr = "";
    path.steps.forEach((polyLine) => {
      pointsStr += polyLine.polyline;
    });
    pointsStr = pointsStr.split(";");
    pointsStr.forEach((point) => {
      point = point.split(",");
      pointArr.push([parseFloat(point[0]), parseFloat(point[1])]);
    });

    const areaLine = {
      type: "polyline",
      paths: pointArr,
    };
    console.log(color[colorIndex]);
    const simpleLineSymbol = {
      type: "simple-line",
      color: color[colorIndex], // Orange, opacity 80%
      width: 4,
    };
    if (colorIndex < 2) {
      colorIndex += 1;
    }
    let polylineGraphic = new Graphic({
      geometry: areaLine,
      symbol: simpleLineSymbol,
      attributes: pathAtt,
      popu: {
        // autocasts as new PopupTemplate()
        title: "{Name}",
        content: "",
      },
    });
    polylineArr.push(polylineGraphic);
  });
  return polylineArr;
}
