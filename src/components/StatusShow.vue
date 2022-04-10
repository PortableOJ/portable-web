<template>
    <div style="display: grid; place-items: center">
        <!--suppress JSValidateTypes -->
        <div style="width: 100%; display: grid; grid-template-columns: repeat(6, auto); place-items: center;">
            <div>过滤条件：</div>
            <InputText style="width: 250px" placeholder="用户昵称" v-model="userHandle"></InputText>
            <InputButton style="width: 50px"
                         :disabled="myUserHandle === null"
                         type="info"
                         @click="userHandle = myUserHandle">
                填入我
            </InputButton>
            <InputText style="width: 200px" placeholder="题号" v-model="problemId"></InputText>
            <InputSelect style="width: 250px" placeholder="状态" v-model="statusType"
                         :data="solutionStatusTypeList"></InputSelect>
            <InputButton style="width: 80px" @click="changeUrl">刷新</InputButton>
        </div>
        <div style="position: relative; min-height: 400px; width: 100%;">
            <!--suppress JSValidateTypes -->
            <Table style="width: 100%;" v-if="languageType" :head="tableHead" :data="tableData">
                <template v-slot:body-id="scope">
                    <Link @click="openSolution(scope.data.id)" :disabled="disableSolution(scope.data.userHandle)">
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
            <GlobalLoading v-show="onRefresh"></GlobalLoading>
        </div>
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
            userHandle: null,
            problemId: null,
            statusType: null,
            // 管理员和出题人的 handle 集合
            ownerAndCoAuthor: [],

            myUserHandle: null,

            languageType: {},
            solutionStatusType: {},
            solutionStatusTypeList: [],

            onRefresh: false
        }
    },
    created() {
        this.$common.getEnum('LanguageType', res => this.languageType = res)
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.userHandle = this.$common.getQueryString(this, 'userHandle', null)
        this.problemId = this.$common.getQueryInt(this, 'problemId', null)
        this.statusType = this.$common.getQueryString(this, 'statusType', null)
        this.$common.getEnum('SolutionStatusType', res => {
            this.solutionStatusType = res
            this.solutionStatusTypeList = []
            this.solutionStatusTypeList.push({
                label: '不过滤',
                value: null
            })
            for (let i in res) {
                this.solutionStatusTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
        this.myUserHandle = this.$user.getCurUserHandle()
        if (this.contestId) {
            this.$contest.getContestInfo(this.contestId, res => {
                // noinspection JSUnresolvedVariable
                this.ownerAndCoAuthor = res.coAuthor
                this.ownerAndCoAuthor.push(res.ownerHandle)
            })
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
            let callback = () => {
                this.onRefresh = false
            }
            this.tableData = []
            this.onRefresh = true
            if (this.contestId) {
                if (this.testContest) {
                    this.$contest.getContestTestStatus(this.contestId, this.pageNum, this.pageSize, this.userHandle, this.problemId, this.statusType, getStatus, callback)
                } else {
                    this.$contest.getContestStatus(this.contestId, this.pageNum, this.pageSize, this.userHandle, this.problemId, this.statusType, getStatus, callback)
                }
            } else {
                this.$solution.getPublicSolutionList(this.pageNum, this.pageSize, this.userHandle, this.problemId, this.statusType, getStatus, callback)
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
        disableSolution(userHandle) {
            if (this.contestId) {
                if (this.ownerAndCoAuthor.indexOf(this.$user.getCurUserData().handle) !== -1) {
                    return false
                }
                return this.$user.getCurUserHandle() !== userHandle
            } else {
                return this.$user.getCurUserHandle() !== userHandle && !this.$user.hasPermission(this.$user.permissionTypeList.VIEW_PUBLIC_SOLUTION)
            }
        },
        changePageNum() {
            this.changeUrl()
        },
        changeUrl() {
            let query = {}
            query.pageNum = this.pageNum.toString()
            query.pageSize = this.pageSize.toString()
            if (this.userHandle) {
                query.userHandle = this.userHandle
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
}
</script>

<style scoped>

</style>