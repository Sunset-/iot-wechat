import $http from "@/common/http.js";
import { createLogger } from "vuex";

var currentUser = null;

var appId = "wx79ae61284641d89d";
var scene = "";
var testId = void 0; //;"oC-KV4vNwHAU4jC1eSr7HwQ5Jm2o"; //
var currentUserPromise = null;

export default {
	setScene(sc) {
		scene = sc;
		console.log("scene:" + sc);
	},
	getScene() {
		return scene;
	},
	login() {
		return new Promise((resolve, reject) => {
			// 获取code
			uni.login({
				success(codeRes) {
					console.log("获取到用户coderes:", codeRes);
					if (codeRes.code) {
						console.log("获取到用户code:", codeRes.code);
						//发起网络请求
						$http({
							// 请求路径
							url: `/m/sys/user/loginByMP?noSign`,
							// 请求参数code
							type: "POST",
							data: {
								code: codeRes.code,
								scene: scene,
								openId: uni.getStorageSync("OPEN_ID"),
							},
						}).then((loginRes) => {
							// 请求成功后获取openid和session_key
							console.log(loginRes);
							if (loginRes.openId) {
								uni.setStorageSync("OPEN_ID", loginRes.openId);
							}
							if (loginRes.userId) {
								currentUser = loginRes;
								resolve(loginRes);
							}else{
								reject(new Error("登录失败！"))
							}
						}).catch(e=>{
							reject(e)
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
			url: `/m/sys/user/loginByMP?noSign`,
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
			if (loginRes.userId) {
				currentUser = loginRes;
			}
			return loginRes;
		});
	},
	getCurrentUser() {
		if (currentUserPromise) {
			return currentUserPromise;
		}
		if (currentUser && currentUser.userId) {
			return Promise.resolve(currentUser);
		} else {
			return (currentUserPromise = new Promise((resolve, reject) => {
				this.loginByOpenId()
					.then((res) => {
						if (res && res.userId) {
							currentUser = res;
							resolve(currentUser);
						} else {
							reject(null);
						}
						currentUserPromise = null;
					})
					.catch((e) => {
						currentUserPromise = null;
						reject(e);
					});
			}));
		}
	},
	getCurrentUserSync() {
		if (!currentUser || !currentUser.userId) {
			console.error("同步获取用户失败");
		}
		return currentUser;
	},
	checkPermission(code) {
		if (!currentUser || !currentUser.permissions) {
			return false;
		}
		return currentUser.permissions.split(",").findIndex((item) => item == code) >= 0;
	},
};
