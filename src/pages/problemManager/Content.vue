<template>
    <div>
        <div v-if="problemData !== null" class="form-box">
            <div>
                标题
            </div>
            <InputText style="width: auto" v-model="problemData.title"></InputText>
            <div>
                题面描述
            </div>
            <MarkdownEdit v-model="problemData.description" min-height="120"></MarkdownEdit>
            <div>
                输入格式
            </div>
            <MarkdownEdit v-model="problemData.input" min-height="120"></MarkdownEdit>
            <div>
                输出格式
            </div>
            <MarkdownEdit v-model="problemData.output" min-height="120"></MarkdownEdit>
            <div>
                样例
            </div>
            <div>
                <div ref="example" v-for="(example, index) in problemData.example" :key="example.hash"
                     class="test-data">
                    <div style="display: grid; grid-template-columns: auto 1fr">
                        <h4>第 {{ index + 1 }} 组</h4>
                        <InputButton @click="deleteExample(index)" type="warning">删除本组</InputButton>
                    </div>
                    <div class="example">
                        <div style="display: grid; place-items: center right">
                            输入
                        </div>
                        <InputTextarea style="overflow: auto" v-model="example.in"></InputTextarea>
                    </div>
                    <div class="example">
                        <div style="display: grid; place-items: center right">
                            输出
                        </div>
                        <InputTextarea style="overflow: auto" v-model="example.out"></InputTextarea>
                    </div>
                    <div class="example">
                        <div style="display: grid; place-items: center right">
                            提示
                        </div>
                        <MarkdownEdit v-model="example.hint" min-height="60"></MarkdownEdit>
                    </div>
                </div>
                <InputButton type="success" @click="problemData.example.push({in: '', out: '', hash: hashCode++})">
                    新增一组
                </InputButton>
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
            if (this.problemId === 0) {
                this.$problem.newProblem(this.problemData, res => {
                    this.problemId = res
                    this.$router.replace({name: 'problemManager-content', params: {problemId: res.toString()}})
                    this.$toast({
                        title: '成功',
                        text: '成功创建题目',
                        duration: 'auto',
                        type: 'success'
                    })
                })
            } else {
                this.$problem.updateContent(this.problemData, () => {
                    this.$toast({
                        title: '成功',
                        text: '更新题目内容成功',
                        duration: 'auto',
                        type: 'success'
                    })
                })
            }
        }
    }
}
</script>

<style scoped>
.test-data {
    margin-top: 10px;
    padding: 5px 10px;
    border-radius: 15px;
    border: 1px solid var(--border-color-level-1);
}

.test-data:hover {
    border: 1px solid var(--brand-color);
}

.example {
    display: grid;
    grid-template-columns: minmax(50px, auto) 1fr;
    grid-column-gap: 20px;
}
</style>