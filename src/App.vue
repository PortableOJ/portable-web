<template>
    <div id="app" class="main-layout">
        <NavMenu @change="toSelect" :options="selectOption" v-model="select" :not-found="v => v ? hiddenOption[v.split('-')[0]] : ''"></NavMenu>
        <router-view></router-view>
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
    name: 'App',
    components: {Footer},
    data() {
        return {
            selectOption: [
                {
                    label: '主页',
                    value: 'home',
                }, {
                    label: '题库',
                    value: 'problemSet',
                }, {
                    label: '判题',
                    value: 'status',
                }, {
                    label: '服务',
                    value: 'judge',
                    hidden: !this.$user.hasPermission(this.$user.permissionTypeList.MANAGER_JUDGE)
                }
            ],
            hiddenOption: {
                user: '用户',
                problem: '题目',
                solution: '提交',
                userManager: '管理',
                problemTest: '数据',
                problemManager: '管理',
            },
            select: this.$route.name
        }
    },
    created() {
        this.$user.registerUserStatusChange('menu', this.init)
    },
    methods: {
        init() {
            this.selectOption =  [
                {
                    label: '主页',
                    value: 'home',
                }, {
                    label: '题库',
                    value: 'problemSet',
                }, {
                    label: '判题',
                    value: 'status',
                }, {
                    label: '服务',
                    value: 'judge',
                    hidden: !this.$user.hasPermission(this.$user.permissionTypeList.MANAGER_JUDGE)
                }
            ]
        },
        toSelect(value) {
            if (value === this.$route.name) {
                return
            }
            this.$router.push({name: value})
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
}

.main-layout {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

.lm-rc-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
}

.lm-rc-layout-left {
    margin-right: 8px;
}

.card {
    box-shadow: var(--open-shadowbox);
    border: 1px solid var(--border-color-level-1);
    padding: 10px 10px;
    margin-top: 10px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    transition: 0.2s ease all;
}

.card:hover {
    border: 1px solid var(--brand-color);
}

.card-title {
    font-weight: bolder;
    margin-bottom: 15px;
}

</style>
