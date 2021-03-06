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
import JudgeManager from "@/manager/judgeManager";
import ContestManager from "@/manager/contestManager";
import FileManager from "@/manager/fileManager";
import BatchManager from "@/manager/batchManager";

Vue.use(Mevcl)
Vue.config.productionTip = false

Vue.prototype.$request = Request
Vue.prototype.$common = CommonManager

Vue.prototype.$user = UserManager
Vue.prototype.$problem = ProblemManager
Vue.prototype.$solution = SolutionManager
Vue.prototype.$judge = JudgeManager
Vue.prototype.$contest = ContestManager
Vue.prototype.$file = FileManager
Vue.prototype.$batch = BatchManager

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
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}

Date.prototype.add = function (t) {
    return new Date(this.getTime() + t * 60 * 1000)
}

CommonManager.init(() => {
    UserManager.init(() => {
        new Vue({
            router,
            render: h => h(App),
        }).$mount('#app')
    })
})
