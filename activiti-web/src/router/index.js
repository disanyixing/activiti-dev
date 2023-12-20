import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'             the icon show in the sidebar
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/workflow',
    component: Layout,
    redirect: '/workflow/model',
    name: 'Workflow',
    meta: { title: '工作流程', icon: 'example' },
    children: [
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/workflow/model'),
        meta: { title: '模型管理', icon: 'tree' }
      },
      {
        path: 'process',
        name: 'Process',
        component: () => import('@/views/workflow/process'),
        meta: { title: '流程管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/leave',
    name: 'Apply',
    meta: { title: '业务办理', icon: 'form' },
    children: [
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('@/views/workflow/apply/leave'),
        meta: { title: '请假申请', icon: 'table' }
      },
      {
        path: 'loan',
        name: 'Loan',
        component: () => import('@/views/workflow/apply/loan'),
        meta: { title: '借款申请', icon: 'table' }
      }
    ]
  },

  {
    path: '/course',
    component: Layout,
    redirect: '/course/teacher',
    name: 'CourseManagement',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      // {
      //   path: 'teacher',
      //   name: 'TeacherCourseManagement',
      //   component: () => import('@/views/course/teacher/manage'),
      //   meta: { title: '课程管理', icon: 'tree' }
      // },
      // {
      //   path: 'student',
      //   name: 'StudentCourseInfo',
      //   component: () => import('@/views/course/student/info'),
      //   meta: { title: '课程信息', icon: 'tree' }
      // },
      {
        path: 'student/enroll',
        name: 'StudentEnrollCenter',
        component: () => import('@/views/course/student/enroll'),
        meta: { title: '选课中心', icon: 'tree' }
      }
    ]
  },

  // // 课程通知 (Course Notification)
  // {
  //   path: '/course-notification',
  //   component: Layout,
  //   redirect: '/course-notification/teacher',
  //   name: 'CourseNotification',
  //   meta: { title: '课程通知', icon: 'notification' },
  //   children: [
  //     {
  //       path: 'teacher',
  //       name: 'TeacherCourseNotification',
  //       component: () => import('@/views/course/notification/teacher'),
  //       meta: { title: '课程通知', icon: 'message' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentCourseNotification',
  //       component: () => import('@/views/course/notification/student'),
  //       meta: { title: '课程通知', icon: 'message' }
  //     }
  //   ]
  // },
  //
  // // 课程讨论 (Course Discussion)
  // {
  //   path: '/course-discussion',
  //   component: Layout,
  //   redirect: '/course-discussion/teacher',
  //   name: 'CourseDiscussion',
  //   meta: { title: '课程讨论', icon: 'discussion' },
  //   children: [
  //     {
  //       path: 'teacher',
  //       name: 'TeacherCourseDiscussion',
  //       component: () => import('@/views/discussion/teacher/discussion'),
  //       meta: { title: '课程讨论', icon: 'discussion' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentCourseDiscussion',
  //       component: () => import('@/views/discussion/student/discussion'),
  //       meta: { title: '课程讨论', icon: 'discussion' }
  //     },
  //     {
  //       path: 'student/forum',
  //       name: 'StudentDiscussionForum',
  //       component: () => import('@/views/discussion/student/forum'),
  //       meta: { title: '课程讨论区', icon: 'forum' }
  //     }
  //   ]
  // },
  //
  // // 考勤管理 (Attendance Management)
  // {
  //   path: '/attendance-management',
  //   component: Layout,
  //   redirect: '/attendance-management/teacher',
  //   name: 'AttendanceManagement',
  //   meta: { title: '考勤管理', icon: 'attendance' },
  //   children: [
  //     {
  //       path: 'teacher',
  //       name: 'TeacherAttendanceManagement',
  //       component: () => import('@/views/attendance/teacher/manage'),
  //       meta: { title: '考勤管理', icon: 'attendance' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentLeaveManagement',
  //       component: () => import('@/views/attendance/student/leave'),
  //       meta: { title: '请假管理', icon: 'leave' }
  //     }
  //   ]
  // },
  //
  // // 作业管理 (Homework Management)
  // {
  //   path: '/homework-management',
  //   component: Layout,
  //   redirect: '/homework-management/teacher',
  //   name: 'HomeworkManagement',
  //   meta: { title: '作业管理', icon: 'homework' },
  //   children: [
  //     {
  //       path: 'teacher',
  //       name: 'TeacherHomeworkManagement',
  //       component: () => import('@/views/homework/teacher/manage'),
  //       meta: { title: '作业管理', icon: 'homework' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentHomeworkManagement',
  //       component: () => import('@/views/homework/student/manage'),
  //       meta: { title: '作业管理', icon: 'homework' }
  //     }
  //   ]
  // },
  //
  // // 在线测试 (Online Testing)
  // {
  //   path: '/online-testing',
  //   component: Layout,
  //   redirect: '/online-testing/teacher',
  //   name: 'OnlineTesting',
  //   meta: { title: '在线测试', icon: 'testing' },
  //   children: [
  //     {
  //       path: 'teacher',
  //       name: 'TeacherOnlineTesting',
  //       component: () => import('@/views/testing/teacher/testing'),
  //       meta: { title: '在线测试', icon: 'testing' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentOnlineTesting',
  //       component: () => import('@/views/testing/student/testing'),
  //       meta: { title: '在线测试', icon: 'testing' }
  //     }
  //   ]
  // },
  //
  // // 成绩查询 (Grade Inquiry)
  // {
  //   path: '/grade-inquiry',
  //   component: Layout,
  //   name: 'GradeInquiry',
  //   meta: { title: '成绩查询', icon: 'grades' },
  //   children: [
  //     {
  //       path: 'student',
  //       name: 'StudentGradeInquiry',
  //       component: () => import('@/views/grades/student/inquiry'),
  //       meta: { title: '成绩查询', icon: 'grades' }
  //     }
  //   ]
  // },
  //
  // // 教学反馈 (Teaching Feedback)
  // {
  //   path: '/teaching-feedback',
  //   component: Layout,
  //   name: 'TeachingFeedback',
  //   meta: { title: '教学反馈', icon: 'feedback' },
  //   children: [
  //     {
  //       path: 'education-dept',
  //       name: 'EducationDeptFeedback',
  //       component: () => import('@/views/feedback/education-dept'),
  //       meta: { title: '教学反馈', icon: 'feedback' }
  //     },
  //     {
  //       path: 'student',
  //       name: 'StudentTeachingFeedback',
  //       component: () => import('@/views/feedback/student'),
  //       meta: { title: '教学反馈', icon: 'feedback' }
  //     }
  //   ]
  // },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/await',
    name: 'Task',
    meta: { title: '个人任务', icon: 'example' },
    children: [
      {
        path: 'await',
        name: 'Await',
        component: () => import('@/views/workflow/await'),
        meta: { title: '待办任务', icon: 'tree' }
      },
      {
        path: 'complete',
        name: 'Complete',
        component: () => import('@/views/workflow/complete'),
        meta: { title: '已办任务', icon: 'tree' }
      }
    ]
  },

  {
    path: '/instance',
    component: Layout,
    redirect: '/instance/running',
    name: 'Instance',
    meta: { title: '流程实例', icon: 'example' },
    children: [
      {
        path: 'running',
        name: 'Running',
        component: () => import('@/views/workflow/running'),
        meta: { title: '运行中流程', icon: 'tree' }
      },
      {
        path: 'finish',
        name: 'Finish',
        component: () => import('@/views/workflow/finish'),
        meta: { title: '已结束流程', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
