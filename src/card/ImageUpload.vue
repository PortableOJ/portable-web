<template>
    <div class="card" v-show="show">
        <span class="card-title">上传图片</span>
        <InputFile class="card-input" @change="loadImage" :accept="'image/*'"></InputFile>
        <InputButton :disabled="!cacheImage" @click="upload">上传并复制图片链接</InputButton>
        <Link v-if="imageUrl" @click="openImage">点击此处复制上一张图片链接</Link>
    </div>
</template>

<script>
export default {
    name: "ImageUpload",
    data() {
        return {
            cacheImage: null,
            imageUrl: null,
            show: false
        }
    },
    created() {
        this.show = this.$user.hasPermission(this.$user.permissionTypeList.UPLOAD_FILE)
    },
    methods: {
        loadImage(files) {
            this.cacheImage = files[0]
        },
        upload() {
            if (!this.cacheImage) {
                return
            }
            this.$file.uploadImage(this.cacheImage, res => {
                this.imageUrl = this.$file.fileUrl(res, 'IMAGE')
                this.$common.copy(`![](${this.imageUrl})`)
                this.$toast({
                    title: '完成',
                    text: '图片上传完成，并已经将图片的地址写入到剪贴板中，或者点击下方链接进行复制',
                    duration: 'auto',
                    type: 'success'
                })
            })
        },
        openImage() {
            this.$common.copy(`![](${this.imageUrl})`)
        }
    }
}
</script>

<style scoped>

</style>