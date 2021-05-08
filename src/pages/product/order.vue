<template>
    <view class="register uni-container" style="background-color:#FFF;">
        <view class="order-product-info">
            <view>简称：{{product.name||''}}</view>
            <view>代码：{{product.code||''}}</view>
            <view>实施日：{{product.implementationDate||''}}</view>
            <view>揭露日：{{product.disclosureDate||''}}</view>
        </view>
        <u-form class="product-order-form" :model="model" label-width="140" ref="uForm">
            <view class="group-title">请上传交易记录</view>
            <view style="padding:10upx 0;" class="uni-flex uni-row">
                <s-images :images="identImgs" :removeable="true" @remove="removeIdenFile"></s-images>
                <s-uploader @upload="onUpload" type="file"></s-uploader>
            </view>
            <view class="uni-flex uni-inline-item u-m-t-20">
                <u-button class="uni-flex-item u-m-l-10 u-m-r-10" type="primary" @click="submit">提交诉讼申请</u-button>
            </view>
        </u-form>
        <u-toast ref="uToast" />
    </view>
</template>

<script>
import Config from "@/common/config.js";
import $auth from "@/common/auth.js";
import $business from "@/common/business.js";
import Store from "./store";

export default {
    data() {
        return {
            FileAddress: Config.FileAddress,
            verCodeText: "获取验证码",
            codeTime: 0,
            codeTimeLock: false,
            product: {},
            identImgs: [],
            model: {},
            lock: false,
        };
    },
    components: {},
    onLoad(event) {
        uni.setNavigationBarTitle({
            title: "提交申请",
        });
        var user = $auth.getCurrentUserSync();
        this.model = {
            productId: event.productId,
            userId: $auth.getCurrentUserSync().id,
            phone: $auth.getCurrentUserSync().phone,
        };
        this.getDetail(event.productId);
    },
    onReady() {
        this.$refs.uForm.setRules(this.rules);
    },
    methods: {
        async getDetail(id) {
            var res = await Store.detail(id);
            if (res && res.list.length > 0) {
                this.product = res.list[0];
            }
        },
        onUpload(res) {
            this.identImgs.push({
                path: res,
                category: "证券交易记录",
            });
        },
        removeIdenFile(img) {
            this.identImgs.splice(this.identImgs.findIndex(item=>item.path==img.path), 1);
        },
        submit() {
            if (this.lock) {
                return;
            }
            var model = this.model;
            var msg = "";
            if (this.identImgs.length == 0) {
                msg = "请上传交易记录";
            }
            if (msg) {
                uni.showToast({
                    icon: "none",
                    position: "bottom",
                    title: msg,
                });
                return;
            }

            model.files = this.identImgs || [];
            $business.Confirm("交易记录已上传，确定提交诉讼申请？").then(() => {
                this.lock = true;
                uni.showLoading({
                    title: "正在提交",
                });
                Store.submitOrder(model)
                    .then((res) => {
                        uni.hideLoading();
                        this.$refs.uToast.show({
                            title: "提交成功",
                            type: "success",
                        });
                        this.lock = false;
                        uni.switchTab({
                            url: "/pages/order/index",
                        });
                        uni.$emit("order-index-refresh");
                    })
                    .catch((e) => {
                        this.lock = false;
                    });
            });
        },
    },
};
</script>

<style>
@import "@/common/uni-nvue.css";
</style>
<style lang="less">
@import "@/common/variables.less";

.logo-box {
    padding: 20px;
    text-align: center;
    img {
        width: 100px;
        height: 100px;
    }
}
.order-product-info {
    border: 1px solid #a0cfff;
    background-color: #ecf5ff;
    padding: 5upx 10upx;
    border-radius: 3px;
    margin-bottom: 30upx;
    & > * {
        display: block;
    }
    .product-code {
        font-weight: bold;
    }
    .product-date {
        float: right;
        color: #8d8d8d;
    }
}
.product-order-form {
    .group-title {
        color: #ababab;
        border-bottom: 1px solid #dedede;
        padding-bottom: 5upx;
        margin-top: 10upx;
    }
}
</style>