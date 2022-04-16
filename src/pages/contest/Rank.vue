<template>
    <div style="width: 100%; overflow: auto; position: relative">
        <GlobalLoading v-show="onLoading"></GlobalLoading>
        <div v-if="metaData">
            <h3>我</h3>
            <RankShow :table-head="tableHead" :table-data="metaData" :problem-len="problemLen"
                      :contest-data="contestData"></RankShow>
        </div>
        <h3>总榜单</h3>
        <RankShow :table-head="tableHead" :table-data="tableData" :problem-len="problemLen"
                  :contest-data="contestData"></RankShow>
        <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
import RankShow from "@/components/RankShow";

export default {
    name: "Rank",
    components: {RankShow},
    props: {
        freeze: Boolean,
    },
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
            contestData: null,
            rankList: null,
            myRank: null,
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 0,

            tableHead: [],
            tableData: [],
            metaData: [],
            problemLen: [],

            onLoading: false
        }
    },
    created() {
        this.onLoading = true
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.$contest.getContestData(this.contestId, res => {
            this.contestData = res
            this.tableHead = [{
                label: '排名',
                value: 'rank',
                width: '30',
            }, {
                label: '昵称',
                value: 'handle',
                width: '80',
            }, {
                label: '解决',
                value: 'totalSolve',
                width: '20',
            }, {
                label: '罚时',
                value: 'totalCost',
                width: '50',
            }]
            this.problemLen = []
            for (let i = 0; i < res.problemList.length; i++) {
                this.tableHead.push({
                    label: i,
                    value: `p${i}`,
                })
                this.problemLen.push(`p${i}`)
            }
        })
        this.initData()
    },
    methods: {
        initData() {
            this.onLoading = true
            let query = {
                pageNum: this.pageNum.toString(),
                pageSize: this.pageSize.toString()
            }
            if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
                this.$router.replace({
                    name: 'contest-rank',
                    query: query
                })
            }
            this.$contest.rank(this.contestId, this.pageNum, this.pageSize, this.freeze, res => {
                this.pageNum = res.pageNum
                this.pageSize = res.pageSize
                this.totalNum = res.totalNum
                this.totalPage = res.totalPage
                this.tableData = []
                for (let i = 0; i < res.data.length; i++) {
                    this.tableData.push(this.reduceData(res.data[i]))
                }
                if (res.metaData) {
                    this.metaData = [this.reduceData(res.metaData)];
                } else {
                    this.metaData = null
                }
            }, () => this.onLoading = false)
        },
        reduceData(data) {
            let res = {
                rank: data.rank + 1,
                handle: data.userHandle,
                totalSolve: data.totalSolve,
                totalCost: data.totalCost,
            }
            // noinspection JSUnresolvedVariable
            for (const submitStatusKey in data.submitStatus) {
                // noinspection JSUnresolvedVariable
                const tmp = data.submitStatus[submitStatusKey]
                let value = ''
                // noinspection JSUnresolvedVariable
                if (tmp.firstSolveId) {
                    // noinspection JSUnresolvedVariable
                    value += this.dateFormat(tmp.solveTime)
                }
                // noinspection JSUnresolvedVariable
                if (tmp.penaltyTimes && tmp.penaltyTimes !== 0) {
                    value += `(${tmp.penaltyTimes})`
                }
                // noinspection JSUnresolvedVariable
                if (tmp.runningSubmit && tmp.runningSubmit !== 0) {
                    value += `+${tmp.runningSubmit}`
                }
                // noinspection JSUnresolvedVariable
                res[`p${submitStatusKey}`] = {
                    value: value,
                    solved: 'rank-item ' + (tmp.firstBlood ? 'first-blood' :
                        tmp.firstSolveId ? 'pass'
                            : (tmp.runningSubmit && tmp.runningSubmit !== 0)
                                ? 'trying' : 'noPass')
                };
            }
            return res
        },
        changePageNum() {
            this.initData()
        },
        dateFormat(timestamp) {
            return this.$common.dateFormat(timestamp * 1000)
        },
    },
    watch: {
        freeze() {
            this.initData()
        }
    }
}
</script>

<style scoped>

</style>