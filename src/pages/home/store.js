import $http from "@/common/http.js";

export default {
	getProductByCode(filter) {
		return $http({
			url: `/api/product/query`,
			data: filter,
		});
	},
	regist(model) {
		return $http({
			url: `/api/wechat_user/regist`,
			method: "POST",
			data: model,
		});
	},
};
