import request from '@/utils/request'

export default {
  // 新增答题申请
  // 方法名: addAnswer, 接收参数: Answer (答题实体类)
  // 参数含义:
  // - paperId: 试卷ID
  // - questionId: 题目ID
  // - answer: 答案
  // - score: 得分
  // - creator: 答题人用户名
  addAnswer(answer) {
    return request({
      url: '/answer',
      method: 'post',
      data: answer
    })
  },

  // 查询答题列表
  // 方法名: listAnswers, 接收参数: AnswerREQ (分页请求基础类扩展)
  // 参数含义:
  // - paperId: 试卷ID
  // - questionId: 题目ID
  // - creator: 答题人用户名
  // - current: 当前页码
  // - size: 每页显示数量
  // {"paperId": "3","creator": "xuesheng11", "current":"1", "size":"-1"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1231231123345426123",
  //                 "paperId": "3",
  //                 "questionId": "123123123",
  //                 "answer": "1",
  //                 "score": 0,
  //                 "creator": "xuesheng11"
  //             },
  //             {
  //                 "id": "1735668035611045889",
  //                 "paperId": "3",
  //                 "questionId": "1735665444156125185",
  //                 "answer": "4",
  //                 "score": 5,
  //                 "creator": "xuesheng11"
  //             },
  //         ],
  //         "total": 0, // 使用 size = -1 查询全部时，total 需要手动计算处理
  //         "size": -1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 0
  //     }
  // }
  listAnswers(req) {
    return request({
      url: '/answer/list',
      method: 'post',
      data: req
    })
  },

  // 更新答题详情信息
  // 方法名: updateAnswer, 接收参数: Answer (答题实体类)
  // 参数含义:
  // - id: 答题ID
  // - paperId: 试卷ID
  // - questionId: 题目ID
  // - answer: 答案
  // - score: 得分
  // - creator: 答题人用户名
  updateAnswer(answer) {
    return request({
      url: '/answer',
      method: 'put',
      data: answer
    })
  },

  // 查询答题详情信息
  // 方法名: viewAnswer, 接收参数: id (答题ID)
  viewAnswer(id) {
    return request({
      url: `/answer/${id}`,
      method: 'get'
    })
  },

  // 获取某人在某卷的得分
  // 方法名: getScore, 接收参数: AnswerREQ (分页请求基础类扩展)
  // 参数含义:
  // - paperId: 试卷ID
  // - questionId: 题目ID
  // - creator: 答题人用户名
  // - current: 当前页码
  // - size: 每页显示数量
  getScore(req) {
    return request({
      url: '/answer/score',
      method: 'get',
      data: req
    })
  }

}
