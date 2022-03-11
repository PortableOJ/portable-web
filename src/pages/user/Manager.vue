<template>
    <div style="display: grid; grid-template-columns: 350px minmax(500px, 1fr); margin-top: 30px;">
        <div>
            <img :src="avatarUrl" alt="avatar" style="width: 250px; border-radius: 50%;">
        </div>
        <div style="text-align: left">
            <template v-if="isDominate && CHANGE_ORGANIZATION">
                <div class="input-desc-layout">
                    <h3>用户所属组织</h3>
                    <InputSelect @change="changeOrganization"
                                 v-model="userData.organizationType"
                                 :data="organizationList">
                    </InputSelect>
                </div>
                <div class="desc">
                    <p>
                        用户所属的组织指用户拥有的管理其他用户的权限，仅高级的用户可以管理低级用户，例如调整对方的组织，授权/收回对方的权限。
                    </p>
                    <p>
                        但是如果需要进行上述的操作，则还需要拥有对应的权限，"组织"并不与任何真实的权限相关，即虽然一个用户拥有非常高级别的组织，
                        但是如果没有任何权限的情况下，仍然和普通的学生没有任何区别。
                    </p>
                </div>
            </template>
            <template v-if="GRANT && isDominate">
                <div>
                    <h3>
                        管理其他用户
                    </h3>
                    <div class="desc">
                        <p>
                            管理其他用户时，必须要保证自己所在的组织可以管理到对方的组织，否则，即使拥有了权限，也不可以对目标进行管理操作
                        </p>
                    </div>
                    <!--GRANT 授权他人-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.GRANT">
                        <template v-slot:title>
                            允许用户授予/收回其他用户的权限。
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    当用户拥有此权限时，用户可以在能够被自己管理的组织的用户页面时，进入管理用户界面，
                                    并授予其新的权限或收回其原有的权限
                                </p>
                                <p>
                                    但是在授予/收回其他用户的权限时，仅可以授予/收回当前用户已经拥有的权限，
                                    而不可以授予/收回自身还没有的权限
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--CHANGE_ORGANIZATION 修改组织-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.CHANGE_ORGANIZATION">
                        <template v-slot:title>
                            允许用户调整其他用户所属的组织
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    当用户拥有此权限时，用户可以在能够被自己管理的组织的用户页面时，进入管理用户界面，
                                    并调整目标用户所属的组织
                                </p>
                                <p>
                                    调整组织时，首先对方现在所在的组织应该被当前用户所在的组织管理，
                                    其次修改后的组织也应该被当前用户所在的组织管理
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                </div>
                <div>
                    <h3>
                        题库管理
                    </h3>
                    <div class="desc">
                        <p>
                            此处的权限描述的是在公开的题库里的权限管理，其不涉及到绝大部分比赛相关的逻辑，
                            若需要查看管理比赛相关的内容，请前往比赛管理
                        </p>
                    </div>
                    <!--VIEW_HIDDEN_PROBLEM 查看隐藏题目-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.VIEW_HIDDEN_PROBLEM">
                        <template v-slot:title>
                            允许用户查看隐藏的题目
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    当用户拥有此权限进入题库页面时，题库会将隐藏题目也展示给用户，用户也可以提交隐藏的题目
                                </p>
                                <p>
                                    同时，此权限可以与其他很多权限配合，使得用户可以拥有更高的权限，在授予此权限时，
                                    请确认是否可能带来更高的叠加权限效果引起的后果
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--CREATE_AND_EDIT_PROBLEM 创建编辑题目-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.CREATE_AND_EDIT_PROBLEM">
                        <template v-slot:title>
                            允许用户创建和编辑题目
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    用户默认可以创建编辑自己拥有的题目
                                </p>
                                <p>
                                    用户将可以随意上传图片，通常我们认为此操作是为了在题面中使用图片，
                                    但是我们并不保证用户将会合理合法的使用这些图片，
                                    同时用户可以创建和编辑自己拥有的题目，并且没有数量上线
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--EDIT_NOT_OWNER_PROBLEM 编辑其他人的题目-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.EDIT_NOT_OWNER_PROBLEM">
                        <template v-slot:title>
                            允许用户编辑任何可见的题目
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    用户可以编辑任何被允许其访问的题目
                                </p>
                                <p class="desc-important">
                                    注意！此权限必须与
                                    <Tag type="info">{{ permissionType[permissionTypeList.CREATE_AND_EDIT_PROBLEM].text }}</Tag>
                                    配合，因为此权限仅用于扩展编辑题目的范围，并非直接可以用于编辑题目
                                </p>
                                <p class="desc-important">
                                    请注意，此权限会和
                                    <Tag type="info">{{ permissionType[permissionTypeList.VIEW_HIDDEN_PROBLEM].text }}</Tag>
                                    权限配合，使得用户可以编辑到隐藏的题目
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                </div>
                <div>
                    <h3>
                        提交管理
                    </h3>
                    <div class="desc">
                        此处的权限描述的是在公开的题库里进行提交的权限管理，其不涉及到绝大部分比赛相关的逻辑，
                        若需要查看管理比赛相关的内容，请前往比赛管理
                    </div>
                    <!--VIEW_PUBLIC_SOLUTION 查看提交内容-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.VIEW_PUBLIC_SOLUTION">
                        <template v-slot:title>
                            查看其他用户的公共提交的内容
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    用户可以查看其他用户的公共提交的内容，主要是在公共提交中，其他用户提交的代码
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--VIEW_SOLUTION_MESSAGE 查看提交中的 judge 信息-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.VIEW_SOLUTION_MESSAGE">
                        <template v-slot:title>
                            查看公共提交中产生的信息
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    Judge 机器会将判题过程中遇到的信息保存下来，当用户拥有此权限时，
                                    则用户可以查看到提交中 Judge 机器提供的信息，常常可以解释为什么程序没有通过测试
                                </p>
                                <p class="desc-important">
                                    注意！此权限可以与
                                    <Tag type="info">{{ permissionType[permissionTypeList.VIEW_PUBLIC_SOLUTION].text }}</Tag>
                                    配合，来查看其他人提交的 Judge 信息
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                </div>
                <div>
                    <h3>
                        比赛管理
                    </h3>
                    <div class="desc">
                        比赛管理可以让用户拥有管理比赛的权限，同时，比赛的权限是独立于其他的模块的，但是在少部分地方时，
                        仍然需要其他权限辅助，例如添加公开题库中的题目时，若比赛管理员没有访问隐藏题目的权限时，则无法添加隐藏题目
                    </div>
                    <!--VIEW_ALL_CONTEST 查看所有比赛-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.VIEW_ALL_CONTEST">
                        <template v-slot:title>
                            可以以访问者的方式，查看所有比赛的内容
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    用户可以查看所有比赛的内容，包括公开的题面、参与者的提交列表（不包括提交详情）、被封榜后的榜单等信息。
                                    但是用户在没有授权的情况下，仍然无法在比赛中进行提交
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--CREATE_AND_EDIT_CONTEST 查看所有比赛-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.CREATE_AND_EDIT_CONTEST">
                        <template v-slot:title>
                            允许用户创建/编辑自己的比赛
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    拥有此权限后，用户可以创建/编辑自己拥有的比赛，并且可以上传图片。
                                </p>
                                <p class="desc-important">
                                    注意！并非是所有参与出题的人都需要此权限，只需要比赛拥有者持有此权限后，可以将其他用户添加至本比赛，
                                    然后这些用户虽然没有此权限，但是仍然可以进行诸如向比赛中添加题目、提交测试代码等行为
                                </p>
                                <p>
                                    值得注意的是，上传图片的行为本意是让用户能够在比赛的介绍页面能够添加一些图片。
                                    请妥善授予其他用户此权限
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                    <!--EDIT_NOT_OWNER_CONTEST 编辑其他人的比赛-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.EDIT_NOT_OWNER_CONTEST">
                        <template v-slot:title>
                            允许用户编辑其他用户所有的比赛
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    拥有此权限后，用户可以编辑其他用户拥有的比赛
                                </p>
                                <p class="desc-important">
                                    注意！这是一个非常危险的权限，这意味着将所有比赛的安全与此用户挂钩
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                </div>
                <div>
                    <h3>
                        其他权限
                    </h3>
                    <!--MANAGER_JUDGE 编辑其他人的比赛-->
                    <UserPermissionSet :user-id="userData.id"
                                       :permission-type="permissionType"
                                       :permission-state="permissionState"
                                       :permission="permissionTypeList.MANAGER_JUDGE">
                        <template v-slot:title>
                            管理判题系统的权限
                        </template>
                        <template v-slot:desc>
                            <div class="desc">
                                <p>
                                    拥有此权限后，用户可以管理判题系统
                                </p>
                            </div>
                        </template>
                    </UserPermissionSet>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import UserPermissionSet from "@/components/UserPermissionSet";

