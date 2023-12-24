import request from '@/utils/request'

export default {

  // 新增请假管理
  // 方法名: addStudentLeave, 接收参数: StudentLeave (请假管理实体类)
  // 参数含义:
  // - name: 学生用户名 后端自动生成
  // - course_name: 课程名称
  // - teacher_nick_name: 教师姓名
  // - time: 上课时间
  // - reason: 请假理由
  // - createDate: 创建时间
  addStudentLeave(studentLeave) {
    return request({
      url: '/studentLeave',
      method: 'post',
      data: studentLeave
    })
  },

  // 查询请假管理列表
  // 方法名: listStudentLeaves, 接收参数: AttendREQ (查询请假管理列表条件)
  // 参数含义:
  // - course: 课程名称
  // - createtime: 创建时间
  // - current: 当前页码
  // - size: 每页显示数量
  // {
  //     "current": "1",
  //     "size": "-1"
  // }
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "11",
  //                 "name": "xuesheng11",
  //                 "course_name": "高等数学",
  //                 "teacher_nick_name": "张三",
  //                 "time": "9-16周 周四 9:40-11:50",
  //                 "reason": "头痛",
  //                 "createDate": "2023-12-16T23:49:28.000+00:00",
  //                 "status": 1,
  //                 "createDateStr": "2023-12-17 07:49:28",
  //                 "statusStr": "待提交"
  //             }
  //         ],
  //         "total": 0,
  //         "size": -1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 0
  //     }
  // }
  listStudentLeaves(req) {
    return request({
      url: '/studentLeave/list',
      method: 'post',
      data: req
    })
  },

  // 更新请假管理详情信息
  // 方法名: updateStudentLeave, 接收参数: StudentLeave (请假管理实体类)
  // - id
  // - name: 学生用户名 后端自动生成
  // - course_name: 课程名称
  // - teacher_nick_name: 教师姓名
  // - time: 上课时间
  // - reason: 请假理由
  // - createDate: 创建时间
  updateStudentLeave(studentLeave) {
    return request({
      url: '/studentLeave',
      method: 'put',
      data: studentLeave
    })
  },

  // 查询请假管理详情信息
  // 方法名: viewStudentLeave, 接收参数: id (请假ID)
  viewStudentLeave(id) {
    return request({
      url: `/studentLeave/${id}`,
      method: 'get'
    })
  }
}
