import Request from "@/common/request";

let userData = {
    id: null,
    handle: null,
    type: null,
    organizationType: null,
    permissionTypeSet: [],
}

let organizationType = {}

let permissionTypeList = {
    CHANGE_ORGANIZATION: "CHANGE_ORGANIZATION",
    GRANT: "GRANT",
    VIEW_HIDDEN_PROBLEM: "VIEW_HIDDEN_PROBLEM",
    CREATE_AND_EDIT_PROBLEM: "CREATE_AND_EDIT_PROBLEM",
    EDIT_NOT_OWNER_PROBLEM: "EDIT_NOT_OWNER_PROBLEM",
    VIEW_PUBLIC_SOLUTION: "VIEW_PUBLIC_SOLUTION",
}

function init() {
    // TODO: 等待 check 接口
}

function isLogin() {
    return userData !== null && userData.id !== null
}

function isNormal() {
    return isLogin() && userData.type === 'NORMAL'
}

function signIn(handle, password, callback) {
    Request.post("/api/user/login", {
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
    Request.post("/api/user/register", {
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

function getUserData() {
    return userData
}

function isDominate(target) {
    if (!isNormal() || organizationType == null) {
        return false
    }
    return (organizationType[userData.organizationType].code & organizationType[target].code) === organizationType[target].code
}

function hasPermission(permission) {
    if (!isNormal()) {
        return false;
    }
    return userData.permissionTypeSet.find(e => e === permission) != null
}

function addPermission(targetId, newPermission, callback) {
    Request.post("/api/user/addPermission", {
        targetId: targetId,
        permissionType: newPermission
    }, callback)
}

function removePermission(targetId, removePermission, callback) {
    Request.post("/api/user/removePermission", {
        targetId: targetId,
        permissionType: removePermission
    }, callback)
}

function changeOrganization(targetId, newOrganization, callback) {
    Request.post("/api/user/changeOrganization", {
        targetId: targetId,
        newOrganization: newOrganization
    }, callback)
}

export default {
    permissionTypeList,

    init,
    isLogin,
    isNormal,
    signUp,
    signIn,
    signOut,
    getUserData,
    isDominate,
    hasPermission,

    addPermission,
    removePermission,
    changeOrganization,
}