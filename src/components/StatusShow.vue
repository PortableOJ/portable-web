<template>
    <div style="display: grid; place-items: center">
        <!--suppress JSValidateTypes -->
        <div style="width: 100%; display: grid; grid-template-columns: repeat(6, auto); place-items: center">
            <div>过滤条件：</div>
            <InputText style="width: 200px" placeholder="用户昵称" v-model="userHandle"></InputText>
            <!--suppress JSUndeclaredVariable -->
            <InputCheckbox :disabled="myUserHandle === null"
                           :value="userHandle === myUserHandle"
                         @change="flag => flag ? userHandle = myUserHandle : userHandle = ''">
                仅我
            </InputCheckbox>
            <InputSelect v-if="problemSelect" style="width: 250px" placeholder="题目" v-model="problemId" :data="problemSelect"></InputSelect>
            <InputText v-else style="width: 250px" placeholder="题号" v-model="problemId"></InputText>
            <InputSelect style="width: 250px" placeholder="状态" v-model="statusType"
                         :data="solutionStatusTypeList"></InputSelect>
            <InputButton style="width: 80px" @click="changeUrl">刷新</InputButton>
        </div>
        <div style="position: relative; min-height: 400px; width: 100%;">
            <!--suppress JSValidateTypes -->
            <Table style="width: 100%; font-size: 0.8rem" v-if="languageType" :head="tableHead" :data="tableData">
                <template v-slot:body-id="scope">
                    <Link @click="openSolution(scope.data.id)" :disabled="disableSolution(scope.data.userHandle)">
                        {{ scope.data.id }}
                    </Link>
                </template>
                <!--suppress JSUnresolvedVariable -->
                <template v-slot:body-submitTime="scope">
                    {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
                </template>
                <template v-slot:body-userHandle="scope">
                    <Link @click="openUser(scope.data.userHandle)">
                        {{ scope.data.userHandle }}
                    </Link>
                </template>
                <template v-slot:body-problemTitle="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <Link @click="openProblem(scope.data.problemId)" style="overflow: hidden;
                    text-overflow:ellipsis; max-width: 200px; white-space: nowrap;">
                        {{ scope.data.problemId }} - {{ scope.data.problemTitle }}
                    </Link>
                </template>
                <template v-slot:body-languageType="scope">
                    {{ languageType[scope.data.languageType].text }}
                </template>
                <template v-slot:body-status="scope">
                    <SolutionStatus :value="scope.data.status"></SolutionStatus>
                </template>
                <!--suppress JSUnresolvedVariable -->
                <template v-slot:body-timeCost="scope">
                    {{ scope.data.timeCost }} ms
                </template>
                <!--suppress JSUnresolvedVariable -->
                <template v-slot:body-memoryCost="scope">
                    {{ scope.data.memoryCost }} KiB
                </template>
            </Table>
            <GlobalLoading v-show="onRefresh"></GlobalLoading>
        </div>
        <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
import SolutionStatus from "@/kit/SolutionStatus";

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
                    label: '耗时',
                    value: 'timeCost',
                    width: '50'
                }, {
                    label: '内存',
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
            problemSelect: null,

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
            this.$contest.getContestData(this.contestId, res => {
                // noinspection JSUnresolvedVariable
                this.ownerAndCoAuthor = res.coAuthor
                this.ownerAndCoAuthor.push(res.ownerHandle)
                this.problemSelect = [{
                    value: null,
                    label: '不过滤'
                }]
                for (let i = 0; i < res.problemList.length; i++) {
                    this.problemSelect.push({
                        value: res.problemList[i].id,
                        label: `${res.problemList[i].id} - ${res.problemList[i].title}`,
                    })
                }
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
                if (this.$user.hasPermission(this.$user.permissionTypeList.EDIT_NOT_OWNER_CONTEST)) {
                    return false
                }
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
            if (this.problemId != null) {
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
        },
        checkOnlyMe(flag) {
            if (flag) {
                this.userHandle = this.myUserHandle
            } else {
                this.userHandle = ''
            }
        }
    },
}
</script>

<style scoped>

</style>