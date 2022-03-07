<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <TabMenu @change="toSelect" :options="menuOption" v-model="step"></TabMenu>
            <router-view></router-view>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>

import UserCard from "@/card/UserCard";

export default {
    name: "User",
    components: {
        UserCard
    },
    data() {
        return {
            step: null,
            handle: '',
            menuOption: [],
        }
    },
    created() {
        this.init()
    },
    methods: {
        toSelect(value) {
            if (`user-${value}` === this.$route.name) {
                return
            }
            this.$router.push({name: `user-${value}`, params: {handle: this.handle}})
        },
        init() {
            this.step = this.$route.name.split('-')[1]
            this.handle = this.$route.params.handle
            this.$user.getUserInfo(this.handle, res => {
                let isDominate = res.type === 'NORMAL' && this.$user.isDominate(res.organizationType)
                let isSelf = res.handle === this.$user.getCurUserHandle()
                this.menuOption = [
                    {
                        label: res.handle,
                        value: 'info',
                    }, {
                        label: '更新信息',
                        value: 'setting',
                        hidden: !isSelf,
                    }, {
                        label: '密码与安全',
                        value: 'security',
                        hidden: !isSelf,
                    }, {
                        label: '管理用户',
                        value: 'manager',
                        hidden: !isDominate
                    }
                ]
            })
        }
    },
    watch: {
        $route(to) {
            this.step = to.name.split('-')[1]
            this.init()
        }
    },
}
</script>

<style scoped>

</style>