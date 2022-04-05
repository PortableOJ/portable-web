<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <h1>{{ problemId === 0 ? '创建' : '编辑' }}题目</h1>
            <!--suppress JSValidateTypes -->
            <TabMenu v-if="problemId !== 0" @change="toSelect" :value="step" :options="stepList"></TabMenu>
            <router-view></router-view>
        </div>
        <div>
            <UserCard></UserCard>
            <ImageUpload></ImageUpload>
            <div class="card">
                <span class="card-title">相关</span>
                <InputButton @click="back">返回题面页面</InputButton>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import ImageUpload from "@/card/ImageUpload";

export default {
    name: "ProblemManager",
    components: {ImageUpload, UserCard},
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

            problemId: parseInt(this.$route.params.problemId),
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
        },
        back() {
            this.$router.push({name: 'problem', params: {problemId: this.problemId.toString()}})
        },
    }
}
</script>

<style scoped>

</style>