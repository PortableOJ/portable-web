import Request from "@/common/request";

let enumData = {}

let version = null

let maxRequestFileSize = 200 * 1024 * 1024

/**
 * 设置缓存
 *
 * @param key key
 * @param value value
 * @param expires 缓存时间，不允许无限缓存，单位：分钟
 */
function setCache(key, value, expires) {
    if (!window.localStorage) {
        return
    }
    let data = {
        version: version,
        data: value,
        expires: expires * 60000 + new Date().getTime()
    }
    localStorage.setItem(key, JSON.stringify(data))
}

function getCache(key) {
    if (!window.localStorage) {
        return null
    }
    let data = window.localStorage.getItem(key)
    if (!data) {
        return null
    }
    data = JSON.parse(data)
    if (data.expires >= new Date().getTime() && data.version === version) {
        return data.data
    }
    return null
}

function init(callback) {
    if (version === null) {
        version = getCache('version')
    }
    if (version === null) {
        Request.get("/api/common/version", null, res => {
            setCache('version', res, 10)
            version = res;
            callback()
        }, null)
    } else {
        setCache('version', version, 10)
        callback()
    }
}

function getEnum(name, callback) {
    if (enumData[name]) {
        callback(enumData[name])
        return
    }
    let tmp = getCache(`ENUM_${name}`)
    if (tmp != null) {
        enumData[name] = tmp
        setCache(`ENUM_${name}`, tmp, 1200)
        callback(tmp)
        return
    }
    Request.get("/api/common/enum", {name: name}, res => {
        enumData[name] = res
        setCache(`ENUM_${name}`, res, 1200)
        callback(res)
    }, null)
}

function getQueryInt(that, name, defaultValue) {
    let tmp = that.$route.query[name] ? parseInt(that.$route.query[name].toString()) : null
    return tmp ? tmp : defaultValue
}

function getQueryString(that, name, defaultValue) {
    let tmp = that.$route.query[name] ? that.$route.query[name].toString() : null
    return tmp ? tmp : defaultValue
}

function copy(str) {
    const clipboard = navigator.clipboard;
    if (clipboard) {
        clipboard.writeText(str)
    } else {
        let tag = document.createElement('textarea');
        tag.setAttribute('id', 'input_for_cp');
        tag.value = str;
        document.body.appendChild(tag);
        document.getElementById('input_for_cp').select();
        document.execCommand('copy');
        document.getElementById('input_for_cp').remove();
    }
}

export default {
    version,
    maxRequestFileSize,

    init,

    setCache,
    getCache,

    getEnum,

    getQueryInt,
    getQueryString,

    copy,
}