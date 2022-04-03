<template>
    <div>
        <Table :head="tableHead" :data="tableData">
            <template v-slot:body-name="scope">
                <div v-if="scope.data.notUpload">
                    <i style="color: var(--warning-color)"
                       v-if="tableData.filter(t => t.name === scope.data.name).length > 1"
                       class="iconfont icon-warning"></i>
                    <InputText v-model="scope.data.name" style="width: 150px">
                    </InputText>
                </div>
                <span v-else>{{ scope.data.name }}</span>
            </template>
            <template v-slot:body-input="scope">
                <div v-if="!scope.data.notUpload">
                    <Link @click="showInput(scope.data.name)">预览</Link>
                    |
                    <Link @click="downloadInput(scope.data.name)">下载</Link>
                </div>
            </template>
            <template v-slot:body-output="scope">
                <div v-if="!scope.data.notUpload">
                    <Link @click="showOutput(scope.data.name)">预览</Link>
                    |
                    <Link @click="downloadOutput(scope.data.name)">下载</Link>
                </div>
            </template>
            <template v-slot:body-delete="scope">
                <InputButton v-if="scope.data.notUpload" :process="scope.data.process" type="success"
                             @click="upload(scope.data)">
                    上传
                </InputButton>
                <InputButton type="error" @click="deleteTest(scope.data)">删除</InputButton>
            </template>
        </Table>
        <div style="display: grid; place-items: center">
            <InputButton @click="showAddFileDialog = true">添加测试数据</InputButton>
        </div>
        <Dialog v-model="showTestDialog" title="预览部分数据">
            <div style="width: 800px">
                <MarkdownBlockCode :key='keyNum' :value="showValue"></MarkdownBlockCode>
            </div>
        </Dialog>
        <Dialog v-model="showAddFileDialog" title="新增数据">
            <div style="width: 800px; display: grid; place-items: center">
                <InputFile v-if="showAddFileDialog" placeholder="选择文件加入暂存" :multiple="true" v-model="templateFileList"></InputFile>
                <InputButton @click="save">添加至暂存区域</InputButton>
            </div>
        </Dialog>
    </div>
</template>

<script>

export default {
    name: "Test",
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
                }, {
                    label: '操作',
                    value: 'delete'
                }
            ],
            tableData: [],

            showValue: null,
            keyNum: 0,
            fileDict: {},
            templateFileList: [],

            showTestDialog: false,
            showAddFileDialog: false
        }
    },
    created() {
        this.$problem.getTestList(this.problemId, res => {
            this.tableData = []
            for (let i = 0; i < res.length; i++) {
                this.tableData.push({
                    name: res[i],
                    notUpload: false,
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
        deleteTest(test) {
            if (test.notUpload) {
                this.fileDict[test.name] = null
            } else {
                this.$problem.removeTest(this.problemId, test.name)
            }
            let tmpTableData = []
            for (let i in this.tableData) {
                if (this.tableData[i].name !== test.name) {
                    tmpTableData.push(this.tableData[i])
                }
            }
            this.tableData = tmpTableData
        },
        upload(scope) {
            let index = this.tableData.findIndex(v => v.name === scope.name)
            if (index === -1) {
                return
            }
            this.$problem.addTest(this.problemId, scope.name, this.fileDict[scope.originalName], () => {
                this.$toast({
                    title: '成功',
                    text: '成功上传数据',
                    duration: 'auto',
                    type: 'success'
                })
                this.fileDict[scope.originalName] = null
                this.$set(this.tableData, index, {
                    name: scope.name,
                    notUpload: false,
                })
            }, proc => {
                this.$set(this.tableData, index, {
                    name: scope.name,
                    originalName: scope.originalName,
                    notUpload: true,
                    process: proc
                })
            }, (status) => {
                if (status) {
                    return
                }
                this.$set(this.tableData, index, {
                    name: scope.name,
                    originalName: scope.originalName,
                    notUpload: true,
                    process: null,
                })
            })
        },
        save() {
            for (let i = 0; i < this.templateFileList.length; ++i) {
                let name = this.templateFileList[i].name
                let fileSize = this.templateFileList[i].size
                if (fileSize > this.$common.maxRequestFileSize) {
                    this.$toast({
                        title: '过大的文件',
                        text: `文件 "${name}" 过大，当前大小为: ${fileSize}b`,
                        duration: 'auto',
                        type: 'error'
                    })
                    continue
                }
                name = name.split('.', 1)[0]
                this.fileDict[name] = this.templateFileList[i]
                this.tableData.push({
                    name: name,
                    originalName: name,
                    notUpload: true,
                })
            }
            this.templateFileList = []
            this.showAddFileDialog = false
        }
    }
}
</script>

<style scoped>

</style>