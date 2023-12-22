import request from '@/utils/request'

export default {
  // 新增简答题申请
  // 方法名: addSaQuestion, 接收参数: SaQuestion (简答题实体类)
  // 参数含义:
  // - paperId: 所属试卷ID
  // - description: 题目描述
  // - score: 分数
  addSaQuestion(question) {
    return request({
      url: '/saQuestion',
      method: 'post',
      data: question
    })
  },

  // 查询简答题申请列表
  // 方法名: listSaQuestions, 接收参数: QuestionREQ (分页请求基础类扩展)
  // 参数含义:
  // - paperId: 试卷ID
  // - current: 当前页码
  // - size: 每页显示数量
  // {"paperId": "2", "current":"1", "size":"1"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1737860234255880194",
  //                 "paperId": "2",
  //                 "description": "测试简答1",
  //                 "score": 10,
  //                 "createDate": "2023-12-21T15:39:02.000+00:00"
  //             }
  //         ],
  //         "total": 1,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 1
  //     }
  // }
  listSaQuestions(req) {
    return request({
      url: '/saQuestion/list',
      method: 'post',
      data: req
    })
  },

  // 更新简答题详情信息
  // 方法名: updateSaQuestion, 接收参数: SaQuestion (简答题实体类)
  updateSaQuestion(question) {
    return request({
      url: '/saQuestion',
      method: 'put',
      data: question
    })
  },

  // 查询简答题详情信息
  // 方法名: viewSaQuestion, 接收参数: id (简答题ID)
  viewSaQuestion(id) {
    return request({
      url: `/saQuestion/${id}`,
      method: 'get'
    })
  },

  // 查询某试卷的简答题总分
  // 方法名: totalSaQuestionScore, 接收参数: id (试卷ID)
  totalSaQuestionScore(id) {
    return request({
      url: `/saQuestion/total/${id}`,
      method: 'get'
    })
  }
}
