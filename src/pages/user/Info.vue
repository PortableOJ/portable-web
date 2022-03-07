<template>
    <div style="display: grid; grid-template-columns: 250px minmax(500px, 1fr); margin-top: 30px">
        <div>
            <img :src="avatarUrl" alt="avatar" style="width: 250px; border-radius: 50%">
        </div>
        <div style="display: grid; margin-left: 30px; grid-template-columns: 120px 1fr; place-items: center">
            <div>昵称：</div>
            <div>
                <span style="font-size: 35px">
                    {{ userData.handle }}
                </span>
            </div>
            <div>账号类型</div>
            <div>
                <Tag type="success"
                     v-if="accountType[userData.type]">{{ accountType[userData.type].text }}
                </Tag>
            </div>
            <div>所属组织：</div>
            <div>{{ organizationType[userData.organizationType].text }}</div>
            <div>提交通过率：</div>
            <div>
                {{ userData.accept }} / {{ userData.submission }}
                (
                <template v-if="userData.submission !== 0">
                    {{ (userData.accept / userData.submission * 100).toFixed(2) }} %
                </template>
                <template v-else>
                    -
                </template>
                )
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
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
                email: null,
                avatar: null,
            },
            avatarUrl: '',

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
                this.avatarUrl = process.env.VUE_APP_AVATAR_URL + this.userData.avatar
            })
        }
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
