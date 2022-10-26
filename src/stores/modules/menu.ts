import { defineStore } from "pinia";

const msgData = [
  {
    name: "城市详情",
    children: [
      {
        name: "区域拥堵排名",
        path: "/AreaCrowd",
      },
      {
        name: "道路拥堵排名",
        path: "/RoadCrowd",
      },
      {
        name: "交通预测",
        path: "/TrafficForecast",
      },
      {
        name: "出行规划",
        path: "/TravelPlan",
      },
    ],
  },
  {
    name: "全国出行概览",
    children: [
      {
        name: "全国节点拥堵排行",
        path: "/CountryNode",
      },
      {
        name: "全国高速安全隐患",
        path: "/CountrySafe",
      },
    ],
  },
  {
    name: "中国城市交通分析报告",
    children: [
      {
        name: "全国报告报告",
        path: "/CountryReport",
      },
      {
        name: "城市报告",
        path: "/CityReport",
      },
    ],
  },
  {
    name: "数字孪生",
    children: [
      {
        name: "小坦克",
        path: "/Enjoy",
      },
      {
        name: "小房子",
        path: "/House",
      },
    ],
  },
];
export const useMenuStore = defineStore("menu", {
  // 共享状态，数据
  state: () => {
    return {
      msgData,
    };
  },
  getters: {},
  actions: {},
});
