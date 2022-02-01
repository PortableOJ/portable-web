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

function getTestList(id, callback) {
    Request.get(baseUrl + '/getTestList', {
        id: id
    }, res => callback(res))
}

function getTestInputShow(id, name, callback) {
    Request.get(baseUrl + '/getTestInputShow', {
        id: id,
        name: name
    }, res => callback(res))
}

function getTestInput(id, name) {
    Request.download(baseUrl + '/getTestInput', {
        id: id,
        name: name
    })
}

function getTestOutputShow(id, name, callback) {
    Request.get(baseUrl + '/getTestOutputShow', {
        id: id,
        name: name
    }, res => callback(res))
}

function getTestOutput(id, name) {
    Request.download(baseUrl + '/getTestOutput', {
        id: id,
        name: name
    })
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

    getTestList,
    getTestInputShow,
    getTestInput,
    getTestOutputShow,
    getTestOutput,

    submit,
}