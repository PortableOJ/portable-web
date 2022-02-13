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
                <template v-if="solutionStatusType[scope.data.status]">
                    {{ solutionStatusType[scope.data.status].text }}
                </template>
            </template>
        </Table>
        <div style="text-align: left; width: 80%">
            <div v-if="code !== ''">
                <h3>代码</h3>
                <MarkdownBlockCode :value="code"></MarkdownBlockCode>
            </div>
            <div v-if="compileMsg !== ''">
                <h3>编译信息</h3>
                <MarkdownBlockCode :value="compileMsg"></MarkdownBlockCode>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SolutionShow",
    props: {
        solutionId: Number,
        contentId: Number,
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
            code: '',
            compileMsg: '',

            solutionStatusType: {},
            languageType: {},
        }
    },
    created() {
        this.$common.getEnum('SolutionStatusType', res => this.solutionStatusType = res)
        this.$common.getEnum('LanguageType', res => this.languageType = res)
        if (this.contentId) {
            // do nothing
        } else {
            this.$solution.getSolution(this.solutionId, res => {
                if (!res) {
                    this.solutionData = []
                    this.code = ''
                    this.compileMsg = ''
                } else {
                    this.solutionData = [res]
                    this.code = res.code
                    this.compileMsg = res.compileMsg
                }
            })
        }
    },
    methods: {
        toUser(handle) {
            this.$router.push({name: 'user', params: {handle: handle}})
        },
        toProblem(id) {
            this.$router.push({name: 'problem', params: {problemId: id}})
        },
    }
}
</script>

<style scoped>

</style>