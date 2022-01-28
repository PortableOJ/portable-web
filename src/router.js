import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    }, {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/Home')
    }, {
        path: '/user/:handle',
        name: 'user',
        component: () => import('@/pages/User')
    }, {
        path: '/problemSet',
        name: 'problemSet',
        component: () => import('@/pages/ProblemSet')
    }, {
        path: '/problemSet/problem/:problemId',
        name: 'problem',
        component: () => import('@/pages/Problem')
    }, {
        path: '*',
        name: 'notFound',
        component: () => import('@/pages/NotFound')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

export default router
