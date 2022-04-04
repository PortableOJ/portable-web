<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <StatusShow :contest-id="null"></StatusShow>
        </div>
        <div>
            <UserCard></UserCard>
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
    }
}
</script>

<style scoped>

</style>