import request from '@/utils/request'

export default {
  /**
   * 新增试卷
   * @param {Object} paper 试卷对象
   * 参数含义:
   * - title: 试卷名称
   * - type: 试卷类型 (1: 平时测试, 2: 考试)
   * - courseId: 所属课程ID
   * - creator: 创建人用户名 not needed
   * - nick_name: 创建人姓名
   * - size: 班级总人数
   * - startDate: 开始答题时间
   * - endDate: 结束答题时间
   */
  add(paper) {
    return request({
      url: '/paper',
      method: 'post',
      data: paper
    })
  },

  /**
   * 查询老师试卷列表
   * @param {Object} req 分页查询条件
   * 参数含义:
   * - current: 当前页码
   * - size: 每页数量
   * - type: 试卷类型
   * - title: 试卷名称
   * - courseId: 课程ID
   * - creator: 创建人
   */
  // { "current": "1", "size": "1" }
  // {
  //   "code": 20000,
  //   "message": "操作成功",
  //   "data": {
  //   "records": [
  //     {
  //       "id": "3",
  //       "title": "期末考试",
  //       "type": 2,
  //       "courseId": "高等数学",
  //       "creator": "zhangsan",
  //       "nick_name": "张三",
  //       "size": "5",
  //       "createDate": "2023-12-15T22:06:00.000+00:00",
  //       "startDate": "2023-12-15T21:50:51.000+00:00",
  //       "endDate": "2023-12-30T21:50:51.000+00:00"
  //     },
  //   ],
  //     "total": 3, // 如果用 size = -1, 则 total = 需要手动处理
  //     "size": 1,
  //     "current": 1,
  //     "orders": [],
  //     "hitCount": false,
  //     "searchCount": true,
  //     "pages": 0
  // }
  listPage(req) {
    return request({
      url: '/paper/list',
      method: 'post',
      data: req
    })
  },

  /**
   * 查询学生试卷列表
   * @param {Object} req 分页查询条件
   * 参数含义:
   * - current: 当前页码
   * - size: 每页数量
   * - type: 试卷类型 (1: 平时测试, 2: 考试)
   * - title: 试卷名称
   * - courseId: 课程ID
   * - creator: 创建人
   */
  // { "current": 1, "size": 1" }
  // {
  //   "code": 20000,
  //   "message": "操作成功",
  //   "data": {
  //   "records": [
  //     {
  //       "id": "3",
  //       "title": "期末考试",
  //       "type": 2,
  //       "courseId": "高等数学",
  //       "creator": "zhangsan",
  //       "nick_name": "张三",
  //       "createDate": "2023-12-15T22:06:00.000+00:00",
  //       "startDate": "2023-12-15T21:50:51.000+00:00",
  //       "endDate": "2023-12-30T21:50:51.000+00:00"
  //     },
  //   ],
  //     "total": 3, // 如果用 size = -1, 则 total = 需要手动处理
  //     "size": 1,
  //     "current": 1,
  //     "orders": [],
  //     "hitCount": false,
  //     "searchCount": true,
  //     "pages": 0
  // }
  getStudentPaperList(req) {
    return request({
      url: '/paper/studentPaperList',
      method: 'post',
      data: req
    })
  },

  /**
   * 更新试卷详情信息
   * @param {Object} paper 试卷对象，可包含任意属性
   * 参数含义:
   * - id: 试卷ID
   * - title: 试卷名称
   * - type: 试卷类型 (1: 平时测试, 2: 考试)
   * - courseId: 所属课程ID
   // * - creator: 创建人用户名
   * - nick_name: 创建人姓名
   * - size: 班级总人数
   * - startDate: 开始答题时间
   * - endDate: 结束答题时间
   */
  update(paper) {
    return request({
      url: '/paper',
      method: 'put',
      data: paper
    })
  },

  /**
   * 查询试卷详情信息
   * @param {String} id 试卷ID
   * 参数含义:
   * - id: 试卷ID
   */
  // {
  //   "code": 20000,
  //   "message": "操作成功",
  //   "data": {
  //   "id": "1",
  //     "title": "测试卷1",
  //     "type": 1,
  //     "courseId": "线性代数",
  //     "creator": "zhangsan",
  //     "createDate": "2023-12-09T16:00:00.000+00:00",
  //     "startDate": "2023-12-15T20:51:16.000+00:00",
  //     "endDate": "2023-12-15T20:51:19.000+00:00"
  // }
  view(id) {
    return request({
      url: `/paper/${id}`,
      method: 'get'
    })
  },

  /**
   * 查询某试卷的选择题总分
   * @param {String} id 试卷ID
   * 参数含义:
   * - id: 试卷ID
   */
  // {
  //   "code": 20000,
  //   "message": "操作成功",
  //   "data": 5
  // }
  total(id) {
    return request({
      url: `/paper/total/${id}`,
      method: 'get'
    })
  },

  /**
   * 查询学生成绩
   * @param {Object} req 分页查询条件
   * 参数含义:
   * - current: 当前页码
   * - size: 每页数量
   * - type: 试卷类型 (1: 平时测试, 2: 考试)
   * - title: 试卷名称
   * - courseId: 课程ID
   * - creator: 创建人
   */
  getGrade(req) {
    return request({
      url: '/paper/grade',
      method: 'post',
      data: req
    })
  }
}
