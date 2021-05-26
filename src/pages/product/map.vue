<template>
    <view class="uni-container map-container u-p-10 uni-flex uni-column">
        <view class="uni-grow">
            <map style="width: 100%;height:100%;" :latitude="location.latitude" :longitude="location.longitude" :markers="covers">
                <cover-view slot="callout">
                    <cover-view marker-id="1">
                        <view style="font-size:12px;width:50px;height:30px;">123</view>
                    </cover-view>
                </cover-view>
            </map>
        </view>
        <view class="device-info-box">
            <view class="device-info">
                {{data.deviceName}}
                <text class="device-sbinfo">
                    SN:{{data.deviceName}}
                </text>
            </view>
            <view class="device-channels">
                <view v-for="(item,index) in data.$channels" :key="index" class="device-channel">
                    {{item.label}}：{{item.measure}}&nbsp;{{item.value}}&nbsp;{{item.unit}}
                </view>
                <view class="location-button">
                    <u-button type="success" @click="mapLocation()">设备导航</u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import Store from "./store";
import $auth from "@/common/auth.js";
import $config from "@/common/config.js";

export default {
    data() {
        return {
            title: "",
            location: {
                latitude: 39.909,
                longitude: 116.39742,
            },
            covers: [],
            data: {},
        };
    },
    onLoad(event) {
        Store.list({
            deviceSN: event.deviceSN,
            pageIndex: 1,
            pageSize: 10,
        }).then((res) => {
            this.data = res.list[0] || {};
            this.location.latitude = this.data.lat;
            this.location.longitude = this.data.lng;
            this.covers = [
                {
                    id: "1",
                    latitude: this.data.lat,
                    longitude: this.data.lng,
                    iconPath: "/static/location.png",
                    customCallout: {
                        display: "ALWAYS",
                        content: "12123123213\n12312312",
                        fontSize: 12,
                    },
                },
            ];
        });
    },
    methods: {
        mapLocation() {
            uni.openLocation({
                latitude: this.data.lat,
                longitude: this.data.lng,
                success: function () {
                    console.log("success");
                },
            });
        },
    },
};
</script>
<style>
@import "@/common/uni-nvue.css";
</style>
<style lang="scss">
.map-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
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
.device-info-box {
    height: 40%;
    overflow-y: auto;
}
.device-info {
    font-size: 32upx;
    font-weight: bold;
    .device-sbinfo {
        display: inline-block;
        padding-left: 5px;
        font-size: 24upx;
        font-weight: normal;
    }
}
.device-channels {
}
.device-channel {
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid #dedede;
    background: #fff;
    margin: 2px 5upx;
    padding: 0upx 10upx;
    height: 70upx;
    line-height: 70upx;
    width: calc(50% - 10upx);
    .sunseticon {
        padding: 0upx 10upx;
        float: right;
        font-size: 36upx;
        line-height: 70upx;
    }
}
.location-button {
    padding: 20upx 10upx;
}
</style>
