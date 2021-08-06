<template>
    <view class="guest">
        <view class="title">欢迎访问无线智<br />能网关管理平台</view>
        <view class="concat">
            <view class="inner">
                <view class="concat-item">请联系管理员索要测试账号</view>
                <view class="concat-item">千高科技：400-608-5098</view>
            </view>
        </view>
    </view>
</template>
<style lang="less">
.guest {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fff;
    .title {
        font-size: 38px;
        font-weight: 700;
        line-height: 42px;
        margin: 25% auto;
        text-align: center;
    }
    .concat {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 10%;
        text-align: center;
        .inner {
            display: inline-block;
        }
        .concat-item {
            font-size: 22px;
            font-family: 黑体;
            font-weight: bold;
            line-height: 30px;
            text-align: left;
        }
    }
}
</style>