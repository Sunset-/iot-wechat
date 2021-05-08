<template>
    <view class="uni-container u-p-10">
        <view class="uni-flex uni-column">
            <view class="flex-item flex-item-V detail-head"><text class="article-author">详情</text></view>
            <view class="flex-item flex-item-V detail-item"><text class="article-author">代码：{{model.code||'-'}}</text>
            </view>
            <view class="flex-item flex-item-V detail-item"><text class="article-author">简称：{{model.name||'-'}}</text>
            </view>
            <view class="flex-item flex-item-V detail-item"><text
                    class="article-author">实施日：{{model.implementationDate||'-'}}</text></view>
            <view class="flex-item flex-item-V detail-item"><text
                    class="article-author">揭露日：{{model.disclosureDate||'-'}}</text></view>
            <view class="flex-item flex-item-V detail-item"><text
                    class="article-author">基准日：{{model.baseDate||'-'}}</text></view>
            <view class="flex-item flex-item-V detail-foot"><text class="article-author">条件：在实施日至揭露日之间买入；持有到揭露日卖出或继续持有。
                    有权委托<text class="color-primary u-p-l-10 u-p-r-10">乾清网•上海百悦律师事务所</text> 向上市公司主张赔偿。</text></view>
            <u-alert-tips type="primary" :show-icon="true" :title="title" :description="description"></u-alert-tips>
            <u-row gutter="12" justify="space-between" class="u-m-t-20">
                <u-col span="6">
                    <u-button type="primary" throttle-time="10" @click="submit">上传交易记录</u-button>
                </u-col>
                <u-col span="6">
                    <u-button type="primary" throttle-time="10" @click="calculate">自助计算</u-button>
                </u-col>
            </u-row>
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
            description:
                "打印对账单时，对账起止日期应将实施日至基准日的时间段包含在内。",
            model: {},
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
        calculate(){
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
        }
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
    border-top:1px solid #1E222D;
}
.detail-item {
    padding: 10upx 15upx;
    &:nth-child(odd) {
        background-color: darken(#f4f4f5, 5%);
    }
}
</style>
