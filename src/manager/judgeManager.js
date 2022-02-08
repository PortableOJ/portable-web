import Request from "@/common/request";

let baseUrl = 'api/judge'

function getServerCode(callback) {
    Request.get(baseUrl + '/serverCode', null, callback, null)
}

function getJudgeContainerList(callback) {
    Request.get(baseUrl + '/judgeList', null, callback, null)
}

function updateJudge(judgeCode, newMaxThreadCore, newMaxWorkCore, newMaxSocketCore, newMaxWorkNum, callback) {
    Request.post(baseUrl + '/updateJudge', {
        judgeCode: judgeCode,
        maxThreadCore: newMaxThreadCore,
        maxWorkCore: newMaxWorkCore,
        maxSocketCore: newMaxSocketCore,
        maxWorkNum: newMaxWorkNum
    }, callback, null)
}

function killJudge(solutionId, callback) {
    Request.post(baseUrl + '/killJudge', {
        id: solutionId
    }, callback, null)
}

function killTest(problemId, callback) {
    Request.post(baseUrl + '/killTest', {
        id: problemId
    }, callback, null)
}

export default {
    getServerCode,
    getJudgeContainerList,
    updateJudge,
    killJudge,
    killTest
}