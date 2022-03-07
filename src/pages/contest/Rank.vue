<template>
    <div style="width: 100%; overflow: auto">
        <div v-if="metaData">
            <h3>我</h3>
            <Table :head="tableHead" :data="metaData">
                <template v-slot:body-handle="scope">
                    <Link @click="openUser(scope.data.handle)">{{ scope.data.handle }}</Link>
                </template>
                <template v-slot:body-totalCost="scope">
                    {{
                        `${(scope.data.totalCost / 3600).toFixed(0).padStart(2, '0')}:${((scope.data.totalCost % 3600) / 60).toFixed(0).padStart(2, '0')}:${(scope.data.totalCost % 60).toFixed(0).padStart(2, '0')}`
                    }}
                </template>
                <template v-for="id in problemLen" v-slot:[bodyRound(id)]="scope">
                <span :key="id" v-if="scope.data[id]" :class="scope.data[id].solved">
                    {{ scope.data[id].value }}
                </span>
                </template>
            </Table>
        </div>
        <h3>总榜单</h3>
        <Table :head="tableHead" :data="tableData">
            <template v-slot:body-handle="scope">
                <Link @click="openUser(scope.data.handle)">{{ scope.data.handle }}</Link>
            </template>
            <template v-slot:body-totalCost="scope">
                {{
                    `${(scope.data.totalCost / 3600).toFixed(0).padStart(2, '0')}:${((scope.data.totalCost % 3600) / 60).toFixed(0).padStart(2, '0')}:${(scope.data.totalCost % 60).toFixed(0).padStart(2, '0')}`
                }}
            </template>
            <template v-for="id in problemLen" v-slot:[bodyRound(id)]="scope">
                <span :key="id" v-if="scope.data[id]" :class="scope.data[id].solved">
                    {{ scope.data[id].value }}
                </span>
            </template>
        </Table>
        <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
export default {
    name: "Rank",
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
        }
    },
    created() {
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
                width: '50',
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
            this.$contest.rank(this.contestId, this.pageNum, this.pageSize, res => {
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
            })
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
                    value += `${(tmp.solveTime / 3600).toFixed(0).padStart(2, '0')}:`
                    // noinspection JSUnresolvedVariable
                    value += `${((tmp.solveTime % 3600) / 60).toFixed(0).padStart(2, '0')}:`
                    // noinspection JSUnresolvedVariable
                    value += `${(tmp.solveTime % 60).toFixed(0).padStart(2, '0')}`
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
                    solved: tmp.firstSolveId != null ? 'accept'
                        : (tmp.runningSubmit && tmp.runningSubmit !== 0)
                            ? 'pending' : 'fail'
                };
            }
            return res
        },
        changePageNum() {
            this.initData()
        },
        bodyRound(id) {
            return `body-${id}`
        },
        openUser(handle) {
            this.$router.push({name: 'user', params: {handle: handle}})
        },
    }
}
</script>

<style>
.accept {
    font-weight: 900;
    color: var(--success-color);
}

.fail {
    color: var(--error-color);
}

.pending {
    color: var(--info-color);
}
</style>