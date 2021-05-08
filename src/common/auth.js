import $http from "@/common/http.js";
import { createLogger } from "vuex";

var currentUser = null;

var testId = void 0;//"oVigB5VHdnxkYiSflMT93-Yd2nsA_"; 

export default {
  login() {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      uni.getUserInfo({
        // 获取信息成功
        success(userInfoRes) {
          console.log("获取到用户info:", userInfoRes);
          uni.setStorageSync("USER_INFO", userInfoRes.userInfo);
          // 成功后进行登录,获取code
          uni.login({
            success(codeRes) {
              console.log("获取到用户coderes:", codeRes);
              if (codeRes.code) {
                console.log("获取到用户code:", codeRes.code);
                //发起网络请求
                $http({
                  // 请求路径
                  url: `/api/wechat_user/login`,
                  // 请求参数code
                  type: "POST",
                  data: {
                    code: codeRes.code,
                    openId: uni.getStorageSync("OPEN_ID"),
                  },
                }).then((loginRes) => {
                  // 请求成功后获取openid和session_key
                  console.log(loginRes);
                  if (loginRes.openId) {
                    uni.setStorageSync("OPEN_ID", loginRes.openId);
                  }
                  loginRes.wechatUserInfo = userInfoRes.userInfo || {};
                  if (loginRes.id) {
                    currentUser = loginRes;
                  }
                  resolve(loginRes);
                });
              } else {
                reject(new Error("登录失败！"));
              }
            },
            fail(err) {
              console.error("获取用户信息失败:", err);
              reject(new Error("获取用户信息失败"));
            },
          });
        },
        fail(err) {
          console.error("获取用户信息失败:", err);
          reject(new Error("获取用户信息失败"));
        },
      });
    });
  },
  loginByOpenId() {
    var openId = testId || uni.getStorageSync("OPEN_ID");
    if (!openId) {
      return Promise.resolve(new Error("无openid"));
    }
    //发起网络请求
    return $http({
      // 请求路径
      url: `/api/wechat_user/login`,
      // 请求参数code
      type: "POST",
      data: {
        openId: openId,
      },
    }).then((loginRes) => {
      // 请求成功后获取openid和session_key
      if (loginRes.openId) {
        uni.setStorageSync("OPEN_ID", loginRes.openId);
      }
      if (loginRes.id) {
        currentUser = loginRes;
      }
      return loginRes;
    });
  },
  getCurrentUser() {
    if (currentUser && currentUser.id) {
      return Promise.resolve(currentUser);
    } else {
      return new Promise((resolve, reject) => {
        this.loginByOpenId()
          .then((res) => {
            if (res && res.id) {
              currentUser = res;
              resolve(currentUser);
            } else {
              reject(null);
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  },
  getCurrentUserSync() {
    if (!currentUser || !currentUser.id) {
      console.error("同步获取用户失败");
    }
    return currentUser;
  },
  checkPermission(code) {
    if (!currentUser || !currentUser.permissions) {
      return false;
    }
    return (
      currentUser.permissions.split(",").findIndex((item) => item == code) >= 0
    );
  },
};
