<script>
import $auth from "@/common/auth.js";

export default {
    onLaunch: function () {},
    onShow: function (options) {
        $auth.setScene(options&&options.scene);
        uni.showToast({
            title: options.scene
        });
        $auth.getCurrentUser();
    },
    onHide: function () {
        console.log("App Hide");
    },
    globalData: {
        test: "",
    },
};
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";

/* 以下样式用于 hello uni-app 演示所需 */
page {
    background-color: #f4f5f6;
    height: 100%;
    font-size: 28rpx;
    line-height: 1.8;
}

.uni-header-logo {
    padding: 30rpx;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10rpx;
}

.uni-header-image {
    width: 100px;
    height: 100px;
}

.uni-hello-text {
    color: #7a7e83;
}

.uni-hello-addfile {
    text-align: center;
    line-height: 300rpx;
    background: #fff;
    padding: 50rpx;
    margin-top: 10px;
    font-size: 38rpx;
    color: #808080;
}

/* #endif*/

/* #ifdef MP-360 */
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: transparent;
}
::-webkit-scrollbar-track {
    background-color: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: #ddd;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
}
::-webkit-scrollbar-thumb:active {
    background-color: #bbb;
}
::-webkit-scrollbar-corner {
    background: #ffffff;
}
/* #endif*/
</style>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
<style lang="less">
@color-primary: #0d3a63;
@color-green: #099200;
@color-gray: #ababab;

img {
    opacity: 1 !important;
}

.fl {
    float: left;
}

//致命的
@color-fatal: #e52020;
//一般的
@color-same: #48b9ff;

//主色
@color-primary: #127bfe;
@color-primary-dark: #1890ff;
@color-primary-hover: #4487f1;
@color-primary-active: #105cbc;
@color-primary-light: fade(@color-primary, 15%);

// 菜单栏
@color-sidebar-active: #127bfe;
@color-sidebar-hover: rgba(18, 123, 254, 0.2);
@color-sidebar-item: #16181d;
@color-sidebar-text: #999999;
//信息色
@color-info: #48b9ff;
@color-info-hover: lighten(@color-info, 3%);
@color-info-active: darken(@color-info, 3%);
//成功色
@color-success: #67c23a;
@color-success-hover: lighten(@color-success, 3%);
@color-success-active: darken(@color-success, 3%);
//警告色
@color-warning: #ff9900;
@color-warning-hover: lighten(@color-warning, 5%);
@color-warning-active: darken(@color-warning, 5%);
//危险色

@color-danger: #ff6600;
@color-danger-hover: lighten(@color-warning, 5%);
@color-danger-active: darken(@color-warning, 5%);
//按钮浅色
@color-normal-hover: #4487f1;
@color-normal-active: #105cbc;
//白色
@color-white: #ffffff;
//紫色
@color-purple: #b490e5;
//黄色
@color-yellow: #fdad2f;

//标题
@color-title: #000000;
//正文
@color-content: #666;
@color-main: #333;
@color-hearder: #333;
@color-hearder-title: #222;
@color-less: #999;
@color-disabled-text: #ccc;
//辅助/图标
@color-subcolor: #959595;
//失效
@color-disabled: #f7f7f7;
//失效
@color-placeholder: #a5b0b6;

//边框
@color-border: #e8e8e8;
@color-border-light: #e1e6eb;
@color-border-dark: #444;
@color-icon: #c0c4cc;
@color-border-wedget: #cdcdcd;
//分割线
@color-divider: #e8e8e8;
@color-deep-divider: #dadada;
//背景
@color-background: #f2f2f2;
@color-background-header-light: #e8ebee;
@color-header-background: #2c3033;
@color-background-header: #f3f6fd;
@color-background-menuTitle: #0f1012;
@color-background-menu: #1f2129;
@color-background-major: #2c3033;
@color-background-light: #fdfdfd;
@color-background-dark: #2c3033;
@color-background-dark-hover: #2e3235;
@color-background-white: #ffffff;
@color-background-card: #f8f8f8;
@color-background-table: #f2f2f2;
@color-background-tr: #f8f8f8;
@color-background-table-hover: #f4f9ff;
@color-danger-background: #fb7171;
@color-light-background: #f9f9f9;
@color-background-shadow: rgba(0, 0, 0, 0.05);

