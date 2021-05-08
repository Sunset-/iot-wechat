<template>
    <view class="uni-container">
        <view class="uni-panel">
            <u-swiper :list="banners"></u-swiper>
        </view>
        <view class="uni-panel">
            <u-grid :col="2">
                <u-grid-item @click="zjss">
                    <u-icon name="grid-fill" :size="46"></u-icon>
                    <view class="grid-text">查询股票</view>
                </u-grid-item>
                <u-grid-item @click="prompt('calculate')">
                    <u-icon name="rmb-circle-fill" :size="46"></u-icon>
                    <view class="grid-text">亏损计算</view>
                </u-grid-item>
                <u-grid-item @click="prompt('order')">
                    <u-icon name="bookmark-fill" :size="46"></u-icon>
                    <view class="grid-text">证券诉讼</view>
                </u-grid-item>
                <u-grid-item @click="authJump('/pages/payapply/index')">
                    <u-icon name="red-packet-fill" :size="46"></u-icon>
                    <view class="grid-text">案件款申请</view>
                </u-grid-item>
            </u-grid>
        </view>
        <view class="uni-panel">
            <u-grid :col="2">
                <u-grid-item @click="authJump('/pages/crossdomain/index')">
                    <u-icon name="map-fill" :size="46"></u-icon>
                    <view class="grid-text">跨域立案</view>
                </u-grid-item>
                <!-- <u-grid-item>
                    <u-icon name="red-packet-fill" :size="46"></u-icon>
                    <view class="grid-text">信用卡诉讼</view>
                </u-grid-item> -->
                <u-grid-item @click="authJump('/pages/publishwant/index')">
                    <u-icon name="order" :size="46"></u-icon>
                    <view class="grid-text">发布法律需求</view>
                </u-grid-item>
                <u-grid-item @click="authJump('/pages/publishwant/index')">
                    <u-icon name="order" :size="46"></u-icon>
                    <view class="grid-text">交通肇事纠纷</view>
                </u-grid-item>
                <u-grid-item @click="authJump('/pages/publishwant/index')">
                    <u-icon name="order" :size="46"></u-icon>
                    <view class="grid-text">土地和施工纠纷</view>
                </u-grid-item>
                <u-grid-item @click="authJump('/pages/publishwant/index')">
                    <u-icon name="order" :size="46"></u-icon>
                    <view class="grid-text">借款纠纷</view>
                </u-grid-item>
                <u-grid-item>
                    <u-icon name="order" :size="46"></u-icon>
                    <view class="grid-text">行业法律需求</view>
                </u-grid-item>
            </u-grid>
        </view>
        <!-- <view class="auto-regist-modal" v-show="showAutoRegist">
            <view class="auto-regist-modal-content">
                <view class="auto-regist-modal-title">
                    获取公开信息，以使用更多功能
                </view>
                <u-button type="success" open-type="getUserInfo" @getuserinfo="login(e)">点击获取公开信息</u-button>
            </view>
        </view> -->
        <u-toast ref="uToast" />
        <s-prompt ref="prompt" title="查询" placeholder="请输入股票代码" text="股票代码"></s-prompt>
    </view>
</template>
<script>
import $auth from "@/common/auth.js";
import Store from "./store";

export default {
    data() {
        return {
            showAutoRegist: false,
            banners: [
                {
                    image: "https://18851.online/proxy-img/static/banner_0.png",
                    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
                },
                // {
                //     image: "https://cdn.uviewui.com/uview/swiper/2.jpg",
                //     title: "身无彩凤双飞翼，心有灵犀一点通",
                // },
                // {
                //     image: "https://cdn.uviewui.com/uview/swiper/3.jpg",
                //     title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
                // },
            ],
        };
    },
    onLoad() {
        wx.showShareMenu({
            menus: ["shareAppMessage", "shareTimeline"],
        });
        // $auth
        //     .getCurrentUser()
        //     .then((res) => {
        //         this.showAutoRegist = false;
        //     })
        //     .catch((e) => {
        //         this.showAutoRegist = true;
        //     });
    },
    methods: {
        login(){
            $auth.login().then((res) => {
                if (res.id) {
                    this.showAutoRegist = false;
                    return;
                }
                //自动注册
                Store.regist({
                    openId : res.openId,
                    name : res.wechatUserInfo.nickName
                }).then((res) => {
                    this.showAutoRegist = false;
                });
            });
        },
        zjss() {
            uni.switchTab({
                url: `/pages/product/index`,
            });
        },
        authJump(page) {
            $auth
                .getCurrentUser()
                .then((res) => {
                    uni.navigateTo({
                        url: page,
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
        overtime(product) {
            var actionLimitation = product["actionLimitation"];
            if (!actionLimitation || actionLimitation.length != 8) {
                return false;
            }
            var date = new Date();
            date.setFullYear(actionLimitation.substr(0, 4));
            date.setMonth(actionLimitation.substr(4, 2) - 1);
            date.setDate(actionLimitation.substr(6, 2));
            return date.getTime() < Date.now();
        },
        prompt(page) {
            $auth
                .getCurrentUser()
                .then((res) => {
                    this.$refs.prompt.show().then((code) => {
                        Store.getProductByCode({
                            code,
                        }).then((product) => {
                            if (product.list.length == 0) {
                                this.$refs.uToast.show({
                                    title: "未找到股票信息",
                                    type: "warning",
                                });
                                return;
                            }
                            if (this.overtime(product.list[0])) {
                                this.$refs.uToast.show({
                                    title: "该股票诉讼时效已经过期",
                                    type: "warning",
                                });
                                return;
                            }
                            this.$refs.prompt.hide();
                            uni.navigateTo({
                                url: `/pages/product/${page}?productId=${product.list[0].id}&name=${product.list[0].name}`,
                            });
                        });
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
    },
};
</script>
<style lang="less">
@import "@/common/uni-nvue.css";
.auto-regist-modal {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.2);
    z-index: 999;
    .auto-regist-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -150px;
        margin-top: -100px;
        width: 300px;
        height: 200px;
        background: #fff;
        border-radius: 5px;
        border: 1px solid #dedede;
        padding: 20px;
        .auto-regist-modal-title {
            text-align: center;
            padding: 20px;
            font-size: 32upx;
        }
    }
}
</style>