<template>
    <div>
        <div v-if="problemData !== null" style="text-align: left">
            <h3>
                标题
            </h3>
            <InputText style="width: auto" v-model="problemData.title"></InputText>
            <h3>
                题面描述
            </h3>
            <MarkdownEdit v-model="problemData.description"></MarkdownEdit>
            <h3>
                输入格式
            </h3>
            <MarkdownEdit v-model="problemData.input"></MarkdownEdit>
            <h3>
                输出格式
            </h3>
            <MarkdownEdit v-model="problemData.output"></MarkdownEdit>
            <div style="display: grid; grid-template-columns: auto 1fr">
                <h3>
                    样例
                </h3>
                <!--suppress JSUnresolvedVariable -->
                <InputButton @click="problemData.example.push({in: '', out: '', hash: hashCode++})">新增一组</InputButton>
            </div>
            <div ref="example" v-for="(example, index) in problemData.example" :key="example.hash" class="test-data">
                <div style="display: grid; grid-template-columns: auto 1fr">
                    <h4>第 {{ index + 1 }} 组</h4>
                    <InputButton @click="deleteExample(index)">删除本组</InputButton>
                </div>
                输入
                <InputTextarea v-model="example.in"></InputTextarea>
                输出
                <InputTextarea v-model="example.out"></InputTextarea>
            </div>
        </div>
        <div style="display: grid; place-items: center">
            <InputButton @click="saveContent">保存题面内容</InputButton>
        </div>
    </div>
</template>

<script>
export default {
    name: "Content",
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,

            hashCode: 0,
        }
    },
    created() {
        if (this.problemId !== 0) {
            this.$problem.getProblemData(this.problemId, res => {
                this.problemData = res
                for (let i in this.problemData.example) {
                    this.problemData.example[i].hash = this.hashCode
                    this.hashCode++
                }
            })
        } else {
            this.problemData = {
                example: []
            }
        }
    },
    methods: {
        deleteExample(index) {
            this.problemData.example.splice(index, 1)
        },
        saveContent() {
            let callback = () => {
                this.$toast({
                    title: '成功',
                    text: '更新题目内容成功',
                    duration: 'auto',
                    type: 'success'
                })
            }
            if (this.problemId === 0) {
                this.$problem.newProblem(this.problemData, res => {
                    this.problemId = res
                    this.$router.push({name: 'problemManager', params: {problemId: res.toString()}})
                    location.reload()
                    callback()
                })
            } else {
                this.$problem.updateContent(this.problemData, callback)
            }
        }
    }
}
</script>

<style scoped>
.test-data {
    margin-top: 10px;
    margin-left: 30px;
    padding: 5px 10px;
    border-radius: 15px;
    border: 1px solid var(--brand-color);
}

</style>