import request from '@/utils/request'

export default {
  // 新增考勤详情
  // 方法名: addAttendList, 接收参数: AttendList[] (考勤管理实体类数组)
  // 参数含义: 注意是个数组
  // - attend_id: 考勤表ID
  // - student_name: 学生姓名
  // - student_id: 学生学号
  // - status: 考勤状态
  addAttendList(attendList) {
    return request({
      url: '/attendList',
      method: 'post',
      data: attendList
    })
  },

  // 查询考勤详情列表
  // 方法名: attendListPage, 接收参数: id (考勤表ID)
  // id:1 (form-data) 出勤0 事假1 病假2 迟到3 早退4 旷课5
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": [
  //         {
  //             "id": "1",
  //             "attend_id": "1",
  //             "student_name": "学生11",
  //             "student_id": "20200310101",
  //             "status": "0"
  //         },
  //         {
  //             "id": "2",
  //             "attend_id": "1",
  //             "student_name": "学生12",
  //             "student_id": "20200310102",
  //             "status": "0"
  //         },
  //         {
  //             "id": "3",
  //             "attend_id": "1",
  //             "student_name": "学生13",
  //             "student_id": "20200310103",
  //             "status": "0"
  //         },
  //         {
  //             "id": "4",
  //             "attend_id": "1",
  //             "student_name": "学生14",
  //             "student_id": "20200310104",
  //             "status": "0"
  //         },
  //         {
  //             "id": "5",
  //             "attend_id": "1",
  //             "student_name": "学生15",
  //             "student_id": "20200310105",
  //             "status": "0"
  //         }
  //     ]
  // }
  attendListPage(id) {
    return request({
      url: '/attendList/list',
      method: 'post',
      params: { id }
    })
  },

  // 更新考勤详情信息
  // 方法名: updateAttendList, 接收参数: AttendList[] (考勤管理实体类数组)
  updateAttendList(attendList) {
    return request({
      url: '/attendList',
      method: 'put',
      data: attendList
    })
  },

  // ---[分割线]---

  // 新增考勤管理
  // 方法名: addAttend, 接收参数: Attend (考勤实体类)
  // 参数含义:
  // - name: 课程名称
  // - TchId: 教师用户名
  // - time: 上课时间
  // - student_num: 学生总人数
  addAttend(attend) {
    return request({
      url: '/attend',
      method: 'post',
      data: attend
    })
  },

  // 查询考勤管理列表
  // 方法名: attendPage, 接收参数: AttendREQ (查询请假管理列表条件)
  // 参数含义:
  // - course: 课程名称
  // - createtime: 创建时间
  // - username: 所属的用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current":"1","size":"10"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "2",
  //                 "name": "线性代数",
  //                 "teacher_name": "张三",
  //                 "time": "1-8周 周三 8:00-9:25",
  //                 "student_num": "10",
  //                 "createDate": "2023-12-16T21:31:41.000+00:00",
  //                 "updateDate": "2023-12-16T21:33:04.000+00:00",
  //                 "tchId": "zhangsan",
  //                 "createDateStr": "2023-12-17 05:31:41",
  //                 "updateDateStr": "2023-12-17 05:33:04"
  //             },
  //         ],
  //         "total": 2,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 1
  //     }
  // }
  attendPage(data, current, size) {
    return request({
      url: '/attend/list',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // 更新考勤管理详情信息
  // 方法名: updateAttend, 接收参数: Attend (考勤实体类)
  // 参数含义:
  // - id: 考勤ID
  // - name: 课程名称
  // - TchId: 教师用户名
  // - time: 上课时间
  // - student_num: 学生总人数
  updateAttend(attend) {
    return request({
      url: '/attend',
      method: 'put',
      data: attend
    })
  },

  // 查询考勤管理详情信息
  // 方法名: viewAttend, 接收参数: id (考勤ID)
  viewAttend(id) {
    return request({
      url: `/attend/${id}`,
      method: 'get'
    })
  },
  // 获取所有课程
  getCourse() {
    return request({
      url: `/courseManager/teacherCourse`,
      method: 'post'
    })
  },
  // 根据课程名获取学生列表
  getStudentNum(courseName) {
    return request({
      url: `/courseManager/${courseName}/allStudents`,
      method: 'get'
    })
  },
  // 新增考勤
  add(data) {
    return request({
      url: '/attend',
      method: 'post',
      data
    })
  },
  // 编辑考勤
  update(data) {
    return request({
      url: '/attend',
      method: 'put',
      data
    })
  },
  // 新增考勤列表
  addList(data) {
    return request({
      url: '/attendList',
      method: 'post',
      data
    })
  }
}
