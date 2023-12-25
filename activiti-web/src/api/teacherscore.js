import request from '@/utils/request'

export default {
  // 新增教师评分
  // 方法名: addTeacherScore, 接收参数: TeacherScore (教学反馈实体类)
  // 参数含义:
  // - name: 课程名称
  // - tch_id: 用户名
  // - username: 教师姓名
  // - score1: 教学内容
  // - score2: 教学方法
  // - score3: 教学状态
  // - score4: 教学效果
  // - 对于每一个score, 优秀为24，良好为18，及格为12，糟糕为6
  addTeacherScore(teacherScore) {
    return request({
      url: '/teacherScore',
      method: 'post',
      data: teacherScore
    })
  },

  // 查询教师评分详情信息
  // 方法名: viewTeacherScoreById, 接收参数: id (教师评分ID)
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "id": "1",
  //         "name": "高等数学",
  //         "score1": "12",
  //         "score2": "6",
  //         "score3": "6",
  //         "score4": "6"
  //     }
  // }
  viewTeacherScoreById(id) {
    return request({
      url: `/teacherScore/${id}`,
      method: 'get'
    })
  },

  // 查询所有教师评分信息
  // 方法名: listTeacherScores, 接收参数: courseManagerREQ (查询课程管理列表条件)
  // 参数含义:
  // - course: 课程名称
  // - teacher: 任课老师
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 10}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "code": 20000,
  //         "message": "操作成功",
  //         "data": {
  //             "records": [
  //                 {
  //                     "name": "高等数学",
  //                     "username": "张三",
  //                     "average_score": "64.50"
  //                 },
  //                 {
  //                     "name": "离散数学",
  //                     "username": "李四",
  //                     "average_score": "50.00"
  //                 },
  //             ],
  //             "total": 4,
  //             "size": 2,
  //             "current": 1,
  //             "orders": [],
  //             "hitCount": false,
  //             "searchCount": true,
  //             "pages": 1
  //         }
  //     }
  // }
  listTeacherScores(req) {
    return request({
      url: '/teacherScore/list',
      method: 'post',
      data: req
    })
  },

  // 查询学生的教师评分信息
  // 方法名: listStuTeacherScores, 接收参数: courseManagerREQ (查询课程管理列表条件)
  // 参数含义:
  // - course: 课程名称
  // - teacher: 任课老师
  // - current: 当前页码
  // - size: 每页显示数量
  // {"current": 1, "size": 10}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "code": 20000,
  //         "message": "操作成功",
  //         "data": {
  //             "records": [
  //                 {
  //                     "name": "高等数学",
  //                     "username": "张三",
  //                     "average_score": "64.50"
  //                 },
  //                 {
  //                     "name": "离散数学",
  //                     "username": "李四",
  //                     "average_score": "50.00"
  //                 },
  //             ],
  //             "total": 4,
  //             "size": 2,
  //             "current": 1,
  //             "orders": [],
  //             "hitCount": false,
  //             "searchCount": true,
  //             "pages": 1
  //         }
  //     }
  // }
  listStuTeacherScores(req) {
    return request({
      url: '/teacherScore/liststu',
      method: 'post',
      data: req
    })
  }
}
