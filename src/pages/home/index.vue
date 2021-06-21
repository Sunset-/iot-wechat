<template>
    <view class="uni-container container-home">
        <view class="home-online-chart">
            <view class="screen-pie-chart">
                <!-- <qiun-data-charts type="arcbar" :animation="false" :opts="{title:{name:(chartOptionsLeft2.deviceCount==0?0:(chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount)).toFixed(0)+'%',color:'#0a73ff',fontSize:25},subtitle:{name:'在线率',color:'#0a73ff',fontSize:15}}" :chartData="chartsDataArcbar1" /> -->
                <view :class="['loading','progress-'+(chartOptionsLeft2.deviceCount==0?0:Math.round(chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount))]">
                    <view class="left"></view>
                    <view class="right"></view>
                    <view class="progress"><span class="loading-text">{{chartOptionsLeft2.deviceCount==0?0:Math.round(chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount)}}%</span></view>
                </view>
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
                <qiun-data-charts type="area" tooltipFormat="manyDate" :animation="true" startDate="2021-03-08" endDate="2021-05-13" :opts="{extra:{area:{type:'curve',addLine:true,gradient:true}}}" :chartData="chartData2" />
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
            ssss: 0.2,
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
            chartData2: {},
            userInfo: { wechatUserInfo: {} },
            loaded: false,
            logined: false,
        };
    },
    onShow() {
        this.init();
        $auth
            .loginByOpenId()
            .then((res) => {
                this.loaded = true;
                if (res.id) {
                    //已注册
                    this.userInfo = res;
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
                }
            });
        },
        subscribeAlarm() {
            // uni.redirectTo({
            //     url: "/pages/product/index",
            // });
            // return;
            $auth
                .getCurrentUser()
                .then((user) => {
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
                })
                .catch((e) => {
                    uni.redirectTo({
                        url: "/pages/product/index",
                    });
                });
        },
        init() {
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
                this.$nextTick(() => {
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
                                rawCategories: res.bottom1.map((item, index) =>
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
        flex-shrink: 0;
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
        flex-shrink: 0;
    }
    .screen-chart2-detail {
        display: flex;
        flex-direction: row;
        flex: 0 0 40px;
        text-align: center;
        padding: 5px 20px;
        justify-content: space-around;
        flex-shrink: 0;
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

    .loading {
        margin: 20px auto 0px auto;
        width: 10em;
        height: 10em;
        position: relative;
    }
    .loading .progress {
        position: absolute;
        width: 8em;
        height: 8em;
        background-color: #0F1418;
        border-radius: 50%;
        left: 1em;
        top: 1em;
        line-height: 8em;
        text-align: center;
        .loading-text{
            font-size:18px;
        }
    }

    .left,
    .right {
        width: 5em;
        height: 10em;
        overflow: hidden;
        position: relative;
        float: left;
        background-color: #999999;
    }

    .left {
        border-radius: 10em 0 0 10em;
    }

    .right {
        border-radius: 0 10em 10em 0;
    }

    .left:after,
    .right:after {
        content: "";
        position: absolute;
        display: block;
        width: 5em;
        height: 10em;
        background-color: white;
        border-radius: 10em 0 0 10em;
        background-color: rgb(10, 115, 255);
    }

    .right:after {
        content: "";
        position: absolute;
        display: block;
        border-radius: 0 10em 10em 0;
    }
    .left:after {
        transform-origin: right center;
        transform: rotateZ( -180deg);
    }
    .right:after {
        transform-origin: left center;
        transform: rotateZ( -180deg);
    }

    .loop(@i) when (@i > 0) {
        .loop((@i - 1));    // 递归调用自身
        &.progress-@{i}{
            .left:after {
                transform: rotateZ( (max( @i - 50 ,0) / 50.0 * 180 + -180) * 1deg);
            }
            .right:after {
                transform:  rotateZ( (min( @i ,50) / 50.0 * 180 + -180) * 1deg);
            }
        }
    }
    .loading{
        .loop(100);
    }
}
</style>