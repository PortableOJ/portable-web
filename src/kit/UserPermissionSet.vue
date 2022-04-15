<template>
    <div v-show="this.status !== null && this.status !== undefined"
         class="input-desc-box"
         v-if="permissionType[permission]">
        <div class="input-desc">
            <div @click="openDesc = !openDesc" :class="{
                'desc-open-button': true,
                'desc-open-button-open': openDesc
            }">
                <i class="iconfont icon-right"></i>
            </div>
            <InputCheckbox :value="status" @change="changePermission(permission)">
                {{ permissionType[permission].text }}
                (
                <slot name="title">
                    暂时没有对此权限的描述内容
                </slot>
                )
            </InputCheckbox>
        </div>
        <div :class="{
            'desc-box': true,
            'desc-box-open': openDesc
        }">
            <slot name="desc">
                暂时没有对此权限的描述内容
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserPermissionSet",
    props: {
        userHandle: String,
        permissionType: Object,
        permission: String,
        permissionState: Object,
    },
    data() {
        return {
            status: false,
            openDesc: false,
        }
    },
    created() {
        this.status = this.permissionState[this.permission]
    },
    methods: {
        changePermission(target) {
            if (this.status) {
                this.$user.removePermission(this.userHandle, target, () => {
                    this.$toast({
                        title: '成功',
                        text: '已经移除对方的权限',
                        duration: 'auto',
                        type: 'success'
                    })
                    this.status = !this.status
                })
            } else {
                this.$user.addPermission(this.userHandle, target, () => {
                    this.$toast({
                        title: '成功',
                        text: '已经为对方添加新的权限',
                        duration: 'auto',
                        type: 'success'
                    })
                    this.status = !this.status
                })
            }
        }
    }
}
</script>

<style scoped>
.input-desc-box:nth-child(1n + 2) {
    margin-top: 10px;
}

.desc-open-button {
    transform: rotate(0deg);
    transition: 0.5s ease all;
    display: inline-block;
    cursor: pointer;
    color: var(--brand-color);
    font-weight: 900;
}

.desc-open-button:hover {
    transform: scale(1.5);
}

.desc-open-button-open {
    transform: rotate(90deg);
}

.desc-open-button-open:hover {
    transform: scale(1.5) rotate(90deg);
}

.desc-box {
    max-height: 0;
    transition: 0.5s ease-in-out all;
    overflow: hidden;
}

.desc-box-open {
    max-height: 200px;
}

</style>