<template>
    <view class="uni-container detail-container u-p-10">
        <view class="deviceName">
            设备数据曲线：{{deviceName}}
            <view class="deviceSN">
                SN: {{deviceSN}}
            </view>
        </view>
        <view class="uni-row filter-date">
            <view class="uni-list-cell-left">
                请选择日期
            </view>
            <picker class="date-picker" mode="date" :value="date" @change="getDetail">
                <view>{{date}}</view>
            </picker>
            <!-- <radio-group @change="radioChange" class="date-filter">
                <label class="uni-list-cell uni-list-cell-pd" v-for="(item) in items" :key="item.value">
                    <view>
                        <radio :value="item.value" :checked="item.value === current" />
                    </view>
                    <view>{{item.name}}</view>
                </label>
            </radio-group> -->
        </view>
        <!-- <scroll-view class="scroll-view_H detail-chart" scroll-x="true" scroll-left="0">
            <view :class="['detail-chart-inner','w-'+chartStyle]">
                <qiun-data-charts :animation="true" :type="chartType" :opts="chartOpts" :chartData="chartData" />
            </view>
        </scroll-view> -->
        <view :class="['detail-chart-inner','w-'+chartStyle]">
            <qiun-data-charts :animation="true" :type="chartType" :opts="chartOpts" :chartData="chartData" :ontouch="true" :canvas2d="true" />
        </view>
    </view>
</template>

<script>
import Store from "./store";
import $auth from "@/common/auth.js";
import $util from "@/common/util.js";
import $config from "@/common/config.js";

