<template>
    <uni-drawer ref="messages" mode="left" :width="320">
        <view class="message-container">
            <view class="message-head">{{category}} - 沟通记录</view>
            <view class="message-content">
                <view v-for="msg in messages" :key="msg.id" :class="[isMe(msg.userId)?'own':'']">
                    <view class="msg-item">
                        <view class="msg-who">
                            <text class="msg-name">{{isMe(msg.userId)?'我':'管理员'}}</text>&nbsp;&nbsp;{{formatTime(msg.time)}}
                        </view>
                        <view class="msg-text">
                            {{msg.content}}
                        </view>
                    </view>
                </view>
            </view>
            <view class="message-report">
                <textarea class="input-area" v-model="rejectMsg" placeholder="请输入反馈意见..."></textarea>
                <u-button class="u-m-t-10 u-m-l-10 product-order-submit" type="primary" size="mini" @click="submitMessage()">回复
                </u-button>
            </view>
        </view>
    </uni-drawer>
</template>
<script>
import $config from "@/common/config.js";
import $util from "@/common/util.js";
import $auth from "@/common/auth.js";
import $http from "@/common/http.js";
import $business from "@/common/business.js";

export default {
    props: {
        order: {},
    },
    data() {
        return {
            category: "",
            rejectMsg: "",
        };
    },
    computed: {
        messages() {
            var messages =
                (this.order.$message && this.order.$message[this.category]) ||
                [];
            messages.sort((a, b) => {
                return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
            });
            return messages;
        },
    },
    methods: {
        open(category) {
            this.category = category;
            this.$refs.messages.open();
        },
        isMe(userId) {
            return (
                $auth.getCurrentUserSync() &&
                $auth.getCurrentUserSync().id == userId
            );
        },
        formatTime(v) {
            return $util.Dates.format(v, "yyyy-MM-dd HH:mm");
        },
        submitMessage() {
            var msg = this.rejectMsg.trim();
            if (!msg) {
                uni.showToast({
                    icon: "none",
                    position: "bottom",
                    title: "请输入反馈意见",
                });
                return;
            }
            $business.Confirm("确定提交反馈意见？").then(() => {
                return $http({
                    url: `/api/wechat_order/message`,
                    type: "post",
                    data: {
                        category: this.category,
                        orderId: this.order.id,
                        userId:
                            $auth.getCurrentUserSync() &&
                            $auth.getCurrentUserSync().id,
                        content: msg,
                    },
                }).then(() => {
                    this.rejectMsg = "";
                    this.$emit("refresh");
                });
            });
        },
    },
};
</script>
<style lang="less">
.message-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f4f5f6;
    .message-head {
        padding: 20upx;
        background: #0d3a63;
        color: #fff;
    }
    .message-content {
        flex-grow: 1;
        .own {
            text-align: right;
        }
        .msg-item {
            display: inline-block;
            margin: 10upx;
            padding: 10upx;
            border: 1px solid #d1d1d1;
            border-radius: 3px;
            background: #fff;
            width: auto;
            max-width: 70%;
            text-align: left;
            .msg-who {
                border-bottom: 1px solid #d1d1d1;
                font-size: 20upx;
                color: #909090;
                margin-bottom: 10upx;
                .msg-name {
                    font-weight: bold;
                    padding-right: 10upx;
                    color: #0d3a63;
                }
            }
            .msg-text {
                font-size: 20upx;
            }
        }
    }
    .message-report {
        border-top: 1px solid #dedede;
        display: flex;
        flex-direction: row;
        padding: 10upx;
        .input-area {
            border: 1px solid #d2d2d2;
            height: 150upx;
            font-size: 14px;
            padding: 5upx;
            background: #fff;
        }
    }
}
</style>