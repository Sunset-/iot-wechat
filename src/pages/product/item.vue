<template>
    <view :class='["my-unit",overtime?"overtime color-999":""]'>
        <view :class="['unit-head product_code_label']">
            <view class="uni-title">
                <view>{{data.deviceName}}</view>
                <view class="mini-sn">sn：{{data.deviceSN}}</view>
            </view>
            <view class="uni-operate">
                <view v-html="statusDom"></view>
                <text class="sunseticon sunseticon-location" :color="'#8f8f94'" @click="showMap()"></text>
            </view>
        </view>
        <view :class="['unit-body']">
            <view v-show="data.deviceType!=2" v-for="(item,index) in data.$channels" :key="index" class="device-channel">
                {{item.label}}：{{item.measure}}&nbsp;{{item.value}}{{item.unit}}
                <text class="sunseticon sunseticon-warning" v-if="item.alarmcode&&data.alarmcode>0" :color="'#8f8f94'"></text>
                <text class="sunseticon sunseticon-chart" :color="'#8f8f94'" @click="showDetail(item)"></text>
            </view>
            <view v-show="data.deviceType==2" class="device-channel full">
                <text class="att-label" v-for="(item,index) in data.$channels" :key="index">{{item.label}}:{{item.measure}}{{item.value}}{{item.unit}}</text>
                <text class="sunseticon sunseticon-warning" v-if="data.alarmcode&&data.alarmcode>0" :color="'#8f8f94'"></text>
                <text class="sunseticon sunseticon-chart" :color="'#8f8f94'" @click="showDetail(data)"></text>
            </view>
            <view class="color-999" style="width:100%;padding:2upx 10upx;">
                <view class="fl">{{data.groupName}}</view>
                <view class="fr">{{formatTime(data.addTime)}}</view>
            </view>
        </view>
        <!-- <view class="unit-foot">
            <u-button v-if="!overtime" type="primary" class="fr btn" size="mini" throttle-time="100" @click="showDetail()">查看详情</u-button>
            <u-button v-if="!overtime" type="primary" class="fr btn" size="mini" throttle-time="100" @click="showMap()">地图</u-button>
        </view> -->
    </view>
</template>
<script>
import $business from "@/common/business.js";
import $util from "@/common/util.js";

export default {
    props: {
        data: {},
    },
    data() {
        return {
            channels: [
                {
                    no: "CH1",
                    label: "压力",
                    value: "0.5",
                    unit: "MPA",
                },
                {
                    no: "CH1",
                    label: "压力",
                    value: "0.5",
                    unit: "MPA",
                },
                {
                    no: "CH1",
                    label: "压力",
                    value: "0.5",
                    unit: "MPA",
                },
                {
                    no: "CH1",
                    label: "压力",
                    value: "0.5",
                    unit: "MPA",
                },
            ],
        };
    },
    methods: {
        formatTime(v) {
            return $util.Dates.format(v);
        },
        showDetail(channel) {
            uni.navigateTo({
                url: `./detail?deviceName=${this.data.deviceName}&deviceSN=${this.data.deviceSN}&channelNum=${channel.channel}&deviceType=${this.data.deviceType}&unit=${channel.unit}&label=${channel.label}`,
            });
            this.$store.commit("switch_loading");
        },
        showMap() {
            uni.navigateTo({
                url: `./map?id=${this.data.id}&name=${this.data.name}`,
            });
            this.$store.commit("switch_loading");
        },
        color(record) {
            var color = "";
            var ral = `${record.actionLimitation}`;
            if (record.actionLimitation && ral.length == 8) {
                var now = Date.now();
                var d = new Date();
                d.setFullYear(+ral.substring(0, 4));
                d.setMonth(+ral.substring(4, 6) - 1);
                d.setDate(+ral.substring(6, 8));
                var dtime = d.getTime();
                if (now > dtime) {
                    color = "label-invalid";
                } else if (dtime - now < 86400000 * 30) {
                    color = "label-one-month";
                } else if (dtime - now < 86400000 * 90) {
                    color = "label-three-month";
                }
            }
            return color;
        },
    },
    computed: {
        overtime() {
            var actionLimitation = this.data["actionLimitation"];
            if (!actionLimitation || actionLimitation.length != 8) {
                return false;
            }
            var date = new Date();
            date.setFullYear(actionLimitation.substr(0, 4));
            date.setMonth(actionLimitation.substr(4, 2) - 1);
            date.setDate(actionLimitation.substr(6, 2));
            return date.getTime() < Date.now();
        },
        statusDom() {
            return `
                ${$business.generateElectricityDom(this.data.powerpercent)}
                ${$business.generateCsqDom(this.data.csq)}
            `;
        },
    },
    created() {},
};
</script>
<style lang='scss'>
.color-primary {
    color: #0d3a63;
}
.my-unit {
    margin: 10upx 0;
    background-color: #ffffff;
    font-size: 28upx;
    transform: all 1s;
    border-bottom: 1px solid #cdcdcd;
    .unit-head {
        padding: 5upx 10upx;
        height: 100upx;
        box-sizing: border-box;
        border-bottom: 2upx solid #e4e7ed;
        background: #0a73ff;
        color: #fff;
        font-size: 28upx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .uni-title {
            .mini-sn {
                font-size: 12upx;
            }
        }
        .uni-operate {
            display: flex;
            flex-direction: row;
            align-items: center;
            .sunseticon-location {
                font-size: 50upx;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
    .unit-body {
        padding: 10upx 5upx;
        display: flex;
        flex-wrap: wrap;
        background: #f6f6f6;
        display: flex;
        flex-direction: row;
        .device-channel {
            box-sizing: border-box;
            border: 1px solid #dedede;
            background: #fff;
            margin: 2px 5upx;
            padding: 2upx 10upx;
            width: calc(50% - 10upx);
            .sunseticon {
                padding: 0upx 5upx;
                float: right;
                font-size: 28upx;
            }
            &.full {
                width: calc(100% - 10upx);
            }
        }
        .sunseticon-warning {
            color: orangered;
        }
        .att-label {
            display: inline-block;
            padding-right: 20upx;
        }
    }
    .unit-foot {
        height: 88upx;
        padding: 0 20upx;
        border-top: 2upx solid #f5f5f5;
        border-bottom: none;
        line-height: 88upx;

        .btn {
            height: 60upx;
            font-size: 28upx;
            line-height: 60upx;
            margin: 14upx 0;
        }
    }
}
</style>