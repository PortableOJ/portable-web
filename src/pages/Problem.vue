<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <ProblemShow :id="parseInt($route.params.problemId)"></ProblemShow>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import ProblemShow from "@/components/ProblemShow";

export default {
    name: "Problem",
    components: {ProblemShow, UserCard},
}
</script>

<style scoped>

</style>