import Request from "@/common/request";

let baseUrl = '/api/solution'

function getPublicSolutionList(pageNum, pageSize, userHandle, problemId, statusType, success, callback) {
    Request.get(baseUrl + '/getPublicStatus', {
        pageNum: pageNum,
        pageSize: pageSize,
        userHandle: userHandle,
        problemId: problemId,
        statusType: statusType
    }, success, callback)
}

function getSolution(id, success) {
    Request.get(baseUrl + '/getSolution', {
        id: id,
    }, success, null)
}

export default {
    getPublicSolutionList,
    getSolution,
}