<template>
    <view class="iot-chart-container">
        <qiun-data-charts type="column" :chartData="chartData" />
    </view>
</template>

<script>
export default {
    name: "charts",
    data() {
        return {
            charts: "",
            chartData: {
                categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
                series: [
                    {
                        name: "目标值",
                        data: [35, 36, 31, 33, 13, 34],
                    },
                    {
                        name: "完成量",
                        data: [18, 27, 21, 24, 6, 28],
                    },
                ],
            },
        };
    },
    props: {
        option: {
            type: Object,
        },
    },
    watch: {
        option: {
            deep: true,
            handler() {
                this.refresh();
            },
        },
    },
    methods: {
        dispose() {},
        drawPie() {},
        refresh() {},
        clear() {},
    },
};
</script>
<style lang="less" scoped>
.iot-chart-container {
    position: relative;
    .iot-chart {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
}
</style>
