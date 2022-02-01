<template>
    <div class="card">
        <div v-if="isLogin" style="text-align: left">
            Hi
            <div>
                <Link @click="openMine">
                    <h1>{{ userData.handle }}</h1>
                </Link>
            </div>
            欢迎来到 Portable OJ
            <InputButton @click="logout">登出</InputButton>
        </div>
        <div v-else>
            <InputText class="card-input" placeholder="用户名" v-model="handle"></InputText>
            <InputText class="card-input" type="password" placeholder="密码" v-model="password"></InputText>
            <div class="button-box">
                <InputButton @click="login" :loading="onLogin" :disabled="onRegister">登录</InputButton>
                <InputButton @click="register" :loading="onRegister" :disabled="onLogin">注册</InputButton>
            </div>
        </div>
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

            onLogin: false,
            onRegister: false
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
            }
            this.onLogin = false
            this.onRegister = false
        },
        login() {
            this.onLogin = true
            this.$user.signIn(this.handle, this.password, () => {
                this.init()
            })
        },
        register() {
            this.onRegister = true
            this.$message({
                text: '请再次输入密码来进行注册',
                type: 'info',
                inputType: 'password',
                ok: '确定',
                cancel: '取消注册',
                input: true,
                confirmOK: (v) => {
                    if (v === this.password) {
                        this.$user.signUp(this.handle, this.password, () => {
                            this.onRegister = false
                            this.init()
                        })
                    } else {
                        this.$toast({
                            title: '错误',
                            text: '两次输入的密码不同',
                            duration: 'auto',
                            type: 'error'
                        })
                        this.onRegister = false
                    }
                },
                confirmCancel: () => {
                    this.onRegister = false
                },
            })
        },
        logout() {
            this.$user.signOut()
            this.isLogin = false
        },
        openMine() {
            this.$router.push({name: 'user', params: {handle: this.userData.handle}})
        },
    },
}
</script>

<style scoped>
.card-input {
    width: 250px;
    margin-top: 15px;
}

.button-box {
    display: grid;
    grid-template-columns: auto auto;
}
</style>