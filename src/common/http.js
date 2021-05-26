import Config from "@/common/config.js";


function setCookie(name, value, myDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + myDay);
    document.cookie = name + "=" + value + ";expires=" + oDate;
}

var JSSID = "";

function http(opts) {
    return new Promise((resolve, reject) => {
        return uni
            .request({
                url: `${Config.ApiAddress}${opts.url}`,
                method: opts.method || opts.type || "GET",
                data: opts.data,
                header: Object.assign(
                    {
                        Cookie: `JSSID=${JSSID}`,
                        JSSID: `JSSID=${JSSID}`,
                    },
                    opts.header || {}
                ),
            })
            .then(([err, res]) => {
                uni.hideLoading();
                if (
                    res &&
                    res.data &&
                    (res.data.code == 200 || res.data.code == 0)
                ) {
                    if (typeof res.data == "object" && res.data.exData) {
                        JSSID = res.data.exData;
                        setCookie("JSSID",res.data.exData);
                    }
                    return resolve(res.data.data);
                }
                console.error("请求异常：", res, err);
                if (res && res.data && res.data.msg) {
                    err = new Error(res.data.msg);
                    uni.showToast({
                        icon: "none",
                        position: "bottom",
                        title: res.data.msg,
                    });
                }
                return reject(err);
            });
    });
}

export default http;
