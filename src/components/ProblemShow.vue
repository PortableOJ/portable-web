<template>
    <div style="display: grid; place-items: center">
        <h1>{{ problemData.title }}</h1>
        <div style="text-align: left; width: 80%;">
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
            <div class="example" v-for="(example, index) in problemData.example" :key="example.in">
                <div>
                    <div class="example-title">
                        输入 # {{ index + 1 }}
                        <Link @click="showHintId = index; showHint = true">展开</Link>
                    </div>
                    <MarkdownBlockCode class="example-copy" :show-line="false" :value="example.in"></MarkdownBlockCode>
                </div>
                <div>
                    <div class="example-title">
                        输出 # {{ index + 1 }}
                        <Link @click="showHintId = index; showHint = true">展开</Link>
                    </div>
                    <MarkdownBlockCode class="example-copy" :show-line="false" :value="example.out"></MarkdownBlockCode>
                </div>
            </div>
            <h3>
                判题系统
            </h3>
            <div class="text-area">
                <Link v-if="judgeCodeType[problemData.judgeCodeType]" :disabled="problemData.judgeCodeType==='DIY'"
                      @click="openSTDJudge">
                    {{ judgeCodeType[problemData.judgeCodeType].text }}
                </Link>
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
            <div>
                <InputCode v-model="submitCode" mode="text/x-c++src" placeholder="请输入需要提交的代码"></InputCode>
            </div>
            <InputButton @click="submit">提交</InputButton>
            <Dialog v-model="showHint" :title="`样例 # ${showHintId + 1}`">
                <div class="example" style="width: 800px; max-height: 500px">
                    <div>
                        <div class="example-title">输入</div>
                        <MarkdownBlockCode class="example-copy" :show-line="false"
                                           :value="problemData.example[showHintId].in"></MarkdownBlockCode>
                    </div>
                    <div>
                        <div class="example-title">输出</div>
                        <MarkdownBlockCode class="example-copy" :show-line="false"
                                           :value="problemData.example[showHintId].out"></MarkdownBlockCode>
                    </div>
                </div>
                <div v-if="problemData.example[showHintId].hint">
                    <div class="example-title">提示</div>
                    <div class="text-area" v-html="markedHint(problemData.example[showHintId].hint)"></div>
                </div>
            </Dialog>
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

            submitCode: '',

            showHint: false,
            showHintId: 0,
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
        })
        this.description = this.$markdown(this.problemData.description)
        this.input = this.$markdown(this.problemData.input)
        this.output = this.$markdown(this.problemData.output)
        this.curLanguage = this.$common.getCache('lastLanguage')
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
            this.$common.setCache('lastLanguage', this.curLanguage, 60 * 24 * 30)
        },
        openSTDJudge() {
            window.open(`https://github.com/PortableOJ/portable-testlib/blob/master/standard/${this.problemData.judgeCodeType}.cpp`, '_blank')
        },
        markedHint(hint) {
            return this.$markdown(hint)
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

.example {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
}

.example-title {
    text-align: center;
    font-weight: bolder;
}

</style>