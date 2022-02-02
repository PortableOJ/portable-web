<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <h1>{{ problemId === 'null' ? '创建' : '编辑' }}题目</h1>
            <NavMenu @change="toSelect" style="margin-top: 30px; background-color: var(--border-color-level-4)"
                     :value="step" :options="stepList"></NavMenu>
            <div style="height: 30px"></div>
            <router-view></router-view>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "ProblemManager",
    components: {UserCard},
    data() {
        return {
            step: this.$route.name.split('-')[1],
            stepList: [
                {
                    label: '题目内容',
                    value: 'content',
                }, {
                    label: '题目设置',
                    value: 'setting',
                }, {
                    label: '判题设置',
                    value: 'judge',
                }, {
                    label: '测试数据',
                    value: 'test',
                }, {
                    label: '标准代码',
                    value: 'code',
                }, {
                    label: '题目处理',
                    value: 'treat'
                }
            ],

            problemId: this.$route.params.problemId,
        }
    },
    created() {
    },
    methods: {
        toSelect(value) {
            if (`problemManager-${value}` === this.$route.name) {
                return
            }
            this.$router.push({name: `problemManager-${value}`, params: {problemId: this.problemId.toString()}})
        }
    }
}
</script>

<style scoped>

</style>