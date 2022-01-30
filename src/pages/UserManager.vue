<template>
    <div class="lm-rc-layout">
        <div class="lm-rc-layout-left" style="display: grid; place-items: center;">
            <div>
                <h1 style="display: inline-block">{{ userData.handle }}</h1>
            </div>
            <div class="user-info">
                <div class="user-info-title">所属组织</div>
                <div class="user-info-value">
                    <InputSelect @change="changeOrganization" v-model="userData.organizationType"
                                 :data="organizationList"></InputSelect>
                </div>
            </div>
            <div class="user-info">
                <div>拥有的权限</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(600px, 1fr))">
                    <InputCheckbox style="display: inline-block"
                                   v-for="permission in permissionList"
                                   :key="permission.value"
                                   :value="permissionState[permission.value]"
                                   @change="changePermission(permission.value)">
                        {{ permission.label }}
                    </InputCheckbox>
                </div>
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
    name: "UserManager",
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

            accountType: {},
            organizationType: {},
            organizationList: [],
            permissionType: {},
            permissionList: [],
            permissionState: {}
        }
    },
    created() {
        this.$common.getEnum('AccountType', res => this.accountType = res)
        this.$common.getEnum('OrganizationType', res => {
            this.organizationType = res
            this.organizationList = []
            for (let i in res) {
                if (this.$user.isDominate(i)) {
                    this.organizationList.push({
                        label: res[i].text,
                        value: i,
                        code: res[i].code
                    })
                }
            }
            this.organizationList.sort((a, b) => a.code - b.code)
        })
        this.$user.getUserInfo(this.handle, res => {
            this.userData = res
            this.$common.getEnum('PermissionType', res => {
                this.permissionType = res
                this.permissionList = []
                for (let i in res) {
                    if (this.$user.hasPermission(i)) {
                        this.permissionList.push({
                            label: res[i].text,
                            value: i,
                        })
                        this.permissionState[i] = this.userData.permissionTypeSet.findIndex(t => t === i) >= 0
                    }
                }
            })
        })
    },
    methods: {
        changeOrganization(target) {
            this.$user.changeOrganization(this.userData.id, target)
        },
        changePermission(target) {
            if (this.permissionState[target]) {
                this.$user.removePermission(this.userData.id, target)
            } else {
                this.$user.addPermission(this.userData.id, target)
            }
        }
    },

}
</script>

<style scoped>
.user-info {
    display: grid;
    grid-template-columns: 300px minmax(500px, 1fr);
    place-items: center;
}
</style>