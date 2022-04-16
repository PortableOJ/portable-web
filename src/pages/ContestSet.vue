<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <!--suppress JSValidateTypes -->
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-id="scope">
                    <Link @click="openContest(scope.data)">{{ scope.data.id }}</Link>
                </template>
                <template v-slot:body-title="scope">
                    <Link @click="openContest(scope.data)">{{ scope.data.title }}</Link>
                </template>
                <template v-slot:body-startTime="scope">
                    {{ new Date(scope.data.startTime).format("yyyy-MM-dd hh:mm:ss") }}
                </template>
                <template v-slot:body-duration="scope">
                    {{ dateFormat(scope.data.duration) }}
                </template>
                <template v-slot:body-accessType="scope">
                    {{ contestAccessType[scope.data.accessType].text }}
                </template>
                <template v-slot:body-status="scope">
                    <Tag type="success"  v-if="status(scope.data.startTime, scope.data.duration) === -1">未开始</Tag>
                    <Tag type="error" v-if="status(scope.data.startTime, scope.data.duration) === 0">正在比赛中</Tag>
                    <Tag type="info" v-if="status(scope.data.startTime, scope.data.duration) === 1">已经结束</Tag>
                </template>
            </Table>
            <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
        </div>
        <div>
            <UserCard></UserCard>
            <div class="card" v-if="canCreateContest()">
                <span class="card-title">管理</span>
                <InputButton @click="newContest">新建比赛</InputButton>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "ContestSet",
    components: {
        UserCard
    },
    data() {
        return {
            tableHead: [
                {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '标题',
                    value: 'title',
                    width: '100',
                }, {
                    label: '开始时间',
                    value: 'startTime',
                    width: '50',
                }, {
                    label: '持续时长',
                    value: 'duration',
                    width: '50',
                }, {
                    label: '访问限制',
                    value: 'accessType',
                    width: '50',
                }, {
                    label: '当前状态',
                    value: 'status',
                    width: '50',
                }
            ],
            tableData: [],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,

            contestAccessType: {}
        }
    },
    created() {
        this.$common.getEnum('ContestAccessType', res => this.contestAccessType = res)
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.initData()
    },
    methods: {
        initData() {
            let query = {
                pageNum: this.pageNum.toString(),
                pageSize: this.pageSize.toString()
            }
            if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
                this.$router.replace({
                    name: 'contestSet',
                    query: query
                })
            }
            this.$contest.getList(this.pageNum, this.pageSize, res => {
                this.pageNum = res.pageNum
                this.pageSize = res.pageSize
                this.totalNum = res.totalNum
                this.totalPage = res.totalPage
                this.tableData = res.data
            })
        },
        openContest(contest) {
            this.$contest.auth(contest.id, null, res => {
                let inContest = (res) => {
                    if (res !== 'NO_ACCESS') {
                        this.$router.push({name: 'contest', params: {contestId: contest.id}})
                    } else {
                        this.$toast({
                            title: '失败',
                            text: '你没有权限访问此比赛',
                            duration: 'auto',
                            type: 'error'
                        })
                    }
                }
                if ((res === 'VISIT' || res === 'NO_ACCESS') && contest.accessType === 'PASSWORD') {
                    this.$message({
                        text: '请输入密码',
                        type: 'info',
                        inputType: 'password',
                        ok: '参加比赛',
                        cancel: res === 'VISIT' ? '仅访问' : '取消参加',
                        input: true,
                        confirmOK: (v) => {
                            this.$contest.auth(contest.id, v, newRes => {
                                inContest(newRes)
                            })
                        },
                        confirmCancel: () => {
                            inContest(res)
                        },
                    })
                } else {
                    inContest(res)
                }
            })
        },
        changePageNum() {
            this.initData()
        },
        canCreateContest() {
            return this.$user.hasPermission(this.$user.permissionTypeList.CREATE_AND_EDIT_CONTEST)
        },
        newContest() {
            this.$router.push({name: 'contest-manager', params: {contestId: '0'}})
        },
        status(startTime, duration) {
            const start = new Date(startTime)
            const end = new Date(startTime).add(duration)
            const now = new Date()
            if (now < start) {
                return -1
            } else if (now < end) {
                return 0
            } else {
                return 1
            }
        },
        dateFormat(duration) {
            return this.$common.dateFormat(duration * 60000 )
        }

    }
}
</script>

<style scoped>

</style>