import axios from "axios";

let Toast = null;

function init(toast) {
    Toast = toast
}

function dealResponse(response, success) {
    if (response.success) {
        if (success) {
            success(response.data)
        }
    } else {
        Toast({
            title: `失败(${response.code})`,
            text: `${response.msg}`,
            duration: 'auto',
            type: 'error'
        })
    }
}

function axiosSend(data, success, callback) {
    axios(data).then(res => {
        dealResponse(res.data, success)
        if (callback) {
            callback()
        }
    }).catch(e => {
        Toast({
            title: '出错啦',
            text: `遇到了未知的错误，请联系管理员解决: ${e}`,
            duration: 'auto',
            type: 'error'
        })
        if (callback) {
            callback()
        }
    })
}

function download(url, data) {
    let params = []
    for (let i in data) {
        params.push(`${i}=${data[i]}`)
    }
    window.open(`${url}?${params.join('&')}`)
}

function get(url, data, success, callback) {
    axiosSend({
        url: url,
        method: 'GET',
        params: data,
        responseType: 'json',
    }, success, callback)
}

function post(url, data, success, callback) {
    axiosSend({
        url: url,
        method: 'POST',
        data: data,
        responseType: 'json',
    }, success, callback)
}

function postFile(url, data, success, callback) {
    let form = new FormData()
    for (let i in data) {
        form.append(i, data[i])
    }
    axiosSend({
        url: url,
        method: 'POST',
        data: form,
        responseType: 'json',
        onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
                let complete =
                    (((progressEvent.loaded / progressEvent.total) * 100) | 0);
                this.percent = complete
                if (complete >= 100) {
                    complete = 100
                }
                callback(complete)
            }
        }
    }, success, null)
}

export default {
    init,
    get,
    post,
    download,
    postFile,
}
