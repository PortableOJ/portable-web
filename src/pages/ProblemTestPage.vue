<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-input="scope">
                    <InputButton @click="showInput(scope.data.name)">预览</InputButton>
                    <InputButton @click="downloadInput(scope.data.name)">下载</InputButton>
                </template>
                <template v-slot:body-output="scope">
                    <InputButton @click="showOutput(scope.data.name)">预览</InputButton>
                    <InputButton @click="downloadOutput(scope.data.name)">下载</InputButton>
                </template>
            </Table>
            <div v-if="showValue !== null">
                <h3>预览</h3>
                预览的数据内容仅为开头部分仅可见的 ASCII 内容，并非完整数据。如需要完整数据，请采用"下载"
                <MarkdownBlockCode :key='keyNum' :value="showValue"></MarkdownBlockCode>
            </div>
        </div>
        <div>
            <UserCard></UserCard>
            <div class="card">
                <InputButton @click="returnProblem">返回题目</InputButton>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "ProblemTestPage",
    components: {UserCard},
    data() {
        return {
            problemId: this.$route.params.problemId,
            tableHead: [
                {
                    label: '输入输出名',
                    value: 'name',
                }, {
                    label: '输入文件',
                    value: 'input'
                }, {
                    label: '输出文件',
                    value: 'output'
                }
            ],
            tableData: [],

            showValue: null,
            keyNum: 0,
        }
    },
    created() {
        this.$problem.getTestList(this.problemId, res => {
            this.tableData = []
            for (let i = 0; i < res.length; i++) {
                this.tableData.push({
                    name: res[i]
                })
            }
        })
    },
    methods: {
        showInput(name) {
            this.$problem.getTestInputShow(this.problemId, name, res => {
                this.showValue = res
                this.keyNum++
            })
        },
        downloadInput(name) {
            this.$problem.getTestInput(this.problemId, name)
        },
        showOutput(name) {
            this.$problem.getTestOutputShow(this.problemId, name, res => {
                this.showValue = res
                this.keyNum++
            })
        },
        downloadOutput(name) {
            this.$problem.getTestOutput(this.problemId, name)
        },
        returnProblem() {
            this.$router.push({name: 'problem', params: {problemId: this.problemId.toString()}})
        }
    }
}
</script>

<style scoped>

</style>