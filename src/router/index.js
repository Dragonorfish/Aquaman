import { createRouter, createWebHistory } from "vue-router";
import RoadCrowd from "../views/citydetail/RoadCrowd.vue";
import AreaCrowd from "../views/citydetail/AreaCrowd.vue";
import TrafficForecast from "../views/citydetail/TrafficForecast.vue";
import TravelPlan from "../views/citydetail/TravelPlan.vue";
import CountryNode from "../views/countrydetail/CountryNode.vue";
import CountrySafe from "../views/countrydetail/CountrySafe.vue";
import CountryReport from "../views/reports/CountryReport.vue";
import CityReport from "../views/reports/CityReport.vue";
import ToggleBaseMap from "../components/ToggleBaseMap.vue";
import OverviewMap from "../components/OverviewMap.vue";
import Enjoy from "../views/enjoy/Enjoy.vue";
import House from "../views/enjoy/House.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: TravelPlan,
    },
    {
      path: "/togglemap",
      name: "toggleBaseMap",
      component: ToggleBaseMap,
    },
    {
      path: "/map",
      name: "map",
      component: OverviewMap,
    },
    {
      path: "/AreaCrowd",
      name: "AreaCrowd",
      component: AreaCrowd,
    },
    {
      path: "/RoadCrowd",
      name: "RoadCrowd",
      component: RoadCrowd,
    },
    {
      path: "/TrafficForecast",
      name: "TrafficForecast",
      component: TrafficForecast,
    },
    {
      path: "/CountryNode",
      name: "CountryNode",
      component: CountryNode,
    },
    {
      path: "/CountrySafe",
      name: "CountrySafe",
      component: CountrySafe,
    },
    {
      path: "/CountryReport",
      name: "CountryReport",
      component: CountryReport,
    },
    {
      path: "/CityReport",
      name: "CityReport",
      component: CityReport,
    },
    {
      path: "/TravelPlan",
      name: "TravelPlan",
      component: TravelPlan,
    },
    {
      path: "/Enjoy",
      name: "Enjoy",
      component: Enjoy,
    },
    {
      path: "/House",
      name: "House",
      component: House,
    },
  ],
});

export default router;
