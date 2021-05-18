import $config from "./config.js";
import $auth from "./auth.js";
import $http from "./http.js";

export default {
    dictCache: null,
    Dict(typeName) {
        return this.dictCache
            ? Promise.resolve(this.dictCache)
            : (this.dictCache = $http({
                  url: `/api/dictionary/query`,
              }).then((res) => {
                  var m = {};
                  res.forEach((item) => {
                      item.text = item.name;
                      item.value = item.no;
                      if (!m[item.type]) {
                          m[item.type] = [];
                      }
                      m[item.type].push(item);
                  });
                  this.dictCache = m;
                  return m;
              }));
    },
    Confirm(msg, title) {
        return new Promise((resolve) => {
            uni.showModal({
                title: title || "提示",
                content: msg || "交易记录已上传，确定提交申请？",
                success: (res) => {
                    if (res.confirm) {
                        resolve();
                    }
                },
            });
        });
    },
    Upload(formData) {
        formData = formData || {};
        formData.userId =
            $auth.getCurrentUserSync() && $auth.getCurrentUserSync().id;
        formData.dirType = "wechat_file";
        return new Promise((resolve, reject) => {
            uni.chooseImage({
                count: 9, //默认9
                sizeType: ["original"], //可以指定是原图还是压缩图，默认二者都有
                success: (res) => {
                    console.log(JSON.stringify(res.tempFilePaths));
                    uni.showLoading({
                        title: "上传中",
                    });
                    var ps = [];
                    res.tempFilePaths.forEach((path) => {
                        ps.push(
                            new Promise((resolve, reject) => {
                                uni.uploadFile({
                                    url: `${$config.ApiAddress}/api/file/upload`, //仅为示例，非真实的接口地址
                                    filePath: path,
                                    name: "file",
                                    formData: formData,
                                    success: (uploadRes) => {
                                        var vr = uploadRes.data;
                                        if (typeof vr == "string") {
                                            vr = JSON.parse(vr);
                                        }
                                        if (vr && vr.data) {
                                            resolve(vr.data);
                                        }
                                    },
                                    fail: (e) => {
                                        reject(e);
                                    },
                                    complete: () => {
                                        uni.hideLoading();
                                    },
                                });
                            })
                        );
                    });
                    Promise.all(ps)
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                },
            });
        });
    },
    Download(path, type) {
        if (path.path) {
            path = path.path;
        }
        path = $config.FileAddress + "/proxy-img/" + path;
        uni.downloadFile({
            url: path,
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log("下载成功:", res.tempFilePath);
                    uni.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: function(res) {
                            var savedFilePath = res.savedFilePath;
                            console.log("保存成功:", res.savedFilePath);
                            uni.openDocument({
                                filePath: res.savedFilePath,
                                showMenu: true,
                                success: function(res) {
                                    console.log("打开文档成功");
                                },
                            });
                        },
                    });
                }
            },
        });
    },
    Preview(current, urls) {
        if (current.path) {
            current = current.path;
        }
        current = $config.FileAddress + "/proxy-img/" + current;
        urls = urls.map((item) => {
            var path = item.path ? item.path : item;
            return $config.FileAddress + "/proxy-img/" + path;
        });
        // 预览图片
        uni.previewImage({
            current: current,
            urls: urls,
        });
    },
    PreviewDoc(doc) {},
    DownloadOpenWindow() {},

    //生成设备状态dom
    generateDevicestatusDom(v) {
        return `<view class="device-status device-status-${v}">${$dictionary.transcode(
            "DEVICE_STATUS",
            v
        )}</view>`;
    },
    //生成电量dom
    generateElectricityDom(electricity, showText) {
        electricity = electricity || 0;
        var h = Math.floor((electricity / 100.0) * 5);
        var status = "empty";
        if (h >= 4) {
            status = "color-success";
        } else if (h >= 2) {
            status = "color-warning";
        } else if (h >= 1 || electricity > 0) {
            status = "color-danger";
        }
        var html = [
            `<view class="device-electricity-iconwrap" title="电量：${electricity}%"><view class="device-electricity-icon ${status}">`,
        ];
        if (status == "empty") {
            html.push(`<view class="empty"></view>`);
        }
        for (var i = 0; i < h; i++) {
            html.push("<text class='text'></text>");
        }
        html.push("</view></view>");
        if (showText) {
            html.push(
                electricity > 0
                    ? `<text class="${status}" style="padding-left:2px;vertical-align:bottom;display:inline-block;">${electricity}%</text>`
                    : ""
            );
        }
        return html.join("");
    },
    //生成信号dom
    generateCsqDom(csq) {
        csq = csq || 0;
        var status = "empty";
        var h = 5;
        if (csq >= 25) {
            status = "color-success";
            h = 5;
        } else if (csq >= 16) {
            status = "color-success";
            h = 4;
        } else if (csq >= 10) {
            status = "color-warning";
            h = 3;
        } else if (csq >= 3) {
            status = "color-warning";
            h = 2;
        } else if (csq > 0) {
            status = "color-danger";
            h = 1;
        }
        var html = [
            `<view class="device-csq-wrap"><view  title="信号：${csq}" class="device-csq-icon ${status}">`,
        ];
        for (var i = 0; i < h; i++) {
            html.push("<text class='text'></text>");
        }
        // for (var i = h; i < 5; i++) {
        // 	html.push("<text class='gray'></text>");
        // }
        html.push("</view><view>");
        return html.join("");
    },
};
