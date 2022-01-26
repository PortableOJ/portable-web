import Vue from 'vue'
import App from './App.vue'

import Mevcl from 'mevcl'
import 'mevcl/src/static/style.css'

import router from './router'

import Request from "@/common/request";

import CommonManager from "@/manager/commonManager";

import UserManager from "@/manager/userManager";

Vue.use(Mevcl)
Vue.config.productionTip = false

Request.init(Vue.prototype.$toast)

Vue.prototype.$enum = CommonManager
CommonManager.init()

Vue.prototype.$user = UserManager
UserManager.init()

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
