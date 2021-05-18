<template>
    <view class="uni-container container-home">
        <view class="uni-panel home-online-chart">
            <view class="screen-pie-chart">
                <qiun-data-charts type="arcbar" :opts="{title:{name:'80%',color:'#0a73ff',fontSize:25},subtitle:{name:'在线率',color:'#0a73ff',fontSize:15}}" :chartData="chartsDataArcbar1" />
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
        <view class="uni-panel">
            <view class="panel-title" sub="单位：台">日活设备</view>
            <qiun-data-charts  type="area" :opts="{extra:{area:{type:'curve',addLine:true,gradient:true}}}" :chartData="chartData2" />
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script>
import $auth from "@/common/auth.js";
import Store from "./store";

export default {
    data() {
        return {
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
                        data: 0.8,
                        color: "#0a73ff",
                    },
                ],
            },
            chartData2: {
                categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
                series: [
                    {
                        name: "活跃设备",
                        data: [35, 36, 31, 33, 13, 34],
                    },
                ],
            },
        };
    },
    methods: {
        login() {
            $auth.login().then((res) => {
                if (res.id) {
                    this.showAutoRegist = false;
                    return;
                }
                //自动注册
                Store.regist({
                    openId: res.openId,
                    name: res.wechatUserInfo.nickName,
                }).then((res) => {
                    this.showAutoRegist = false;
                });
            });
        },
        zjss() {
            uni.switchTab({
                url: `/pages/product/index`,
            });
        },
        authJump(page) {
            $auth
                .getCurrentUser()
                .then((res) => {
                    uni.navigateTo({
                        url: page,
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
    .home-online-chart {
        background: #0f1418;
        display: flex;
        flex-direction: column;
        height: 45%;
        .screen-pie-chart{
            flex-grow: 1;
            height: 60%;
            position: relative;
            padding-top:10px;
        }
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