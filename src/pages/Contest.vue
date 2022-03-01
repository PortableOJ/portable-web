<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left">
            <div v-if="contestData" style="display: grid; place-items: center">
                <h1 style="margin: 0">{{ contestData.title }}</h1>
                <InputSlider style="margin: 0; width: 100%" :disabled="true" v-model="slider" :max="100" :min="0"
                             :valueFormat="v => `${v.toFixed(0)}%`"></InputSlider>
                <NavMenu style="width: 100%" @change="toSelect" v-model="step" :options="selectOption"
                         :not-found="v => v ? hiddenOption[v.split('-')[0]] : ''"></NavMenu>
                <router-view></router-view>
            </div>
        </div>
        <div>
            <UserCard></UserCard>
            <div class="card" v-if="contestData">
                <span class="card-title">比赛信息</span>
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
                        `${(leftTime / 3600).toFixed(0).padStart(2, '0')}:${(leftTime / 60).toFixed(0).padStart(2, '0')}:${(leftTime % 60).toString().padStart(2, '0')}`
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "Contest",
    components: {
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
            step: this.$route.name.split('-')[1]
        }
    },
    created() {
        this.contestId = parseInt(this.$route.params.contestId)
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
                    hidden: this.hidden()
                }, {
                    label: '榜单',
                    value: 'rank',
                }, {
                    label: '管理',
                    value: 'manager',
                    hidden: this.hidden()
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
        },
        hidden() {
            // noinspection JSUnresolvedVariable
            return  !this.contestData || (this.contestData.ownerHandle !== this.$user.getCurUserHandle() && this.contestData.coAuthor.indexOf(this.$user.getCurUserHandle()) === -1)
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