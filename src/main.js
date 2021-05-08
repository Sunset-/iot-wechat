import Vue from 'vue'
import App from './App'

import pageHead from './components/page-head.vue'
import pageFoot from './components/page-foot.vue'
import uLink from '@/components/uLink.vue'
import store from './store'
import uView from 'uview-ui';
import '@/static/css/reset.scss'
import '@/static/iconfont/iconfont.css' //使用字体图标
import '@/static/js/constant.js'
Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
Vue.prototype.$adpid = "1111111111"

Vue.component('page-head', pageHead)
Vue.component('page-foot', pageFoot)
Vue.component('uLink', uLink)
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
