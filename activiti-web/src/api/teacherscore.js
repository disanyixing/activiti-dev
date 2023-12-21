import request from '@/utils/request'

export default {
  // 新增教师评分
  // 方法名: addTeacherScore, 接收参数: TeacherScore (教学反馈实体类)
  // 参数含义:
  // - name: 课程名称
  // - tch_id: 用户名
  // - nick_name: 教师姓名
  // - score1, score2, score3, score4: 课程评分
  addTeacherScore(teacherScore) {
    return request({
      url: '/teacherScore',
      method: 'post',
      data: teacherScore
    })
  },

  // 查询教师评分详情信息
  // 方法名: viewTeacherScoreById, 接收参数: id (教师评分ID)
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
  // - username: 所属的用户名
  // - status: 流程状态
  // - current: 当前页码
  // - size: 每页显示数量
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
  //                     "nick_name": "张三",
  //                     "average_score": "64.50"
  //                 },
  //                 {
  //                     "name": "离散数学",
  //                     "nick_name": "李四",
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
  }

}
