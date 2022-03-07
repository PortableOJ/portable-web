<template>
    <div style="display: grid; place-items: center">
        <div v-if="problemData" class="form">
            <div>
                <h3>访问权限</h3>
                <InputSelect v-model="problemData.accessType" :data="problemAccessTypeList"></InputSelect>
            </div>
            <div>
                <h3>支持的语言</h3>
                <div>
                    <template v-for="(value, language) in languageType">
                        <InputCheckbox @change="() => {
                            if (!supportLanguageStatus[language]) {
                                deleteTime(language)
                                deleteMemory(language)
                            }
                        }" v-model="supportLanguageStatus[language]" :key="language">
                            {{ value.text }}
                        </InputCheckbox>
                    </template>
                </div>
            </div>
            <div>
                <h3>默认的时间限制(s)</h3>
                <InputText type="number" v-model="problemData.defaultTimeLimit"></InputText>
            </div>
            <div>
                <h3>默认的内存限制(MB)</h3>
                <InputText type="number" v-model="problemData.defaultMemoryLimit"></InputText>
            </div>
            <div>
                <h3>为特定的语言设置时间限制</h3>
                <div class="special">
                    <span>当使用</span>
                    <InputSelect placeholder="语言" style="width: 200px" v-model="templateTimeLimit.language"
                                 :data="languageTypeList"></InputSelect>
                    <span>时，时间限制应为</span>
                    <InputText placeholder="时间限制" type="number" style="width: 100px"
                               v-model="templateTimeLimit.value"></InputText>
                    <span>s</span>
                    <InputButton @click="addSpecialTime">新增/更新</InputButton>
        </div>
            </div>
            <div>
                <h3>现有的特定时间限制</h3>
                <div>
                    <span v-for="(value, language) in problemData.specialTimeLimit" :key="language">
                        <InputCheckbox @change="deleteTime(language)" :value="true">
                            当使用 {{ languageType[language].text }} 时，时间限制应为 {{ value }} s
                        </InputCheckbox>
                    </span>
                </div>
            </div>
            <div>
                <h3>为特定的语言设置内存限制</h3>
                <div class="special">
                    <span>当使用</span>
                    <InputSelect placeholder="语言" style="width: 200px" v-model="templateMemoryLimit.language"
                                 :data="languageTypeList"></InputSelect>
                    <span>时，内存限制应为</span>
                    <InputText placeholder="内存限制" type="number" style="width: 100px"
                               v-model="templateMemoryLimit.value"></InputText>
                    <span>MB</span>
                    <InputButton @click="addSpecialMemory">新增/更新</InputButton>
                </div>
            </div>
            <div>
                <h3>现有的特定内存限制</h3>
                <div>
                    <span v-for="(value, language) in problemData.specialMemoryLimit" :key="language">
                        <InputCheckbox @change="deleteMemory(language)" :value="true">
                            当使用 {{ languageType[language].text }} 时，内存限制应为 {{ value }} MB
                        </InputCheckbox>
                    </span>
                </div>
            </div>
            <div>
                <h3>是否允许下载样例</h3>
                <InputCheckbox v-model="problemData.shareTest">
                    {{ problemData.shareTest ? '是' : '否' }}
                </InputCheckbox>
            </div>
        </div>
        <InputButton @click="save">保存</InputButton>
    </div>
</template>

<script>
export default {
    name: "Setting",
    data() {
        return {
            problemId: parseInt(this.$route.params.problemId),
            problemData: null,

            problemAccessType: {},
            problemAccessTypeList: [],

            languageType: {},
            languageTypeList: [],
            supportLanguageStatus: {},

            templateTimeLimit: {
                language: '',
                value: 1
            },
            templateMemoryLimit: {
                language: '',
                value: 128
            }
        }
    },
    created() {
        this.$common.getEnum('ProblemAccessType', res => {
            this.problemAccessType = res
            this.problemAccessTypeList = []
            for (let key in res) {
                this.problemAccessTypeList.push({
                    label: res[key].text,
                    value: key
                })
                if (!this.supportLanguageStatus[key]) {
                    this.supportLanguageStatus[key] = false
                }
            }
        })
        this.$common.getEnum('LanguageType', res => {
            this.languageType = res
            this.languageTypeList = []
            for (let key in res) {
                this.languageTypeList.push({
                    label: res[key].text,
                    value: key
                })
            }
        })
        this.$problem.getProblemData(this.problemId, res => {
            this.problemData = res
            for (let i in res.supportLanguage) {
                this.supportLanguageStatus[res.supportLanguage[i]] = true
            }
        })
    },
    methods: {
        addSpecialTime() {
            if (!this.supportLanguageStatus[this.templateTimeLimit.language]) {
                this.$toast({
                    title: '失败',
                    text: '请选择一个允许提交的语言',
                    duration: 'auto',
                    type: 'error'
                })
                return
            }
            this.$set(this.problemData.specialTimeLimit, this.templateTimeLimit.language, this.templateTimeLimit.value)
        },
        deleteTime(language) {
            this.$delete(this.problemData.specialTimeLimit, language)
        },
        addSpecialMemory() {
            if (!this.supportLanguageStatus[this.templateMemoryLimit.language]) {
                this.$toast({
                    title: '失败',
                    text: '请选择一个允许提交的语言',
                    duration: 'auto',
                    type: 'error'
                })
                return
            }
            this.$set(this.problemData.specialMemoryLimit, this.templateMemoryLimit.language, this.templateMemoryLimit.value)
        },
        deleteMemory(language) {
            this.$delete(this.problemData.specialMemoryLimit, language)
        },
        save() {
            this.problemData.supportLanguage = []
            for (let i in this.supportLanguageStatus) {
                if (this.supportLanguageStatus[i]) {
                    this.problemData.supportLanguage.push(i)
                }
            }
            this.$problem.updateSetting(this.problemData, () => {
                this.$toast({
                    title: '成功',
                    text: '更新题目设置成功',
                    duration: 'auto',
                    type: 'success',
                })
            })
        }
    }
}
</script>

<style scoped>
.form > div {
    display: grid;
    grid-template-columns: 300px minmax(500px, 1fr);
    place-items: center;
    border-bottom: 1px solid var(--border-color-level-1);
}

.special {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto 1fr;
    place-items: center;
}
</style>