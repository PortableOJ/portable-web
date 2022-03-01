<template>
    <div style="width: 100%">
        <!--suppress JSValidateTypes -->
        <Table :head="tableHead" :data="problemList">
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
        <div class="announcement-box" v-if="announcement && announcement.length > 0">
            <h3>公告</h3>
            <div v-html="announcement" class="announcement"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Content",
    props: {},
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
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
            contestData: null,
            problemList: [],
            announcement: "",

            problemAccessType: {},
            problemStatusType: {},
        }
    },
    created() {
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.$contest.getContestData(this.contestId, res => {
            this.contestData = res
            this.problemList = res.problemList
            this.announcement = this.$markdown(res.announcement)
        })
    },
    methods: {
        openProblem(problemId) {
            this.$router.push({name: 'contest-problem', params: {problemIndex: problemId}})
        },
        openStatus(problemId, onlyAccept) {
            this.$router.push({
                name: 'contest-status',
                query: {
                    problemId: problemId,
                    statusType: onlyAccept ? 'ACCEPT' : null
                }
            })
        },
    }

}
</script>

<style scoped>
.announcement {
    padding: 40px 40px;
    margin: 20px 20px;
    border-radius: 30px;
    background: var(--border-color-level-3);
}
.announcement-box {
    border-radius: 15px;
    border: 1px solid var(--brand-color);
}
</style>