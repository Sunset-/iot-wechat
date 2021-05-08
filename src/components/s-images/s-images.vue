<template>
    <view class="sucurities-imgs">
        <view :class="['sucurities-imgwrap',isPdf(img)||isDoc(img)?'pdf':'']" v-for="img in images" :key="img.path">
            <u-icon v-if="removeable" class="remove-icon" name="close-circle-fill" color="#0d3a63" size="40" @click="remove(img)"></u-icon>
            <image :class="['sucurities-img',isPdf(img)||isDoc(img)?'pdf':'']" mode='widthFix' :src="thumbnail(img)" @click="viewImage(img,images)"></image>
            <view class="img-name">{{imageName(img)}}</view>
        </view>
    </view>
</template>
<script>
import $business from "@/common/business.js";
import $config from "@/common/config.js";

export default {
    props: {
        images: "",
        removeable: "",
    },
    data() {
        return {};
    },
    methods: {
        viewImage(img, transactions) {
            if (this.isImage(img)) {
                $business.Preview(img, transactions);
            } else {
                $business.Download(img);
            }
        },
        thumbnail(img) {
            var path = img.path;
            path = path.replace(/\\/g, "/");
            var ext = path.toLowerCase();
            if (this.isPdf(img)) {
                path = "/static/pdf_icon.jpg";
            } else if (ext.endsWith(".doc") || ext.endsWith(".docx")) {
                path = "/static/doc_icon.jpg";
            } else if (ext.endsWith(".xls") || ext.endsWith(".xlsx")) {
                path = "/static/xls_icon.jpg";
            }
            return $config.FileAddress + "/proxy-img/" + path;
        },
        imageName(img) {
            if (!img.name) {
                return "";
            }
            return img.name.substring(0, img.name.lastIndexOf("."));
        },
        isImage(img) {
            var path = img.path.toLowerCase();
            return (
                path.endsWith(".jpg") ||
                path.endsWith(".gif") ||
                path.endsWith(".bmp") ||
                path.endsWith(".png")
            );
        },
        isPdf(img) {
            return img.path.endsWith(".pdf") || img.path.endsWith(".PDF");
        },
        isDoc(img) {
            var ext = img.path.toLowerCase();
            return (
                ext.endsWith(".doc") ||
                ext.endsWith(".docx") ||
                ext.endsWith(".xls") ||
                ext.endsWith(".xlsx")
            );
        },
        remove(img) {
            this.$emit("remove", img);
        },
    },
};
</script>
<style lang="less">
@import "@/common/variables.less";

.sucurities-imgs {
    .sucurities-imgwrap {
        width: 150upx;
        max-height: 210upx;
        border: 1px solid @color-primary;
        margin-bottom: 10upx;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 5upx;
        font-size: 0px;
        overflow: hidden;
        &.pdf {
            border: 1px solid transparent;
        }
        &.doc {
            border: 1px solid transparent;
        }
        .sucurities-img {
            width: 100%;
            color: red;
            img {
                opacity: 1;
            }
        }
        .remove-icon {
            position: absolute;
            right: 5upx;
            top: 5upx;
            z-index: 1;
        }
        .img-name {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
    }
}
</style>