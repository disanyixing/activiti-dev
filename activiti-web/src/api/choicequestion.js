import request from '@/utils/request'

export default {
  // 新增选择题申请
  // 方法名: addChoiceQuestion, 接收参数: ChoiceQuestion (选择题实体类)
  // 参数含义:
  // - paperId: 所属试卷ID
  // - description: 题目描述
  // - choiceA: 选项A
  // - choiceB: 选项B
  // - choiceC: 选项C
  // - choiceD: 选项D
  // - answer: 答案
  // - score: 分数
  addChoiceQuestion(question) {
    return request({
      url: '/choiceQuestion',
      method: 'post',
      data: question
    })
  },

  // 查询选择题申请列表
  // 方法名: listChoiceQuestions, 接收参数: QuestionREQ (分页请求基础类)
  // 参数含义:
  // - paperId: 试卷ID
  // - current: 当前页码
  // - size: 每页显示数量
  // {"paperId": "1", "current":"1", "size":"1"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "123",
  //                 "paperId": "1",
  //                 "description": "测试选择题5",
  //                 "choiceA": "选项A",
  //                 "choiceB": "选项B",
  //                 "choiceC": "选项C",
  //                 "choiceD": "正确选项D",
  //                 "answer": 4,
  //                 "score": 5,
  //                 "createDate": "2023-12-14T16:00:00.000+00:00"
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
  listChoiceQuestions(req) {
    return request({
      url: '/choiceQuestion/list',
      method: 'post',
      data: req
    })
  },

  // 更新选择题详情信息
  // 方法名: updateChoiceQuestion, 接收参数: ChoiceQuestion (选择题实体类)
  // 参数含义:
  // - id: 题目ID
  // - paperId: 所属试卷ID
  // - description: 题目描述
  // - choiceA: 选项A
  // - choiceB: 选项B
  // - choiceC: 选项C
  // - choiceD: 选项D
  // - answer: 答案
  // - score: 分数
  updateChoiceQuestion(question) {
    return request({
      url: '/choiceQuestion',
      method: 'put',
      data: question
    })
  },

  // 查询选择题详情信息
  // 方法名: viewChoiceQuestion, 接收参数: id (题目ID)
  viewChoiceQuestion(id) {
    return request({
      url: `/choiceQuestion/${id}`,
      method: 'get'
    })
  },

  // 查询某试卷的选择题总分
  // 方法名: getTotalScore, 接收参数: id (试卷ID)
  getTotalScore(id) {
    return request({
      url: `/choiceQuestion/total/${id}`,
      method: 'get'
    })
  }

}
