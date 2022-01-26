import Request from "@/common/request";

let enumData = {}

let version = null

function init() {
    // TODO: 读取缓存
    // Request.get("/api/common/version", null, res => {
    //     version = res;
    // })
}

function getEnum(name, callback) {
    if (!(enumData[name] === null || enumData[name] === undefined)) {
        callback(enumData[name])
        return
    }
    Request.get("/api/common/enum", {name: name}, res => {
        enumData[name] = res
        // TODO: 缓存
        callback(res)
    })
}

export default {
    version,

    init,

    getEnum
}