<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left" style="display: grid; place-items: center;">
            <div>
                <h1 style="display: inline-block">{{ userData.handle }}</h1>
            </div>
            <div class="user-info" style="width: 90%">
                <div class="user-info-title">账号类型</div>
                <div class="user-info-value">
                    <Tag type="success" v-if="accountType[userData.type]">{{ accountType[userData.type].text }}</Tag>
                </div>
                <div class="user-info-operator"></div>
                <div class="user-info-title">所属组织</div>
                <div class="user-info-value">
                    <Tag v-if="organizationType[userData.organizationType]" type="success">
                        {{ organizationType[userData.organizationType].text }}
                    </Tag>
                </div>
                <div class="user-info-operator">
                    <Link @click="userManager" v-if="isDominate">修改组织</Link>
                </div>
                <div class="user-info-title">拥有的权限</div>
                <div class="user-info-value">
                    <template v-for="permission in userData.permissionTypeSet">
                        <Tag style="margin-top: 5px" type="success" :key="permission"
                             v-if="permissionType[permission]">
                            {{ permissionType[permission].text }}
                        </Tag>
                    </template>
                </div>
                <div class="user-info-operator">
                    <Link @click="userManager" v-if="isDominate">调整权限</Link>
                </div>
                <div class="user-info-title">通过/提交率</div>
                <div class="user-info-value">
                    {{ userData.accept }} / {{ userData.submission }} (
                    <template v-if="userData.submission !== 0">
                        {{ userData.accept / userData.submission * 100 }} %
                    </template>
                    <template v-else>-</template>
                    )
                </div>
                <div class="user-info-operator"></div>
                <div class="user-info-title"></div>
                <div class="user-info-value"></div>
                <div class="user-info-operator"></div>
            </div>
        </div>
        <div>
            <UserCard></UserCard>
        </div>
    </div>
</template>

<script>
import UserCard from "@/card/UserCard";

export default {
    name: "User",
    components: {
        UserCard
    },
    data() {
        return {
            handle: this.$route.params.handle,
            userData: {
                id: 0,
                handle: "",
                type: "NORMAL",
                organizationType: "ADMIN",
                submission: 0,
                accept: 0,
                permissionTypeSet: [],
                email: null
            },
            isDominate: false,

            accountType: {},
            organizationType: {},
            permissionType: {},
        }
    },
    created() {
        this.$common.getEnum('AccountType', res => this.accountType = res)
        this.$common.getEnum('OrganizationType', res => this.organizationType = res)
        this.$common.getEnum('PermissionType', res => this.permissionType = res)
        this.init()
    },
    methods: {
        init() {
            this.$user.getUserInfo(this.handle, res => {
                this.userData = res
                this.isDominate = this.userData.type === 'NORMAL' && this.$user.isDominate(this.userData.organizationType)
            })
        },
        userManager() {
            this.$router.push({name: 'userManager', params: {handle: this.userData.handle}})
        },
    },
    watch: {
        $route() {
            this.handle = this.$route.params.handle
            this.init()
        }
    }
}
</script>

<style scoped>
.user-info {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(12, 1fr);
    place-items: center;
}

.user-info > div {
    padding-top: 4px;
}

.user-info-title {
    grid-column: 1 / span 2;
}

.user-info-value {
    grid-column: 3 / span 9;
}

.user-info-operator {
    grid-column: 12 / span 1;
}
</style>