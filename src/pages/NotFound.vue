<template>
    <div>
        <img src="../assets/logo.svg" alt="Logo">
        <div><h1>这里正在施工</h1></div>
        <div>
            你可以选择前往
            <Link @click="open('home')">首页</Link>
            或者
            <Link @click="open('problemSet')">题库</Link>
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFound",
    methods: {
        open(to) {
            this.$router.replace({name: to})
        }
    }
}
</script>

<style scoped>

</style>