<template>
    <div id="app">
        <NavMenu :options="selectOption" v-model="select"></NavMenu>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {},
    data() {
        return {
            selectOption: [
                {
                    label: '主页',
                    value: 'home',
                }
            ],
            select: this.$route.name
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
    margin-top: 60px;
}
</style>
