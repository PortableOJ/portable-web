import Vue from 'vue'
import App from './App.vue'

import Mevcl from 'mevcl'
import 'mevcl/src/static/style.css'

import router from './router'

import Request from "@/common/request";

import User from "@/common/user";

Vue.use(Mevcl)
Vue.config.productionTip = false

Vue.prototype.$request = Request
Request.init(Vue.prototype.$toast)

Vue.prototype.$user = User

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
