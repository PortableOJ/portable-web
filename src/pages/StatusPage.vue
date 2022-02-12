<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <StatusShow :content-id="null" :only-this-user-id="curUserId"></StatusShow>
        </div>
        <div>
            <UserCard></UserCard>
            <div v-if="onLogin" class="card">
                <InputCheckbox @change="changeOnlyMe" v-model="onlyMe">仅显示我的提交</InputCheckbox>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import StatusShow from "@/components/StatusShow";

export default {
    name: "StatusPage",
    components: {
        StatusShow,
        UserCard
    },
    data() {
        return {
            onLogin: false,
            onlyMe: false,
            curUserId: null
        }
    },
    created() {
        this.onLogin = this.$user.isLogin()
        let queryUserId = this.$route.query.userId ? parseInt(this.$route.query.userId.toString()) : null
        if (this.onLogin && queryUserId === this.$user.getCurUserId()) {
            this.onlyMe = true
            this.curUserId = this.$user.getCurUserId()
        } else {
            this.curUserId = null
        }
    },
    methods: {
        changeOnlyMe() {
            if (this.onlyMe) {
                this.curUserId = this.$user.getCurUserId()
            } else {
                this.curUserId = null
            }
        }
    }
}
</script>

<style scoped>

</style>