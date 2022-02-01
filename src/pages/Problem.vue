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
            <div v-if="problemData && (canEdit || problemData.shareTest)" class="card">
                管理
                <div class="button-box">
                    <InputButton @click="viewTest">查看 & 下载此题目的测试数据</InputButton>
                    <InputButton v-if="canEdit" @click="editProblem">编辑题目</InputButton>
                </div>
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

            canEdit: false,
        }
    },
    created() {
        this.$problem.getProblemData(this.problemId, res => {
            this.problemData = res
            this.canEdit = this.$user.hasPermission(this.$user.permissionTypeList.CREATE_AND_EDIT_PROBLEM)
                && (this.$user.hasPermission(this.$user.permissionTypeList.EDIT_NOT_OWNER_PROBLEM)
                    || this.$user.getCurUserData().id === this.problemData.owner)
        })
    },
    methods: {
        openOwner() {
            this.$router.push({name: 'user', params: {handle: this.problemData.ownerHandle}})
        },
        viewTest() {
            this.$router.push({name: 'problemTest', params: {problemId: this.problemId.toString()}})
        },
        editProblem() {

        }
    }
}
</script>

<style scoped>
.button-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>