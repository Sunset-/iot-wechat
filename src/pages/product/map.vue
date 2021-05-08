<template>
    <view class="uni-container u-p-10">
        <view class="uni-flex uni-column">
            <map style="width: 100%; height: 500px;" :latitude="location.latitude" :longitude="location.longitude" :markers="covers">
                <cover-view slot="callout">
                    <cover-view marker-id="1">
                        <view style="font-size:12px;width:50px;height:30px;">123</view>
                    </cover-view>
                </cover-view>
            </map>
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
            covers: [{
                id : "1",
                latitude: 39.909,
                longitude: 116.39722,
                iconPath: '/static/location.png',
                customCallout : {
                    display : "ALWAYS",
                    content : "12123123213\n12312312",
                    fontSize : 12
                }
            }]
        };
    },
    onLoad(event) {
        uni.setNavigationBarTitle({
            title: event.name,
        });
        this.getDetail(event.id);
    },
    methods: {
        async getDetail(id) {
            var res = await Store.detail(id);
            if (res && res.list.length > 0) {
                this.model = res.list[0];
            }
        },
        submit() {
            $auth
                .getCurrentUser()
                .then((res) => {
                    uni.navigateTo({
                        url: `./order?productId=${this.model.id}`,
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
        calculate() {
            $auth
                .getCurrentUser()
                .then((res) => {
                    uni.navigateTo({
                        url: `./calculate?productId=${this.model.id}`,
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
<style>
@import "@/common/uni-nvue.css";
</style>
<style lang="scss">
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
</style>
