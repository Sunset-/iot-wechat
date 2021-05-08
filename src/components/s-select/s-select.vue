<template>
    <view>
        <picker :value="index" :range="items" range-key="text" @change="bindPickerChange">
            <view :class="{'s-select':true,'placeholder':!(items[index]&&items[index].text)}">{{!!(items[index]&&items[index].text)?items[index].text:options.placeholder}}</view>
        </picker>
    </view>
</template>
<script>
export default {
    props: {
        options: {},
    },
    model: {
        prop: "value",
        event: "input",
    },
    data() {
        return {
            index: void 0,
        };
    },
    computed: {
        items() {
            return this.options.data || [];
        },
    },
    methods: {
        bindPickerChange: function (e) {
            console.log("picker发送选择改变，携带值为", e.target.value);
            this.index = e.target.value;
            this.$emit("input", this.items[this.index].value);
            this.$emit("change",this.items[this.index].value);
        },
    },
};
</script>
<style lang="less">
.s-select {
    padding: 0px 10px;
    text-align: left;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    border-color: rgb(192, 196, 204);
    position: relative;
    height:30px;
    &.placeholder {
        color: rgb(192, 196, 204);
    }
}
</style>