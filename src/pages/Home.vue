<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <img src="../assets/logo.svg" alt="Logo">
            <h1>欢迎来到 Portable OJ</h1>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
export default {
    name: "Home",
    components: {UserCard}
}
</script>

<style scoped>
</style>