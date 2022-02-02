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

function newProblem(problemData, callback) {
    Request.post(baseUrl + '/newProblem', problemData, callback)
}

function updateContent(problemData, callback) {
    Request.post(baseUrl + '/updateContent', problemData, callback)
}

function updateSetting(problemData, callback) {
    Request.post(baseUrl + '/updateSetting', problemData, callback)
}

function updateJudge(problemData, callback) {
    Request.post(baseUrl + '/updateJudge', problemData, callback)
}

function addTest(problemId, name, file, callback) {
    Request.postFile(baseUrl + '/addTest', {
        id: problemId,
        name: name,
        fileData: file
    }, callback)
}

function removeTest(problemId, name, callback) {
    Request.post(baseUrl + '/removeTest', {
        id: problemId,
        name: name,
    }, callback)
}

function getStdTestCode(problemId, callback) {
    Request.get(baseUrl + '/getStdTestCode', {
        id: problemId,
    }, callback)
}

function updateStdCode(problemId, code, languageType, callback) {
    Request.post(baseUrl + '/updateStdCode', {
        id: problemId,
        code: code,
        languageType: languageType,
        codeName: 'STD',
        resultType: 'ACCEPT'
    }, callback)
}

function addTestCode(problemId, code, languageType, name, resultType, callback) {
    Request.post(baseUrl + '/addTestCode', {
        id: problemId,
        code: code,
        languageType: languageType,
        codeName: name,
        resultType: resultType
    }, callback)
}

function removeTestCode(problemId, name, callback) {
    Request.post(baseUrl + '/removeTestCode', {
        id: problemId,
        name: name,
    }, callback)
}

function getStdCodeShow(problemId, callback) {
    Request.get(baseUrl + '/getStdCodeShow', {
        id: problemId,
    }, callback)
}

function getTestCodeShow(problemId, name, callback) {
    Request.get(baseUrl + '/getTestCodeShow', {
        id: problemId,
        name: name
    }, callback)
}

function getStdCode(problemId, callback) {
    Request.download(baseUrl + '/getStdCode', {
        id: problemId,
    }, callback)
}

function getTestCode(problemId, name, callback) {
    Request.download(baseUrl + '/getTestCode', {
        id: problemId,
        name: name
    }, callback)
}

function treatAndCheckProblem(problemId, callback) {
    Request.post(baseUrl + '/treatAndCheckProblem', {
        id: problemId,
    }, callback)
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

    newProblem,
    updateContent,
    updateSetting,
    updateJudge,

    addTest,
    removeTest,

    getStdTestCode,
    updateStdCode,
    addTestCode,
    removeTestCode,
    getStdCodeShow,
    getTestCodeShow,
    getStdCode,
    getTestCode,

    treatAndCheckProblem,

    submit,
}