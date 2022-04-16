<template>
    <div class="footer">
        <div>
            <span>Copyright ©</span>
            <Link @click="open('https://github.com/PortableOJ')">Portable Online Judge Develop Team</Link>
            <i class="iconfont icon-app"></i>
            <span>Powered By</span>
            <Link @click="open('https://github.com/PortableOJ/portable-oj')">Portable Online Judge Project</Link>
        </div>
        <div>
            <span> Give us an </span>
            <Link @click="open('https://github.com/PortableOJ/portable-server/issues')">issue</Link>
            <span> to make us do better </span>
        </div>
        <div>
            Contributors:
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
    margin-top: 100px;
    font-size: small;
    user-select: none;
    border-top: 1px solid var(--border-color-level-1);
    padding-top: 10px;
}
</style>