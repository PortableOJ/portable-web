import Request from "@/common/request";

let baseUrl = '/api/contest'

function getList(pageNum, pageSize, success) {
    Request.get(baseUrl + '/getList', {
        pageNum: pageNum,
        pageSize: pageSize
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

// TODO: rank

function getContestStatus(contestId, pageNum, pageSize, userId, problemId, statusType, success) {
    Request.get(baseUrl + '/status', {
        contestId: contestId,
        pageNum: pageNum,
        pageSize: pageSize,
        userId: userId,
        problemId: problemId,
        statusType: statusType
    }, success, null)
}

function getContestSolution(solutionId, success) {
    Request.get(baseUrl + '/statusDetail', {
        solutionId: solutionId
    }, success, null)
}

function getContestTestStatus(contestId, pageNum, pageSize, userId, problemId, statusType, success) {
    Request.get(baseUrl + '/testStatus', {
        contestId: contestId,
        pageNum: pageNum,
        pageSize: pageSize,
        userId: userId,
        problemId: problemId,
        statusType: statusType
    }, success, null)
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
    getContestData,
    getContestDataAdmin,
    getContestProblem,
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