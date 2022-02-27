<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-id="scope">
                    <Link @click="openContest(scope.data.id)">{{ scope.data.id }}</Link>
                </template>
                <template v-slot:body-title="scope">
                    <Link @click="openContest(scope.data.id)">{{ scope.data.title }}</Link>
                </template>
                <template v-slot:body-startTime="scope">
                    {{ new Date(scope.data.startTime).format("yyyy-MM-dd hh:mm:ss") }}
                </template>
                <template v-slot:body-duration="scope">
                    {{ `${(scope.data.duration / 60).toFixed(0)}:${scope.data.duration % 60}:00` }}
                </template>
                <template v-slot:body-accessType="scope">
                    {{ contestAccessType[scope.data.accessType].text }}
                </template>
            </Table>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "ContestSet",
    components: {
        UserCard
    },
    data() {
        return {
            tableHead: [
                {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '标题',
                    value: 'title',
                    width: '100',
                }, {
                    label: '开始时间',
                    value: 'startTime',
                    width: '50',
                }, {
                    label: '持续时长',
                    value: 'duration',
                    width: '50',
                }, {
                    label: '访问限制',
                    value: 'accessType',
                    width: '50',
                }
            ],
            tableData: [],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,

            contestAccessType: {}
        }
    },
    created() {
        this.$common.getEnum('ContestAccessType', res => this.contestAccessType = res)
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.$contest.getList(this.pageNum, this.pageSize, res => {
            this.pageNum = res.pageNum
            this.pageSize = res.pageSize
            this.totalNum = res.totalNum
            this.totalPage = res.totalPage
            this.tableData = res.data
        })
    },
    methods: {
        openContest(id) {
            this.$router.push({name: 'contest', params: {contestId: id}})
        }
    }
}
</script>

<style scoped>

</style>