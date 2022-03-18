<template>
    <div v-html="announcement" class="announcement"></div>
</template>

<script>
export default {
    name: "Info",
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
            contestData: null,
            announcement: null
        }
    },
    created() {
        this.$contest.getContestInfo(this.contestId, res => {
            this.contestData = res
            this.problemList = res.problemList
            this.announcement = this.$markdown(res.announcement)
        })
    }
}
</script>

<style scoped>
.announcement {
    padding: 40px 40px;
    margin: 20px 20px;
    border-radius: 30px;
    background: var(--border-color-level-4);
}
</style>