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
        path: '/user/manager/:handle',
        name: 'userManager',
        component: () => import('@/pages/UserManager')
    }, {
        path: '/problemSet',
        name: 'problemSet',
        component: () => import('@/pages/ProblemSet')
    }, {
        path: '/problemSet/problem/:problemId',
        name: 'problem',
        component: () => import('@/pages/Problem')
    }, {
        path: '/status',
        name: 'status',
        component: () => import('@/pages/StatusPage')
    }, {
        path: '/status/:solutionId',
        name: 'solution',
        component: () => import('@/pages/SolutionPage')
    }, {
        path: '/problemSet/problem/:problemId/test',
        name: 'problemTest',
        component: () => import('@/pages/ProblemTestPage')
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
