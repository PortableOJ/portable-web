<template>
    <div style="display: grid; place-items: center">
        <h3>当前状态：{{
                this.problemData && problemStatusType[this.problemData.statusType] ?
                    problemStatusType[this.problemData.statusType].text : '未知'
            }}</h3>
        <!--suppress JSUnresolvedVariable -->
        <InputButton v-if="problemId !== 0" :disabled="!this.problemData || this.problemData.statusType === 'NORMAL'
                            || problemStatusType[this.problemData.statusType].onTreatedOrCheck"
                     type="warning"
                     @click="treatAndCheck">
            执行处理校验！
        </InputButton>
    </div>
</template>

<script>
export default {
    name: "Treat",
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,

            problemStatusType: {}
        }
    },
    created() {
        this.init()
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
    },
    methods: {
        init() {
            if (this.problemId !== 0) {
                this.$problem.getProblemData(this.problemId, res => {
                    this.problemData = res
                })
            }
        },
        treatAndCheck() {
            this.$problem.treatAndCheckProblem(this.problemId, () => {
                this.$toast({
                    title: '成功',
                    text: '操作成功，请稍后再来查看状态',
                    duration: 'auto',
                    type: 'success'
                })
                this.init()
            })
        }
    }
}
</script>

<style scoped>

</style>