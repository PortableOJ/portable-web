<template>
    <Table :head="tableHead" :data="tableData" class="rank-table">
        <template v-for="id in problemLen" v-slot:[headRound(id)]="scope">
            <span :key="id">
                <Link @click="openProblem(scope.data.label)">{{ scope.data.label }}</Link>
                (
                <Link @click="openStatus(null, scope.data.label, 'ACCEPT')">{{ contestData.problemList[scope.data.label].acceptCount }}</Link>
                /
                <Link @click="openStatus(null, scope.data.label, null)">{{ contestData.problemList[scope.data.label].submissionCount }}</Link>
                )
            </span>
        </template>
        <template v-slot:body-handle="scope">
            <Link @click="openStatus(scope.data.handle, null, null)">{{ scope.data.handle }}</Link>
        </template>
        <template v-slot:body-totalCost="scope">
            {{ dateFormat(scope.data.totalCost) }}
        </template>
        <template v-for="id in problemLen" v-slot:[bodyRound(id)]="scope">
            <span :key="id" v-if="scope.data[id]" :class="scope.data[id].solved">
                {{ scope.data[id].value }}
            </span>
        </template>
    </Table>
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
            this.$router.push({name: 'contest-status', query: {userHandle: handle, problemId: problemIndex, statusType: status}})
        },
    }
}
</script>

<style>
.rank-table td {
    padding: 0 !important;
}

.rank-table * {
    white-space: nowrap;
}

.rank-item {
    padding: 8px 12px;
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