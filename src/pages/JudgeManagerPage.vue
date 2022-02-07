<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <h1>服务器密钥：{{ serverCode.code }}</h1>
            <div v-if="serverCode.temporary">过期时间：{{ new Date(serverCode.endTime).format("yyyy-MM-dd hh:mm:ss") }}</div>
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-maxWorkCore="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <span>{{ scope.data.maxWorkCore }} / {{ scope.data.workAccumulation }}</span>
                </template>
                <template v-slot:body-maxThreadCore="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <span>{{ scope.data.maxThreadCore }} / {{ scope.data.threadAccumulation }}</span>
                </template>
                <template v-slot:body-maxSocketCore="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <span>{{ scope.data.maxSocketCore }} / {{ scope.data.socketAccumulation }}</span>
                </template>
                <template v-slot:body-lastHeartbeat="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <span>{{ new Date(scope.data.lastHeartbeat).format("yyyy-MM-dd hh:mm:ss") }}</span>
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
    name: "JudgeManagerPage",
    components: {UserCard},
    data() {
        return {
            tableHead: [
                {
                    label: '编号',
                    value: 'judgeCode',
                    width: '60'
                }, {
                    label: '任务线程数/任务堆积数',
                    value: 'maxWorkCore',
                    width: '50'
                }, {
                    label: '工作线程数/堆积任务数',
                    value: 'maxThreadCore',
                    width: '50'
                }, {
                    label: '网络线程数/堆积任务数',
                    value: 'maxSocketCore',
                    width: '50'
                }, {
                    label: '同步任务数',
                    value: 'maxWorkNum',
                    width: '50'
                }, {
                    label: '最后同步时间',
                    value: 'lastHeartbeat',
                    width: '80'
                }
            ],
            tableData: [],
            serverCode: {
                code: '',
                temporary: false,
                endTime: null
            }
        }
    },
    created() {
        this.$judge.getServerCode(res => this.serverCode = res)
        this.$judge.getJudgeContainerList(res => this.tableData = res)
    }
}
</script>

<style scoped>

</style>