import Request from "@/common/request";

let baseUrl = '/api/file'

function fileUrl(id, type) {
    return `/api/file/get?id=${id}&type=${type}`
}

function uploadImage(file, success) {
    Request.postFile(baseUrl + '/image', {
        fileData: file
    }, success, null)
}

export default {
    fileUrl,
    uploadImage,
}