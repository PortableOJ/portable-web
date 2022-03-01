<template>
    <div style="width: 100%">
        <SolutionShow :contest-id="contestId" :solution-id="solutionId" :test-solution="true">
        </SolutionShow>
    </div>
</template>

<script>
import SolutionShow from "@/components/SolutionShow";

export default {
    name: "TestSolution",
    components: {SolutionShow},
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
            solutionId: parseInt(this.$route.params.solutionId),
        }
    }
}
</script>

<style scoped>

</style>