<template>
    <view class="uni-container container-home">
        <view>
            <u-button type="success" open-type="getUserInfo" @getuserinfo="login(e)">点击授权登录</u-button>
            <view>SCENE:{{scene}}</view>
        </view>
        <view class="uni-panel home-online-chart">
            <view class="screen-pie-chart">
                <qiun-data-charts type="arcbar" :animation="true" :opts="{title:{name:(chartOptionsLeft2.deviceCount==0?0:(chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount)).toFixed(0)+'%',color:'#0a73ff',fontSize:25},subtitle:{name:'在线率',color:'#0a73ff',fontSize:15}}" :chartData="chartsDataArcbar1" />
            </view>
            <view class="screen-chart2-detail">
                <view>
                    <label>设备总数</label>
                    <span>{{chartOptionsLeft2.deviceCount}}</span>
                </view>
                <view>
                    <label>在线设备</label>
                    <span>{{chartOptionsLeft2.onlineDeviceCount}}</span>
                </view>
                <view>
                    <label>离线设备</label>
                    <span>{{chartOptionsLeft2.offlineDeviceCount}}</span>
                </view>
            </view>
        </view>
        <view class="uni-panel home-line-chart">
            <view class="panel-title" sub="单位：台">日活设备</view>
            <!-- <qiun-loading></qiun-loading> -->
            <qiun-data-charts type="area" tooltipFormat="manyDate" :animation="true" startDate="2021-03-08" endDate="2021-05-13" :opts="{extra:{area:{type:'curve',addLine:true,gradient:true}}}" :chartData="chartData2" />
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script>
import $auth from "@/common/auth.js";
import $util from "@/common/util.js";
import Store from "./store";

export default {
    data() {
        return {
            scene: "",
            showAutoRegist: false,
            chartOptionsLeft2: {
                alarmDeviceCount: 0,
                deviceCount: 100,
                offlineDeviceCount: 0,
                onlineDeviceCount: 50,
                signalType: 0,
            },
            chartsDataArcbar1: {
                series: [
                    {
                        name: "在线率",
                        data: 0,
                        color: "#0a73ff",
                    },
                ],
            },
            chartData2: {
                categories: [],
                series: [
                    {
                        name: "活跃设备",
                        data: [],
                    },
                ],
            },
        };
    },
    mounted() {
        this.scene = $auth.getScene();
        this.init();
    },
    methods: {
        init() {
            $auth
                .getCurrentUser()
                .then(() => {
                    Store.summary().then((res) => {
                        this.chartOptionsLeft2 = res.left2;
                        this.chartsDataArcbar1 = {
                            series: [
                                {
                                    name: "在线率",
                                    data: (
                                        (res.left2.onlineDeviceCount * 1.0) /
                                        res.left2.deviceCount
                                    ).toFixed(1),
                                    color: "#0a73ff",
                                },
                            ],
                        };
                    });
                    Store.statistics().then((res) => {
                        this.chartData2 = {
                            categories: res.bottom1.map((item, index) => {
                                if (index % 14 == 0) {
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
                                    name: "活跃设备",
                                    rawCategories: res.bottom1.map(
                                        (item, index) =>
                                            $util.Dates.format(
                                                item.addTime,
                                                "yyyy-MM-dd"
                                            )
                                    ),
                                    data: res.bottom1.map(
                                        (item) => item.statisticValue
                                    ),
                                },
                            ],
                        };
                    });
                })
                .catch((e) => {});
        },
        overtime(product) {
            var actionLimitation = product["actionLimitation"];
            if (!actionLimitation || actionLimitation.length != 8) {
                return false;
            }
            var date = new Date();
            date.setFullYear(actionLimitation.substr(0, 4));
            date.setMonth(actionLimitation.substr(4, 2) - 1);
            date.setDate(actionLimitation.substr(6, 2));
            return date.getTime() < Date.now();
        },
        prompt(page) {
            $auth
                .getCurrentUser()
                .then((res) => {
                    this.$refs.prompt.show().then((code) => {
                        Store.getProductByCode({
                            code,
                        }).then((product) => {
                            if (product.list.length == 0) {
                                this.$refs.uToast.show({
                                    title: "未找到股票信息",
                                    type: "warning",
                                });
                                return;
                            }
                            if (this.overtime(product.list[0])) {
                                this.$refs.uToast.show({
                                    title: "该股票诉讼时效已经过期",
                                    type: "warning",
                                });
                                return;
                            }
                            this.$refs.prompt.hide();
                            uni.navigateTo({
                                url: `/pages/product/${page}?productId=${product.list[0].id}&name=${product.list[0].name}`,
                            });
                        });
                    });
                })
                .catch((e) => {
                    //未注册
                    uni.showToast({
                        icon: "none",
                        position: "bottom",
                        title: "请先登录",
                    });
                });
        },
    },
};
</script>
<style lang="less">
@import "@/common/uni-nvue.css";
.container-home {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #000;
    padding: 0px;
    display: flex;
    flex-direction: column;
    color: #fff;
    .home-online-chart {
        background: #0f1418;
        display: flex;
        flex-direction: column;
        height: 45%;
        .screen-pie-chart {
            flex-grow: 1;
            height: 60%;
            position: relative;
            padding-top: 10px;
        }
    }
    .home-line-chart {
        flex-direction: column;
        height: 45%;
    }
    .screen-panel {
        background: rgba(#0f1418, 1);
        border: 5px solid #000;
        padding: 10px;
        display: flex;
        flex-direction: column;
        .panel-title {
            font-size: 16px;
            color: #fff;
            flex: 0 0 30px;
            &:after {
                content: attr(sub);
                float: right;
                font-size: 12px;
                color: #999;
            }
        }
        .panel-chart {
            flex-grow: 1;
        }
    }
    .screen-chart2-detail {
        display: flex;
        flex-direction: row;
        flex: 0 0 50px;
        text-align: center;
        padding: 10px 20px;
        justify-content: space-around;
        & > div {
            display: inline-block;
            padding: 5px 10px;
        }
        label {
            display: block;
            color: #7acdef;
        }
        span {
            padding-top: 5px;
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #0a73ff;
        }
    }
}
</style>