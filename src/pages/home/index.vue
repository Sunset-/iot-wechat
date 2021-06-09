<template>
    <view class="uni-container container-home">
        <view class="home-online-chart">
            <view class="screen-pie-chart">
                <qiun-data-charts type="arcbar" :animation="false" :opts="{title:{name:(chartOptionsLeft2.deviceCount==0?0:(chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount)).toFixed(0)+'%',color:'#0a73ff',fontSize:25},subtitle:{name:'在线率',color:'#0a73ff',fontSize:15}}" :chartData="chartsDataArcbar1" />
            </view>
            <view class="screen-chart2-detail">
                <view>
                    <text class="label">设备总数</text>
                    <text class="span">{{chartOptionsLeft2.deviceCount}}</text>
                </view>
                <view>
                    <text class="label">在线设备</text>
                    <text class="span">{{chartOptionsLeft2.onlineDeviceCount}}</text>
                </view>
                <view>
                    <text class="label">离线设备</text>
                    <text class="span">{{chartOptionsLeft2.offlineDeviceCount}}</text>
                </view>
            </view>
        </view>
        <view class="home-line-chart ">
            <view class="panel-title" sub="单位：台">日活设备</view>
            <view class="panel-chart">
                <qiun-data-charts type="area" tooltipFormat="manyDate" :animation="false" startDate="2021-03-08" endDate="2021-05-13" :opts="{extra:{area:{type:'curve',addLine:true,gradient:true}}}" :chartData="chartData2" />
            </view>
        </view>
        <view>
            <view class="login-button" v-if="loaded&&logined">
                <u-button type="success" @click="subscribeAlarm">查看详情</u-button>
            </view>
            <view class="login-button" v-if="loaded&&!logined">
                <u-button type="success" open-type="getUserInfo" @getuserinfo="login(e)">点击授权登录</u-button>
            </view>
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
                deviceCount: 0,
                offlineDeviceCount: 0,
                onlineDeviceCount: 0,
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
            userInfo: { wechatUserInfo: {} },
            loaded: false,
            logined: false,
        };
    },
    onShow() {
        $auth
            .loginByOpenId()
            .then((res) => {
                this.loaded = true;
                if (res.id) {
                    //已注册
                    this.userInfo = res;
                    this.init();
                    console.log("已登录用户：", res);
                    this.logined = true;
                    return;
                }
            })
            .catch((e) => {
                this.loaded = true;
            });
    },
    mounted() {
        this.scene = $auth.getScene();
    },
    methods: {
        login() {
            $auth.login().then((res) => {
                this.currentUser = res;
                if (res) {
                    this.logined = true;
                    this.init();
                }
            });
        },
        subscribeAlarm() {
            // uni.redirectTo({
            //     url: "/pages/product/index",
            // });
            // return;
            $auth.getCurrentUser().then((user) => {
                var tmplIds = (
                    user.alarmTemplateId ||
                    "mDPNgIm27Bp8hl7QhzL-dGZyfN7vEIzier-LuiV3xvQ"
                ).split(",");
                uni.requestSubscribeMessage({
                    tmplIds: tmplIds,
                    success(res) {
                        console.log("订阅成功：", JSON.stringify(res));
                        // uni.showToast({
                        //     icon: "success",
                        //     position: "bottom",
                        //     title: "订阅成功",
                        // });
                        uni.redirectTo({
                            url: "/pages/product/index",
                        });
                    },
                });
            });
        },
        init() {
            $auth
                .getCurrentUser()
                .then(() => {
                    this.logined = true;
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
                        var step = Math.floor(res.bottom1.length / 3);
                        this.chartData2 = {
                            categories: res.bottom1.map((item, index) => {
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
                .catch((e) => {
                    console.error(e);
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
    overflow: hidden;
    .home-online-chart {
        background: #0f1418;
        display: flex;
        flex-direction: column;
        height: 45%;
        .screen-pie-chart {
            flex-grow: 1;
            position: relative;
            padding-top: 10px;
        }
    }
    .home-line-chart {
        display: flex;
        flex-direction: column;
        height: calc(55% - 60px);
    }
    .panel-title {
        font-size: 12px;
        color: #fff;
        padding: 0px 10px;
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
    .screen-chart2-detail {
        display: flex;
        flex-direction: row;
        flex: 0 0 40px;
        text-align: center;
        padding: 5px 20px;
        justify-content: space-around;
        & > * {
            display: inline-block;
            padding: 5px 10px;
        }
        .label {
            display: block;
            color: #7acdef;
        }
        .span {
            padding-top: 0px;
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #0a73ff;
        }
    }
    .login-button {
        padding: 10px;
    }
}
</style>