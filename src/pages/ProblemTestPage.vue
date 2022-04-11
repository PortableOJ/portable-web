<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-input="scope">
                    <Link @click="showInput(scope.data.name)">预览</Link>
                    |
                    <Link @click="downloadInput(scope.data.name)">下载</Link>
                </template>
                <template v-slot:body-output="scope">
                    <Link @click="showOutput(scope.data.name)">预览</Link>
                    |
                    <Link @click="downloadOutput(scope.data.name)">下载</Link>
                </template>
            </Table>
            <Dialog v-model="showTestDialog" title="预览部分数据">
                <div style="width: 800px; max-height: 600px; overflow: auto">
                    <MarkdownBlockCode :key='keyNum' :value="showValue"></MarkdownBlockCode>
                </div>
            </Dialog>
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
            showTestDialog: false,
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
                this.showTestDialog = true
            })
        },
        downloadInput(name) {
            this.$problem.getTestInput(this.problemId, name)
        },
        showOutput(name) {
            this.$problem.getTestOutputShow(this.problemId, name, res => {
                this.showValue = res
                this.keyNum++
                this.showTestDialog = true
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