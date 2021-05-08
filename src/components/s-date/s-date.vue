<template>
    <view>
        <picker mode="date" :value="value" @change="bindPickerChange">
            <view :class="{'s-date':true,'placeholder':!value}">{{value?value:options.placeholder}}</view>
        </picker>
    </view>
</template>
<script>
export default {
    props: {
        options: {},
        value: {},
    },
    model: {
        prop: "value",
        event: "input",
    },
    data() {
        return {
            widgetValue: void 0,
        };
    },
    computed: {
        items() {
            return this.options.data || [];
        },
    },
    methods: {
        bindPickerChange: function (e) {
            this.$emit("input", e.target.value);
        },
    },
};
</script>
<style lang="less">
.s-date {
    padding: 0px 10px;
    text-align: left;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    border-color: rgb(192, 196, 204);
    position: relative;
    height: 30px;
    &.placeholder {
        color: rgb(192, 196, 204);
    }
}
</style>