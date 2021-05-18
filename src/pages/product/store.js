import $http from "@/common/http.js";

export default {
	list(filter) {
		return $http({
			url: `/api/m/device/info/query?noSign`,
			type : "POST",
			data: filter,
		});
	},
	detail(id) {
		return $http({
			url: `/api/product/query`,
			data: {
				id: id,
			},
		});
	},
	submitOrder(order){
		return $http({
			url: `/api/wechat_order/save`,
			type : "POST",
			data: order,
		});	
	},
	calculate(params){
		return $http({
			url: `/api/transaction/calculateByTransactions`,
			type : "POST",
			data: params,
		});	
	}
};
