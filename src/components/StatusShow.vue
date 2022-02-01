<template>
    <div style="display: grid; place-items: center">
        <!--suppress JSValidateTypes -->
        <Table :head="tableHead" :data="tableData">
            <template v-slot:body-id="scope">
                <Link @click="openSolution(scope.data.id)" :disabled="disableSolution(scope.data.userId)">
                    {{ scope.data.id }}
                </Link>
            </template>
            <template v-slot:body-submitTime="scope">
                {{ new Date(scope.data.submitTime).format("yyyy-MM-dd hh:mm:ss") }}
            </template>
            <template v-slot:body-status="scope">
                {{ solutionStatusType[scope.data.status].text }}
            </template>
        </Table>
        <Pagination @change="changePageNum" v-model="pageNum" :total="totalNum" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
export default {
    name: "StatusShow",
    props: {
        contentId: {
            type: Number,
            default: null,
        }
    },
    data() {
        return {
            tableHead: [
                {
                    label: '编号',
                    value: 'id',
                    width: '30',
                }, {
                    label: '提交时间',
                    value: 'submitTime',
                    width: '80',
                }, {
                    label: '用户',
                    value: 'userId',
                    width: '50',
                }, {
                    label: '问题',
                    value: 'problemId',
                    width: '50',
                }, {
                    label: '语言',
                    value: 'languageType',
                    width: '50',
                }, {
                    label: '状态',
                    value: 'status',
                    width: '50',
                }, {
                    label: '耗时(ms)',
                    value: 'timeCost',
                    width: '50'
                }, {
                    label: '最大内存占用(KB)',
                    value: 'memoryCost',
                    width: '80'
                }
            ],
            tableData: [
                {
                    id: 0,
                    submitTime: "2022-01-24T16:00:00.000+00:00",
                    userId: 1,
                    problemId: 3,
                    languageType: "CPP11",
                    status: "WRONG_ANSWER",
                    timeCost: 0,
                    memoryCost: 1408
                }
            ],
            pageNum: 1,
            pageSize: 30,
            totalNum: 0,
            totalPage: 1,

            solutionStatusType: {}
        }
    },
    created() {
        this.$common.getEnum('SolutionStatusType', res => this.solutionStatusType = res)
        this.initData()
    },
    methods: {
        initData() {
            if (this.contentId) {
                // do nothing
            } else {
                this.$solution.getPublicSolutionList(this.pageNum, this.pageSize, res => {
                    if (res == null) {
                        this.totalNum = 1
                        this.totalPage = 1
                        this.tableData = []
                    } else {
                        this.pageNum = res.pageNum
                        this.pageSize = res.pageSize
                        this.totalNum = res.totalNum
                        this.totalPage = res.totalPage
                        this.tableData = res.data
                    }
                })
            }
        },
        openSolution(id) {
            this.$router.push({name: 'solution', params: {solutionId: id}})
        },
        disableSolution(userId) {
            return this.$user.getCurUserData().id !== userId && this.$user.hasPermission(this.$user.permissionTypeList.VIEW_PUBLIC_SOLUTION)
        },
        changePageNum() {
            this.initData()
        }
    }
}
</script>

<style scoped>

</style>