import { UserLayout, BasicLayout, RouteView } from "@/layouts";

export const constantRouterMap = [
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/Login"),
      },
      {
        path: "register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/Register"),
      },
    ],
  },
];

export const asyncRouterMap = [
  {
    path: "/",
    name: "index",
    component: BasicLayout,
    meta: { title: "Hệ thống thi trực tuyến" },
    redirect: "/dashboard/home",
    children: [
      // dashboard
      {
        path: "/dashboard",
        name: "dashboard",
        redirect: "/dashboard/home",
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          title: "Trang chủ",
          keepAlive: true,
          icon: "home",
          permission: ["dashboard"],
        },
        children: [
          {
            path: "/dashboard/home",
            name: "Workplace",
            component: () => import("../views/Home"),
            meta: {
              title: "Giới thiệu",
              keepAlive: true,
              permission: ["dashboard"],
            },
          },
        ],
      },

      // {
      //   path: '/exam-card',
      //   name: 'exam-card',
      //   redirect: '/list/exam-card',
      //   component: PageView,
      //   hideChildrenInMenu: true,
      //   meta: { title: 'Exam', keepAlive: true, icon: examList, permission: ['exam-card'] },
      //   children: [
      //     {
      //       path: '/list/exam-card',
      //       name: 'ExamCardList',
      //       component: () => import('../views/list/ExamCardList'),
      //       meta: { title: 'Exam List', keepAlive: true, permission: ['exam-card'] }
      //     }
      //   ]
      // },
      // {
      //   path: '/question-admin',
      //   name: 'question-admin',
      //   redirect: '/list/question-table-list',
      //   component: PageView,
      //   hideChildrenInMenu: true,
      //   meta: { title: 'Question Admin', keepAlive: true, icon: questionAdmin, permission: ['question-admin'] },
      //   children: [
      //     {
      //       path: '/list/question-table-list',
      //       name: 'QuestionTableListWrapper',
      //       hideChildrenInMenu: true,
      //       component: () => import('../views/list/QuestionTableList'),
      //       meta: { title: 'Question List', keepAlive: true, permission: ['question-admin'] }
      //     }
      //   ]
      // },
      // list
      // {
      //   path: '/list/exam-table-list',
      //   name: 'exam-table-list',
      //   component: PageView,
      //   redirect: '/list/exam-table-list',
      //   hideChildrenInMenu: true,
      //   meta: { title: 'Exam Admin', icon: examAdmin, permission: ['exam-table-list'] },
      //   children: [
      //     {
      //       path: '/list/exam-table-list',
      //       name: 'ExamTableListWrapper',
      //       hideChildrenInMenu: true,
      //       component: () => import('../views/list/ExamTableList'),
      //       meta: { title: 'Exam List', keepAlive: true, permission: ['exam-table-list'] }
      //     }
      //   ]
      // },
      // {
      //   path: '/exam-record-list',
      //   name: 'exam-record-list',
      //   redirect: '/list/exam-record-list',
      //   component: PageView,
      //   hideChildrenInMenu: true,
      //   meta: { title: 'My Exam Record', keepAlive: true, icon: 'user', permission: ['exam-record-list'] },
      //   children: [
      //     {
      //       path: '/list/exam-record-list',
      //       name: 'ExamRecordList',
      //       component: () => import('../views/list/ExamRecordList'),
      //       meta: { title: 'List Of Test', keepAlive: true, permission: ['exam-record-list'] }
      //     }
      //   ]
      // },
      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   hidden: true,
      //   meta: { title: 'User Info', icon: 'user', keepAlive: true, permission: ['user'] },
      //   children: [
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('../views/account/settings/Index'),
      //       meta: { title: 'User Setting', hideHeader: true, permission: ['user'] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('../views/account/settings/BaseSetting'),
      //           meta: { title: 'Base Setting', hidden: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('../views/account/settings/Custom'),
      //           meta: { title: 'Custom Setting', hidden: true, keepAlive: true, permission: ['user'] }
      //         }
      //       ]
      //     }
      //   ]
      // }
    ],
  },
  {
    // Tất cả các đường dẫn không thể truy cập cuối cùng sẽ rơi vào 404
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];
