<template>
    <div style="display: grid; place-items: center; width: 100%;">
        <div v-if="contestData" class="form" style="width: 100%;">
            <div>
                <h3>标题</h3>
                <InputText :read-only="notOwner" style="width: 100%" v-model="contestData.title"></InputText>
            </div>
            <div>
                <h3>开始时间</h3>
                <InputDateTime :read-only="notOwner" v-model="contestData.startTime"></InputDateTime>
            </div>
            <div>
                <h3>持续时间(分钟)</h3>
                <InputText :read-only="notOwner" :type="'number'" v-model="contestData.duration"></InputText>
            </div>
            <div>
                <h3>访问权限</h3>
                <InputSelect :disabled="contestId !== 0 || notOwner" v-model="contestData.accessType"
                             :data="contestAccessTypeList"></InputSelect>
            </div>
            <div v-if="contestData.accessType === 'PASSWORD'">
                <h3>密码</h3>
                <InputText :read-only="notOwner" v-model="contestData.password"></InputText>
            </div>
            <div>
                <h3>封榜时间(分钟)</h3>
                <InputText :read-only="notOwner" v-model="contestData.freezeTime"></InputText>
            </div>
            <div>
                <h3>惩罚时间(分钟)</h3>
                <InputText :read-only="notOwner" v-model="contestData.penaltyTime"></InputText>
            </div>
            <div>
                <h3>共同出题人</h3>
                <div>
                    <template v-for="handle in contestData.coAuthor">
                        <InputCheckbox :read-only="notOwner" @change="deleteCoAuthor(handle)" :value="true"
                                       :key="handle">
                            {{ handle }}
                        </InputCheckbox>
                    </template>
                </div>
                <h3>添加邀请</h3>
                <div style="display: grid; grid-template-columns: 1fr auto">
                    <InputText :read-only="notOwner" v-model="templateCoAuthor"
                               :placeholder="'用户的昵称，使用空格分割多个昵称'"></InputText>
                    <InputButton :disabled="notOwner" @click="addCoAuthor">添加</InputButton>
                </div>
            </div>
            <div v-if="contestData.accessType === 'PRIVATE'">
                <h3>邀请列表</h3>
                <div>
                    <template v-for="handle in contestData.inviteUserSet">
                        <InputCheckbox :read-only="notOwner" @change="deleteInvite(handle)" :value="true" :key="handle">
                            {{ handle }}
                        </InputCheckbox>
                    </template>
                </div>
                <h3>添加邀请</h3>
                <div style="display: grid; grid-template-columns: 1fr auto">
                    <InputText :read-only="notOwner" v-model="templateInvite"
                               :placeholder="'用户的昵称，使用空格分割多个昵称'"></InputText>
                    <InputButton :disabled="notOwner" @click="addInvite">添加</InputButton>
                </div>
            </div>
            <div style="display: block">
                <h3>题目</h3>
                <!--suppress JSValidateTypes -->
                <Table :head="tableHead" :data="problemList" ref="problemTable">
                    <template v-slot:body-title="scope">
                        <Link @click="openProblem(scope.data.id)">{{ scope.data.title }}</Link>
                    </template>
                    <template v-slot:body-status="scope">
                        {{ problemStatusType[scope.data.status].text }}
                    </template>
                    <template v-slot:body-accessType="scope">
                        {{ problemAccessType[scope.data.accessType].text }}
                    </template>
                    <template v-slot:body-lock="scope">
                        <i v-show="scope.data.lock !== null" :class="{'iconfont': true, 'icon-success': scope.data.lock, 'icon-error': !scope.data.lock}"></i>
                    </template>
                    <template v-slot:body-operator="scope">
                        <InputButton :disabled="scope.data.id === 0 || notOwner" style="width: 30px; height: 30px"
                                     @click="up(scope.data.id)">
                            <i class="iconfont icon-up"></i>
                        </InputButton>
                        <InputButton :disabled="scope.data.id === problemList.length - 1 || notOwner"
                                     style="width: 30px; height: 30px" @click="down(scope.data.id)">
                            <i class="iconfont icon-down"></i>
                        </InputButton>
                        <InputButton :disabled="notOwner" :type="'warning'" @click="deleteProblem(scope.data.id)">
                            删除
                        </InputButton>
                    </template>
                </Table>
                <h3>添加题目</h3>
                <div style="display: grid; grid-template-columns: auto 1fr auto">
                    <InputCheckbox @change="clearSearchKey" :disabled="notOwner" v-model="usePublic">启用公开题库</InputCheckbox>
                    <InputSelect @search="changeSearchKey"
                                 style="width: 100%"
                                 :data="searchProblemList"
                                 :placeholder="usePublic ? '键入来搜索公开题库' : '键入来搜索私有题库'"
                                 v-model="selectedProblem"
                    >
                    </InputSelect>
                    <InputButton @click="addProblem">添加</InputButton>
                </div>
            </div>
            <div style="display: block">
                <h3>公告</h3>
                <MarkdownEdit :read-only="notOwner" style="width: 100%" v-model="contestData.announcement"></MarkdownEdit>
            </div>
        </div>
        <InputButton @click="save">保存</InputButton>
    </div>
