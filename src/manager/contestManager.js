import Request from "@/common/request";

let baseUrl = '/api/contest'

function getList(pageNum, pageSize, success) {
    Request.get(baseUrl + '/getList', {
        pageNum: pageNum,
        pageSize: pageSize
    }, success, null)
}

function getContestInfo(contestId, success) {
    Request.get(baseUrl + '/getInfo', {
        contestId: contestId
    }, success, null)
}

function getContestData(contestId, success) {
    Request.get(baseUrl + '/get', {
        contestId: contestId
    }, success, null)
}

function getContestDataAdmin(contestId, success) {
    Request.get(baseUrl + '/getAdmin', {
        contestId: contestId
    }, success, null)
}

function getContestProblem(contestId, problemIndex, success) {
    Request.get(baseUrl + '/problem', {
        contestId: contestId,
        problemIndex: problemIndex
    }, success, null)
}

function rank(contestId, pageNum, pageSize, freeze, success) {
    Request.get(baseUrl + '/rank', {
        contestId: contestId,
        pageNum: pageNum,
        pageSize: pageSize,
        freeze: freeze
    }, success, null)
}

function getContestStatus(contestId, pageNum, pageSize, userHandle, problemId, statusType, success, callback) {
    Request.get(baseUrl + '/status', {
        contestId: contestId,
        pageNum: pageNum,
        pageSize: pageSize,
        userHandle: userHandle,
        problemId: problemId,
        statusType: statusType
    }, success, callback)
}

function getContestSolution(solutionId, success) {
    Request.get(baseUrl + '/statusDetail', {
        solutionId: solutionId
    }, success, null)
}

function getContestTestStatus(contestId, pageNum, pageSize, userHandle, problemId, statusType, success, callback) {
    Request.get(baseUrl + '/testStatus', {
        contestId: contestId,
        pageNum: pageNum,
        pageSize: pageSize,
        userHandle: userHandle,
        problemId: problemId,
        statusType: statusType
    }, success, callback)
}

function getContestTestSolution(solutionId, success) {
    Request.get(baseUrl + '/testStatusDetail', {
        solutionId: solutionId
    }, success, null)
}

function newContest(contest, success) {
    Request.post(baseUrl + '/newContest', contest, success, null)
}

function updateContest(contest, success) {
    Request.post(baseUrl + '/updateContest', contest, success, null)
}

function addProblem(contestId, problemId, success) {
    Request.post(baseUrl + '/addProblem', {
        contestId: contestId,
        problemId: problemId
    }, success, null)
}

function auth(contestId, password, success) {
    Request.post(baseUrl + '/auth', {
        contestId: contestId,
        password: password
    }, success, null)
}

function submit(contestId, problemIndex, code, languageType, success) {
    Request.post(baseUrl + '/submit', {
        contestId: contestId,
        problemId: problemIndex,
        code: code,
        languageType: languageType
    }, success, null)
}

export default {
    getList,
    getContestInfo,
    getContestData,
    getContestDataAdmin,
    getContestProblem,
    rank,
    getContestStatus,
    getContestSolution,
    getContestTestStatus,
    getContestTestSolution,

    newContest,
    updateContest,
    addProblem,
    auth,
    submit,
}