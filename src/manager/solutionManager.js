import Request from "@/common/request";

let baseUrl = '/api/solution'

function getPublicSolutionList(pageNum, pageSize, callback) {
    Request.get(baseUrl + '/getPublicStatus', {
        pageNum: pageNum,
        pageSize: pageSize
    }, callback, null)
}

function getSolution(id, callback) {
    Request.get(baseUrl + '/getSolution', {
        id: id,
    }, callback, null)
}

export default {
    getPublicSolutionList,
    getSolution,
}