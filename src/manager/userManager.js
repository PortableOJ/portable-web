import Request from '@/common/request';
import CommonManager from "@/manager/commonManager";

let baseUrl = '/api/user'

let userData = {
    id: null,
    handle: null,
    type: null,
    organizationType: null,
    permissionTypeSet: [],
}

let organizationType = null

let permissionTypeList = {
    CHANGE_ORGANIZATION: 'CHANGE_ORGANIZATION',
    GRANT: 'GRANT',
    VIEW_HIDDEN_PROBLEM: 'VIEW_HIDDEN_PROBLEM',
    CREATE_AND_EDIT_PROBLEM: 'CREATE_AND_EDIT_PROBLEM',
    EDIT_NOT_OWNER_PROBLEM: 'EDIT_NOT_OWNER_PROBLEM',
    VIEW_PUBLIC_SOLUTION: 'VIEW_PUBLIC_SOLUTION',
}

function init() {
    check(() => {})
    CommonManager.getEnum("OrganizationType", res => organizationType = res)
}

function isLogin() {
    return userData !== null && userData.id !== null
}

function isNormal() {
    return isLogin() && userData.type === 'NORMAL'
}

function check(callback) {
    if (isLogin()) {
        callback()
        return
    }
    Request.get(baseUrl + '/check', null, res => {
        if (res != null) {
            userData = res
        }
        callback()
    })
}

function signIn(handle, password, callback) {
    Request.post(baseUrl + '/login', {
        handle: handle,
        password: password
    }, res => {
        if (res != null) {
            userData = res
        }
        callback()
    });
}

function signUp(handle, password, callback) {
    Request.post(baseUrl + '/register', {
        handle: handle,
        password: password
    }, res => {
        userData = res
        callback()
    });
}

function signOut() {
    userData = {
        id: null
    }
    // TODO 等待 logout 接口
}

function getUserInfo(handle, callback) {
    if (handle === userData.handle) {
        callback(userData)
        return
    }
    Request.get(baseUrl + '/getUserInfo', {handle: handle}, res => {
        callback(res)
    })
}

function getCurUserData() {
    return userData
}

function isDominate(target) {
    if (!isNormal() || organizationType == null) {
        return false
    }
    return userData.organizationType !== target && (organizationType[userData.organizationType].code & organizationType[target].code) === organizationType[target].code
}

function hasPermission(permission) {
    if (!isNormal()) {
        return false;
    }
    return userData.permissionTypeSet.find(e => e === permission) != null
}

function addPermission(targetId, newPermission) {
    Request.post(baseUrl + '/addPermission', {
        targetId: targetId,
        permissionType: newPermission
    }, null)
}

function removePermission(targetId, removePermission) {
    Request.post(baseUrl + '/removePermission', {
        targetId: targetId,
        permissionType: removePermission
    }, null)
}

function changeOrganization(targetId, newOrganization) {
    Request.post(baseUrl + '/changeOrganization', {
        targetId: targetId,
        newOrganization: newOrganization
    }, null)
}

export default {
    permissionTypeList,

    init,
    isLogin,
    isNormal,
    check,
    signUp,
    signIn,
    signOut,
    getUserInfo,
    getCurUserData,
    isDominate,
    hasPermission,

    addPermission,
    removePermission,
    changeOrganization,
}
