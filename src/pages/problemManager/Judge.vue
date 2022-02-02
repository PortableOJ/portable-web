<template>
    <div>
        <div v-if="problemData !== null"
             :class="{'diy': problemData.judgeCodeType === 'DIY', 'no-diy': problemData.judgeCodeType !== 'DIY'}">
            <InputSelect placeholder="选择使用的 judge 代码"
                         v-model="problemData.judgeCodeType"
                         :data="judgeCodeTypeList"></InputSelect>
            <div v-show="problemData.judgeCodeType === 'DIY'" style="margin-top: 30px">
                请在此处键入自定义的 Judge 代码
                <InputTextarea style="width: 100%"
                               :min-height="100"
                               v-model="problemData.judgeCode">
                </InputTextarea>
            </div>
        </div>
        <div class="no-diy">
            <InputButton @click="save">保存</InputButton>
        </div>
        <Link style="margin-top: 50px" @click="openHelp">
            关于本页面的帮助，请前往 PortableTestLib
        </Link>
    </div>
</template>

<script>
export default {
    name: "Judge",
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,

            judgeCodeType: {},
            judgeCodeTypeList: []
        }
    },
    created() {
        this.$common.getEnum('JudgeCodeType', res => {
            this.judgeCodeType = res
            this.judgeCodeTypeList = []
            for (let key in res) {
                this.judgeCodeTypeList.push({
                    label: res[key].text,
                    value: key
                })
            }
        })
        if (this.problemId !== 0) {
            this.$problem.getProblemData(this.problemId, res => {
                this.problemData = res
            })
        }
    },
    methods: {
        openHelp() {
            window.open('https://github.com/ZJGSU-TTCM/portable-testlib', '_blank')
        },
        save() {
            this.$problem.updateJudge(this.problemData, () => {
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
</script>

<style scoped>
.diy {
    display: grid;
    grid-template-columns: auto 1fr;
}

.no-diy {
    display: grid;
    place-items: center;
}

</style>