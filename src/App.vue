<template>
    <div id="app" class="main-layout">
        <!--suppress JSValidateTypes -->
        <NavMenu @change="toSelect" :options="selectOption" v-model="select"
                 :not-found="v => v ? hiddenOption[v.split('-')[0]] : ''"></NavMenu>
        <router-view></router-view>
        <Footer></Footer>
        <Dialog v-model="captchaDialogShow" title="你是机器人吗">
            <div style="text-align: center; margin: 30px">
                请输入下面的验证码后<span style="color: var(--error-color)">再重复刚才的操作</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; place-items: center; width: 350px; margin: 30px">
                <InputText style="width: 100%" placeholder="请输入验证码" v-model="captchaValue"></InputText>
                <Link @click="flushCaptcha">
                    <img :src="captchaUrl" alt="验证码"/>
                </Link>
            </div>
            <InputButton style="width: 100%" @click="addCaptcha">提交</InputButton>
        </Dialog>
    </div>
</template>

<script>
import Footer from "@/components/Footer";
import Vue from "vue";

export default {
    name: 'App',
    components: {Footer},
    data() {
        return {
            selectOption: [
                {
                    label: '<i class="iconfont icon-app" />主页',
                    value: 'home',
                }, {
                    label: '<i class="iconfont icon-disk" />题库',
                    value: 'problemSet',
                }, {
                    label: '<i class="iconfont icon-monitor" />判题',
                    value: 'status',
                }, {
                    label: '<i class="iconfont icon-data-analyse" />比赛',
                    value: 'contestSet',
                }, {
                    label: '<i class="iconfont icon-userinfo" />批量用户',
                    value: 'batch',
                    hidden: !this.$user.hasPermission(this.$user.permissionTypeList.CREATE_AND_EDIT_BATCH)
                }, {
                    label: '<i class="iconfont icon-dashboard" />服务',
                    value: 'judge',
                    hidden: !this.$user.hasPermission(this.$user.permissionTypeList.MANAGER_JUDGE)
                }, {
                    label: '<i class="iconfont icon-work-order" />FAQ',
                    value: 'faq',
                }
            ],
            hiddenOption: {
                user: '用户',
                problem: '题目',
                solution: '提交',
                userManager: '管理',
                problemTest: '数据',
                problemManager: '管理',
                notFound: '未知',
                contest: '比赛',
            },
            select: this.$route.name,
            captchaDialogShow: false,
            captchaValue: '',
            captchaUrl: process.env.VUE_APP_CAPTCHA_URL
        }
    },
    created() {
        this.$request.init(Vue.prototype.$toast, this.needCaptcha)
    },
    methods: {
        toSelect(value) {
            if (value === this.$route.name) {
                return
            }
            this.$router.push({name: value})
        },
        needCaptcha() {
            this.flushCaptcha()
            this.captchaValue = ''
            this.captchaDialogShow = true
        },
        flushCaptcha() {
            this.captchaUrl = process.env.VUE_APP_CAPTCHA_URL + '?t=' + new Date().getTime()
        },
        addCaptcha() {
            this.$request.setCaptcha(this.captchaValue)
            this.captchaDialogShow = false
        }
    },
    watch: {
        $route(to) {
            this.select = to.name
        }
    }
}
</script>

<style>
#app {
    /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
    font-family: "PingFang SC", "Microsoft Yahei", Arial, serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
}

.main-layout {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-width: 1200px;
    max-width: 1440px;
    margin: 0 auto;
}

.lm-rc-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
}

.lm-rc-layout-left {
    margin-right: 8px;
    margin-top: 10px;
}

.card {
    /*box-shadow: var(--open-shadowbox);*/
    border: 1px solid var(--border-color-level-1);
    margin-top: 10px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    transition: 0.2s ease all;
    padding: 10px 10px 20px;
}

.card:hover {
    border: 1px solid var(--brand-color);
}

.card-title {
    font-weight: bolder;
    margin-bottom: 15px;
}

.card-input {
    width: 250px !important;
    margin-top: 15px !important;
}

a {
    color: inherit;
    text-decoration: none;
}

.form-box {
    display: grid;
    grid-template-columns: minmax(120px, auto) 1fr;
    grid-column-gap: 20px;
}

.form-box > div:nth-child(odd) {
    text-align: right;
    line-height: 60px;
}

.form-box > div:nth-child(even) {
    text-align: left;
}
</style>
