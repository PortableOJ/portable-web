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
    /*margin-top: 60px;*/
}

.lm-rc-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
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

</style>
