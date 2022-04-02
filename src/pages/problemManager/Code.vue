<!--suppress JSUnresolvedVariable -->
<template>
    <div>
        <h3>标准代码</h3>
        <Table :head="tableStdHead" :data="tableStdData">
            <template v-slot:body-expectResultType="scope">
                {{ solutionStatusType[scope.data.expectResultType].text }}
            </template>
            <template v-slot:body-languageType="scope">
                {{ languageType[scope.data.languageType].text }}
            </template>
            <template v-slot:body-operator>
                <InputButton @click="showStdCode">查看</InputButton>
                <InputButton @click="downloadStdCode">下载</InputButton>
            </template>
        </Table>
        <h3>测试代码</h3>
        <Table :head="tableTestHead" :data="tableTestData">
            <template v-slot:body-expectResultType="scope">
                {{ solutionStatusType[scope.data.expectResultType].text }}
            </template>
            <template v-slot:body-languageType="scope">
                {{ languageType[scope.data.languageType].text }}
            </template>
            <template v-slot:body-solutionStatusType="scope">
                <!--TODO: 允许访问-->
                <Link :disabled="true" v-if="scope.data.solutionId" @click="toSolution(scope.data.solutionId)">
                    {{ solutionStatusType[scope.data.solutionStatusType].text }}
                </Link>
            </template>
            <template v-slot:body-operator="scope">
                <InputButton @click="showTestCode(scope.data)">查看</InputButton>
                <InputButton @click="downloadTestCode(scope.data.name)">下载</InputButton>
                <InputButton type="error" @click="removeTestCode(scope.data.name)">删除</InputButton>
            </template>
        </Table>

        <div style="display: grid; place-items: center">
            <InputButton @click="showCode(false)">新增测试代码</InputButton>
        </div>

        <Dialog v-model="showDialog" :title="isStdCode ? '查看/覆盖标准代码' : '查看/新增/覆盖测试代码'">
            <div style="display: grid; grid-template-columns: auto auto auto; place-items: center">
                <InputText placeholder="名称" v-model="name"></InputText>
                <InputSelect :data="languageTypeList" placeholder="语言" v-model="language"></InputSelect>
                <InputSelect :data="solutionStatusTypeList" placeholder="期望结果" v-model="result"></InputSelect>
            </div>
            <div style="text-align: left">
                <InputCode ref="inputCode" :key="keyNum" v-model="code"></InputCode>
            </div>
            <div style="display: grid; place-items: center">
                <InputButton v-if="isStdCode" @click="updateStd">更新标准代码</InputButton>
                <InputButton v-else @click="addTest">添加/覆盖测试代码</InputButton>
            </div>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: "Code",
    data() {
        return {
            problemId: this.$route.params.problemId,
            tableStdHead: [
                {
                    label: '名称',
                    value: 'name'
                }, {
                    label: '期望结果',
                    value: 'expectResultType'
                }, {
                    label: '语言',
                    value: 'languageType'
                }, {
                    label: '操作',
                    value: 'operator'
                }],
            tableTestHead: [
                {
                    label: '名称',
                    value: 'name'
                }, {
                    label: '期望结果',
                    value: 'expectResultType'
                }, {
                    label: '语言',
                    value: 'languageType'
                }, {
                    label: '执行的测试结果',
                    value: 'solutionStatusType'
                }, {
                    label: '操作',
                    value: 'operator'
                }],
            tableStdData: [],
            tableTestData: [],

            solutionStatusType: {},
            solutionStatusTypeList: [],
            languageType: {},
            languageTypeList: [],

            code: '',
            name: '',
            language: null,
            result: null,
            keyNum: 0,

            showDialog: false,
            isStdCode: false
        }
    },
    created() {
        this.$problem.getStdTestCode(this.problemId, res => {
            this.tableStdData = [res.stdCode]
            this.tableTestData = res.testCodeList
        })
        this.$common.getEnum('SolutionStatusType', res => {
            this.solutionStatusType = res
            this.solutionStatusTypeList = []
            for (let i in res) {
                if (!res[i].endingResult) {
                    continue
                }
                this.solutionStatusTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
        this.$common.getEnum('LanguageType', res => {
            this.languageType = res
            this.languageTypeList = []
            for (let i in res) {
                this.languageTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
    },
    methods: {
        toSolution(solutionId) {
            this.$router.push({name: 'solution', params: {solutionId: solutionId}})
        },
        showStdCode() {
            this.$problem.getStdCodeShow(this.problemId, res => {
                this.code = res
                this.name = '标准代码'
                this.language = this.tableStdData[0].languageType
                this.result = this.tableStdData[0].expectResultType
                this.keyNum++
                this.showCode(true)
            })
        },
        downloadStdCode() {
            this.$problem.getStdCode(this.problemId)
        },
        showTestCode(data) {
            this.$problem.getTestCodeShow(this.problemId, data.name, res => {
                this.code = res
                this.name = data.name
                this.language = data.languageType
                this.result = data.expectResultType
                this.keyNum++
                this.showCode(false)
            })
        },
        downloadTestCode(name) {
            this.$problem.getTestCode(this.problemId, name)
        },
        removeTestCode(name) {
            this.$problem.removeTestCode(this.problemId, name, () => {
                this.$toast({
                    title: '成功',
                    text: '成功删除测试代码',
                    duration: 'auto',
                    type: 'success'
                })
                let index = this.tableTestData.findIndex(t => t.name === name)
                if (index !== -1) {
                    this.tableTestData.splice(index, 1)
                }
            })
        },
        updateStd() {
            this.$problem.updateStdCode(this.problemId, this.code, this.language, () => {
                this.$toast({
                    title: '成功',
                    text: '成功更新标准代码',
                    duration: 'auto',
                    type: 'success'
                })
                this.tableStdData[0] = {
                    name: 'STD',
                    expectResultType: 'ACCEPT',
                    languageType: this.language,
                    solutionId: null,
                    solutionResult: null
                }
                this.code = ''
                this.name = ''
                this.language = null
                this.result = null
                this.keyNum++
            })
        },
        addTest() {
            this.$problem.addTestCode(this.problemId, this.code, this.language, this.name, this.result, () => {
                this.$toast({
                    title: '成功',
                    text: '成功添加测试代码',
                    duration: 'auto',
                    type: 'success'
                })
                this.tableTestData.push({
                    name: this.name,
                    expectResultType: this.result,
                    languageType: this.language,
                    solutionId: null,
                    solutionResult: null
                })
                this.code = ''
                this.name = ''
                this.language = null
                this.result = null
                this.keyNum++
            })
        },
        newTest() {
            this.code = ''
            this.name = ''
            this.language = null
            this.result = null
        },
        showCode(flag) {
            this.showDialog = true
            this.isStdCode = flag
            setTimeout(() => {
                this.$refs.inputCode.fresh()
            }, 500)
        }
    }
}
</script>

<style scoped>

</style>