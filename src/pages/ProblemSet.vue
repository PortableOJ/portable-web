<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <!--suppress JSValidateTypes -->
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-icon="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <i class="iconfont icon-flow" v-if="scope.data.problemListStatusType === 'ON_JUDGE'"></i>
                    <!--suppress JSUnresolvedVariable -->
                    <i class="iconfont icon-success" v-if="scope.data.problemListStatusType === 'PASS'"></i>
                    <!--suppress JSUnresolvedVariable -->
                    <i class="iconfont icon-error" v-if="scope.data.problemListStatusType === 'NOT_PASS'"></i>
                </template>
                <template v-slot:body-title="scope">
                    <Link @click="openProblem(scope.data.id)">{{ scope.data.title }}</Link>
                </template>
                <template v-slot:body-status="scope">
                    <template v-if="problemStatusType[scope.data.status]">
                        {{ problemStatusType[scope.data.status].text }}
                    </template>
                </template>
                <template v-slot:body-accessType="scope">
                    <template v-if="problemAccessType[scope.data.accessType]">
                        {{ problemAccessType[scope.data.accessType].text }}
                    </template>
                </template>
                <template v-slot:body-radio="scope">
                    <Link @click="openStatus(scope.data.id, true)">
                        {{ scope.data.acceptCount }}
                    </Link>
                    /
                    <Link @click="openStatus(scope.data.id, false)">
                        {{ scope.data.submissionCount }}
                    </Link>
                    (
                    <span v-if="scope.data.submissionCount !== 0">
                        {{ (scope.data.acceptCount / scope.data.submissionCount * 100).toFixed(2) }} %
                    </span>
                    <span v-else> 从未提交 </span>
                    )
                </template>
            </Table>
            <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
        </div>
        <div>
            <UserCard></UserCard>
            <div v-if="canCreateProblem()" class="card">
                <span class="card-title">管理</span>
                <InputButton @click="newProblem">新建题目</InputButton>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "ProblemSet",
    components: {
        UserCard
    },
    data() {
        return {
            tableHead: [
                {
                    label: '',
                    value: 'icon',
                    width: '20'
                }, {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '标题',
                    value: 'title',
                    width: '250',
                }, {
                    label: '当前状态',
                    value: 'status',
                    width: '50',
                }, {
                    label: '访问权限',
                    value: 'accessType',
                    width: '50',
                }, {
                    label: '通过/提交率',
                    value: 'radio',
                    width: '100',
                }
            ],
            tableData: [],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,

            problemAccessType: {},
            problemStatusType: {},
        }
    },
    created() {
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.initData()
    },
    methods: {
        initData() {
            let query = {
                pageNum: this.pageNum.toString(),
                pageSize: this.pageSize.toString()
            }
            if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
                this.$router.replace({
                    name: 'problemSet',
                    query: query
                })
            }
            this.$problem.getProblemList(this.pageNum, this.pageSize, res => {
                if (res == null) {
                    this.totalNum = 1
                    this.totalPage = 1
                    this.tableData = []
                } else {
                    this.pageNum = res.pageNum
                    this.pageSize = res.pageSize
                    this.totalNum = res.totalNum
                    this.totalPage = res.totalPage
                    this.tableData = res.data
                }
            })
        },
        openProblem(problemId) {
            this.$router.push({name: 'problem', params: {problemId: problemId}})
        },
        openStatus(problemId, onlyAccept) {
            this.$router.push({
                name: 'status', query: {
                    problemId: problemId,
                    statusType: onlyAccept ? 'ACCEPT' : null
                }
            })
        },
        changePageNum() {
            this.initData()
        },
        canCreateProblem() {
            return this.$user.hasPermission(this.$user.permissionTypeList.CREATE_AND_EDIT_PROBLEM)
        },
        newProblem() {
            this.$router.push({name: 'problemManager', params: {problemId: "0"}})
        }
    },
}
</script>

<style scoped>

</style>