import Request from "@/common/request";

let baseUrl = '/api/problem'

function init() {
    // do nothing
}

function getProblemList(pageNum, pageSize, callback) {
    Request.get(baseUrl + '/getList', {
        pageNum: pageNum,
        pageSize: pageSize
    }, res => callback(res))
}

function getProblemData(id, callback) {
    Request.get(baseUrl + '/getData', {
        id: id
    }, res => callback(res))
}

export default {
    init,

    getProblemList,
    getProblemData,
}