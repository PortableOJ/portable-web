<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <!--suppress JSValidateTypes -->
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-icon="scope">
                    <i class="iconfont icon-flow" v-if="scope.data.problemListStatusType === 'ON_JUDGE'"></i>
                    <i class="iconfont icon-success" v-if="scope.data.problemListStatusType === 'PASS'"></i>
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
                    {{ scope.data.acceptCount }} / {{ scope.data.submissionCount }}
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
            <div class="card">
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
            tableData: [
                {
                    acceptCount: 0,
                    accessType: "HIDDEN",
                    id: 0,
                    owner: 0,
                    problemListStatusType: "NEVER_SUBMIT",
                    status: "CHECKING",
                    submissionCount: 0,
                    title: "string"
                }
            ],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,

            problemAccessType: {},
            problemStatusType: {}
        }
    },
    created() {
        this.pageNum = this.$route.query.pageNum
        this.pageSize = this.$route.query.pageSize
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.initData()
    },
    methods: {
        initData() {
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
        changePageNum() {
            this.initData()
        },
        newProblem() {
            this.$router.push({name: 'problemManager', params: {problemId: "0"}})
        }
    },
}
</script>

<style scoped>

</style>