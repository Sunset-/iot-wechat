import $http from "@/common/http.js";

export default {
    summary(filter) {
        return $http({
            url: `/m/device/info/left?noSign`,
            method: "POST",
            data: { version: "1.0" },
        });
    },
    statistics(filter) {
        return $http({
            url: `/m/device/info/bottom?noSign`,
            method: "POST",
            data: { version: "1.0" },
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
