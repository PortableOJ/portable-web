<template>
    <div style="width: 100%">
        <StatusShow :contest-id="contestId" :prefix="'contest-'"></StatusShow>
    </div>
</template>

<script>
import StatusShow from "@/components/StatusShow";
export default {
    name: "Status",
    components: {
        StatusShow
    },
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId)
        }
    }
}
</script>

<style scoped>

</style>