<template>
    <u-button size="mini" class="u-m-r-10" @click="getVerCode">
        {{codeTime==0?'获取验证码':`${codeTime}秒后重置`}}
    </u-button>
</template>
<script>
import $http from "@/common/http.js";

export default {
    props: {
        phone: "",
        category: "",
    },
    data() {
        return {
            verCodeText: "获取验证码",
            codeTime: 0,
            codeTimeLock: false,
        };
    },
    methods: {
        getVerCode() {
            if (this.codeTimeLock) {
                return;
            }
            if (this.codeTime > 0) {
                return;
            }
            //获取验证码
            var phone = (this.phone || "").trim();
            if (phone.length != 11) {
                uni.showToast({
                    icon: "none",
                    position: "bottom",
                    title: "手机号不正确",
                });
                return false;
            }
            this.codeTimeLock = true;

            return $http({
                url: `/api/wechat_user/verCode`,
                method: "POST",
                data: {
                    phone: phone,
                    category: this.category,
                },
            })
                .then(() => {
                    this.codeTimeLock = false;
                    this.codeTime = 60;
                    this.loopCodeTime();
                })
                .catch(() => {
                    this.codeTimeLock = false;
                });
        },
        loopCodeTime() {
            this.codeTime--;
            if (this.codeTime <= 0) {
                this.codeTime = 0;
            }
            if (this.codeTime > 0) {
                setTimeout(() => {
                    this.loopCodeTime();
                }, 1000);
            }
        },
    },
};
</script>