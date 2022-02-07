import Request from "@/common/request";

let baseUrl = '/api/problem'

function getProblemList(pageNum, pageSize, callback) {
    Request.get(baseUrl + '/getList', {
        pageNum: pageNum,
        pageSize: pageSize
    }, callback, null)
}

function getProblemData(id, callback) {
    Request.get(baseUrl + '/getData', {
        id: id
    }, callback, null)
}

function getTestList(id, callback) {
    Request.get(baseUrl + '/getTestList', {
        id: id
    }, callback, null)
}

function getTestInputShow(id, name, callback) {
    Request.get(baseUrl + '/getTestInputShow', {
        id: id,
        name: name
    }, callback, null)
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
    }, callback, null)
}

function getTestOutput(id, name) {
    Request.download(baseUrl + '/getTestOutput', {
        id: id,
        name: name
    })
}

function newProblem(problemData, callback) {
    Request.post(baseUrl + '/newProblem', problemData, callback, null)
}

function updateContent(problemData, callback) {
    Request.post(baseUrl + '/updateContent', problemData, callback, null)
}

function updateSetting(problemData, callback) {
    Request.post(baseUrl + '/updateSetting', problemData, callback, null)
}

function updateJudge(problemData, callback) {
    Request.post(baseUrl + '/updateJudge', problemData, callback, null)
}

function addTest(problemId, name, file, callback) {
    Request.postFile(baseUrl + '/addTest', {
        id: problemId,
        name: name,
        fileData: file
    }, callback, null)
}

function removeTest(problemId, name, callback) {
    Request.post(baseUrl + '/removeTest', {
        id: problemId,
        name: name,
    }, callback, null)
}

function getStdTestCode(problemId, callback) {
    Request.get(baseUrl + '/getStdTestCode', {
        id: problemId,
    }, callback, null)
}

function updateStdCode(problemId, code, languageType, callback) {
    Request.post(baseUrl + '/updateStdCode', {
        id: problemId,
        code: code,
        languageType: languageType,
        codeName: 'STD',
        resultType: 'ACCEPT'
    }, callback, null)
}

function addTestCode(problemId, code, languageType, name, resultType, callback) {
    Request.post(baseUrl + '/addTestCode', {
        id: problemId,
        code: code,
        languageType: languageType,
        codeName: name,
        resultType: resultType
    }, callback, null)
}

function removeTestCode(problemId, name, callback) {
    Request.post(baseUrl + '/removeTestCode', {
        id: problemId,
        name: name,
    }, callback, null)
}

function getStdCodeShow(problemId, callback) {
    Request.get(baseUrl + '/getStdCodeShow', {
        id: problemId,
    }, callback, null)
}

function getTestCodeShow(problemId, name, callback) {
    Request.get(baseUrl + '/getTestCodeShow', {
        id: problemId,
        name: name
    }, callback, null)
}

function getStdCode(problemId, callback) {
    Request.download(baseUrl + '/getStdCode', {
        id: problemId,
    }, callback, null)
}

function getTestCode(problemId, name, callback) {
    Request.download(baseUrl + '/getTestCode', {
        id: problemId,
        name: name
    }, callback, null)
}

function treatAndCheckProblem(problemId, callback) {
    Request.post(baseUrl + '/treatAndCheckProblem', {
        id: problemId,
    }, callback, null)
}

function submit(id, code, languageType, callback) {
    Request.post(baseUrl + '/submit', {
        problemId: id,
        code: code,
        languageType: languageType
    }, callback, null)
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