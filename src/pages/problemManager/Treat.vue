<template>
    <div style="display: grid; place-items: center">
        <h3>当前状态：{{
                this.problemData && problemStatusType[this.problemData.statusType] ?
                    problemStatusType[this.problemData.statusType].text : '未知'
            }}</h3>
        <InputButton v-if="problemId !== 0" type="warning" @click="treatAndCheck">
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
        if (this.problemId !== 0) {
            this.$problem.getProblemData(this.problemId, res => {
                this.problemData = res
            })
        }
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
    },
    methods: {
        treatAndCheck() {
            this.$problem.treatAndCheckProblem(this.problemId, () => {
                this.$toast({
                    title: '成功',
                    text: '操作成功，请稍后再来查看状态',
                    duration: 'auto',
                    type: 'success'
                })
            })
        }
    }
}
</script>

<style scoped>

</style>