import Config from "@/common/config.js";

function http(opts) {
	return new Promise((resolve, reject) => {
		return uni
			.request({
				url: `${Config.ApiAddress}${opts.url}`,
				method: opts.method || opts.type || "GET",
				data: opts.data,
			})
			.then(([err, res]) => {
                uni.hideLoading();
				if (res && res.data && res.data.code == 200) {
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
