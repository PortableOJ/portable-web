<template>
    <div class="faq-box">
        <div class="faq-title" @click="openAnswer = !openAnswer">
            <span :class="{
                'answer-open-button': true,
                'answer-open-button-open': openAnswer
            }">
                <i class="iconfont icon-right"></i>
            </span>
            <span style="font-size: 20px; font-weight: bolder">
                {{ title }}
            </span>
        </div>
        <div :class="{'faq-answer': true, 'faq-answer-open': openAnswer}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestAndAnswer",
    props: {
        title: String,
        open: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            openAnswer: this.open,
        }
    },
}
</script>

<style scoped>
.faq-box {
    border: 1px solid var(--border-color-level-1);
    /*background: var(--border-color-level-4);*/
    border-radius: 15px;
    text-align: left;
    padding: 15px 15px;
    margin-top: 20px;
    transition: 0.5s ease all;
}

.faq-title {
    cursor: pointer;
}

.faq-box:hover {
    border: 1px solid var(--brand-color);
    background: var(--background-brand-color)
}

.answer-open-button {
    transform: rotate(0deg);
    transition: 0.2s ease all;
    display: inline-block;
    cursor: pointer;
    color: var(--brand-color);
    font-weight: 900;
}

.answer-open-button:hover {
    transform: scale(1.5);
}

.answer-open-button-open {
    transform: rotate(90deg);
}

.answer-open-button-open:hover {
    transform: scale(1.5) rotate(90deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: 0.5s ease-in-out all;
    margin: 0;
}

.faq-answer-open {
    max-height: 1000px;
    overflow: auto;
    margin: 10px 15px;
}
</style>