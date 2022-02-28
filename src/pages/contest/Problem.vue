<template>
    <div style="width: 100%">
        <ProblemShow v-if="problemData !== null" :id="problemIndex" :contest-id="contestId" :problem-data="problemData"></ProblemShow>
    </div>
</template>

<script>
import ProblemShow from "@/components/ProblemShow";

export default {
    name: "Problem",
    components: {ProblemShow},
    data() {
        return {
            contestId: 0,
            problemIndex: 0,
            problemData: null,

            solutionStatusType: {},
            languageType: {},
            problemAccessType: {},
        }
    },
    created() {
        this.contestId = parseInt(this.$route.params.contestId)
        this.problemIndex = parseInt(this.$route.params.problemIndex)

        this.$contest.getContestProblem(this.contestId, this.problemIndex, res => {
            this.problemData = res
        })
    }
}
</script>

<style scoped>

</style>