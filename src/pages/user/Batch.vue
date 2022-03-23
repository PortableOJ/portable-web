<template>
    <div style="display: grid; place-items: center">
        <h3>IP 记录</h3>
        <Table style="width: 100%" :head="tableHead" :data="userData.ipRecordList">
            <template v-slot:body-date="scope">
                {{ new Date(scope.data.date).format("yyyy-MM-dd hh:mm:ss") }}
            </template>
        </Table>
        <InputButton @click="clearIp">清空 IP 记录</InputButton>
    </div>
</template>

<script>
export default {
    name: "Batch",
    data() {
        return {
            handle: this.$route.params.handle,
            userData: {
                id: 0,
                handle: "",
                ipRecordList: [],
            },
            tableHead: [{
                label: 'IP地址',
                value: 'ip'
            }, {
                label: '时间',
                value: 'date'
            }]
        }
    },
    created() {
        this.$user.getBatchUserAdminInfo(this.handle, res => {
            this.userData = res
            console.log(res)
        })
    },
    methods: {
        clearIp() {
            this.$user.clearIpList(this.handle, () => {
                this.userData.ipRecordList = []
                this.$toast({
                    title: '完成',
                    text: '成功完成清理',
                    duration: 'auto',
                    type: 'success'
                })
            })
        }
    }
}
</script>

<style scoped>

</style>