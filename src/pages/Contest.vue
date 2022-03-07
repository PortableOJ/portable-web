<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <div style="display: grid; place-items: center">
                <h1 v-if="contestData">{{ contestData.title }}</h1>
                <TabMenu v-if="contestData" style="width: 100%" @change="toSelect" v-model="step"
                         :options="selectOption"></TabMenu>
                <router-view></router-view>
            </div>
        </div>
        <div>
            <UserCard></UserCard>
            <ImageUpload v-if="step === 'manager'"></ImageUpload>
            <div class="card" v-if="contestData">
                <span class="card-title">{{ contestData.title }}</span>
                <div>
                    比赛管理员：
                    <Link @click="openUser(contestData.ownerHandle)">{{ contestData.ownerHandle }}</Link>
                </div>
                <div>
                    合作出题人：
                    <!--suppress JSUnresolvedVariable -->
                    <Link style="margin-right: 10px" @click="openUser(handle)" :key="handle"
                          v-for="handle in contestData.coAuthor">
                        {{ handle }}
                    </Link>
                </div>
                <div>
                    开始时间：{{ new Date(contestData.startTime).format("yyyy-MM-dd hh:mm:ss") }}
                </div>
                <div>
                    持续时间：{{
                        `${(contestData.duration / 60).toFixed(0).padStart(2, '0')}:${(contestData.duration % 60).toString().padStart(2, '0')}:00`
                    }}
                </div>
                <div v-if="leftTime > 0">
                    剩余时间：{{
                        `${(leftTime / 3600).toFixed(0).padStart(2, '0')}:${((leftTime % 3600) / 60).toFixed(0).padStart(2, '0')}:${(leftTime % 60).toString().padStart(2, '0')}`
                    }}
                </div>
                <InputSlider v-if="leftTime > 0"
                             :read-only="true"
                             :show-handle="false"
                             style="margin: 0; width: 100%"
                             v-model="slider"
                             :max="100"
                             :min="0">
                </InputSlider>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";
import ImageUpload from "@/card/ImageUpload";

export default {
    name: "Contest",
    components: {
        ImageUpload,
        UserCard
    },
    data() {
        return {
            contestId: 0,
            contestData: null,
            slider: 0,
            leftTime: 0,
            sliderInterval: null,
            selectOption: [
                {
                    label: '题目',
                    value: 'content',
                }
            ],
            hiddenOption: {
                problem: '题目',
                solution: '提交',
                test_solution: '测试',
            },
            step: null,
        }
    },
    created() {
        this.step = this.$route.name.split('-')[1]
        this.contestId = parseInt(this.$route.params.contestId)
        if (this.contestId === 0) {
            return;
        }
        this.$contest.getContestData(this.contestId, res => {
            this.contestData = res
            this.sliderInterval = setInterval(() => {
                let usedTime = new Date().getTime() - new Date(this.contestData.startTime).getTime()
                usedTime /= 1000
                this.leftTime = -1
                if (usedTime < 0) {
                    this.slider = 0
                } else if (usedTime > this.contestData.duration * 60) {
                    this.slider = 100
                } else {
                    this.slider = (usedTime / this.contestData.duration) / 6 * 10;
                    this.leftTime = this.contestData.duration * 60 - usedTime
                    this.leftTime = this.leftTime.toFixed(0)
                }
            }, 10)
        })
        this.$contest.auth(this.contestId, null, res => {
            let hidden = true
            if (res === 'ADMIN' || res === 'CO)AUTHOR') {
                hidden = false
            }
            this.selectOption = [
                {
                    label: '题目',
                    value: 'content',
                }, {
                    label: '判题',
                    value: 'status',
                }, {
                    label: '测试',
                    value: 'test_status',
                    hidden: hidden
                }, {
                    label: '榜单',
                    value: 'rank',
                }, {
                    label: '管理',
                    value: 'manager',
                    hidden: hidden
                }
            ]
        })
    },
    methods: {
        toSelect(value) {
            if (`contest-${value}` === this.$route.name) {
                return
            }
            this.$router.push({name: `contest-${value}`, params: {contestId: this.contestId.toString()}})
        },
        openUser(handle) {
            this.$router.push({name: 'user', params: {handle: handle}})
        }
    },
    watch: {
        $route(to) {
            this.step = to.name.split('-')[1]
        }
    },
    beforeDestroy() {
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval)
        }
    }
}
</script>

<style scoped>

</style>