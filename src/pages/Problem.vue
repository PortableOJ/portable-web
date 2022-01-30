<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <ProblemShow v-if="problemData !== null" :id="problemId" :problem-data="problemData"></ProblemShow>
        </div>
        <div>
            <UserCard></UserCard>
            <div v-if="problemData !== null" class="card">
                出题人
                <Link @click="openOwner"><h1>{{ problemData.ownerHandle }}</h1></Link>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import ProblemShow from "@/components/ProblemShow";

export default {
    name: "Problem",
    components: {
        ProblemShow,
        UserCard
    },
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,
        }
    },
    created() {
        this.$problem.getProblemData(this.problemId, res => {
            this.problemData = res
        })
    },
    methods: {
        openOwner() {
            this.$router.push({name: 'user', params: {handle: this.problemData.ownerHandle}})
        },
    }
}
</script>

<style scoped>

</style>