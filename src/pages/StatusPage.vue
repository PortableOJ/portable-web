<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <StatusShow :content-id="null" :only-this-user-id="curUserId" :select-status-type="statusTypeSelect"></StatusShow>
        </div>
        <div>
            <UserCard></UserCard>
            <div class="card">
                <span class="card-title">过滤选项</span>
                <InputCheckbox v-if="onLogin" @change="changeOnlyMe" v-model="onlyMe">仅显示我的提交</InputCheckbox>
                <InputSelect placeholder="状态过滤" class="card-input" v-model="statusTypeSelect" :data="solutionStatusTypeList"></InputSelect>
<!--                <InputSelect placeholder="语言过滤" class="card-input" v-model="languageTypeSelect" :data="languageTypeList"></InputSelect>-->
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import StatusShow from "@/components/StatusShow";

export default {
    name: "StatusPage",
    components: {
        StatusShow,
        UserCard
    },
    data() {
        return {
            onLogin: false,
            onlyMe: false,
            curUserId: null,
            statusTypeSelect: null,
            languageTypeSelect: null,

            solutionStatusType: {},
            solutionStatusTypeList: [],
            languageType: {},
            languageTypeList: [],
        }
    },
    created() {
        this.onLogin = this.$user.isLogin()
        let queryUserId = this.$common.getQueryInt(this, 'userId', null)
        if (this.onLogin && queryUserId === this.$user.getCurUserId()) {
            this.onlyMe = true
            this.curUserId = this.$user.getCurUserId()
        } else {
            this.curUserId = null
        }
        this.statusTypeSelect = this.$common.getQueryString(this, 'statusType', null)

        this.$common.getEnum('SolutionStatusType', res => {
            this.solutionStatusType = res
            this.solutionStatusTypeList = []
            this.solutionStatusTypeList.push({
                label: '不过滤',
                value: null
            })
            for (let i in res) {
                this.solutionStatusTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
        this.$common.getEnum('LanguageType', res => {
            this.languageType = res
            this.languageTypeList = []
            this.languageTypeList.push({
                label: '不过滤',
                value: null
            })
            for (let i in res) {
                this.languageTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
    },
    methods: {
        changeOnlyMe() {
            if (this.onlyMe) {
                this.curUserId = this.$user.getCurUserId()
            } else {
                this.curUserId = null
            }
        }
    }
}
</script>

<style scoped>

</style>