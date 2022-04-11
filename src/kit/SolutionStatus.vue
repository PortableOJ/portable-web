<template>
    <!--suppress JSUnresolvedVariable -->
    <span :class="{
        'accept': value === 'ACCEPT',
        'fail': value !== 'ACCEPT' && solutionStatusType[value].endingResult,
        'pending': !solutionStatusType[value].endingResult
    }">
        {{ solutionStatusType[value].text }}
    </span>
</template>

<script>
export default {
    name: "SolutionStatus",
    props: {
        value: String
    },
    data() {
        return {
            solutionStatusType: {},
        }
    },
    created() {
        this.$common.getEnum('SolutionStatusType', res => this.solutionStatusType = res)
    }
}
</script>

<style scoped>
.accept {
    font-weight: 900;
    color: var(--success-color);
}

.fail {
    color: var(--error-color);
}

.pending {
    color: var(--info-color);
}
</style>