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

const student = 0b001
const teacher = 0b010
const admin = 0b100

export const constantRoutes = [
  {
    path: '/login',
    hidden: true,
    component: () => import('@/views/login/index'),
    meta: { title: '登录', icon: 'key' }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: { title: '404', icon: 'warning' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'home-filled' }
      }
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    redirect: '/workflow/model',
    name: 'Workflow',
    meta: { title: '工作流程', icon: 'suitcase' },
    perm: admin,
    children: [
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/workflow/model'),
        meta: { title: '模型管理', icon: 'suitcase' }
      },
      {
        path: 'process',
        name: 'Process',
        component: () => import('@/views/workflow/process'),
        meta: { title: '流程管理', icon: 'suitcase' }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    redirect: '/apply',
    name: 'Apply',
    meta: { title: '业务办理', icon: 'form' },
    perm: admin,
    children: [
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('@/views/workflow/apply/leave'),
        meta: { title: '请假申请', icon: 'form' }
      },
      {
        path: 'loan',
        name: 'Loan',
        component: () => import('@/views/workflow/apply/loan'),
        meta: { title: '借款申请', icon: 'form' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course',
    name: 'Course',
    meta: { title: '课程管理', icon: 'notebook' },
    children: [
      {
        path: 'teacher',
        name: 'courseManager',
        component: () => import('@/views/course/teacher/manage'),
        meta: { title: '课程管理', icon: 'notebook' },
        perm: teacher
      },
      {
        path: 'student/info',
        name: 'StudentCourseInfo',
        component: () => import('@/views/course/student/info'),
        meta: { title: '课程信息', icon: 'notebook' },
        perm: student
      },
      {
        path: 'student/enroll',
        name: 'StudentEnrollCenter',
        component: () => import('@/views/course/student/enroll'),
        meta: { title: '选课中心', icon: 'notebook' },
        perm: student
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message',
    name: 'message',
    meta: { title: '课程通知', icon: 'message-box' },
    children: [
      {
        path: 'manage',
        name: 'TeacherCourseNotification',
        component: () => import('@/views/message/list'),
        meta: { title: '课程通知', icon: 'message-box' },
        perm: teacher
      },
      {
        path: 'list',
        name: 'StudentCourseNotification',
        component: () => import('@/views/message/stulist'),
        meta: { title: '课程通知', icon: 'message-box' },
        perm: student
      }
    ]
  },
  {
    path: '/talk',
    component: Layout,
    redirect: '/talk',
    name: 'Talk',
    meta: { title: '课程讨论', icon: 'data-analysis' },
    children: [
      {
        path: 'topic',
        name: 'CourseTopic',
        component: () => import('@/views/talk/topic'),
        meta: { title: '讨论主题', icon: 'data-analysis' },
        hidden: true
      },
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/talk/list'),
        meta: { title: '课程讨论', icon: 'data-analysis' },
        perm: teacher
      },
      {
        path: 'liststu',
        name: 'CourseList',
        component: () => import('@/views/talk/liststu'),
        meta: { title: '课程讨论', icon: 'data-analysis' },
        perm: student
      }
    ]
  },
  {
    path: '/attend',
    component: Layout,
    redirect: '/attend',
    name: 'Attend',
    meta: { title: '考勤管理', icon: 'checked' },
    children: [
      {
        path: 'stuleave/apply',
        name: 'StudentLeave',
        component: () => import('@/views/stuleave/apply.vue'),
        meta: { title: '请假申请', icon: 'checked' },
        perm: student
      },
      {
        path: 'list',
        name: 'Attend',
        component: () => import('@/views/workflow/apply/attendance'),
        meta: { title: '考勤管理', icon: 'checked' },
        perm: teacher
      }
    ]
  },
  {
    path: '/homework',
    component: Layout,
    redirect: '/homework',
    name: 'homework',
    meta: { title: '作业管理', icon: 'tickets' },
    children: [
      {
        path: 'teacher/list',
        name: 'Listhomework',
        component: () => import('@/views/homework/list'),
        meta: { title: '作业管理', icon: 'tickets' },
        perm: teacher
      },
      {
        path: 'student/list',
        name: 'ListStuhomework',
        component: () => import('@/views/homework/stulist'),
        meta: { title: '作业管理', icon: 'tickets' },
        perm: student
      },
      {
        path: 'paper/edit',
        name: 'homeworkEdit',
        component: () => import('@/views/homework/edit'),
        meta: { title: '作业编辑', icon: 'tickets' },
        hidden: true
      },
      {
        path: 'paper/answer',
        name: 'OnlineTest',
        component: () => import('@/views/homework/answer'),
        meta: { title: '作业', icon: 'tickets' },
        hidden: true
      },
      {
        path: 'paper/result',
        name: 'TestResult',
        component: () => import('@/views/homework/detail'),
        meta: { title: '作业结果', icon: 'tickets' },
        hidden: true
      },
      {
        path: 'paper/score',
        name: 'homeworkScore',
        component: () => import('@/views/homework/score'),
        meta: { title: '作业批改', icon: 'tickets' },
        hidden: true
      },
      {
        path: 'paper/monitor',
        name: 'homeworkMonitor',
        component: () => import('@/views/homework/monitor'),
        meta: { title: '作业情况', icon: 'tickets' },
        hidden: true
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam',
    name: 'exam',
    meta: { title: '在线测试', icon: 'toilet-paper' },
    children: [
      {
        path: 'teacher/list',
        name: 'ListExam',
        component: () => import('@/views/exam/list'),
        meta: { title: '在线测试', icon: 'toilet-paper' },
        perm: teacher
      },
      {
        path: 'student/list',
        name: 'ListStuExam',
        component: () => import('@/views/exam/stulist'),
        meta: { title: '在线测试', icon: 'toilet-paper' },
        perm: student
      },
      {
        path: 'paper/edit',
        name: 'ExamEdit',
        component: () => import('@/views/exam/edit'),
        meta: { title: '试卷编辑', icon: 'toilet-paper' },
        hidden: true
      },
      {
        path: 'paper/answer',
        name: 'OnlineTest',
        component: () => import('@/views/exam/answer'),
        meta: { title: '考试', icon: 'toilet-paper' },
        hidden: true
      },
      {
        path: 'paper/result',
        name: 'TestResult',
        component: () => import('@/views/exam/detail'),
        meta: { title: '试卷结果', icon: 'toilet-paper' },
        hidden: true
      },
      {
        path: 'paper/score',
        name: 'ExamScore',
        component: () => import('@/views/exam/score'),
        meta: { title: '试卷评分', icon: 'toilet-paper' },
        hidden: true
      },
      {
        path: 'paper/monitor',
        name: 'ExamMonitor',
        component: () => import('@/views/exam/monitor'),
        meta: { title: '考试监控', icon: 'toilet-paper' },
        hidden: true
      },
      {
        path: 'paper/judge',
        name: 'ExamJudge',
        component: () => import('@/views/exam/judge'),
        meta: { title: '考试评分', icon: 'toilet-paper' },
        hidden: true
      }
    ]
  },
  {
    path: '/grade',
    component: Layout,
    name: 'GradeInquiry',
    redirect: '/grade',
    meta: { title: '成绩查询', icon: 'paperclip' },
    perm: student,
    children: [
      {
        path: 'grade/stu',
        name: 'StudentGrade',
        component: () => import('@/views/grade/stu'),
        meta: { title: '成绩查询', icon: 'paperclip' }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback',
    name: 'TeachingFeedback',
    meta: { title: '教学反馈', icon: 'histogram' },
    children: [
      {
        path: 'director',
        name: 'ListFeedback',
        component: () => import('@/views/teacherscore/director.vue'),
        meta: { title: '评教结果', icon: 'histogram' },
        perm: admin
      },
      {
        path: 'student',
        name: 'ListFeedbackStu',
        component: () => import('@/views/teacherscore/stu.vue'),
        meta: { title: '学生评教', icon: 'histogram' },
        perm: student
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/await',
    name: 'Task',
    meta: { title: '个人任务', icon: 'stamp' },
    perm: teacher | admin,
    children: [
      {
        path: 'await',
        name: 'Await',
        component: () => import('@/views/workflow/await'),
        meta: { title: '待办任务', icon: 'stamp' }
      },
      {
        path: 'complete',
        name: 'Complete',
        component: () => import('@/views/workflow/complete'),
        meta: { title: '已办任务', icon: 'stamp' }
      }
    ]
  },
  {
    path: '/instance',
    component: Layout,
    redirect: '/instance/running',
    name: 'Instance',
    meta: { title: '流程实例', icon: 'promotion' },
    perm: admin,
    children: [
      {
        path: 'running',
        name: 'Running',
        component: () => import('@/views/workflow/running'),
        meta: { title: '运行中流程', icon: 'promotion' }
      },
      {
        path: 'finish',
        name: 'Finish',
        component: () => import('@/views/workflow/finish'),
        meta: { title: '已结束流程', icon: 'promotion' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

import capi from '@/api/course'
import { getInfo } from '@/api/user'

// 获取用户角色
export async function getUserPerm() {
  let perm = 0

  const studentfetch = (await capi.isStudent()).data
  if (studentfetch) {
    perm |= student // 如果是学生，添加学生权限
  }

  const teacherfetch = await capi.getCurrentTeacher()
  if (teacherfetch.data && teacherfetch.data.post === '教师') {
    perm |= teacher // 如果是教师，添加教师权限
  }

  const adminfetch = await getInfo()

  if (adminfetch.data && adminfetch.data.username === 'admin') {
    perm |= admin // 添加权限
  }
  return perm
}

export function setRouteVisibility(routes, perm) {
  routes.forEach(route => {
    if (!route.hidden && route.children && route.children.length > 0) {
      setRouteVisibility(route.children, perm)
    }

    if (route.perm) {
      route.hidden = (perm & route.perm) === 0
    }
  })
}
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
