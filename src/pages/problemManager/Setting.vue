<template>
    <div style="display: grid; place-items: center">
        <div v-if="problemData" class="form-box">
            <div>
                访问权限
            </div>
            <div>
                <InputSelect v-model="problemData.accessType" :data="problemAccessTypeList"></InputSelect>
            </div>
            <div>
                支持的语言
            </div>
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
            <div>
                资源限制
            </div>
            <div style="display: grid; place-items: center left; grid-template-columns: auto 200px 1fr;">
                <div>
                    默认时间限制(s):
                </div>
                <InputText placeholder="时间" style="width: 150px" type="number"
                           v-model="problemData.defaultTimeLimit"></InputText>
                <Link @click="showSpecialTime = true">特殊时间限制管理</Link>
                <div>
                    默认内存限制(MB):
                </div>
                <InputText placeholder="内存" style="width: 150px" type="number"
                           v-model="problemData.defaultMemoryLimit"></InputText>
                <Link @click="showSpecialMemory = true">特殊内存限制管理</Link>
            </div>
            <div>
                是否允许下载样例
            </div>
            <div>
                <InputCheckbox v-model="problemData.shareTest">
                    {{ problemData.shareTest ? '是' : '否' }}
                </InputCheckbox>
            </div>
        </div>
        <InputButton @click="save">保存</InputButton>
        <Dialog v-model="showSpecialTime" title="特殊时间限制">
            <div>
                <span v-for="(value, language) in problemData.specialTimeLimit" :key="language">
                    <InputCheckbox type="success" @change="deleteTime(language)" :value="true">
                        当使用 {{ languageType[language].text }} 时，时间限制应为 {{ value }} s
                    </InputCheckbox>
                    <br>
                </span>
                <div class="special-add">
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
        </Dialog>
        <Dialog v-model="showSpecialMemory" title="特殊时间限制">
            <div>
                <span v-for="(value, language) in problemData.specialMemoryLimit" :key="language">
                    <InputCheckbox type="success" @change="deleteMemory(language)" :value="true">
                        当使用 {{ languageType[language].text }} 时，内存限制应为 {{ value }} MB
                    </InputCheckbox>
                </span>
                <div class="special-add">
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
        </Dialog>
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
            },

            showSpecialTime: false,
            showSpecialMemory: false,
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

.special-add {
    display: grid;
    grid-template-columns: repeat(6, auto);
    place-items: center left;
    margin-top: 150px;
}
</style>