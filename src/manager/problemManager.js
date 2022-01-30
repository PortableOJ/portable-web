import Request from "@/common/request";

let baseUrl = '/api/problem'

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

function submit(id, code, languageType, callback) {
    Request.post(baseUrl + '/submit', {
        problemId: id,
        code: code,
        languageType: languageType
    }, res => callback(res))
}

export default {
    getProblemList,
    getProblemData,
    submit,
}