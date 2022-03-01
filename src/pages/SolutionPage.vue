<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <SolutionShow :contest-id="null" :solution-id="solutionId"></SolutionShow>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import SolutionShow from "@/components/SolutionShow";

export default {
    name: "SolutionPage",
    components: {SolutionShow, UserCard},
    data() {
        return {
            solutionId: parseInt(this.$route.params.solutionId),
        }
    }
}
</script>

<style scoped>

</style>