<template>
    <view class="content">
        <view class="s-table">
            <view class="flex-box tc thead">
                <view v-for="col in options.columns" :key="col.title" class="item-2" :style="'width:'+col.width+'%;'">
                    {{col.title}}</view>
                <view class="item-2" :style="'width:'+options.operatorWidth+'%;'">操作</view>
            </view>
            <view class="flex-box table tc" v-for="record in data" :key="record.id">
                <view v-for="col in options.columns" :key="col.title" :style="'width:'+col.width+'%;'" :class="['item-2',col.validate?col.validate(record[col.name],record)?'':'valid':'']">
                    <view class="widget-select" v-if="col.widget=='select'" @click="clickCol(col,record)">{{record[col.name]}}</view>
                    <input v-if="col.widget!='select'" class="phone-input" :type="col.inputType||'text'" :border="true" border-color="transparent" :height="30" v-model="record[col.name]" :clearable="false" :placeholder="col.title" />
                </view>
                <view class="item-2" :style="'width:'+options.operatorWidth+'%;'">
                    <u-button throttle-time="10" type="warning" size="mini" @click="remove(record)">删除</u-button>
                </view>
            </view>
        </view>
        <u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
    </view>
</template>

<script>
export default {
    props: {
        options: {},
    },
    data() {
        return {
            actionSheetShow: false,
            currentCol: {},
            currentRecord: {},
            data: [],
            actionSheetList: [
                {
                    text: "男",
                },
                {
                    text: "女",
                },
                {
                    text: "保密",
                },
            ],
        };
    },
    methods: {
        open(data) {
            this.data = data;
        },
        // 点击actionSheet回调
        actionSheetCallback(index) {
            this.currentRecord[this.currentCol.name] = this.actionSheetList[
                index
            ].text;
        },
        clickCol(col, record) {
            if (col.widget != "select") {
                return;
            }
            this.currentRecord = record;
            this.currentCol = col;
            this.actionSheetList = col.data;
            this.actionSheetShow = true;
        },
        remove(record) {
            this.data.splice(
                this.data.findIndex((item) => item.id == record.id),
                1
            );
            this.$emit("refresh", JSON.parse(JSON.stringify(this.data)));
        },
    },
};
</script>

<style lang="scss">
$color: #e0e0e0;
.content {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.flex-box {
    display: flex;
    flex-wrap: wrap;
}

.flex-box > .item-3 {
    flex: 0 0 33.3333%;
}

.title {
    margin: 20upx 0;
    color: red;
}

//普通表格
.s-table {
    .item-2 {
        font-size: 22upx;
        border: 1upx solid $color;
        border-width: 1upx 1upx 0 0;
        padding: 10upx 0;
        box-sizing: border-box;
        text-align: center;

        &:first-child {
            border-left-width: 1upx;
        }

        &:last-child {
            border-right-width: 1upx;
        }
    }

    .thead {
        .item-2 {
            font-weight: bold;

            box-sizing: border-box;
        }
    }

    .table {
        &:last-child {
            border-bottom: 1upx solid $color;
        }

        .item-2 {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }
    }
}

// 多行合并表格
.advance-area {
    .item-3 {
        font-size: 22upx;
        border: 1upx solid $color;
        border-width: 1upx 1upx 0 0;
        box-sizing: border-box;
        text-align: center;

        &:first-child {
            border-left-width: 1upx;
        }

        &:last-child {
            border-right-width: 1upx;
        }
    }

    .thead {
        .item-3 {
            font-weight: bold;
            padding: 16upx 0;
            box-sizing: border-box;
        }
    }

    .table {
        &:last-child {
            border-bottom: 1upx solid $color;
        }

        .item-3 {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }
    }

    .table-flex {
        flex: 1;

        .item {
            border-bottom: 1upx solid $color;
            padding: 10upx 0;
            box-sizing: border-box;

            &:last-child {
                border-width: 0;
            }
        }
    }
}
.valid {
    background: rgb(255, 230, 230);
}
.phone-input {
    font-size: 24upx;
    .uni-input-input {
        font-size: 24upx;
    }
}
.widget-select {
    position: relative;
    font-size: 24upx;
    padding-right: 30upx;
    display: inline-block;
    margin-right: -15upx;
    &:after {
        content: "";
        position: absolute;
        width: 0px;
        height: 0px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent;
        border-top-color: #aaa;
        top: 46%;
        right: 10upx;
    }
}
</style>