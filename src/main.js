import Vue from 'vue'
import App from './App.vue'

import Mevcl from 'mevcl'
import 'mevcl/src/static/style.css'

import router from './router'

import Request from "@/common/request";

import CommonManager from "@/manager/commonManager";

import UserManager from "@/manager/userManager";
import ProblemManager from "@/manager/problemManager";
import SolutionManager from "@/manager/solutionManager";

Vue.use(Mevcl)
Vue.config.productionTip = false

Request.init(Vue.prototype.$toast)

Vue.prototype.$common = CommonManager
CommonManager.init()

Vue.prototype.$user = UserManager
Vue.prototype.$problem = ProblemManager
Vue.prototype.$solution = SolutionManager

UserManager.init()
ProblemManager.init()
SolutionManager.init()

Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,               //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
