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
        component: () => import('@/pages/Home'),
    }, {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/Register')
    }, {
        path: '/user/:handle',
        component: () => import('@/pages/User'),
        children: [
            {
                path: '',
                name: 'user',
                redirect: '/user/:handle/info'
            }, {
                path: 'info',
                name: 'user-info',
                component: () => import('@/pages/user/Info')
            }, {
                path: 'setting',
                name: 'user-setting',
                component: () => import('@/pages/user/Setting')
            }, {
                path: 'security',
                name: 'user-security',
                component: () => import('@/pages/user/Security')
            }, {
                path: 'manager',
                name: 'user-manager',
                component: () => import('@/pages/user/Manager')
            }, {
                path: 'batch',
                name: 'user-batch',
                component: () => import('@/pages/user/Batch')
            }
        ]
    }, {
        path: '/problemSet',
        name: 'problemSet',
        component: () => import('@/pages/ProblemSet'),
    }, {
        path: '/problemSet/problem/:problemId',
        name: 'problem',
        component: () => import('@/pages/Problem'),
    }, {
        path: '/status',
        name: 'status',
        component: () => import('@/pages/StatusPage'),
    }, {
        path: '/status/:solutionId',
        name: 'solution',
        component: () => import('@/pages/SolutionPage'),
    }, {
        path: '/judge',
        name: 'judge',
        component: () => import('@/pages/JudgeManagerPage'),
    }, {
        path: '/problemSet/problem/:problemId/test',
        name: 'problemTest',
        component: () => import('@/pages/ProblemTestPage'),
    }, {
        path: '/problemSet/problem/:problemId/manager',
        component: () => import('@/pages/ProblemManager'),
        children: [
            {
                path: '',
                name: 'problemManager',
                redirect: '/problemSet/problem/:problemId/manager/content'
            }, {
                path: 'content',
                name: 'problemManager-content',
                component: () => import('@/pages/problemManager/Content'),
            }, {
                path: 'setting',
                name: 'problemManager-setting',
                component: () => import('@/pages/problemManager/Setting'),
            }, {
                path: 'judge',
                name: 'problemManager-judge',
                component: () => import('@/pages/problemManager/Judge'),
            }, {
                path: 'test',
                name: 'problemManager-test',
                component: () => import('@/pages/problemManager/Test'),
            }, {
                path: 'code',
                name: 'problemManager-code',
                component: () => import('@/pages/problemManager/Code'),
            }, {
                path: 'treat',
                name: 'problemManager-treat',
                component: () => import('@/pages/problemManager/Treat'),
            },
        ]
    }, {
        path: '/contestSet',
        name: 'contestSet',
        component: () => import('@/pages/ContestSet'),
    }, {
        path: '/contest/:contestId',
        component: () => import('@/pages/Contest'),
        children: [
            {
                path: '',
                name: 'contest',
                redirect: '/contest/:contestId/info'
            }, {
                path: 'info',
                name: 'contest-info',
                component: () => import('@/pages/contest/Info'),
            }, {
                path: 'content',
                name: 'contest-content',
                component: () => import('@/pages/contest/Content'),
            }, {
                path: 'problem/:problemIndex',
                name: 'contest-problem',
                component: () => import('@/pages/contest/Problem'),
            }, {
                path: 'status',
                name: 'contest-status',
                component: () => import('@/pages/contest/Status'),
            }, {
                path: 'testStatus',
                name: 'contest-test_status',
                component: () => import('@/pages/contest/TestStatus'),
            }, {
                path: 'solution/:solutionId',
                name: 'contest-solution',
                component: () => import('@/pages/contest/Solution'),
            }, {
                path: 'testSolution/:solutionId',
                name: 'contest-test_solution',
                component: () => import('@/pages/contest/TestSolution'),
            }, {
                path: 'rank',
                name: 'contest-rank',
                component: () => import('@/pages/contest/Rank'),
            }, {
                path: 'manager',
                name: 'contest-manager',
                component: () => import('@/pages/contest/Manager'),
            }
        ]
    }, {
        path: '/batch',
        name: 'batch',
        component: () => import('@/pages/BatchManager')
    }, {
        path: '/faq',
        name: 'faq',
        component: () => import('@/pages/FAQ')
    },

    // 404 ?????????????????????
    {
        path: '*',
        name: 'notFound',
        component: () => import('@/pages/NotFound'),
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

export default router
