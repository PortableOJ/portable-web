<template>
    <div style="display: grid; place-items: center">
        <h1>修改密码</h1>
        <InputText type="password" v-model="old" placeholder="之前的密码"></InputText>
        <InputText type="password" v-model="newPwd" placeholder="新的密码"></InputText>
        <InputText type="password" v-model="rePwd" placeholder="再次输入新的密码"></InputText>
        <InputButton @click="changePwd">确定修改</InputButton>
    </div>
</template>

<script>
export default {
    name: "Security",
    data() {
        return {
            old: '',
            newPwd: '',
            rePwd: ''
        }
    },
    methods: {
        changePwd() {
            if (this.newPwd !== this.rePwd) {
                this.$toast({
                    title: '错误',
                    text: '两次输入的密码不同',
                    duration: 'auto',
                    type: 'error'
                })
                return
            }
            this.$user.changePassword(this.old, this.newPwd, () => {
                this.$router.replace({name: 'home'})
                this.$toast({
                    title: '成功',
                    text: '更新密码完成，页面将会在数秒后刷新以退出当前的登录状态',
                    duration: 'auto',
                    type: 'success'
                })
                setTimeout(() => location.reload(), 3000)
            })
        }
    }
}
</script>

<style scoped>

</style>