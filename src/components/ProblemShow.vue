<template>
    <div style="display: grid; place-items: center">
        <h1>{{ problemData.title }}</h1>
        <div style="text-align: left; width: 80%">
            <div style="display: grid; grid-template-columns: auto 1fr">
                <h3>
                    题目配置
                </h3>
                <InputSelect :data="languageSupport"
                             v-model="curLanguage"
                             placeholder="将会使用的语言"
                             @change="initLimit">
                </InputSelect>
            </div>
            <div class="text-area problem-attribute" style="text-align: center">
                <!--                <div></div>-->
                <Tag type="success">时间限制: {{ timeLimit }}s</Tag>
                <Tag type="success">内存限制: {{ memoryLimit }}MB</Tag>
                <Tag :type="problemData.statusType === 'NORMAL' ? 'success' : 'error'">
                    当前状态:
                    <template v-if="problemStatusType[problemData.statusType]">
                        {{ problemStatusType[problemData.statusType].text }}
                    </template>
                </Tag>

                <Tag type="success">题面类型:
                    <template v-if="problemType[problemData.type]">
                        {{ problemType[problemData.type].text }}
                    </template>
                </Tag>
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
                输入(最左侧为行号)
                <MarkdownBlockCode class="text-area" :value="example.in"></MarkdownBlockCode>
                输出(最左侧为行号)
                <MarkdownBlockCode class="text-area" :value="example.out"></MarkdownBlockCode>
            </div>
            <h3>
                判题系统
            </h3>
            <div class="text-area">
                {{ judgeCodeType[problemData.judgeCodeType].text }}
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr">
                <h3>
                    提交你的答案
                </h3>
                <InputSelect :data="languageSupport"
                             v-model="curLanguage"
                             placeholder="将会使用的语言"
                             @change="initLimit">
                </InputSelect>
            </div>
            <div style="border: 1px solid var(--border-color-level-1)">
                <InputCode mode="text/x-c++src" placeholder="请输入需要提交的代码" @change="updateCode"></InputCode>
            </div>
            <InputButton @click="submit">提交</InputButton>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProblemShow",
    props: {
        id: Number,
        contestId: {
            type: Number,
            default: null
        },
        problemData: {
            type: Object,
            default: () => {
                return {
                    acceptCount: 0,
                    accessType: "PUBLIC",
                    contestId: 0,
                    defaultMemoryLimit: 0,
                    defaultTimeLimit: 0,
                    description: "",
                    example: [
                        {
                            in: "",
                            out: ""
                        }
                    ],
                    gmtModifyTime: "",
                    id: 0,
                    input: "",
                    judgeCode: "",
                    judgeCodeType: "ALL_SAME",
                    output: "",
                    owner: 0,
                    ownerHandle: "",
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
                    statusType: "NORMAL",
                    submissionCount: 0,
                    supportLanguage: [
                        "C11"
                    ],
                    title: "",
                    type: "STANDARD",
                    version: 0
                }
            },
        }
    },
    data() {
        return {
            curLanguage: '',
            languageSupport: [],
            timeLimit: 0,
            memoryLimit: 0,

            description: '',
            input: '',
            output: '',

            languageType: {},
            judgeCodeType: {},
            problemType: {},
            problemStatusType: {},

            submitCode: '123',
        }
    },
    created() {
        this.$common.getEnum('JudgeCodeType', res => this.judgeCodeType = res)
        this.$common.getEnum('ProblemType', res => this.problemType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.$common.getEnum('LanguageType', res => {
            this.languageType = res
            for (let i in this.problemData.supportLanguage) {
                let cur = this.problemData.supportLanguage[i]
                this.languageSupport.push({
                    label: this.languageType[cur].text,
                    value: cur
                })
            }
            this.description = this.$markdown(this.problemData.description)
            this.input = this.$markdown(this.problemData.input)
            this.output = this.$markdown(this.problemData.output)
        })
        this.initLimit()
    },
    methods: {
        initLimit() {
            this.timeLimit = this.getTimeLimit()
            this.memoryLimit = this.getMemoryLimit()
        },
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
        updateCode(v) {
            this.submitCode = v
        },
        submit() {
            if (this.languageSupport.findIndex(value => value.value === this.curLanguage) === -1) {
                this.$toast({
                    title: '错误',
                    text: '请选择需要提交的语言',
                    duration: 'auto',
                    type: 'error'
                })
                return
            }
            if (this.contestId) {
                this.$contest.submit(this.contestId, this.problemData.id, this.submitCode, this.curLanguage, res => {
                    this.$router.push({name: 'contest-solution', params: {solutionId: res}})
                })
            } else {
                this.$problem.submit(this.problemData.id, this.submitCode, this.curLanguage, res => {
                    this.$router.push({name: 'solution', params: {solutionId: res}})
                })
            }
        }
    }
}
</script>

<style scoped>
.text-area {
    margin-left: 30px;
}

.problem-attribute {
    display: grid;
    grid-gap: 3px;
    grid-template-columns: repeat(4, 1fr);
}

</style>