import Request from "@/common/request";

let baseUrl = '/api/solution'

function getPublicSolutionList(pageNum, pageSize, callback) {
    Request.get(baseUrl + '/getPublicStatus', {
        pageNum: pageNum,
        pageSize: pageSize
    }, res => callback(res))
}

function getSolution(id, callback) {
    Request.get(baseUrl + '/getSolution', {
        id: id,
    }, res => callback(res))
}

export default {
    getPublicSolutionList,
    getSolution,
}