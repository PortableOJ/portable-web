import axios from "axios";

let Toast = null;

function init(toast) {
    Toast = toast
}

function dealResponse(response) {
    if (response.success) {
        return response.data
    } else {
        Toast({
            title: `失败(${response.code})`,
            text: `${response.msg}`,
            duration: 'auto',
            type: 'error'
        })
    }
}

function axiosSend(data, callback) {
    axios(data).then(res => {
        let response = dealResponse(res.data)
        if (callback !== null && callback !== undefined) {
            callback(response)
        }
    }).catch(e => {
        Toast({
            title: '出错啦',
            text: `遇到了未知的错误，请联系管理员解决: ${e}`,
            duration: 'auto',
            type: 'error'
        })
    })
}

function download(url, data) {
    let params = []
    for (let i in data) {
        params.push(`${i}=${data[i]}`)
    }
    window.open(`${url}?${params.join('&')}`)
}

function get(url, data, callback) {
    axiosSend({
        url: url,
        method: 'GET',
        params: data,
        responseType: 'json',
    }, callback)
}

function post(url, data, callback) {
    axiosSend({
        url: url,
        method: 'POST',
        data: data,
        responseType: 'json',
    }, callback)
}

function postFile(url, data, callback) {
    let form = new FormData()
    for (let i in data) {
        form.append(i, data[i])
    }
    axiosSend({
        url: url,
        method: 'POST',
        data: form,
        responseType: 'json',
    }, callback)
}

export default {
    init,
    get,
    post,
    download,
    postFile,
}