export default {
    data() {
        return {
            title: "",
            deviceName: "",
            deviceSN: "",
            model: {},
            chartType: "line",
            items: [
                { value: "1", name: "1Day" },
                { value: "2", name: "2Days" },
                { value: "7", name: "7Days" },
                // { value: "30", name: "30Days" },
            ],
            current: "1",
            date: $util.Dates.format(new Date(), "yyyy-MM-dd"),
            chartData: {
                categories: [],
                series: [
                    {
                        name: "",
                        data: [],
                    },
                ],
            },
            chartOpts: {
                yAxis: {
                    data: [
                        {
                            title: "",
                            tofix: 2,
                        },
                    ],
                },
                enableScroll: true, //开启图表拖拽功能
                extra: {
                    area: { type: "curve", addLine: true, gradient: true },
                },
            },
            currentFilter: {},
            chartStyle: "",
            showChart: true,
            runningFilter: {},
        };
    },
    onLoad(event) {
        // uni.setNavigationBarTitle({
        //     title: "设备数据："+event.deviceName,
        // });
        this.deviceName = event.deviceName;
        this.deviceSN = event.deviceSN;
        this.currentFilter = {
            deviceSN: event.deviceSN,
            deviceType: event.deviceType,
            channelNum: event.channelNum,
            unit: event.unit,
            label: event.label,
        };
        this.getDetail();
    },
    methods: {
        radioChange: function (evt) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].value === evt.target.value) {
                    this.current = this.items[i].value;
                    break;
                }
            }
            this.getDetail();
        },
        getDetail(e) {
            this.date = e ? e.target.value : this.date;
            var filter = {
                deviceSN: this.currentFilter.deviceSN,
                channelNum: this.currentFilter.channelNum,
            };
            filter.queryStartTime = `${this.date} 00:00:00`;
            filter.queryEndTime = `${this.date} 23:59:59`;
            this.runningFilter = filter;
            this.showChart = false;
            this.chartData.series = [];
            $auth.getCurrentUser().then((user) => {
                Store[
                    this.currentFilter.deviceType == 2
                        ? "detailCgq"
                        : "detailWg"
                ](filter).then((res) => {
                    this.showChart = true;
                    if (this.runningFilter != filter) {
                        return;
                    }
                    if (this.currentFilter.deviceType == 2) {
                        var step = Math.ceil(res.length / 3);
                        this.chartType = "mix";
                        this.chartStyle = "500";

                        var maxT = null;
                        var minT = null;
                        var maxA = null;
                        var minA = null;
                        res.forEach((item) => {
                            var t = +item.t;
                            var a1 = +item.a1;
                            var a2 = +item.a2;
                            if (maxT == null) {
                                maxT = t;
                            } else {
                                maxT = Math.max(maxT, t);
                            }
                            if (minT == null) {
                                minT = t;
                            } else {
                                minT = Math.min(minT, t);
                            }
                            if (maxA == null) {
                                maxA = a1;
                            } else {
                                maxA = Math.max(maxA, a1);
                            }
                            if (maxA == null) {
                                maxA = a2;
                            } else {
                                maxA = Math.max(maxA, a2);
                            }
                            if (minA == null) {
                                minA = a1;
                            } else {
                                minA = Math.min(minA, a1);
                            }
                            if (minA == null) {
                                minA = a2;
                            } else {
                                minA = Math.min(minA, a2);
                            }
                        });
                        var topT = maxT + maxT - minT;
                        var bottomT = minT - maxT + minT;
                        var topA = maxA + maxA - minA;
                        var bottomA = minA - maxA + minA;

                        this.chartData = {
                            categories: res.map((item, index) => {
                                return $util.Dates.format(
                                    item.addTime,
                                    "HH:mm:ss"
                                );
                            }),
                            series: [
                                {
                                    name: "温度",
                                    rawCategories: res.map((item, index) =>
                                        $util.Dates.format(
                                            item.addTime,
                                            "HH:mm:ss"
                                        )
                                    ),
                                    type: "line",
                                    dataPointShape: true,
                                    dataPointShapeType: "solid",
                                    // style: "curve",
                                    dataLabel: false,
                                    data: res.map((item) => item.t),
                                },
                                {
                                    name: "电流1",
                                    index: 1,
                                    dataLabel: false,
                                    rawCategories: res.map((item, index) =>
                                        $util.Dates.format(
                                            item.addTime,
                                            "HH:mm:ss"
                                        )
                                    ),
                                    type: "line",
                                    dataPointShape: true,
                                    dataPointShapeType: "solid",
                                    // style: "curve",
                                    data: res.map((item) => item.a1),
                                },
                                {
                                    name: "电流2",
                                    index: 1,
                                    rawCategories: res.map((item, index) =>
                                        $util.Dates.format(
                                            item.addTime,
                                            "HH:mm:ss"
                                        )
                                    ),
                                    type: "line",
                                    dataPointShape: true,
                                    dataPointShapeType: "solid",
                                    // style: "curve",
                                    data: res.map((item) => item.a2),
                                },
                            ],
                        };
                        this.chartOpts = {
                            enableScroll: true, //开启图表拖拽功能
                            xAxis: {
                                type: "grid",
                                gridType: "dash",
                                labelCount: 4,
                                itemCount: 25, //x轴单屏显示数据的数量，默认为5个
                                scrollShow: true, //新增是否显示滚动条，默认false
                                scrollAlign: "left", //滚动条初始位置
                                scrollBackgroundColor: "#F7F7FF", //默认为 #EFEBEF
                                scrollColor: "#DEE7F7", //默认为 #A6A6A6
                            },
                            yAxis: {
                                disableGrid: !res || res.length == 0,
                                data: [
                                    {
                                        position: "left",
                                        title: "温度℃",
                                        tofix: 1,
                                        min: isNaN(bottomT) ? void 0 : bottomT,
                                        max: isNaN(topT) ? void 0 : topT,
                                    },
                                    {
                                        position: "right",
                                        title: "电流mA",
                                        tofix: 2,
                                        min: isNaN(bottomA) ? void 0 : bottomA,
                                        max: isNaN(topA) ? void 0 : topA,
                                    },
                                ],
                            },
                            legend: {
                                show: true,
                                position: "bottom",
                                float: "center",
                                padding: 5,
                                margin: 5,
                                backgroundColor: "rgba(0,0,0,0)",
                                borderColor: "rgba(0,0,0,0)",
                                borderWidth: 0,
                                fontSize: 13,
                                fontColor: "#666666",
                                lineHeight: 11,
                                hiddenColor: "#CECECE",
                                itemGap: 10,
                            },
                            extra: {
                                area: {
                                    type: "curve",
                                    addLine: true,
                                    gradient: true,
                                },
                                tooltip: {
                                    showBox: true,
                                    showArrow: true,
                                    showCategory: true,
                                },
                            },
                        };
                    } else {
                        var step =
                            Math.max(Math.ceil(res.length / 500), 1) * 10;
                        this.chartType = "line";
                        this.chartStyle = "";
                        var maxV = null;
                        var minV = null;
                        res.forEach((item) => {
                            var v = +item.channelValue;
                            if (maxV == null) {
                                maxV = v;
                            } else {
                                maxV = Math.max(maxV, v);
                            }
                            if (minV == null) {
                                minV = v;
                            } else {
                                minV = Math.min(minV, v);
                            }
                        });
                        var top = maxV + maxV - minV;
                        var bottom = minV - maxV + minV;

                        this.chartData = {
                            categories: res.map((item, index) => {
                                return $util.Dates.format(
                                    item.addTime,
                                    "HH:mm:ss"
                                );
                            }),
                            series: [
                                {
                                    name: this.currentFilter.label,
                                    rawCategories: res.map((item, index) =>
                                        $util.Dates.format(
                                            item.addTime,
                                            "HH:mm:ss"
                                        )
                                    ),
                                    data: res.map((item) => +item.channelValue),
                                },
                            ],
                        };
                        this.chartOpts = {
                            enableScroll: true, //开启图表拖拽功能
                            xAxis: {
                                type: "grid",
                                gridType: "dash",
                                labelCount: 4,
                                itemCount: 25, //x轴单屏显示数据的数量，默认为5个
                                scrollShow: true, //新增是否显示滚动条，默认false
                                scrollAlign: "left", //滚动条初始位置
                                scrollBackgroundColor: "#F7F7FF", //默认为 #EFEBEF
                                scrollColor: "#DEE7F7", //默认为 #A6A6A6
                            },
                            yAxis: {
                                disableGrid: !res || res.length == 0,
                                data: [
                                    {
                                        position: "left",
                                        title: this.currentFilter.unit,
                                        tofix: 2,
                                        min: isNaN(bottom) ? void 0 : bottom,
                                        max: isNaN(top) ? void 0 : top,
                                    },
                                ],
                            },
                            extra: {
                                area: {
                                    type: "curve",
                                    addLine: true,
                                    gradient: true,
                                },
                                tooltip: {
                                    showBox: true,
                                    showArrow: true,
                                    showCategory: true,
                                },
                            },
                        };
                    }
                });
            });
        },
    },
};
</script>
<style>
@import "@/common/uni-nvue.css";
</style>
<style lang="scss">
.detail-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
.color-primary {
    color: #0d3a63;
}
.detail-head {
    background-color: #0d3a63;
    color: #fff;
    padding: 10upx 15upx;
}
.detail-foot {
    padding: 10upx 15upx;
    margin-top: 10upx;
    border-top: 1px solid #1e222d;
}
.detail-item {
    padding: 10upx 15upx;
    &:nth-child(odd) {
        background-color: darken(#f4f4f5, 5%);
    }
}
.deviceName {
    padding: 10px 0px;
    text-align: center;
    font-size: 40upx;
}
.deviceSN {
    padding-top: 5px;
    text-align: left;
    padding-left: 10px;
    font-size: 28upx;
}
.date-filter {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0px;
    .uni-list-cell-pd {
        padding: 0px;
    }
}
.filter-date {
    height: 70upx;
    line-height: 70upx;
    background: #fff;
    align-items: center;
}
.date-picker {
    flex-grow: 1;
}
.detail-chart {
    height: 55%;
    overflow-x: scroll;
    position: relative;
}
.detail-chart-inner {
    height: 350px;
    width: 100%;
    &.w-500 {
        width: 100%;
    }
}
</style>
