<template>
    <div class="card">
        <template v-if="isLogin" style="text-align: left">
            <span class="card-title">
                <Link @click="openMine">
                    {{ userData.handle }}
                </Link>
            </span>
            <div style="display: grid; grid-template-columns: auto 100px">
                <div style="margin-right: 30px; display: grid; place-items: center start;">
                    <Link @click="openMine">个人资料</Link>
                    <Link @click="logout">登出</Link>
                </div>
                <img @click="openMine"
                     style="border-radius: 50%; width: 100px; cursor: pointer"
                     :src="avatarUrl" alt="avatar">
            </div>
        </template>
        <template v-else>
            <span class="card-title">登录</span>
            <InputText class="card-input" placeholder="用户名" v-model="handle"></InputText>
            <InputText class="card-input" type="password" placeholder="密码" v-model="password"></InputText>
            <div class="button-box">
                <InputButton @click="login" :loading="onLogin">登录</InputButton>
                <Link @click="register">
                    去注册<i class="iconfont icon-right"></i>
                </Link>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "UserCard",
    data() {
        return {
            isLogin: false,

            userData: {
                id: null,
                handle: null,
                type: null,
                organizationType: null,
                permissionTypeSet: [],
            },

            handle: '',
            password: '',
            reportPassword: '',
            avatarUrl: '',

            onLogin: false,
        }
    },
    created() {
        this.$user.check(() => {
            this.isLogin = this.$user.isLogin()
            this.init()
        })
    },
    methods: {
        init() {
            this.isLogin = this.$user.isLogin()
            if (this.isLogin) {
                this.userData = this.$user.getCurUserData()
                this.avatarUrl = process.env.VUE_APP_AVATAR_URL + this.userData.avatar
            }
            this.onLogin = false
        },
        login() {
            this.onLogin = true
            this.$user.signIn(this.handle, this.password, () => {
                this.init()
            })
        },
        register() {
            this.$router.push({name: 'register', query: {back: this.$route.fullPath}})
        },
        logout() {
            this.$message({
                text: '即将登出，请确认',
                type: 'info',
                inputType: 'password',
                ok: '确定',
                cancel: '取消',
                input: false,
                confirmOK: () => {
                    this.$user.signOut()
                    this.isLogin = false
                },
                confirmCancel: () => {
                },
            })
        },
        openMine() {
            this.$router.push({name: 'user', params: {handle: this.userData.handle}})
        },
    },
}
</script>

<style scoped>
.button-box {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: 10px;
}
</style>