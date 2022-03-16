<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <Table :head="tableHead" :data="tableData">
                <template v-slot:body-contest="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <Link :disabled="!scope.data.contestId" @click="openContest(scope.data.contestId)">
                        {{ scope.data.contestTitle }}
                    </Link>
                </template>
                <template v-slot:body-ipLock="scope">
                    <!--suppress JSUnresolvedVariable -->
                    <i class="iconfont icon-success" v-if="scope.data.ipLock"></i>
                    <i class="iconfont icon-error" v-else></i>
                </template>
                <template v-slot:body-status="scope">
                    {{ batchStatusType[scope.data.status].text }}
                </template>
            </Table>
            <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
        </div>
        <div>
            <UserCard></UserCard>
            <div class="card">
                <span class="card-title">新增批量用户</span>
                <InputText class="card-input" v-model="batch.prefix" placeholder="用户的前缀"></InputText>
                <InputText class="card-input" v-model="batch.count" type="number" placeholder="需要生成的数量"></InputText>
                <InputCheckbox v-model="batch.ipLock">是否锁定 IP</InputCheckbox>
                <div class="button-box">
                    <InputButton @click="newBatch" :loading="onNew">新增</InputButton>
                    <Link v-if="userHandleAndPassword">
                        <a :href="userHandleAndPassword" :download="`${batch.prefix}.csv`">下载账号密码</a>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "BatchManager",
    components: {UserCard},
    data() {
        return {
            tableHead: [
                {
                    label: '序号',
                    value: 'id',
                    width: 30
                }, {
                    label: '绑定至的比赛标题',
                    value: 'contest',
                    width: 200
                }, {
                    label: '前缀内容',
                    value: 'prefix',
                    width: 100
                }, {
                    label: '用户数量',
                    value: 'count',
                    width: 80
                }, {
                    label: 'IP锁',
                    value: 'ipLock',
                    width: 30
                }, {
                    label: '登录状态',
                    value: 'status',
                }, {
                    label: '',
                    value: 'operator'
                }
            ],
            tableData: [],

            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 0,

            batch: {
                prefix: '',
                count: null,
                ipLock: false
            },
            onNew: false,
            userHandleAndPassword: null,

            batchStatusType: {}
        }
    },
    created() {
        this.$common.getEnum('BatchStatusType', res => this.batchStatusType = res)
        this.pageNum = this.$common.getQueryInt(this, 'pageNum', 1)
        this.pageSize = this.$common.getQueryInt(this, 'pageSize', 30)
        this.initData()
    },
    methods: {
        initData() {
            this.$batch.getList(this.pageNum, this.pageSize, res => {
                this.pageNum = res.pageNum
                this.pageSize = res.pageSize
                this.totalNum = res.totalNum
                this.totalPage = res.totalPage
                this.tableData = res.data
            })
        },
        openContest(id) {
            this.$router.push({name: 'contest', params: {contestId: id}})
        },
        changePageNum() {
            this.initData()
        },
        newBatch() {
            this.$message({
                text: `你正在生成 ${this.batch.count} 个批量用户，且他们的开头为 ${this.batch.prefix}，这需要花一点时间，请耐心等待完成，无论如何请不要刷新页面或前往其他页面，若长时间未能完成，请先联系管理员`,
                type: 'warning',
                input: false,
                ok: '确定',
                cancel: '取消',
                confirmOK: () => {
                    this.onNew = true
                    this.$toast({
                        title: '正在创建中',
                        text: '请不要跳转或刷新页面',
                        duration: -1,
                        type: 'success'
                    })
                    this.$batch.newBatch(this.batch, res => {
                        let csv = 'data:text/csv;charset=utf-8,用户名,密码\r\n'
                        // noinspection JSUnresolvedVariable
                        for (let i = 0; i < res.batchUserList.length; i++) {
                            // noinspection JSUnresolvedVariable
                            csv += `${res.batchUserList[i].handle},${res.batchUserList[i].password}\r\n`
                        }
                        this.userHandleAndPassword = encodeURI(csv);
                        this.$toast({
                            title: '创建完成',
                            text: '批量账号创建完成，请点击右侧按钮来打开批量用户的账号密码信息，并尽快保存此内容',
                            duration: 'auto',
                            type: 'success'
                        })
                        this.onNew = false
                    })
                },
                confirmCancel: () => {
                }
            })
        },
        download() {
            console.log(this.userHandleAndPassword)
            window.open(this.userHandleAndPassword, '_blank')
        }
    }
}
</script>

<style scoped>
.button-box {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: 10px;
}
</style>