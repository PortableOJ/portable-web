<template>
    <div style="display: grid; grid-template-columns: 350px minmax(500px, 1fr); margin-top: 30px;">
        <div>
            <InputAvatar @change="saveAvatar" :src="avatarUrl" style="margin: auto">
            </InputAvatar>
            <div style="margin-top: 10px">点击以更改头像</div>
        </div>
        <div>
            暂时还没有别的信息可以更新～
        </div>
    </div>
</template>

<script>
export default {
    name: "Setting",
    data() {
        return {
            handle: this.$route.params.handle,
            userData: {
                id: 0,
                handle: "",
                type: "NORMAL",
                organizationType: "ADMIN",
                submission: 0,
                accept: 0,
                permissionTypeSet: [],
                email: null
            },
            avatarUrl: '',
        }
    },
    created() {
        if (this.$route.params.handle !== this.$user.getCurUserHandle()) {
            this.$router.replace({name: 'user-setting', params: {handle: this.$user.getCurUserHandle()}})
        }
        this.userData = this.$user.getCurUserData()
        this.avatarUrl = process.env.VUE_APP_AVATAR_URL + this.userData.avatar
    },
    methods: {
        saveAvatar(file) {
            this.$user.changeAvatar(file, res => {
                this.$user.getCurUserData().avatar = res
                this.avatarUrl = process.env.VUE_APP_AVATAR_URL + this.userData.avatar
                this.$toast({
                    title: '成功',
                    text: '更新头像成功，这可能需要数分钟至数小时后才能将数据同步至所有页面',
                    duration: 'auto',
                    type: 'success'
                })
            })
        }
    }
}
</script>

<style scoped>

</style>