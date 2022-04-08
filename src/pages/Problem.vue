<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <ProblemShow v-if="problemData !== null" :id="problemId" :problem-data="problemData"></ProblemShow>
        </div>
        <div>
            <UserCard></UserCard>
            <div v-if="problemData !== null" class="card">
                <span class="card-title">题目信息</span>
                <div>
                    出题人:
                    <Link @click="openOwner">{{ problemData.ownerHandle }}</Link>
                </div>
                <div style="margin-top: 5px">访问权限:
                    <Tag :type="problemData.accessType === 'PUBLIC' ? 'success'
                         : problemData.accessType === 'HIDDEN' ? 'warning' : 'error'">
                        <template v-if="problemAccessType[problemData.accessType]">
                            {{ problemAccessType[problemData.accessType].text }}
                        </template>
                    </Tag>
                </div>
                <div>通过/提交率:
                    <Link @click="openStatus(problemData.id, true)">
                        {{ problemData.acceptCount }}
                    </Link>
                    /
                    <Link @click="openStatus(problemData.id, false)">
                        {{ problemData.submissionCount }}
                    </Link>
                    (
                    <span v-if="problemData.submissionCount !== 0">
                        {{ (problemData.acceptCount / problemData.submissionCount * 100).toFixed(2) }} %
                    </span>
                    <span v-else> 从未提交 </span>
                    )
                </div>
            </div>
            <div v-if="problemData && (canEdit || problemData.shareTest)" class="card">
                <span class="card-title">管理</span>
                <div class="button-box">
                    <InputButton @click="viewTest">查看 & 下载此题目的测试数据</InputButton>
                    <InputButton v-if="canEdit" @click="editProblem">编辑题目</InputButton>
                </div>
            </div>
            <div v-if="problemData !== null && isLogin && tableData.length !== 0" class="card">
                <span class="card-title">我的最近几次提交</span>
                <Table :head="tableHead" :data="tableData">
                    <template v-slot:body-id="scope">
                        <Link @click="openSolution(scope.data.id)">
                            {{ scope.data.id }}
                        </Link>
                    </template>
                    <!--suppress JSUnresolvedVariable -->
                    <template v-slot:body-submitTime="scope">
                        <!--suppress JSUnresolvedVariable -->
                        <span style="word-break: keep-all">
                        {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
                        </span>
                    </template>
                    <template v-slot:body-status="scope">
                        <SolutionStatus :value="scope.data.status"></SolutionStatus>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import ProblemShow from "@/components/ProblemShow";
import SolutionStatus from "@/components/SolutionStatus";

export default {
    name: "Problem",
    components: {
        SolutionStatus,
        ProblemShow,
        UserCard
    },
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,
            canEdit: false,
            isLogin: this.$user.isLogin(),
            tableHead: [
                {
                    label: '',
                    value: 'id',
                }, {
                    label: '提交时间',
                    value: 'submitTime',
                }, {
                    label: '状态',
                    value: 'status',
                }
            ],
            tableData: [],

            solutionStatusType: {},
            languageType: {},
            problemAccessType: {},
        }
    },
    created() {
        this.$common.getEnum('SolutionStatusType', res => this.solutionStatusType = res)
        this.$common.getEnum('LanguageType', res => this.languageType = res)
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$problem.getProblemData(this.problemId, res => {
            this.problemData = res
            this.canEdit = this.$user.hasPermission(this.$user.permissionTypeList.CREATE_AND_EDIT_PROBLEM)
                && (this.$user.hasPermission(this.$user.permissionTypeList.EDIT_NOT_OWNER_PROBLEM)
                    || this.$user.getCurUserHandle() === this.problemData.ownerHandle)
            if (this.isLogin) {
                this.$solution.getPublicSolutionList(1, 5, this.$user.getCurUserHandle(), this.problemId, null, res => {
                    this.tableData = res.data
                })
            }
        })
    },
    methods: {
        openOwner() {
            this.$router.push({name: 'user', params: {handle: this.problemData.ownerHandle}})
        },
        viewTest() {
            this.$router.push({name: 'problemTest', params: {problemId: this.problemId.toString()}})
        },
        openStatus(problemId, onlyAccept) {
            this.$router.push({
                name: 'status', query: {
                    problemId: problemId,
                    statusType: onlyAccept ? 'ACCEPT' : null
                }
            })
        },
        openSolution(id) {
            this.$router.push({name: 'solution', params: {solutionId: id}})
        },
        editProblem() {
            this.$router.push({name: 'problemManager', params: {problemId: this.problemId.toString()}})
        },
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