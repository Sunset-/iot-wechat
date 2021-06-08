<template>
    <view class="uni-container detail-container u-p-10">
        <view class="deviceName">
            设备数据曲线：{{deviceName}}
            <view class="deviceSN">
                SN: {{deviceSN}}
            </view>
        </view>
        <view>
            <radio-group @change="radioChange" class="date-filter">
                <label class="uni-list-cell uni-list-cell-pd" v-for="(item) in items" :key="item.value">
                    <view>
                        <radio :value="item.value" :checked="item.value === current" />
                    </view>
                    <view>{{item.name}}</view>
                </label>
            </radio-group>
        </view>
        <view class="detail-chart">
            <view :class="['detail-chart-inner','w-'+this.current]">
                <qiun-data-charts tooltipFormat="manyDate" :animation="false"  type="line" :opts="chartOpts" :chartData="chartData" />
            </view>
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
            items: [
                { value: "1", name: "1Day" },
                { value: "3", name: "3Days" },
                { value: "7", name: "7Days" },
                // { value: "30", name: "30Days" },
            ],
            current: "7",
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
                        },
                    ],
                },
                extra: {
                    area: { type: "curve", addLine: true, gradient: true },
                },
            },
            currentFilter: {},
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
        getDetail() {
            var now = Date.now();
            var start = now - 86400000 * (this.current-1);
            var filter = {
                deviceSN: this.currentFilter.deviceSN,
                channelNum: this.currentFilter.channelNum,
            };
            filter.queryStartTime = $util.Dates.format(
                start,
                "yyyy-MM-dd 00:00:00"
            );
            filter.queryEndTime = $util.Dates.format(
                now,
                "yyyy-MM-dd 23:59:59"
            );
            $auth.getCurrentUser().then((user) => {
                Store[
                    this.currentFilter.deviceType == 2
                        ? "detailCgq"
                        : "detailWg"
                ](filter).then((res) => {
                    if (this.currentFilter.deviceType == 2) {
                        var step = Math.ceil(res.length / 3);
                        this.chartData = {
                            categories: res.map((item, index) => {
                                if (index % step == 0) {
                                    return $util.Dates.format(
                                        item.addTime,
                                        "yyyy-MM-dd"
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
                                            "yyyy-MM-dd HH:mm:ss"
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
                                            "yyyy-MM-dd HH:mm:ss"
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
                                            "yyyy-MM-dd HH:mm:ss"
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
                                data: [
                                    { position: "left", title: "温度℃" },
                                    { position: "right", title: "电流mA" },
                                ],
                            },
                            extra: {
                                area: {
                                    type: "curve",
                                    addLine: true,
                                    gradient: true,
                                },
                            },
                        };
                    } else {
                        var step = 100;
                        this.chartData = {
                            categories: res.map((item, index) => {
                                if (index % step == 0) {
                                    return $util.Dates.format(
                                        item.addTime,
                                        "yyyy-MM-dd HH:mm:ss"
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
                                            "yyyy-MM-dd HH:mm:ss"
                                        )
                                    ),
                                    data: res.map((item) => +(item.channelValue)),
                                },
                            ],
                        };
                        this.chartOpts = {
                            yAxis: {
                                data: [
                                    {
                                        position: "left",
                                        title: this.currentFilter.unit,
                                    },
                                ],
                            },
                            extra: {
                                area: {
                                    type: "curve",
                                    addLine: true,
                                    gradient: true,
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
.detail-container{
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
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
.detail-chart {
    height: 55%;
    overflow-x: scroll;
    .detail-chart-inner{
        height:100%;
        width:20000px;
        &.w-7{
            width:20000px;
        }
        &.w-3{
            width:10000px;
        }
        &.w-1{
            width:4000px;
        }
    }
}
</style>
