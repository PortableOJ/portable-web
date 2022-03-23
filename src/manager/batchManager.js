import Request from "@/common/request";

let baseUrl = '/api/batch'

function getList(pageNum, pageSize, success) {
    Request.get(baseUrl + '/get', {
        pageNum: pageNum,
        pageSize: pageSize
    }, success, null)
}

function newBatch(batch, success, callback) {
    Request.post(baseUrl + '/new', batch, success, callback)
}

function updateStatus(id, newStatus, success) {
    Request.post(baseUrl + '/updateStatus', {
        id: id,
        newStatus: newStatus
    }, success, null)
}

function updateIpLock(id, newIpLock, success) {
    Request.post(baseUrl + '/updateIpLock', {
        id: id,
        ipLock: newIpLock
    }, success, null)
}

function get(id, success) {
    Request.get(baseUrl + '/check', {
        id: id
    }, success, null)
}

export default {
    getList,
    newBatch,
    updateStatus,
    updateIpLock,
    get,
}