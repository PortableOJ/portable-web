<template>
    <div>
        <div style="display: grid; place-items: center">
            <!--suppress JSValidateTypes -->
            <Table :head="tableHead" :data="solutionData">
                <template v-slot:body-submitTime="scope">
                    {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
                </template>
                <template v-slot:body-status="scope">
                    {{ solutionStatusType[scope.data.status].text }}
                </template>
            </Table>
        </div>
        <div style="text-align: left">
            <h3>代码</h3>
            <InputTextarea :code-mode="true" :read-only="true" v-model="code"></InputTextarea>
            <h3>编译信息</h3>
            <InputTextarea :code-mode="true" :read-only="true" v-model="compileMsg"></InputTextarea>
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
                    value: 'userId',
                    width: '50',
                }, {
                    label: '问题',
                    value: 'problemId',
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
            solutionData: [{
                id: 0,
                submitTime: "1970-01-01T00:00:00.000+00:00",
                userId: 0,
                problemId: 0,
                contestId: null,
                languageType: "CPP11",
                status: "ACCEPT",
                solutionType: "PUBLIC",
                timeCost: 1,
                memoryCost: 1507,
                code: "",
                compileMsg: ""
            }],
            code: '',
            compileMsg: '',

            solutionStatusType: {}
        }
    },
    created() {
        this.$common.getEnum('SolutionStatusType', res => this.solutionStatusType = res)
        if (this.contentId) {
            // do nothing
        } else {
            this.$solution.getSolution(this.solutionId, res => {
                this.solutionData = [res]
                this.code = res.code
                this.compileMsg = res.compileMsg
            })
        }
    }
}
</script>

<style scoped>

</style>