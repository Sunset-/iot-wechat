<template>
    <view class="product-container">
        <view class="page_header uni-panel search-header">
            <u-search placeholder="关键字/拼音" v-model="keyword" @change="inputChange"></u-search>
            <view class="top-status-tip">
                <view>全部 <text>{{summaryData.deviceCount}}</text></view>
                <view>正常 <text>{{summaryData.onlineDeviceCount}}</text></view>
                <view>告警 <text>{{summaryData.alarmDeviceCount}}</text></view>
                <view>掉线 <text>{{summaryData.offlineDeviceCount}}</text></view>
            </view>
        </view>
        <view class="uni-list product-list-wrap">
            <block v-for="(value, index) in listData" :key="index">
                <product-item :data="value"></product-item>
            </block>
            <uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
        </view>
    </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import ProductItem from "./item.vue";
import Store from "./store";
import $auth from "@/common/auth.js";
var dateUtils = require("@/common/util.js").dateUtils;

export default {
    components: {
        uniLoadMore,
        ProductItem,
    },
    data() {
        return {
            keyword: "",
            listData: [],
            status: "more",
            contentText: {
                contentdown: "上拉加载更多",
                contentrefresh: "加载中",
                contentnomore: "没有更多",
            },
            currentState: 0,
            summaryData: {
                alarmDeviceCount: 0,
                deviceCount: 0,
                offlineDeviceCount: 0,
                onlineDeviceCount: 0,
                signalType: 0,
            },
            tabs: [
                {
                    name: "全部",
                },
                {
                    name: "立案",
                },
                {
                    name: "处罚",
                },
                {
                    name: "判决",
                },
            ],
        };
    },
    onLoad() {
        $auth.getCurrentUser().then((user) => {
            Store.summary().then((res) => {
                this.summaryData = res;
            });
        });
        this.loadData(true);
    },
    onPullDownRefresh() {
        this.loadData(true);
    },
    onReachBottom() {
        this.loadData();
    },
    methods: {
        tabsChange(index) {
            this.currentState = index;
            this.loadData(true);
        },
        inputChange() {
            const vm = this;
            // 输入框防抖
            clearTimeout(vm.timer);
            vm.timer = setTimeout(function () {
                // 切换为搜索
                vm.loadData(true);
            }, 300);
        },
        loadData(clear) {
            if (clear === true) {
                this.listData = [];
            } else if (this.status == "noMore") {
                return;
            }
            this.status = "loading";
            $auth
                .getCurrentUser()
                .then((user) => {
                    Store.list({
                        deviceSN: this.keyword,
                        pageSize: 10,
                        pageIndex: Math.floor(this.listData.length / 10) + 1,
                    })
                        .then((res) => {
                            console.log("请求接口结果：", res.list);
                            this.listData = this.listData.concat(res.list);
                            this.status =
                                res.count == this.listData.length
                                    ? "noMore"
                                    : "more";
                        })
                        .finally(() => {
                            uni.stopPullDownRefresh();
                        });
                })
                .catch((e) => {
                    console.error(e);
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
    color: $u-type-primary;
}
.product-container {
    .page_header {
        position: fixed;
        width: 100%;
        left: 0;
        right: 0;
        z-index: 10;
        background: #fff;
        border-bottom: 1px solid #ededed;
        & > .u-search {
            padding: 5px 5px 5px 5px;
        }
        .top-status-tip {
            height: 60upx;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
    }
    .product-list-wrap {
        padding-top: 150upx;
    }
}
</style>
