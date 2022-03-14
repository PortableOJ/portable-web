<!--suppress JSUnresolvedVariable -->
<template>
    <div style="display: grid; place-items: center">
        <!--suppress JSValidateTypes -->
        <Table style="width: 100%" :head="tableHead" :data="solutionData">
            <template v-slot:body-submitTime="scope">
                {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
            </template>
            <template v-slot:body-userHandle="scope">
                <Link @click="toUser(scope.data.userHandle)">{{ scope.data.userHandle }}</Link>
            </template>
            <template v-slot:body-problemTitle="scope">
                <Link @click="toProblem(scope.data.problemId)">{{ scope.data.problemTitle }}</Link>
            </template>
            <template v-slot:body-languageType="scope">
                {{ languageType[scope.data.languageType].text }}
            </template>
            <template v-slot:body-status="scope">
                <SolutionStatus :value="scope.data.status"></SolutionStatus>
            </template>
        </Table>
        <div style="text-align: left; width: 100%">
            <div v-if="code !== ''">
                <h3>代码</h3>
                <MarkdownBlockCode :value="code"></MarkdownBlockCode>
            </div>
            <div v-if="compileMsg && compileMsg !== ''">
                <h3>编译信息</h3>
                <MarkdownBlockCode :value="compileMsg"></MarkdownBlockCode>
            </div>
        </div>
        <Table v-if="runningMsg.length > 0" style="width: 100%" :head="judgeMsgHead" :data="runningMsg">
            <template v-slot:body-status="scope">
                <SolutionStatus :value="scope.data.status"></SolutionStatus>
            </template>
            <template v-slot:body-msg="scope">
                <MarkdownBlockCode style="width: 100%; display: grid" :value="scope.data.msg"></MarkdownBlockCode>
            </template>
        </Table>
    </div>
</template>

<script>
import SolutionStatus from "@/components/SolutionStatus";
export default {
    name: "SolutionShow",
    components: {SolutionStatus},
    props: {
        solutionId: Number,
        contestId: Number,
        testSolution: {
            type: Boolean,
            default: false
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
                    label: '耗时(ms)',
                    value: 'timeCost',
                    width: '50'
                }, {
                    label: '最大内存占用(KB)',
                    value: 'memoryCost',
                    width: '80'
                }
            ],
            solutionData: [],
            judgeMsgHead: [
                {
                    label: '测试名',
                    value: 'name',
                    width: '50',
                }, {
                    label: '结果',
                    value: 'status',
                    width: '50',
                }, {
                    label: '信息',
                    value: 'msg',
                    width: '120'
                }
            ],
            code: '',
            compileMsg: '',
            runningMsg: [],

            languageType: {},
        }
    },
    created() {
        this.$common.getEnum('LanguageType', res => this.languageType = res)
        let getSolutionData = res => {
            if (!res) {
                this.solutionData = []
                this.code = ''
                this.compileMsg = ''
            } else {
                this.solutionData = [res]
                this.code = res.code
                this.compileMsg = res.compileMsg
                this.runningMsg = []
                if (res.judgeReportMsgMap) {
                    for (let name in res.judgeReportMsgMap) {
                        this.runningMsg.push({
                            name: name,
                            status: res.judgeReportMsgMap[name].statusType,
                            msg: res.judgeReportMsgMap[name].msg
                        })
                    }
                }
            }
        }
        if (this.contestId) {
            if (this.testSolution) {
                this.$contest.getContestTestSolution(this.solutionId, getSolutionData)
            } else {
                this.$contest.getContestSolution(this.solutionId, getSolutionData)
            }
        } else {
            this.$solution.getSolution(this.solutionId, getSolutionData)
        }
    },
    methods: {
        toUser(handle) {
            this.$router.push({name: 'user', params: {handle: handle}})
        },
        toProblem(id) {
            if (this.contestId) {
                this.$router.push({
                    name: 'contest-problem',
                    params: {contestId: this.contestId.toString(), problemIndex: id}
                })
            } else {
                this.$router.push({name: 'problem', params: {problemId: id}})
            }
        },
    }
}
</script>

<style scoped>

</style>