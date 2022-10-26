<template>
    <div class="report_page">
        <div class="report_header">
            <h1 style="font-weight: 600;left: 5%;top: 20%">中国城市交通分析报告</h1>
            <div style="width: 35%;top: 30%;left: 5%">报告采用“拥堵延时指数”作为城市拥堵程度的评价指标，即城市居民平均一次出行实际旅行时间与自由流状态下旅行时间的比值。</div>
        </div>
        <div class="report_body">
            <div class="report_item" v-for="item in reportCountryData" :key="index">
                <img :src=item.img style="width: 50%;height: 100%;right: 3%">
                <div style="top: 5%;display: flex;flex-direction: column;width: 40%">
                    <div style="height: 55%">{{item.title}}</div>
                    <div style="text-align: left;color: #09f">{{item.pubtime}}</div>
                    <div style="text-align: left;display: flex;flex-direction: row">
                        <a style="
                                    text-decoration:none;
                                    background-color: #0051c1;
                                    font-size: 13px;
                                    display: inline-block;
                                    height: 23px;
                                    line-height: 22px;
                                    text-align: center;
                                    width: 52px;
                                    border-radius: 3px;
                                    color: #ccc;
                                    margin-top: 6px;
                                    border-top: 1px #0092de solid;
                                    border-bottom: 1px #0057c8 solid;
                                    margin-right: 10px;
                                "  :href="item.name" target="_blank">查看</a>
                        <a style="
                                    text-decoration:none;
                                    background-color: #0051c1;
                                    font-size: 13px;
                                    display: inline-block;
                                    height: 23px;
                                    line-height: 22px;
                                    text-align: center;
                                    width: 52px;
                                    border-radius: 3px;
                                    color: #ccc;
                                    margin-top: 6px;
                                    border-top: 1px #0092de solid;
                                    border-bottom: 1px #0057c8 solid;
                                    margin-right: 10px;
                                "  :href="item.url" target="_blank">下载</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAreaDataStore } from "../../stores/modules/dataBase";
import dayjs from "dayjs";

export default {
  name: "CountryReport",
  setup(){
    const areaDataStore = useAreaDataStore();
    let reportCountryData = JSON.parse(JSON.stringify(areaDataStore.reportCountryData));
    reportCountryData.forEach((item)=>{
      item.pubtime=dayjs(item.pubtime).format('YYYY-MM-DD')
      item.name="https://trp.autonavi.com/share.do?id="+item.id
    })
    return{
      reportCountryData
    }
  }

};
</script>

<style scoped>
    .report_page{
        height: 95%;
        width: 80%;
    }
    .report_header{
        background-image: url("../../assets/static/reportHeader.png");
        background-size: 100% 100%;
        width: 80%;
        height: 35%;
        left: 8%;
        color: #909399;
        text-align: left;
    }
    .report_body{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        left: 8%;
    }
    .report_item{
        display: flex;
        flex-direction: row;
        width: 28%;
        height: 13vh;
        margin-top: 3%;
        color: white;
        font-size: 3px;
    }

</style>
