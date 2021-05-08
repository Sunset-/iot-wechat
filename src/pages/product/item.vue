<template>
    <view :class='["my-unit",overtime?"overtime color-999":""]'>
        <view :class="['unit-head product_code_label',color(data)]">
            <text>{{data.name}}</text><text class="fr">代码：{{data.code}}</text>
        </view>
        <view :class="['unit-body']">
            <text v-for="(item,index) in unitModel1" :key="index" :class="item.class">
                {{item.label}}：<text :class="item.class">{{(item.name?data[item.name]:item.format(data))||''}}</text>
            </text>
        </view>
        <view class="unit-foot">
            <text class="color-999"></text>
            <text class="fr" v-if="overtime">诉讼时效已经过期，无法主张赔偿。</text>
            <u-button v-if="!overtime" type="primary" class="fr btn" size="mini" throttle-time="100" @click="showDetail()">查看详情</u-button>
            <u-button v-if="!overtime" type="primary" class="fr btn" size="mini" throttle-time="100" @click="showMap()">地图</u-button>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        data: {},
    },
    data() {
        return {
            unitModel1: [
                {
                    label: "实施日",
                    name: "implementationDate",
                    class: "color-primary",
                    isMoney: true,
                },
                { label: "揭露日", name: "disclosureDate" },
                {
                    label: "基准日",
                    name: "baseDate",
                    isMoney: true,
                },
                { label: "时效", name: "actionLimitation" },
                {
                    label: "赔偿能力",
                    format(data) {
                        return (
                            {
                                "-1": "E",
                                0: "D",
                                1: "C",
                                2: "B",
                                3: "A",
                            }[data.businessType] || "-"
                        );
                    },
                },
                {
                    label: "备注",
                    name: "remark",
                    class: "color-999 monopolize",
                },
            ],
        };
    },
    methods: {
        showDetail() {
            uni.navigateTo({
                url: `./detail?id=${this.data.id}&name=${this.data.name}`,
            });
            this.$store.commit("switch_loading");
        },
        showMap(){
            uni.navigateTo({
                url: `./map?id=${this.data.id}&name=${this.data.name}`,
            });
            this.$store.commit("switch_loading");
        },
        color(record) {
            var color = "";
            var ral = `${record.actionLimitation}`;
            if (record.actionLimitation && ral.length == 8) {
                var now = Date.now();
                var d = new Date();
                d.setFullYear(+ral.substring(0, 4));
                d.setMonth(+ral.substring(4, 6) - 1);
                d.setDate(+ral.substring(6, 8));
                var dtime = d.getTime();
                if (now > dtime) {
                    color = "label-invalid";
                } else if (dtime - now < 86400000 * 30) {
                    color = "label-one-month";
                } else if (dtime - now < 86400000 * 90) {
                    color = "label-three-month";
                }
            }
            return color;
        },
    },
    computed: {
        overtime() {
            var actionLimitation = this.data["actionLimitation"];
            if (!actionLimitation || actionLimitation.length != 8) {
                return false;
            }
            var date = new Date();
            date.setFullYear(actionLimitation.substr(0, 4));
            date.setMonth(actionLimitation.substr(4, 2) - 1);
            date.setDate(actionLimitation.substr(6, 2));
            return date.getTime() < Date.now();
        },
    },
    created() {},
};
</script>
<style lang='scss'>
.color-primary {
    color: #0d3a63;
}
.my-unit {
    margin: 10upx 0;
    background-color: #ffffff;
    font-size: 28upx;
    transform: all 1s;
    &.overtime {
        .unit-body {
            text {
                color: #bdbdbd !important;
            }
        }
    }
    .unit-head {
        padding: 20upx;
        height: 80upx;
        line-height: 40upx;
        box-sizing: border-box;
        border-bottom: 2upx solid #e4e7ed;
        background: #0d3a63;
        color: #fff;
        font-size: 28upx;
    }
    .product_code_label {
        position: relative;
        font-weight: bold;
        &.label-invalid {
            color: #ababab;
        }
        &.label-one-month {
            color: rgb(255, 58, 58);
        }
        &.label-three-month {
            color: orange;
        }
    }
    .unit-body {
        padding: 20upx;
        display: flex;
        flex-wrap: wrap;
        text {
            width: 50%;
            font-size: 28upx;
            line-height: 55upx;
            &.monopolize {
                width: 100%;
            }
        }
    }
    .unit-foot {
        height: 88upx;
        padding: 0 20upx;
        border-top: 2upx solid #f5f5f5;
        border-bottom: none;
        line-height: 88upx;

        .btn {
            height: 60upx;
            font-size: 28upx;
            line-height: 60upx;
            margin: 14upx 0;
        }
    }
}
</style>