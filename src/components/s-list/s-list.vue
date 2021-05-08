<template>
    <view class="s-list">
        <view v-if="title" class="s-list-title-wrap">
            <text class="s-list-title">{{title}}</text>
        </view>
        <view class="s-list-content">
            <slot></slot>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        title: "",
    },
};
</script>
<style lang="less">
.s-list {
    .s-list-title-wrap {
        padding: 15upx 20upx;
        &:before {
            content: "";
            display: inline-block;
            vertical-align: middle;
            height: 15px;
            background-color: #0d3a63;
            border-radius: 5px;
            width: 3px;
        }
        .s-list-title {
            display: inline-block;
            vertical-align: middle;
            padding-left: 20upx;
        }
    }
    .s-list-content {
        display: flex;
        background-color: #ffffff;
        position: relative;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        flex-direction: column;
    }
}
</style>