export default {
    name: "Manager",
    components: {UserPermissionSet},
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
            avatarUrl: '',

            isDominate: false,

            CHANGE_ORGANIZATION: false,
            GRANT: false,

            accountType: {},
            organizationType: {},
            organizationList: [],
            permissionType: {},
            permissionState: {},
            permissionTypeList: [],
        }
    },
    created() {
        this.permissionTypeList = this.$user.permissionTypeList
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
            this.avatarUrl = process.env.VUE_APP_AVATAR_URL + this.userData.avatar
            this.$common.getEnum('PermissionType', res => {
                this.permissionType = {}
                this.permissionList = []
                this.isDominate = this.userData.type === 'NORMAL' && this.$user.isDominate(this.userData.organizationType)
                for (let i in res) {
                    if (this.$user.hasPermission(i)) {
                        this.permissionType[i] = res[i]
                        this.permissionState[i] = this.userData.permissionTypeSet.findIndex(t => t === i) >= 0
                    }
                }
            })
        })
        this.CHANGE_ORGANIZATION = this.$user.hasPermission(this.permissionTypeList.CHANGE_ORGANIZATION)
        this.GRANT = this.$user.hasPermission(this.permissionTypeList.GRANT)
    },
    methods: {
        changeOrganization(target) {
            this.$user.changeOrganization(this.userData.id, target, () => {
                this.$toast({
                    title: '成功',
                    text: '已经更新对方的组织',
                    duration: 'auto',
                    type: 'success'
                })
            })
        }
    },
}
</script>

<style scoped>
.desc {
    color: var(--info-color);
    margin-left: 30px;
}

.desc > p {
    margin-top: 10px;
    margin-bottom: 10px;
}

.desc-important {
    color: var(--error-color);
}

.input-desc-layout {
    display: grid;
    grid-template-columns: auto 1fr;
    place-items: start left;
}

.input-desc-layout:nth-child(1n + 2) {
    margin-top: 10px;
}
</style>