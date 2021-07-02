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
        <scroll-view class="scroll-view_H detail-chart" scroll-x="true" scroll-left="0">
            <view :class="['detail-chart-inner','w-'+chartStyle]">
                <qiun-data-charts :animation="true" :type="chartType" :opts="chartOpts" :chartData="chartData" />
            </view>
        </scroll-view>
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
                        this.chartData = {
                            categories: res.map((item, index) => {
                                if (index % step == 0) {
                                    return $util.Dates.format(
                                        item.addTime,
                                        "HH:mm:ss"
                                    );
                                } else {
                                    return "";
                                }
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
                                    style: "curve",
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
                                    style: "curve",
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
                                    style: "curve",
                                    data: res.map((item) => item.a2),
                                },
                            ],
                        };
                        this.chartOpts = {
                            yAxis: {
                                disableGrid: !res || res.length == 0,
                                data: [
                                    {
                                        position: "left",
                                        title: "温度℃",
                                        tofix: 1,
                                    },
                                    {
                                        position: "right",
                                        title: "电流mA",
                                        tofix: 2,
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
                            Math.max(Math.ceil(res.length / 500), 1) * 20;
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
                                if (index % step == 0) {
                                    return $util.Dates.format(
                                        item.addTime,
                                        "HH:mm:ss"
                                    );
                                } else {
                                    return "";
                                }
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
    .detail-chart-inner {
        height: 100%;
        width: 3000px;
        &.w-500 {
            width: 1000px;
        }
        // &.w-1000 {
        //     width: 8000px;
        // }
        // &.w-2000 {
        //     width: 16000px;
        // }
        // &.w-3000 {
        //     width: 24000px;
        // }
        // &.w-4000 {
        //     width: 32000px;
        // }
        // &.w-5000 {
        //     width: 40000px;
        // }
        // &.w-6000 {
        //     width: 48000px;
        // }
        // &.w-7000 {
        //     width: 56000px;
        // }
        // &.w-8000 {
        //     width: 64000px;
        // }
    }
}
</style>
