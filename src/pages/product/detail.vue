<template>
    <view class="uni-container u-p-10">
        <qiun-data-charts type="area" :opts="{extra:{area:{type:'curve',addLine:true,gradient:true}}}" :chartData="chartData2" />
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
            model: {},
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
    onLoad(event) {
        uni.setNavigationBarTitle({
            title: event.name,
        });
        this.getDetail(event.id);
    },
    methods: {
        getDetail(id) {},
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
