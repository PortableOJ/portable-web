<template>
    <div style="display: grid; place-items: center">
        <h1>{{ problemData.title }}</h1>
        <div style="text-align: left; width: 80%">
            <div style="display: grid; grid-template-columns: auto 1fr">
                <h3>
                    题目配置
                </h3>
                <InputSelect :data="languageSupport"
                             :value="curLanguage"
                             placeholder="将会使用的语言">
                </InputSelect>
            </div>
            <div class="text-area problem-attribute">
                <div>时间限制: {{ getTimeLimit() }}s</div>
                <div>内存限制: {{ getMemoryLimit() }}MB</div>
                <div>当前状态: {{ problemStatusType[problemData.statusType].text }}</div>
                <div>访问权限: {{ problemAccessType[problemData.accessType].text }}</div>
                <div>通过/提交: {{ problemData.acceptCount }} / {{ problemData.submissionCount }}</div>
                <div>题面类型: {{ problemType[problemData.type].text }}</div>
            </div>
            <h3>
                题面描述
            </h3>
            <div class="text-area" v-html="description">
            </div>
            <h3>
                输入格式
            </h3>
            <div class="text-area" v-html="input">
            </div>
            <h3>
                输出格式
            </h3>
            <div class="text-area" v-html="output">
            </div>
            <h3>
                样例
            </h3>
            <div v-for="(example, index) in problemData.example" :key="example.in">
                <h4>第 {{ index + 1 }} 组</h4>
                <InputTextarea title="输入" :code-mode="true" :read-only="true" v-model="example.in">
                </InputTextarea>
                <InputTextarea title="输出" :code-mode="true" :read-only="true" v-model="example.out">
                </InputTextarea>
            </div>
            <h3>
                判题系统
            </h3>
            <div class="text-area">
                {{ judgeCodeType[problemData.judgeCodeType].text }}
            </div>
            <h3>
                提交你的答案
            </h3>
            <div>
                <InputTextarea :code-mode="true" v-model="submitCode"></InputTextarea>
            </div>
            <InputButton @click="submit">提交</InputButton>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProblemShow",
    props: {
        id: Number
    },
    data() {
        return {
            problemId: this.id,
            curLanguage: '',
            problemData: {
                acceptCount: 0,
                accessType: "HIDDEN",
                contestId: 0,
                defaultMemoryLimit: 0,
                defaultTimeLimit: 0,
                description: "string",
                example: [
                    {
                        in: "string",
                        out: "string"
                    }
                ],
                gmtModifyTime: "2022-01-28T13:26:56.329Z",
                id: 0,
                input: "string",
                judgeCode: "string",
                judgeCodeType: "ALL_SAME",
                output: "string",
                owner: 0,
                shareTest: true,
                specialMemoryLimit: {
                    additionalProp1: 0,
                    additionalProp2: 0,
                    additionalProp3: 0
                },
                specialTimeLimit: {
                    additionalProp1: 0,
                    additionalProp2: 0,
                    additionalProp3: 0
                },
                statusType: "CHECKING",
                submissionCount: 0,
                supportLanguage: [
                    "C11"
                ],
                title: "string",
                type: "STANDARD",
                version: 0
            },
            languageSupport: [],

            description: '',
            input: '',
            output: '',

            languageType: {},
            problemAccessType: {},
            problemStatusType: {},
            judgeCodeType: {},
            problemType: {},

            submitCode: '',
        }
    },
    created() {
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.$common.getEnum('JudgeCodeType', res => this.judgeCodeType = res)
        this.$common.getEnum('ProblemType', res => this.problemType = res)
        // 可以并行但没必要.jpg
        this.$common.getEnum('LanguageType', res => {
            this.languageType = res
            this.$problem.getProblemData(this.problemId, res => {
                this.problemData = res
                if (!res) {
                    return
                }
                for (let i in res.supportLanguage) {
                    let cur = res.supportLanguage[i]
                    this.languageSupport.push({
                        label: this.languageType[cur].text,
                        value: cur
                    })
                }
                this.description = this.$markdown(res.description)
                this.input = this.$markdown(res.input)
                this.output = this.$markdown(res.output)
            })
        })
    },
    methods: {
        getTimeLimit() {
            let t = this.problemData.specialTimeLimit[this.curLanguage]
            if (t) return t
            return this.problemData.defaultTimeLimit
        },
        getMemoryLimit() {
            let t = this.problemData.specialMemoryLimit[this.curLanguage]
            if (t) return t
            return this.problemData.defaultMemoryLimit
        },
        submit() {
            // TODO
        }
    }
}
</script>

<style scoped>
.text-area {
    margin-left: 30px
}

.problem-attribute {
    display: grid;
    grid-gap: 3px;
    grid-template-columns: repeat(6 , 1fr);
}

.problem-attribute > div {
    border-radius: 5px;
    border: 1px dotted var(--brand-color);
}
</style>