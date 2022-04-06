<template>
    <div style="display: grid; place-items: center; width: 100%;">
        <div v-if="contestData" class="form-box">
            <div>标题</div>
            <div>
                <InputText style="width: 500px" v-model="contestData.title"></InputText>
            </div>
            <div>时间</div>
            <div style="display: flex; place-items: center">
                <InputDateTime style="width: 200px"
                               :read-only="notOwner"
                               v-model="contestData.startTime">
                </InputDateTime>
                <div>至</div>
                <InputText style="width: 150px"
                           :disabled="true"
                           :value="new Date(contestData.startTime).add(contestData.duration).format('yyyy-MM-dd hh:mm')">
                </InputText>
                <div>，持续</div>
                <InputText style="width: 150px"
                           :read-only="notOwner"
                           :type="'number'"
                           v-model="contestData.duration">
                </InputText>
                <div>
                    分钟
                </div>
            </div>
            <div>访问权限</div>
            <div style="display: flex; place-items: center;">
                <InputSelect style="width: 200px"
                             :disabled="contestId !== 0"
                             v-model="contestData.accessType"
                             :data="contestAccessTypeList">
                </InputSelect>
                <div v-if="contestData.accessType === 'BATCH'">
                    批量用户组 ID
                </div>
                <div v-if="contestData.accessType === 'BATCH'">
                    <div style="display: grid; grid-template-columns: 250px 50px; place-items: center ">
                        <!--suppress JSUnresolvedVariable -->
                        <InputText style="width: 250px" :read-only="notOwner" v-model="contestData.batchId"></InputText>
                        <Link @click="checkBatch">校验</Link>
                    </div>
                </div>
                <div v-if="contestData.accessType === 'PASSWORD'">
                    密码
                </div>
                <div v-if="contestData.accessType === 'PASSWORD'">
                    <InputText :read-only="notOwner" v-model="contestData.password"></InputText>
                </div>
                <div v-if="contestData.accessType === 'PRIVATE'">
                    已邀请：
                </div>
                <div style="max-width: 300px; display: flex; overflow: auto; place-items: center"
                     v-if="contestData.accessType === 'PRIVATE'">
                    <template v-for="handle in contestData.inviteUserSet">
                        <InputCheckbox :read-only="notOwner" @change="deleteInvite(handle)" :value="true" :key="handle">
                            {{ handle }}
                        </InputCheckbox>
                    </template>
                </div>
                <div v-if="contestData.accessType === 'PRIVATE'">
                    <Link @click="showPrivateUserDialog = true">邀请更多</Link>
                </div>
            </div>
            <div>
                封榜时间(分钟)
            </div>
            <div>
                <InputText :read-only="notOwner" v-model="contestData.freezeTime"></InputText>
            </div>
            <div>
                惩罚时间(分钟)
            </div>
            <div>
                <InputText :read-only="notOwner" v-model="contestData.penaltyTime"></InputText>
            </div>
            <div>
                共同出题人
            </div>
            <div style="display: flex; place-items: center">
                <div style="display: flex; max-width: 500px; overflow: auto">
                    <template v-for="handle in contestData.coAuthor">
                        <InputCheckbox :read-only="notOwner" @change="deleteCoAuthor(handle)" :value="true"
                                       :key="handle">
                            {{ handle }}
                        </InputCheckbox>
                    </template>
                </div>
                <Link @click="showCoAuthorDialog = true">邀请更多</Link>
            </div>
        </div>
        <div v-if="contestData" style="width: 100%">
            <h1>题目</h1>
            <div style="display: grid; place-items: center;">
                <!--suppress JSValidateTypes -->
                <Table style="width: 100%" :head="tableHead" :data="problemList" ref="problemTable">
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
                        <i v-show="scope.data.lock !== null"
                           :class="{'iconfont': true, 'icon-success': scope.data.lock, 'icon-error': !scope.data.lock}"></i>
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
                <InputButton @click="showAddProblemDialog = true">添加题目</InputButton>
            </div>
            <h1>公告</h1>
            <div style="display: block; text-align: left">
                <MarkdownEdit :min-height="100" :read-only="notOwner" style="width: 100%"
                              v-model="contestData.announcement"></MarkdownEdit>
            </div>
        </div>
        <InputButton @click="save">保存</InputButton>
        <Dialog title="邀请列表" v-model="showPrivateUserDialog">
            <div style="display: grid; grid-template-columns: 1fr auto">
                <InputText :read-only="notOwner" v-model="templateInvite"
                           :placeholder="'用户的昵称，使用空格分割多个昵称'"></InputText>
                <InputButton :disabled="notOwner" @click="addInvite">添加</InputButton>
            </div>
        </Dialog>
        <Dialog title="邀请合作出题人" v-model="showCoAuthorDialog">
            <div style="display: grid; grid-template-columns: 1fr auto">
                <InputText :read-only="notOwner" v-model="templateCoAuthor"
                           :placeholder="'用户的昵称，使用空格分割多个昵称'"></InputText>
                <InputButton :disabled="notOwner" @click="addCoAuthor">添加</InputButton>
            </div>
        </Dialog>
        <Dialog title="添加题目" v-model="showAddProblemDialog">
            <div style="display: grid; grid-template-columns: auto 1fr auto">
                <InputCheckbox @change="clearSearchKey" :disabled="notOwner" v-model="usePublic">启用公开题库
                </InputCheckbox>
                <InputSelect @search="changeSearchKey"
                             :data="searchProblemList"
                             :placeholder="usePublic ? '键入来搜索公开题库' : '键入来搜索私有题库'"
                             v-model="selectedProblem">
                </InputSelect>
                <InputButton @click="addProblem">添加</InputButton>
            </div>
        </Dialog>
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

            showPrivateUserDialog: false,
            showCoAuthorDialog: false,
            showAddProblemDialog: false,
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
            })
            this.$contest.auth(this.contestId, null, res => this.notOwner = res !== 'ADMIN')
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
                startTime: new Date().format("yyyy-MM-ddThh:mm"),
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
                    this.$user.getUserInfo(templateList[i], () => {
                        if (this.contestData.coAuthor.indexOf(templateList[i]) === -1) {
                            this.contestData.coAuthor.push(templateList[i])
                        } else {
                            this.$toast({
                                title: '失败',
                                text: '此用户已经存在',
                                duration: 'auto',
                                type: 'error'
                            })
                        }
                    })
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
            this.showCoAuthorDialog = false
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
                    this.$user.getUserInfo(templateList[i], () => {
                        if (!this.contestData.inviteUserSet) {
                            this.contestData.inviteUserSet = []
                        }
                        if (this.contestData.inviteUserSet.indexOf(templateList[i]) === -1) {
                            this.contestData.inviteUserSet.push(templateList[i])
                        } else {
                            this.$toast({
                                title: '失败',
                                text: '此用户已经存在',
                                duration: 'auto',
                                type: 'error'
                            })
                        }
                    })
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
            this.showPrivateUserDialog = false
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
            this.showAddProblemDialog = false
        },
        save() {
            this.contestData.problemList = []
            for (let i = 0; i < this.problemList.length; i++) {
                this.contestData.problemList.push(this.problemList[i].realId)
            }
            this.contestData.startTime = new Date(this.contestData.startTime)
            if (this.contestId === 0) {
                this.$contest.newContest(this.contestData, id => {
                    this.$toast({
                        title: '成功',
                        text: '创建成功',
                        duration: 'auto',
                        type: 'success'
                    })
                    this.$router.replace({name: 'contest-manager', params: {contestId: id}})
                    location.reload()
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
            this.contestData.startTime = this.contestData.startTime.format("yyyy-MM-ddThh:mm")
        },
        checkBatch() {
            // noinspection JSUnresolvedVariable
            this.$batch.get(this.contestData.batchId, res => {
                if (res.contestId == null) {
                    this.$toast({
                        title: '成功',
                        text: '这是一个全新的批量用户组',
                        duration: 'auto',
                        type: 'success'
                    })
                } else {
                    // noinspection JSUnresolvedVariable
                    this.$toast({
                        title: '注意',
                        text: `请注意，这个批量用户组已经被分配至比赛 "${res.contestTitle}"，如果继续操作，
                        将会使得这个用户组不再能登录比赛 "${res.contestTitle}", 而只能登录本比赛，若不希望发生如上事件，
                        请刷新页面来放弃所有的更改`,
                        duration: -1,
                        type: 'warning'
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.form > div {
    display: grid;
    grid-template-columns: 20% 80%;
    place-items: center;
    border-bottom: 1px solid var(--border-color-level-1);
}
</style>