</template>

<script>
export default {
    name: "Manager",
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
            contestData: null,
            templateCoAuthor: '',
            templateInvite: '',
            tableHead: [
                {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '标题',
                    value: 'title',
                    width: '200',
                }, {
                    label: '当前状态',
                    value: 'status',
                    width: '50',
                }, {
                    label: '访问权限',
                    value: 'accessType',
                    width: '50',
                }, {
                    label: '锁定状态',
                    value: 'lock',
                    width: '30',
                }, {
                    label: '操作',
                    value: 'operator',
                    width: '200'
                }
            ],
            problemList: [],
            notOwner: true,

            // 添加问题
            usePublic: false,
            searchProblemList: [],
            selectedProblem: null,
            searchInterval: null,
            searchKeyword: '',
            lastSearchKeyword: null,

            contestAccessType: {},
            contestAccessTypeList: [],
            problemAccessType: {},
            problemStatusType: {},
        }
    },
    created() {
        if (this.contestId !== 0) {
            this.$contest.getContestDataAdmin(this.contestId, res => {
                this.contestData = res
                let startTime = new Date(this.contestData.startTime)
                this.contestData.startTime = startTime.format("yyyy-MM-ddThh:mm")
                this.problemList = res.problemList
                for (let i = 0; i < res.problemList.length; i++) {
                    // noinspection JSUnresolvedVariable
                    this.problemList[i].lock = res.problemLock[i]
                    // noinspection JSUnresolvedVariable
                    this.problemList[i].realId = res.problemRealId[i]
                }
                this.notOwner = res.ownerHandle !== this.$user.getCurUserHandle()
            })
        } else {
            this.contestData = {
                id: null,
                accessType: 'PUBLIC',
                announcement: '',
                coAuthor: [],
                duration: 0,
                freezeTime: 0,
                inviteUserSet: [],
                password: '',
                penaltyTime: 0,
                problemList: [],
                startTime: '2022-03-01T05:23',
                title: ''
            }
            this.notOwner = false
        }
        this.$common.getEnum('ContestAccessType', res => {
            this.contestAccessType = res
            this.contestAccessTypeList = []
            for (let i in res) {
                this.contestAccessTypeList.push({
                    label: res[i].text,
                    value: i
                })
            }
        })
        this.$common.getEnum('ProblemAccessType', res => this.problemAccessType = res)
        this.$common.getEnum('ProblemStatusType', res => this.problemStatusType = res)
        this.searchInterval = setInterval(() => {
            this.searchProblem()
        }, 1000)
    },
    methods: {
        deleteCoAuthor(handle) {
            let ind = this.contestData.coAuthor.indexOf(handle)
            this.contestData.coAuthor.splice(ind, 1)
        },
        addCoAuthor() {
            if (this.templateCoAuthor && this.templateCoAuthor.length > 0) {
                let templateList = this.templateCoAuthor.split(' ')
                for (let i = 0; i < templateList.length; ++i) {
                    // noinspection JSUnresolvedVariable
                    this.contestData.coAuthor.push(templateList[i])
                }
                this.templateCoAuthor = ''
            } else {
                this.$toast({
                    title: '失败',
                    text: '请输入一个名称，若需要快速添加多个，可以通过空格分割多个昵称',
                    duration: 'auto',
                    type: 'error'
                })
            }
        },
        deleteInvite(handle) {
            // noinspection JSUnresolvedVariable
            let ind = this.contestData.inviteUserSet.indexOf(handle)
            // noinspection JSUnresolvedVariable
            this.contestData.inviteUserSet.splice(ind, 1)
        },
        addInvite() {
            if (this.templateInvite && this.templateInvite.length > 0) {
                let templateList = this.templateInvite.split(' ')
                for (let i = 0; i < templateList.length; ++i) {
                    // noinspection JSUnresolvedVariable
                    this.contestData.inviteUserSet.push(templateList[i])
                }
                this.templateInvite = ''
            } else {
                this.$toast({
                    title: '失败',
                    text: '请输入一个名称，若需要快速添加多个，可以通过空格分割多个昵称',
                    duration: 'auto',
                    type: 'error'
                })
            }
        },
        openProblem(id) {
            this.$router.push({
                name: 'contest-problem',
                params: {
                    contestId: this.contestId.toString(),
                    problemIndex: id,
                }
            })
        },
        up(id) {
            for (let i = 0; i < this.problemList.length; i++) {
                if (this.problemList[i].id === id) {
                    this.problemList[i].id -= 1
                } else if (this.problemList[i].id === id - 1) {
                    this.problemList[i].id += 1
                }
            }
            this.problemList.sort((a, b) => a.id - b.id)
        },
        down(id) {
            for (let i = 0; i < this.problemList.length; i++) {
                if (this.problemList[i].id === id) {
                    this.problemList[i].id += 1
                } else if (this.problemList[i].id === id + 1) {
                    this.problemList[i].id -= 1
                }
            }
            this.problemList.sort((a, b) => a.id - b.id)
        },
        deleteProblem(id) {
            let index = this.problemList.findIndex(t => t.id === id)
            this.problemList.splice(index, 1)
            for (let i = 0; i < this.problemList.length; i++) {
                this.problemList[i].id = i
            }
        },
        changeSearchKey(keyword) {
            this.searchKeyword = keyword
        },
        clearSearchKey() {
            this.searchProblemList = []
            this.lastSearchKeyword = null
            this.searchKeyword = ''
        },
        searchProblem() {
            if (this.searchKeyword === this.lastSearchKeyword) {
                return
            }
            let reduceProblemList = res => {
                this.searchProblemList = []
                for (let i = 0; i < res.length; i++) {
                    this.searchProblemList.push({
                        label: res[i].title,
                        value: res[i].id,
                        status: res[i].status,
                        accessType: res[i].accessType,
                    })
                }
            }
            if (this.usePublic) {
                this.$problem.searchProblem(this.searchKeyword, reduceProblemList)
            } else {
                this.$problem.searchPrivateProblem(this.searchKeyword, reduceProblemList)
            }
            this.lastSearchKeyword = this.searchKeyword
        },
        addProblem() {
            if (this.notOwner) {
                this.$contest.addProblem(this.contestId, this.selectedProblem, () => {
                    this.$toast({
                        title: '成功',
                        text: '增加题目成功',
                        duration: 'auto',
                        type: 'success'
                    })
                })
            } else {
                let item = this.searchProblemList.find(t => t.value === this.selectedProblem)
                this.problemList.push({
                    id: this.problemList.length,
                    realId: item.value,
                    title: item.label,
                    status: item.status,
                    accessType: item.accessType,
                    lock: null,
                })
            }
        },
        save() {
            this.contestData.problemList = []
            for (let i = 0; i < this.problemList.length; i++) {
                this.contestData.problemList.push(this.problemList[i].realId)
            }
            if (this.contestId === 0) {
                this.$contest.newContest(this.contestData, id => {
                    this.$toast({
                        title: '成功',
                        text: '创建成功',
                        duration: 'auto',
                        type: 'success'
                    })
                    this.$router.replace({name: 'contest-manager', params: {contestId: id}})
                })
            } else {
                this.$contest.updateContest(this.contestData, () => {
                    this.$toast({
                        title: '成功',
                        text: '更新成功，部分不允许更新项已经回滚至修改前',
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
.form > div {
    display: grid;
    grid-template-columns: 20% 80%;
    place-items: center;
    border-bottom: 1px solid var(--brand-color);
}
</style>