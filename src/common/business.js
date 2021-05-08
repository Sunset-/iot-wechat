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
};
