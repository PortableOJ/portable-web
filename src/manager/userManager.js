import Request from '@/common/request';
import CommonManager from "@/manager/commonManager";

let baseUrl = '/api/user'

let userData = {
    id: null,
    handle: null,
    type: null,
    organizationType: null,
    permissionTypeSet: [],
    avatar: null,
}

let organizationType = null

let onLogin = false

let permissionTypeList = {
    GRANT: 'GRANT',
    CHANGE_ORGANIZATION: 'CHANGE_ORGANIZATION',
    RESET_PASSWORD: 'RESET_PASSWORD',
    VIEW_HIDDEN_PROBLEM: 'VIEW_HIDDEN_PROBLEM',
    CREATE_AND_EDIT_PROBLEM: 'CREATE_AND_EDIT_PROBLEM',
    EDIT_NOT_OWNER_PROBLEM: 'EDIT_NOT_OWNER_PROBLEM',
    VIEW_PUBLIC_SOLUTION: 'VIEW_PUBLIC_SOLUTION',
    VIEW_SOLUTION_MESSAGE: 'VIEW_SOLUTION_MESSAGE',
    VIEW_ALL_CONTEST: 'VIEW_ALL_CONTEST',
    CREATE_AND_EDIT_CONTEST: 'CREATE_AND_EDIT_CONTEST',
    EDIT_NOT_OWNER_CONTEST: 'EDIT_NOT_OWNER_CONTEST',
    CREATE_AND_EDIT_BATCH: 'CREATE_AND_EDIT_BATCH',
    MANAGER_JUDGE: 'MANAGER_JUDGE',
    UPLOAD_FILE: 'UPLOAD_FILE',
}

let userStatusChange = {}

function init(callback) {
    let cnt = 0
    let tar = 3
    check(() => {
        cnt++
        if (cnt === tar) callback()
    })
    CommonManager.getEnum("OrganizationType", res => {
        organizationType = res
        cnt++
        if (cnt === tar) callback()
    })
    cnt++
}

function isLogin() {
    return userData !== null && userData.id !== null
}

function isNormal() {
    return isLogin() && userData.type === 'NORMAL'
}

/**
 * 废弃
 * @param name 名称
 * @param callback 调用函数
 */
function registerUserStatusChange(name, callback) {
    userStatusChange[name] = callback
}

function check(callback) {
    if (onLogin) {
        window.setTimeout(check, 100, callback)
        return
    }
    if (isLogin()) {
        callback()
        return
    }
    onLogin = true
    Request.get(baseUrl + '/check', null, res => {
        userData = res
    }, () => {
        onLogin = false
        callback()
    })
}

function signIn(handle, password, callback) {
    Request.post(baseUrl + '/login', {
        handle: handle,
        password: password
    }, res => {
        userData = res
        location.reload()
    }, callback);
}

function signUp(handle, password, captcha, success, callback) {
    Request.postWithCaptcha(baseUrl + '/register', {
        handle: handle,
        password: password
    }, captcha, res => {
        userData = res
        if (success) {
            success()
        }
    }, callback);
}

function signOut() {
    userData = {
        id: null,
        handle: null,
        type: null,
        organizationType: null,
        permissionTypeSet: [],
    }
    Request.post(baseUrl + '/logout', null, () => {
        location.reload()
    })
}

function getUserInfo(handle, success) {
    if (isLogin() && handle === userData.handle) {
        success(userData)
        return
    }
    Request.get(baseUrl + '/getUserInfo', {
        handle: handle
    }, success)
}

function getBatchUserAdminInfo(handle, success) {
    Request.get(baseUrl + '/getBatchUserAdminInfo', {
        handle: handle
    }, success)
}

function clearIpList(handle, success) {
    Request.post(baseUrl + '/clearIpList', {
        name: handle
    }, success)
}

function getCurUserData() {
    return userData
}

function getCurUserHandle() {
    return userData == null ? null : userData.handle
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

function addPermission(targetHandle, newPermission, success) {
    Request.post(baseUrl + '/addPermission', {
        targetHandle: targetHandle,
        permissionType: newPermission
    }, success, null)
}

function removePermission(targetHandle, removePermission, success) {
    Request.post(baseUrl + '/removePermission', {
        targetHandle: targetHandle,
        permissionType: removePermission
    }, success, null)
}

function changeOrganization(targetHandle, newOrganization, success) {
    Request.post(baseUrl + '/changeOrganization', {
        targetHandle: targetHandle,
        newOrganization: newOrganization
    }, success, null)
}

function changeAvatar(cutValue, success) {
    Request.postFile(baseUrl + '/avatar', {
        fileData: cutValue.file,
        left: cutValue.left,
        top: cutValue.top,
        width: cutValue.width,
        height: cutValue.height,
    }, success, null, null)
}

function changePassword(oldPassword, newPassword, success) {
    Request.post(baseUrl + '/changePassword', {
        oldPassword: oldPassword,
        newPassword: newPassword
    }, success, null, null)
}

function resetPassword(handle, newPassword, success) {
    Request.post(baseUrl + '/resetPassword', {
        handle: handle,
        newPassword: newPassword
    }, success, null, null)
}

export default {
    permissionTypeList,

    init,
    isLogin,
    isNormal,
    registerUserStatusChange,
    check,
    signUp,
    signIn,
    signOut,
    getUserInfo,
    getBatchUserAdminInfo,
    clearIpList,
    getCurUserData,
    getCurUserHandle,
    isDominate,
    hasPermission,

    addPermission,
    removePermission,
    changeOrganization,

    changeAvatar,
    changePassword,
    resetPassword,
}
