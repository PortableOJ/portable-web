<template>
    <div style="display: grid;place-items: center;">
        <h1>注册</h1>
        <InputText style="width: 350px" v-model="handle" placeholder="用户名"></InputText>
        <InputText type="password" style="width: 350px" v-model="password" placeholder="密码"></InputText>
        <InputText type="password" style="width: 350px" v-model="rePassword" placeholder="再次输入密码"></InputText>
        <div style="display: grid; grid-template-columns: 1fr auto; place-items: center; width: 350px;">
            <InputText style="width: 100%" v-model="captcha" placeholder="验证码"></InputText>
            <Link @click="flushCaptcha">
                <img ref="captcha" :src="captchaUrl" alt="验证码"/>
            </Link>
        </div>
        <InputButton @click="register">注册</InputButton>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            handle: '',
            password: '',
            rePassword: '',
            captcha: '',
            captchaUrl: process.env.VUE_APP_CAPTCHA_URL,
            backUrl: this.$common.getQueryString(this, 'back', '/')
        }
    },
    created() {
    },
    methods: {
        register() {
            if (this.password !== this.rePassword) {
                this.$toast({
                    title: '错误',
                    text: '两次输入的密码不同',
                    duration: 'auto',
                    type: 'error'
                })
                return
            }
            this.$user.signUp(this.handle, this.password, this.captcha, () => {
                this.$toast({
                    title: '欢迎',
                    text: '注册成功',
                    duration: 'auto',
                    type: 'success'
                })
                this.$router.push(this.backUrl)
            })
        },
        flushCaptcha() {
            this.captchaUrl = process.env.VUE_APP_CAPTCHA_URL + '?t=' + new Date().getTime()
        }
    }
}
</script>

<style scoped>

</style>