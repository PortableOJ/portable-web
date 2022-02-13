import Request from "@/common/request";

let baseUrl = '/api/solution'

function getPublicSolutionList(pageNum, pageSize, userId, problemId, statusType, success) {
    Request.get(baseUrl + '/getPublicStatus', {
        pageNum: pageNum,
        pageSize: pageSize,
        userId: userId,
        problemId: problemId,
        statusType: statusType
    }, success, null)
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