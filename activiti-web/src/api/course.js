import request from '@/utils/request'

// Course Manager API
export default {

  // 新增课程管理
  // 方法名: add, 接收参数: courseManager (课程管理实体类)
  // 参数含义:
  // - id: 课程管理ID (自动生成，不需传入)
  // - name: 课程名称
  // - tchId: 教师用户名
  // - username: 教师姓名
  // - time: 上课时间
  // - room: 上课教室
  // - classId: 班级id
  // - class_name: 班级名称 (非数据库字段)
  // - student_id: 学生id (非数据库字段)
  // - student_name: 学生姓名 (非数据库字段)
  // - createDate: 创建时间 (自动生成，不需传入)
  // - updateDate: 更新时间 (自动生成，不需传入)
  // - processInstanceId: 流程实例id (非数据库字段)
  // - status: 流程状态 (非数据库字段)
  add(courseManager) {
    return request({
      url: '/courseManager',
      method: 'post',
      data: courseManager
    })
  },

  // 获取所有课程班级
  // 方法名: getAllClasses, 无参数
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": [
  //         {
  //             "id": "202003101",
  //             "name": "20计科1班",
  //             "head_teacher": "zhangsan",
  //             "head_teacher_nick_name": "王五",
  //             "counselor": "wangwu",
  //             "counselor_nick_name": "张三"
  //         },
  //         {
  //             "id": "202003102",
  //             "name": "20计科2班",
  //             "head_teacher": "zhangsan",
  //             "head_teacher_nick_name": "王五",
  //             "counselor": "wangwu",
  //             "counselor_nick_name": "张三"
  //         },
  //     ]
  // }
  getAllClasses() {
    return request({
      url: '/courseManager/classes',
      method: 'get'
    })
  },

  // 获取当前教师的所有课程
  // 请使用 listPage，此接口无法返回唯一的课程名称和任课老师，是经过GROUP BY的。
  // 方法名: getTeacherCourse, 无参数
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": [
  //         {
  //             "name": "高等数学"
  //         },
  //         {
  //             "name": "线性代数"
  //         }
  //     ]
  // }
  getTeacherCourse() {
    return request({
      url: '/courseManager/teacherCourse',
      method: 'post'
    })
  },

  // 获取指定课程的所有班级学生 (一个课程可能有多个班级)
  // 方法名: getAllStudents, 接收参数: courseName (课程名称)
  // courseName: 高等数学 (/courseManager/高等数学/allStudents)
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": [
  //         {
  //             "name": "高等数学",
  //             "tchId": "zhangsan",
  //             "username": "学生15",
  //             "classId": "202003101",
  //             "student_id": "20200310105",
  //             "student_name": "xuesheng15",
  //             "createDateStr": "",
  //             "updateDateStr": "",
  //             "statusStr": ""
  //         },
  //         ...
  //     ]
  // }
  getAllStudents(courseName) {
    return request({
      url: `/courseManager/${courseName}/allStudents`,
      method: 'get'
    })
  },

  // 获取指定班级的所有学生
  // 方法名: getStudentsByClass, 接收参数: classId (班级ID)
  // classId: 202003101 (/courseManager/classes/202003101/students)
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": [
  //         {
  //             "id": "19",
  //             "name": "xuesheng11",
  //             "username": "学生11",
  //             "student_id": "20200310101",
  //             "classid": "202003101",
  //             "major": "计算机科学与技术"
  //         },
  //         ...
  //     ]
  // }
  getStudentsByClass(classId) {
    return request({
      url: `/courseManager/classes/${classId}/students`,
      method: 'get'
    })
  },

  // 查询课程管理列表
  // 方法名: listPage, 接收参数: data (包含搜索条件和分页信息的对象)
  // 参数含义:
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - status: 流程状态
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current":1,"size":1}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1737762817609584642",
  //                 "name": "线性代数",
  //                 "tchId": "zhangsan",
  //                 "username": "张三",
  //                 "time": "1-8周 周三 8:00-9:25",
  //                 "room": "C4-116",
  //                 "classId": "202003101",
  //                 "class_name": "20计科1班",
  //                 "createDate": "2023-12-21T09:11:56.000+00:00",
  //                 "updateDate": "2023-12-21T09:11:56.000+00:00",
  //                 "status": 1,
  //                 "createDateStr": "2023-12-21 17:11:56",
  //                 "updateDateStr": "2023-12-21 17:11:56",
  //                 "statusStr": "待提交"
  //             },
  //         ],
  //         "total": 5,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 1
  //     }
  // }
  listPage(data, current, size) {
    return request({
      url: '/courseManager/list',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // 更新课程管理详情信息
  // 方法名: update, 接收参数: courseManager (课程管理实体类)
  // 参数含义:
  // - id: 课程管理ID (自动生成，不需传入)
  // - name: 课程名称
  // - tchId: 教师用户名
  // - username: 教师姓名
  // - time: 上课时间
  // - room: 上课教室
  // - classId: 班级id
  // - class_name: 班级名称 (非数据库字段)
  // - student_id: 学生id (非数据库字段)
  // - student_name: 学生姓名 (非数据库字段)
  // - createDate: 创建时间 (自动生成，不需传入)
  // - updateDate: 更新时间 (自动生成，不需传入)
  // - processInstanceId: 流程实例id (非数据库字段)
  // - status: 流程状态 (非数据库字段)
  update(courseManager) {
    return request({
      url: '/courseManager',
      method: 'put',
      data: courseManager
    })
  },

  // 查询课程管理详情信息
  // 方法名: viewById, 接收参数: id (课程管理ID)
  // wrap了两层data，这是预期的。
  // id: 1 (/courseManager/1)
  //  {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "code": 20000,
  //         "message": "操作成功",
  //         "data": [
  //             {
  //                 "id": "1",
  //                 "name": "高等数学",
  //                 "tchId": "zhangsan",
  //                 "username": "张三",
  //                 "time": "1-8周 周三 9:40-11:50",
  //                 "room": "C4-116",
  //                 "classId": "202003101",
  //                 "class_name": "20计科1班",
  //                 "createDate": "2023-12-17T00:19:46.000+00:00",
  //                 "updateDate": "2023-12-21T07:21:12.000+00:00",
  //                 "processInstanceId": "7bd742bd-9fd1-11ee-9ff6-6e6a773b7536",
  //                 "status": 3,
  //                 "createDateStr": "2023-12-17 08:19:46",
  //                 "updateDateStr": "2023-12-21 15:21:12",
  //                 "statusStr": "已完成"
  //             }
  //         ]
  //     }
  // }
  viewById(id) {
    return request({
      url: `/courseManager/${id}`,
      method: 'get'
    })
  },

  // 查询所有课程名称和任课老师唯一的列表
  // 实际上就是对每一个老师做了一个GROUP BY课程名
  // 方法名: allCourseNameAndTeacherlist,
  // 参数含义:
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 2}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1",
  //                 "name": "高等数学",
  //                 "username": "张三",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             },
  //             {
  //                 "id": "1737762817609584642",
  //                 "name": "线性代数",
  //                 "username": "张三",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             },
  //         ],
  //         "total": 6,
  //         "size": 2,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 0
  //     }
  // }
  allCourseNameAndTeacherlist(req) {
    return request({
      url: '/courseManager/allCourseNameAndTeacherlist',
      method: 'post',
      data: req
    })
  },

  // 查询班级的课程名称和任课老师唯一的列表
  // 实际上是查学生的班级，然后对每一个老师做了一个GROUP BY课程名
  // 方法名: classCourseNameAndTeacherlist, 接收参数: req
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 10}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1",
  //                 "name": "高等数学",
  //                 "username": "张三",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             },
  //             {
  //                 "id": "1737762817609584642",
  //                 "name": "线性代数",
  //                 "username": "张三",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             }
  //         ],
  //         "total": 2,
  //         "size": 10,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 0
  //     }
  // }
  classCourseNameAndTeacherlist(req) {
    return request({
      url: '/courseManager/classCourseNameAndTeacherlist',
      method: 'post',
      data: req
    })
  },

  // 查询所有课程名称和任课老师和班级唯一的列表
  // 同上，但是针对管理员的
  // 方法名: allCourseNameAndTeacherAndClasslist, 接收参数: req
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 2}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1",
  //                 "name": "高等数学",
  //                 "username": "张三",
  //                 "classId": "202003101",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             },
  //             {
  //                 "id": "1737762817609584642",
  //                 "name": "线性代数",
  //                 "username": "张三",
  //                 "classId": "202003101",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //         ],
  //         "total": 7,
  //         "size": 2,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 0
  //     }
  // }
  allCourseNameAndTeacherAndClasslist(req) {
    return request({
      url: '/courseManager/allCourseNameAndTeacherAndClasslist',
      method: 'post',
      data: req
    })
  },

  // 查询班级的课程名称和任课老师和班级唯一的列表
  // 查班级的课程列表
  // 方法名: classCourseNameAndTeacherAndClasslist, 接收参数: req
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 1}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1",
  //                 "name": "高等数学",
  //                 "username": "张三",
  //                 "classId": "202003101",
  //                 "createDateStr": "",
  //                 "updateDateStr": "",
  //                 "statusStr": ""
  //             }
  //         ],
  //         "total": 3,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 3
  //     }
  // }
  classCourseNameAndTeacherAndClasslist(req) {
    return request({
      url: '/courseManager/classCourseNameAndTeacherAndClasslist',
      method: 'post',
      data: req
    })
  },

  // 查询当前教师
  // 方法名: getCurrentTeacher, 无参数
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "id": "12",
  //         "name": "zhangsan",
  //         "nickName": "张三",
  //         "post": "教师"
  //     }
  // }
  getCurrentTeacher() {
    return request({
      url: '/courseManager/currentTeacher',
      method: 'get'
    })
  },

  // 查询学生课程信息
  // 方法名: stuClassInfoList, 接收参数: data (包含搜索条件和分页信息的对象)
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - status: 流程状态
  // - current: 当前页码
  // - size: 每页显示数量
  // 此返回wrap了两层data，这是预期的。
  // { "current": 1, "size: 2 }
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "code": 20000,
  //         "message": "操作成功",
  //         "data": {
  //             "records": [
  //                 {
  //                     "id": "1",
  //                     "name": "高等数学",
  //                     "tchId": "zhangsan",
  //                     "username": "张三",
  //                     "time": "1-8周 周三 9:40-11:50",
  //                     "room": "C4-116",
  //                     "classId": "202003101",
  //                     "createDateStr": "",
  //                     "updateDateStr": "",
  //                     "statusStr": ""
  //                 },
  //                 {
  //                     "id": "1737762817609584642",
  //                     "name": "线性代数",
  //                     "tchId": "zhangsan",
  //                     "username": "张三",
  //                     "time": "1-8周 周三 8:00-9:25",
  //                     "room": "C4-116",
  //                     "classId": "202003101",
  //                     "createDateStr": "",
  //                     "updateDateStr": "",
  //                     "statusStr": ""
  //                 },
  //             ],
  //             "total": 2,
  //             "size": 2,
  //             "current": 1,
  //             "orders": [],
  //             "hitCount": false,
  //             "searchCount": true,
  //             "pages": 1
  //         }
  //     }
  // }
  stuClassInfoList(data, current, size) {
    return request({
      url: '/courseManager/classInfolist',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // 查询选修课程信息
  // 方法名: viewElectiveCourse, 接收参数: data (包含搜索条件和分页信息的对象)
  // - course: 课程名称
  // - teacher: 任课老师
  // - username: 所属的用户名
  // - status: 流程状态
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current":1, "size": 10}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "code": 20000,
  //         "message": "操作成功",
  //         "data": {
  //             "records": [
  //                 {
  //                     "id": "1000000",
  //                     "name": "创新思维训练",
  //                     "tchId": "zhangsan",
  //                     "username": "张三",
  //                     "time": "1-8周 周三 9:40-11:50",
  //                     "room": "C4-116",
  //                     "createDateStr": "",
  //                     "updateDateStr": "",
  //                     "statusStr": ""
  //                 },
  //             ],
  //             "total": 1,
  //             "size": 1,
  //             "current": 1,
  //             "orders": [],
  //             "hitCount": false,
  //             "searchCount": true,
  //             "pages": 1
  //         }
  //     }
  // }
  viewElectiveCourse(data, current, size) {
    return request({
      url: '/courseManager/electiveCourse',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // 选择选修课程
  // 方法名: selectElectiveCourse, 接收参数: id (选修课程ID)
  selectElectiveCourse(id) {
    return request({
      url: `/courseManager/selectElectiveCourse/${id}`,
      method: 'post'
    })
  },

  // 删除选修课程
  // 方法名: deleteElectiveCourse, 接收参数: id (选修课程ID)
  deleteElectiveCourse(id) {
    return request({
      url: `/courseManager/deleteElectiveCourse/${id}`,
      method: 'delete'
    })
  },

  // 判断用户是否为学生
  // 方法名: isStudent, 无参数
  // return: true/false
  isStudent() {
    return request({
      url: '/courseManager/isStudent',
      method: 'post'
    })
  }
}
