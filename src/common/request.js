import axios from "axios";

let Toast = null
let NeedCaptcha = null
let NextCaptcha = null

function init(toast, needCaptcha) {
    Toast = toast
    NeedCaptcha = needCaptcha
}

function setCaptcha(value) {
    NextCaptcha = value
}
function captcha() {
    NeedCaptcha()
}

function reduceCode(code, msg) {
    let dic = {'W-00-001': captcha}
    if (dic[code]) {
        dic[code](msg)
    } else {
        Toast({
            title: `失败(${code})`,
            text: `${msg}`,
            duration: 'auto',
            type: 'error'
        })
    }
}

function dealResponse(response, success, callback) {
    if (response.success) {
        if (success) {
            success(response.data)
        }
        if (callback) {
            callback(true, null)
        }
    } else {
        reduceCode(response.code, response.msg)
        if (callback) {
            callback(false, response.code)
        }
    }
}

function axiosSend(data, success, callback) {
    axios(data).then(res => {
        dealResponse(res.data, success, callback)
    }).catch(e => {
        Toast({
            title: '出错啦',
            text: `遇到了未知的错误，请联系管理员解决: ${e}`,
            duration: 'auto',
            type: 'error'
        })
        if (callback) {
            callback(false, null)
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
    postWithCaptcha(url, data, NextCaptcha, success, callback)
    NextCaptcha = null
}

function postWithCaptcha(url, data, captcha, success, callback) {
    axiosSend({
        url: url,
        method: 'POST',
        data: data,
        headers: {captcha: captcha},
        responseType: 'json',

    }, success, callback)
}

function postFile(url, data, success, process, callback) {
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
                const complete = (progressEvent.loaded / progressEvent.total)
                process(complete)
            }
        }
    }, success, callback)
}

export default {
    init,
    setCaptcha,
    get,
    post,
    postWithCaptcha,
    download,
    postFile,
}
