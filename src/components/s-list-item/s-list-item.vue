<template>
    <view class="s-list-item">
        <view class="s-list-item-wrap uni-inline-item">
            <view class="s-list-item-title">
                {{title}}
            </view>
            <view class="s-list-item-content">
                <slot></slot>
            </view>
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
.s-list-item {
    padding: 0upx 20upx;
    &:last-child {
        .s-list-item-wrap {
            border-color: transparent;
        }
    }
    .s-list-item-wrap {
        padding: 20upx 0upx;
        border-bottom: 1upx solid #d1d1d1;
        .s-list-item-title {
            padding-right: 20upx;
            min-width: 200upx;
            font-size: 16px;
            color: #111;
        }
        .s-list-item-content {
            flex-grow: 1;
        }
    }
}
</style>