import $http from "@/common/http.js";
import $util from "@/common/util.js";

var CHANNEL_DATA_TYPE_UNIT = [
    { text: "", value: "0" },
    { text: "m", value: "1" },
    { text: "cm", value: "2" },
    { text: "Mpa", value: "3" },
    { text: "Kpa", value: "4" },
    { text: "℃", value: "5" },
    { text: "℉", value: "6" },
    { text: "RH%", value: "7" },
    { text: "m³/h", value: "8" },
    { text: "cm³/h", value: "9" },
    { text: "m³", value: "10" },
    { text: "cm³", value: "11" },
    { text: "PH", value: "12" },
    { text: "Hz", value: "13" },
    { text: "kHz", value: "14" },
    { text: "ON/OFF", value: "15" },
    { text: "mA", value: "A1" },
    { text: "mA", value: "A2" },
    { text: "℃", value: "T" },
].reduce((res, item) => {
    res[item.value] = item.text;
    return res;
}, {});

var CHANNEL_DATA_TYPE_LABEL = [
    { text: "无类型", value: "0" },
    { text: "液位", value: "1" },
    { text: "液位", value: "2" },
    { text: "压力", value: "3" },
    { text: "压力", value: "4" },
    { text: "温度", value: "5" },
    { text: "温度", value: "6" },
    { text: "湿度", value: "7" },
    { text: "流速", value: "8" },
    { text: "流速", value: "9" },
    { text: "流量", value: "10" },
    { text: "流量", value: "11" },
    { text: "碱度", value: "12" },
    { text: "频率", value: "13" },
    { text: "频率", value: "14" },
    { text: "输入", value: "15" },
].reduce((res, item) => {
    res[item.value] = item.text;
    return res;
}, {});

export default {
    summary() {
        return $http({
            url: `/m/device/info/getDeviceStatistical?noSign`,
            type: "POST",
            data: {},
        });
    },
    list(filter) {
        return $http({
            url: `/m/data/real/queryMobileIndexByCond?noSign`,
            type: "POST",
            data: filter,
        }).then((res) => {
            res.list &&
                res.list.forEach((item) => {
                    var channelData = [];
                    if (item.showData) {
                        var sd = {};
                        if (item.deviceType == 2) {
                            var cgqC = ["T", "A1", "A2"];
                            sd = item.showData.split(";").reduce((res, kvc) => {
                                kvc.split(",").forEach((kv) => {
                                    var kvs = kv.split(":");
                                    if (kvs.length == 2) {
                                        res[kvs[0]] = kvs[1];
                                    }
                                });
                                return res;
                            }, {});
                            cgqC.forEach((c) => {
                                sd[`value${c}`] = sd[c];
                                sd[`valuePre${c}`] = sd[`${c}-previous`];
                                sd[`change${c}`] = sd[`${c}-change`];
                                sd[`measureT`] = "T";
                                sd[`measureA1`] = "A1";
                                sd[`measureA2`] = "A2";
                            });
                        } else {
                            sd = item.showData.split(",").reduce((res, kv) => {
                                var kvs = kv.split(":");
                                if (kvs.length == 2) {
                                    res[kvs[0]] = kvs[1];
                                }
                                return res;
                            }, {});
                        }
                        var channels =
                            item.deviceType == 2
                                ? ["T", "A1", "A2"]
                                : [
                                      1,
                                      2,
                                      3,
                                      4,
                                      5,
                                      6,
                                      7,
                                      8,
                                      9,
                                      10,
                                      11,
                                      12,
                                      13,
                                      14,
                                      15,
                                      16,
                                  ];
                        channels.forEach((i) => {
                            if (sd.hasOwnProperty(`value${i}`)) {
                                var unit =
                                    CHANNEL_DATA_TYPE_UNIT[sd[`measure${i}`]];
                                var preV = sd[`valuePre${i}`] || "";
                                var curV = sd[`value${i}`] || "";
                                if (unit == "ON/OFF") {
                                    unit = "";
                                    preV = preV == "1" ? "ON" : "OFF";
                                    curV = curV == "1" ? "ON" : "OFF";
                                }
                                channelData.push({
                                    measure:
                                        CHANNEL_DATA_TYPE_LABEL[
                                            sd[`measure${i}`]
                                        ] || "",
                                    channel: i,
                                    label: isNaN(i)
                                        ? {
                                              T: "温度",
                                              A1: "电流1",
                                              A2: "电流2",
                                          }[i] || i
                                        : `CH${i}`,
                                    value: curV,
                                    valuePre: sd[`valuePre${i}`],
                                    unit: unit,
                                    change: sd[`change${i}`],
                                    alarmcode : sd[`alarmcode${i}`], 
                                    title: `上报时间：${$util.Dates.format(
                                        +sd[`addTime${i}`]
                                    )} 上次值：${preV}${unit}`,
                                });
                            }
                        });
                    }
                    item.$channels = channelData;
                });
            return res;
        });
    },
    detailWg(filter) {
        return $http({
            url: "/m/data/record/queryDataAnalysis?noSign",
            type: "POST",
            data: filter,
        }).then((res) => {
            if (filter.compareType == 1) {
                res = [res];
            }
            return res;
        });
    },
    detailCgq(filter) {
        return $http({
            url: "/m/data/record_ct/list?noSign",
            type: "POST",
            data: filter,
        }).then((res) => {
            if (filter.compareType == 1) {
                res = [res];
            }
            return res;
        });
    },
};
