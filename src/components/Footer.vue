<template>
    <div class="footer">
        <div>
            Copyright ©
            <Link @click="open('https://github.com/PortableOJ')">Portable Online Judge Develop Team</Link>
        </div>
        <div>
            Powered By
            <Link @click="open('https://github.com/PortableOJ/portable-oj')">Portable Online Judge Project</Link>
        </div>
        <div>
            Contributor:
            <Link @click="open('https://github.com/Hukeqing')">Shiroha</Link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Footer",
    methods: {
        open(url) {
            window.open(url, '_blank')
        }
    }
}
</script>

<style scoped>
.footer {
    margin-top: 50px;
    font-size: small;
    user-select: none;
}
</style>