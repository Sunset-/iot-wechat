<template>
    <view class="upload-trigger-wrap">
        <view class="upload-trigger" @click="upload('image')">
            <u-icon name="camera" color="#cacaca" size="60"></u-icon>
            <view class="upload-trigger-label">拍照</view>
        </view>
        <view class="upload-trigger upload-trigger-file" v-if="type=='file'" @click="upload('file')">
            <u-icon name="file-text" color="#cacaca" size="60"></u-icon>
            <view class="upload-trigger-label">文件</view>
        </view>
    </view>
</template>
<script>
import $config from "@/common/config.js";
import $auth from "@/common/auth.js";
import $business from "@/common/business.js";

export default {
    props: {
        count: "",
        type: "",
    },
    data() {
        return {};
    },
    methods: {
        upload(type) {
            if (type == "file") {
                this.uploadFile();
            } else {
                this.uploadImage();
            }
        },
        uploadImage() {
            uni.chooseImage({
                count: +this.count || 9, //默认9
                sizeType: ["original"], //可以指定是原图还是压缩图，默认二者都有
                success: (res) => {
                    console.log(JSON.stringify(res.tempFilePaths));
                    uni.showLoading({
                        title: "上传中",
                    });
                    res.tempFilePaths.forEach((path) => {
                        uni.uploadFile({
                            url: `${$config.ApiAddress}/api/file/upload_wechat`, //仅为示例，非真实的接口地址
                            filePath: path,
                            name: "file",
                            formData: {
                                userId: $auth.getCurrentUserSync().id,
                            },
                            success: (uploadRes) => {
                                var vr = uploadRes.data;
                                if (typeof vr == "string") {
                                    vr = JSON.parse(vr);
                                }
                                if (vr && vr.data) {
                                    this.$emit("upload", vr.data);
                                }
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                        });
                    });
                },
            });
        },
        uploadFile() {
            uni.chooseMessageFile({
                count: this.count || 9, //默认9
                type: "all",
                success: (res) => {
                    console.log(JSON.stringify(res.tempFilePaths));
                    uni.showLoading({
                        title: "上传中",
                    });
                    res.tempFiles.forEach((tempFile) => {
                        var path = tempFile.path;
                        uni.uploadFile({
                            url: `${$config.ApiAddress}/api/file/upload_wechat`, //仅为示例，非真实的接口地址
                            filePath: path,
                            name: "file",
                            formData: {
                                userId: $auth.getCurrentUserSync().id,
                            },
                            success: (uploadRes) => {
                                var vr = uploadRes.data;
                                if (typeof vr == "string") {
                                    vr = JSON.parse(vr);
                                }
                                if (vr && vr.data) {
                                    this.$emit("upload", vr.data);
                                }
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                        });
                    });
                },
            });
        },
    },
};
</script>
<style lang="less">
@import "@/common/variables.less";

.upload-trigger {
    position: relative;
    width: 120upx;
    height: 120upx;
    border: 2px solid #cdcdcd;
    margin: 5upx;
    display: inline-block;
    text-align: center;
    &.upload-trigger-file {
        margin-left: 20upx;
    }
    .u-icon {
        padding-top: 20upx;
    }
    // &:before {
    //     position: absolute;
    //     content: "";
    //     width: 60%;
    //     height: 2px;
    //     top: calc(40% - 1px);
    //     left: 20%;
    //     background: #cdcdcd;
    // }
    // &:after {
    //     position: absolute;
    //     content: "";
    //     height: 50%;
    //     width: 2px;
    //     left: calc(50% - 1px);
    //     top: 16%;
    //     background: #cdcdcd;
    // }
    &:active {
        border-color: darken(#cdcdcd, 10%);
        &:before {
            background: darken(#cdcdcd, 10%);
        }
        &:after {
            background: darken(#cdcdcd, 10%);
        }
    }
    .upload-trigger-label {
        position: absolute;
        bottom: 5upx;
        font-size: 20upx;
        width: 100%;
        text-align: center;
        color: #ababab;
    }
}
</style>