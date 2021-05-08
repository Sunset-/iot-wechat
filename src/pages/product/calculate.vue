<template>
    <view class="register uni-container" style="background-color:#FFF;">
        <view class="order-product-info">
            <view>简称：{{product.name||''}}</view>
            <view>代码：{{product.code||''}}</view>
            <view>实施日：{{product.implementationDate||''}}</view>
            <view>揭露日：{{product.disclosureDate||''}}</view>
        </view>
        <u-form class="product-order-form" :model="model" label-width="140" ref="uForm">
            <view class="group-title">请填写交易记录</view>
            <view style="padding:10upx 0;" class="uni-flex uni-row">
                <s-table ref="table" class="calculate-table" :options="tableOptions" :data.sync="transactions" @refresh="refreshTable"></s-table>
            </view>
            <view class="uni-flex uni-inline-item u-m-t-20 u-m-b-20">
                <u-button class="uni-flex-item u-m-l-10 u-m-r-10" throttle-time="0" type="info" @click="addRecord">添加一行
                </u-button>
                <u-button class="uni-flex-item u-m-l-10 u-m-r-10" throttle-time="0" type="primary" @click="submit">计算</u-button>
            </view>
            <view class="calculate-result">
                <view>计算结果</view>
                <view class="color-danger" v-if="errMsg">{{errMsg}}</view>
                <view v-if="result.finish">投资损失：{{money(result.investmentLoss,2)}}</view>
                <view v-if="result.finish">佣金：{{money(result.commission,2)}}</view>
                <view v-if="result.finish">印花税：{{money(result.stampDuty,2)}}</view>
                <view v-if="result.finish">资金利息：{{money(result.interest,2)}}</view>
                <view v-if="result.finish">合计损失：{{money(result.totalLoss,2)}}</view>
            </view>
            <view v-show="result.finish&&result.totalLoss>0" class="uni-flex uni-inline-item u-m-t-20">
                <u-button class="uni-flex-item u-m-l-10 u-m-r-10" type="primary" @click="submitOrder">提交诉讼申请</u-button>
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
            result: {},
            resultApply: "",
            lock: false,
            productId: "",
            errMsg: "",
            tableOptions: {
                columns: [
                    {
                        title: "交易日期",
                        name: "transactionDate",
                        widget: "text",
                        inputType: "number",
                        width: 28,
                        tip: "，例：20180701",
                        validate(v) {
                            return v && v.length == 8 && !isNaN(v);
                        },
                    },
                    {
                        title: "类型",
                        name: "businessCategory",
                        widget: "select",
                        width: 15,
                        data: [
                            {
                                text: "买入",
                            },
                            {
                                text: "卖出",
                            },
                        ],
                    },
                    {
                        title: "价格(元)",
                        name: "dealPrice",
                        widget: "text",
                        inputType: "digit",
                        width: 21,
                        validate(v) {
                            return v && !isNaN(v);
                        },
                    },
                    {
                        title: "数量",
                        name: "dealQuantity",
                        widget: "text",
                        inputType: "number",
                        width: 20,
                        validate(v) {
                            return v && !isNaN(v) && `${v}`.indexOf(".") == -1;
                        },
                    },
                ],
                operatorWidth: 16,
                update: (id) => {
                    return this.transactions.filter((item) => item.id == id);
                },
            },
            transactions: [],
        };
    },
    components: {},
    onLoad(event) {
        uni.setNavigationBarTitle({
            title: "自助计算",
        });
        var user = $auth.getCurrentUserSync();
        this.model = {
            productId: event.productId,
            userId: $auth.getCurrentUserSync().id,
            phone: $auth.getCurrentUserSync().phone,
        };
        this.getDetail((this.productId = event.productId));
    },
    watch: {
        transactions() {
            this.result.finish = false;
            this.errMsg = "";
        },
    },
    methods: {
        async getDetail(id) {
            var res = await Store.detail(id);
            if (res && res.list.length > 0) {
                this.product = res.list[0];
            }
        },
        addRecord() {
            this.$refs.table.open(this.transactions);
            this.transactions.push({
                transactionDate: "",
                businessCategory: "买入",
                dealPrice: "",
                dealQuantity: "",
                id: Date.now() + "" + Math.round(Math.random() * 10000),
            });
        },
        submit() {
            this.errMsg = "";
            this.resultApply = "";
            if (this.transactions.length == 0) {
                this.errMsg = "交易记录为空";
                return;
            }
            for (var i = 0, item; (item = this.transactions[i++]); ) {
                for (var j = 0, col; (col = this.tableOptions.columns[j++]); ) {
                    if (
                        col.validate &&
                        col.validate(item[col.name], item) == false
                    ) {
                        this.errMsg = col.title + "格式错误" + (col.tip || "");
                        return;
                    }
                }
            }
            var transactions = this.transactions.map((item) => {
                return {
                    transactionDate: item.transactionDate,
                    dealQuantity: item.dealQuantity,
                    dealPrice: item.dealPrice,
                    dealAmount: item.dealPrice * item.dealQuantity,
                    businessCategory: item.businessCategory,
                };
            });
            Store.calculate({
                productId: this.productId,
                transactions: transactions,
            }).then((res) => {
                this.result = res;
                this.result.finish = true;
                this.resultApply = JSON.stringify({
                    calculate: {
                        transactions: transactions,
                        result: res,
                    },
                });
            });
        },
        money(v, p) {
            return (+v).toFixed(p || 0);
        },
        refreshTable(data) {
            this.$refs.table.open((this.transactions = data));
        },
        onUpload(res) {
            this.identImgs.push({
                path: res,
                category: "证券交易记录",
            });
        },
        removeIdenFile(img) {
            this.identImgs.splice(
                this.identImgs.findIndex((item) => item.path == img.path),
                1
            );
        },
        submitOrder() {
            if (this.lock) {
                return;
            }
            var model = this.model;
            var msg = "";
            if (this.resultApply == "") {
                msg = "请计算";
            }
            if (msg) {
                uni.showToast({
                    icon: "none",
                    position: "bottom",
                    title: msg,
                });
                return;
            }

            model.apply = this.resultApply;
            $business.Confirm("确定提交诉讼申请？").then(() => {
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

.s-table {
    display: flex;
    flex-direction: column;
    .s-tr {
        display: flex;
        flex-direction: row;
    }
    .s-th,
    .s-td {
        flex-grow: 1;
        border: 1px solid #dedede;
        margin: 0px -1px -1px 0px;
    }
}
.calculate-result {
    font-size: 30upx;
    border-top: 1px solid #d1d1d1;
    margin-top: 10upx;
}
.calculate-table {
    width: 100%;
}
</style>