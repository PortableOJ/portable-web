<template>
    <div style="display: grid; grid-template-columns: auto 1fr">
        <Table :head="leftHead" :data="tableData" class="rank-table-left">
            <template v-slot:body-handle="scope">
                <Link style="overflow: hidden; text-overflow: ellipsis; max-width: 150px;"
                      @click="openStatus(scope.data.handle, null, null)">{{ scope.data.handle }}
                </Link>
            </template>
            <template v-slot:body-totalCost="scope">
                {{ dateFormat(scope.data.totalCost) }}
            </template>
        </Table>
        <div style="overflow: auto">
            <Table :head="tableHead" :data="tableData" class="rank-table">
                <template v-for="id in problemLen" v-slot:[headRound(id)]="scope">
                <span :key="id">
                    <Link @click="openProblem(scope.data.label)">{{ scope.data.label }}</Link>
                    (
                    <Link @click="openStatus(null, scope.data.label, 'ACCEPT')">
                        {{ contestData.problemList[scope.data.label].acceptCount }}
                    </Link>
                    /
                    <Link @click="openStatus(null, scope.data.label, null)">
                        {{ contestData.problemList[scope.data.label].submissionCount }}
                    </Link>
                    )
                </span>
                </template>
                <template v-for="id in problemLen" v-slot:[bodyRound(id)]="scope">
            <span :key="id" v-if="scope.data[id]" :class="scope.data[id].solved">
                {{ scope.data[id].value }}
            </span>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
export default {
    name: "RankShow",
    props: {
        tableHead: Array,
        tableData: Array,
        problemLen: Array,
        contestData: Object
    },
    data() {
        return {
            leftHead: [{
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
        }
    },
    methods: {
        bodyRound(id) {
            return `body-${id}`
        },
        headRound(id) {
            return `head-${id}`
        },
        dateFormat(timestamp) {
            return this.$common.dateFormat(timestamp * 1000)
        },
        openProblem(id) {
            this.$router.push({name: 'contest-problem', params: {problemIndex: id}})
        },
        openStatus(handle, problemIndex, status) {
            this.$router.push({
                name: 'contest-status',
                query: {userHandle: handle, problemId: problemIndex, statusType: status}
            })
        },
    }
}
</script>

<style>
.rank-table-left {
    white-space: nowrap;
}

.rank-table-left table {
    border-top-right-radius: 0 !important;
    box-shadow: none !important;
}

.rank-table-left td {
    padding: 8px 12px !important;
    height: 22px;
}

.rank-table {
    white-space: nowrap;
}

.rank-table table {
    border-top-left-radius: 0 !important;
    box-shadow: none !important;
}

.rank-table td {
    padding: 0 !important;
}

.rank-item {
    padding: 8px 12px;
    height: 22px;
    width: calc(100% - 24px);
}

.first-blood {
    font-weight: bolder;
    background-color: #5FAE4D;
    color: var(--white-color);
}

.pass {
    font-weight: bolder;
    background-color: #E7FEBD;
    color: var(--success-color);
}

.noPass {
    color: var(--error-color);
    background-color: #F9D2D1;
}

.trying {
    color: var(--info-color);
    background-color: #CBD6F7;
}
</style>