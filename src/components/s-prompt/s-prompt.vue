<!-- prompt组件 -->
<!-- prompt -->
<template>
    <view class="prompt-box" :hidden="isHidden">
        <view class="prompt-content contentFontColor">
            <view class="prompt-title">{{title}}</view>
            <view class="prompt-inputwrap">
                <view class="prompt-label">{{text}}</view>
                <input class="prompt-input" type="text" :placeholder="placeholder" @input="_input" :value="cost" />
            </view>
            <view class="prompt-btn-group">
                <u-button class="prompt-btn" type="primary" size="mini" @click="_confirm">{{btn_certain}}</u-button>
                <u-button class="prompt-btn" type="info" size="mini" @click="_cancel">{{btn_cancel}}</u-button>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            multipleSlots: true, // 在组件定义时的选项中启用多slot支持
            isHidden: true,
            cost: "",
            resolve: function () {},
            reject: function () {},
        };
    },
    props: {
        title: {
            type: String,
            default: "提示",
        },
        btn_cancel: {
            type: String,
            default: "取消",
        },
        btn_certain: {
            type: String,
            default: "确定",
        },
        text: {
            type: String,
            default: "",
        },
        placeholder: "",
    },
    watch: {},
    methods: {
        hide: function () {
            this.isHidden = true;
        },
        show(e) {
            this.cost = "";
            this.isHidden = false;
            if (e != null && e != undefined && e != "") {
                this.text = e;
            }
            return {
                then: (resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                },
            };
        },
        /*
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件
         */
        _cancel() {
            //触发cancel事件，即在外部，在组件上绑定cancel事件即可，bind:cancel，像绑定tap一样
            this.cost = "";
            this.hide();
            this.$emit("onCancel");
            this.reject && this.reject();
        },
        _confirm() {
            //this.triggerEvent("confirm");
            console.log(this.cost);
            this.$emit("onConfirm", this.cost);
            this.resolve && this.resolve(this.cost);
        },
        _input(e) {
            //将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
            //this.triggerEvent("getInput",e.detail);
            this.cost = e.detail.value;
        },
    },
};
</script>

<style>
/* components/vas-prompt/vas-prompt.wxss */
.prompt-box {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    background: rgba(0, 0, 0, 0.5);
}

.prompt-content {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 80%;
    max-width: 600rpx;
    border: 2rpx solid #ccc;
    border-radius: 10rpx;
    box-sizing: bordre-box;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: #fff;
}

.prompt-title {
    width: 100%;
    padding: 20rpx;
    text-align: center;
    font-size: 40rpx;
    border-bottom: 2rpx solid gray;
}
.prompt-inputwrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 40upx 20upx;
}
.prompt-label {
    width: 160upx;
    text-align: center;
    line-height: 60upx;
}
.prompt-input {
    padding: 10rpx 10rpx;
    width: 80%;
    height: 40rpx;
    border: 1px solid #ccc;
    border-radius: 10rpx;
}
.prompt-btn-group {
    padding: 10upx;
    text-align: right;
}
.prompt-btn-group .prompt-btn {
    margin: 0px 8px;
}

.btn-item {
    width: 35%;
    margin-bottom: 20rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: white;
    justify-content: space-around;
}
.prompt-certain-btn {
    color: white;
    background-color: #4febde;
}
.prompt-cancel-btn {
    border: 1px solid #4febde;
}
.contentFontColor {
    color: #868686;
}
.prompt-text {
    margin-top: 15rpx;
    font-size: 38rpx;
}
</style>