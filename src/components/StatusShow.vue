<template>
    <div style="display: grid; place-items: center">
        <!--suppress JSValidateTypes -->
        <Table v-if="languageType" :head="tableHead" :data="tableData">
            <template v-slot:body-id="scope">
                <Link @click="openSolution(scope.data.id)" :disabled="disableSolution(scope.data.userId)">
                    {{ scope.data.id }}
                </Link>
            </template>
            <template v-slot:body-userHandle="scope">
                <Link @click="openUser(scope.data.userHandle)">
                    {{ scope.data.userHandle }}
                </Link>
            </template>
            <template v-slot:body-problemTitle="scope">
                <!--suppress JSUnresolvedVariable -->
                <Link @click="openProblem(scope.data.problemId)">
                    {{ scope.data.problemTitle }}
                </Link>
            </template>
            <!--suppress JSUnresolvedVariable -->
            <template v-slot:body-submitTime="scope">
                {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
            </template>
            <template v-slot:body-languageType="scope">
                {{ languageType[scope.data.languageType].text }}
            </template>
            <template v-slot:body-status="scope">
                <SolutionStatus :value="scope.data.status"></SolutionStatus>
            </template>
        </Table>
        <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
import SolutionStatus from "@/components/SolutionStatus";
export default {
    name: "StatusShow",
    components: {SolutionStatus},
    props: {
        contestId: {
            type: Number,
            default: null,
        },
        testContest: {
            type: Boolean,
            default: false,
        },
        onlyThisUserId: {
            type: Number,
            default: null
        },
        selectStatusType: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            tableHead: [
                {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '提交时间',
                    value: 'submitTime',
                    width: '80',
                }, {
                    label: '用户',
                    value: 'userHandle',
                    width: '50',
                }, {
                    label: '问题',
                    value: 'problemTitle',
                    width: '50',
                }, {
                    label: '语言',
                    value: 'languageType',
                    width: '50',
                }, {
                    label: '状态',
                    value: 'status',
                    width: '50',
                }, {
                    label: '耗时(ms)',
                    value: 'timeCost',
                    width: '50'
                }, {
                    label: '最大内存占用(KB)',
                    value: 'memoryCost',
                    width: '80'
                }
            ],
            tableData: [],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,
            userId: null,
            problemId: null,
            statusType: null,
            // 管理员和出题人的 handle 集合
            ownerAndCoAuthor: [],

            languageType: {},
        }
    },
    created() {
        this.$common.getEnum('LanguageType', res => this.languageType = res)
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.userId = this.$common.getQueryInt(this, 'userId', null)
        this.problemId = this.$common.getQueryInt(this, 'problemId', null)
        this.statusType = this.$common.getQueryString(this, 'statusType', null)
        if (this.onlyThisUserId) {
            this.userId = this.onlyThisUserId
        }
        if (this.selectStatusType) {
            this.statusType = this.selectStatusType
        }
        this.changeUrl()
    },
    methods: {
        initData() {
            let getStatus = res => {
                this.pageNum = res.pageNum
                this.pageSize = res.pageSize
                this.totalNum = res.totalNum
                this.totalPage = res.totalPage
                this.tableData = res.data
            }
            if (this.contestId) {
                if (this.testContest) {
                    this.$contest.getContestTestStatus(this.contestId, this.pageNum, this.pageSize, this.userId, this.problemId, this.statusType, getStatus)
                } else {
                    this.$contest.getContestStatus(this.contestId, this.pageNum, this.pageSize, this.userId, this.problemId, this.statusType, getStatus)
                }
                this.$contest.getContestData(this.contestId, res => {
                    // noinspection JSUnresolvedVariable
                    this.ownerAndCoAuthor = res.coAuthor
                    this.ownerAndCoAuthor.push(res.ownerHandle)
                })
            } else {
                this.$solution.getPublicSolutionList(this.pageNum, this.pageSize, this.userId, this.problemId, this.statusType, getStatus)
            }
        },
        openSolution(id) {
            if (this.contestId) {
                if (this.testContest) {
                    this.$router.push({
                        name: 'contest-test_solution',
                        params: {
                            contestId: this.contestId ? this.contestId.toString() : null,
                            solutionId: id
                        }
                    })
                } else {
                    this.$router.push({
                        name: 'contest-solution',
                        params: {
                            contestId: this.contestId ? this.contestId.toString() : null,
                            solutionId: id
                        }
                    })
                }
            } else {
                this.$router.push({
                    name: 'solution',
                    params: {solutionId: id}
                })
            }
        },
        openUser(userHandle) {
            this.$router.push({name: 'user', params: {handle: userHandle}})
        },
        openProblem(problemId) {
            if (this.contestId) {
                this.$router.push({
                    name: 'contest-problem',
                    params: {
                        contestId: this.contestId ? this.contestId.toString() : null,
                        problemIndex: problemId
                    }
                })
            } else {
                this.$router.push({
                    name: 'problem',
                    params: {problemId: problemId}
                })
            }
        },
        disableSolution(userId) {
            if (this.contestId) {
                if (this.ownerAndCoAuthor.indexOf(this.$user.getCurUserData().handle) !== -1) {
                    return false
                }
                return this.$user.getCurUserId() !== userId
            } else {
                return this.$user.getCurUserId() !== userId && !this.$user.hasPermission(this.$user.permissionTypeList.VIEW_PUBLIC_SOLUTION)
            }
        },
        changePageNum() {
            this.changeUrl()
        },
        changeUrl() {
            let query = {}
            query.pageNum = this.pageNum.toString()
            query.pageSize = this.pageSize.toString()
            if (this.userId) {
                query.userId = this.userId.toString()
            }
            if (this.problemId) {
                query.problemId = this.problemId.toString()
            }
            if (this.statusType) {
                query.statusType = this.statusType
            }
            if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
                this.$router.replace({
                    name: this.$route.name,
                    query: query
                })
            }
            this.initData()
        }
    },
    watch: {
        onlyThisUserId(v) {
            this.userId = v
            this.changeUrl()
        },
        selectStatusType(v) {
            this.statusType = v
            this.changeUrl()
        }
    }
}
</script>

<style scoped>

</style>