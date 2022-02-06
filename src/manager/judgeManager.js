import Request from "@/common/request";

let baseUrl = 'api/judge'

function getServerCode(callback) {
    Request.get(baseUrl + '/serverCode', null, res => callback(res))
}

function getJudgeContainerList(callback) {
    Request.get(baseUrl + '/judgeList', null, res => callback(res))
}

function updateJudge(judgeCode, newMaxThreadCore, newMaxWorkCore, newMaxSocketCore, newMaxWorkNum, callback) {
    Request.post(baseUrl + '/updateJudge', {
        judgeCode: judgeCode,
        maxThreadCore: newMaxThreadCore,
        maxWorkCore: newMaxWorkCore,
        maxSocketCore: newMaxSocketCore,
        maxWorkNum: newMaxWorkNum
    }, () => callback())
}

function killJudge(solutionId, callback) {
    Request.post(baseUrl + '/killJudge', {
        id: solutionId
    }, () => callback())
}

function killTest(problemId, callback) {
    Request.post(baseUrl + '/killTest', {
        id: problemId
    }, () => callback())
}

export default {
    getServerCode,
    getJudgeContainerList,
    updateJudge,
    killJudge,
    killTest
}