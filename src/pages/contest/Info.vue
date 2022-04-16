<template>
    <div style="width: 100%">
        <div style="margin-top: 40px">
            <template v-if="!isStarted">
                距离比赛开始还有
                <div style="font-size: 80px; font-weight: bolder">
                    <Tag type="success">{{ dateFormat(startTime - cTime) }}</Tag>
                </div>
            </template>
            <template v-else-if="!isEnded">
                距离比赛结束还有
                <div style="font-size: 80px; font-weight: bolder">
                    <Tag type="warning">{{ dateFormat(endTime - cTime) }}</Tag>
                </div>
            </template>
            <template v-else>
                <Tag type="info">比赛已经结束</Tag>
            </template>
        </div>
        <div v-if="announcement">
            <h1>公告</h1>
            <div v-html="announcement" class="announcement"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    data() {
        return {
            contestId: parseInt(this.$route.params.contestId),
            contestData: null,
            announcement: null,
            isStarted: false,
            isEnded: false,
            cTime: new Date().getTime(),
            startTime: new Date().getTime(),
            endTime: new Date().getTime(),
            timer: null,
        }
    },
    created() {
        this.$contest.getContestInfo(this.contestId, res => {
            this.contestData = res
            this.problemList = res.problemList
            this.announcement = this.$markdown(res.announcement)
            this.startTime = new Date(res.startTime).getTime()
            this.endTime = new Date(res.startTime).add(res.duration).getTime()

            this.isStarted = this.cTime > this.startTime
            this.isEnded = this.cTime > this.endTime
            this.timer = setInterval(() => {
                this.cTime = new Date().getTime()
            }, 1000)
        })
    },
    methods: {
        dateFormat(timestamp) {
            return this.$common.dateFormat(timestamp)
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style scoped>
.announcement {
    padding: 40px 40px;
    margin: 20px 20px;
    border-radius: 30px;
    background: var(--border-color-level-4);
}
</style>