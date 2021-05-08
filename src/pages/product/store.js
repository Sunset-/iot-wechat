import $http from "@/common/http.js";

export default {
	list(filter) {
		return Promise.resolve({
			list : [{},{}],
			count : 2
		})
		return $http({
			url: `/api/product/query`,
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