// 电池电量
.device-electricity-iconwrap {
    display: inline-block;
    vertical-align: bottom;
}
.device-electricity-icon {
    position: relative;
    width: 13px;
    height: 20px;
    border: 2px solid #777;
    margin: 4px auto 0px auto;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    & > .text {
        display: block;
        width: 86%;
        height: 2px;
        background: #777;
        margin: 1px;
    }
    &:before {
        content: "";
        position: absolute;
        top: -4px;
        left: calc(50% - 3px);
        width: 6px;
        height: 2px;
        background: #777;
    }
    .empty {
        position: relative;
        left: 0px;
        width: 8px;
        height: 50%;
        border-top: 2px solid #777;
        border-bottom: 2px solid #777;
        margin: 3px auto;
        &:after {
            content: "";
            width: 2px;
            height: 6px;
            background: #777;
            position: absolute;
            top: -4px;
            left: 3px;
        }
    }
    &.color-success {
        border-color: @color-success;
        & > .text {
            background: @color-success;
        }
        &:before {
            background: @color-success;
        }
    }
    &.color-warning {
        border-color: @color-warning;
        & > .text {
            background: @color-warning;
        }
        &:before {
            background: @color-warning;
        }
    }
    &.color-danger {
        border-color: @color-danger;
        & > .text {
            background: @color-danger;
        }
        &:before {
            background: @color-danger;
        }
    }
}

// 设备信号
.device-csq-wrap {
    display: inline-block;
    vertical-align: bottom;
}
.device-csq-icon {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 20px;
    &.color-success {
        border-color: @color-success;
        & > .text {
            background: @color-success;
        }
    }
    &.color-warning {
        border-color: @color-warning;
        & > .text {
            background: @color-warning;
        }
    }
    &.color-danger {
        border-color: @color-danger;
        & > .text {
            background: @color-danger;
        }
    }
    & > .text {
        display: inline-block;
        vertical-align: bottom;
        width: 3px;
        background: #cacaca;
        margin: 1px;
        &:nth-child(1) {
            height: 20%;
        }
        &:nth-child(2) {
            height: 40%;
        }
        &:nth-child(3) {
            height: 60%;
        }
        &:nth-child(4) {
            height: 80%;
        }
        &:nth-child(5) {
            height: 100%;
        }
        &.gray {
            background: #dadada;
        }
    }
}

// 设备数据状态
.device-datachange-arrow {
    &.change-0 {
        display: none;
    }
    &.change-1 {
        color: @color-primary;
    }
    &.change--1 {
        color: @color-warning;
    }
}

//设备状态
.device-status {
    display: inline-block;
    text-align: left;
    padding: 0px 2px;
    overflow: visible;
    margin-left: 15px;
    &:before {
        content: "";
        display: inline-block;
        margin-right: 5px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: currentColor;
        margin-left: -15px;
    }
    &.device-status-0 {
        color: @color-warning;
    }
    &.device-status-1 {
        color: #bababa;
    }
    &.device-status-2 {
        color: @color-success;
    }
    &.device-status-3 {
        &:before {
            background: @color-danger;
        }
    }
    &.device-status-4,
    &.device-status-5 {
        color: #fff;
        background: @color-danger;
        &:before {
            background: @color-danger;
        }
    }
}

.echarts-dataview-table {
    border-collapse: collapse;
    border: 1px solid #676767;
    td {
        border-collapse: collapse;
        border: 1px solid #676767;
        padding: 5px 10px;
    }
}
</style>