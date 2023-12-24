import request from '@/utils/request'

export default {
  /**
   * 新增课程通知
   * @param {Object} courseMessage 课程通知对象
   * 参数含义:
   * - course_name: 课程名称
   * - teacher_name: 教师用户名
   * - teacher_nick_name: 教师姓名
   * - class_id: 班级id
   * - class_name: 班级名称（非数据库字段）
   * - message: 通知内容
   * - createDate: 创建时间
   */
  add(courseMessage) {
    return request({
      url: '/CourseMessage',
      method: 'post',
      data: courseMessage
    })
  },

  /**
   * 更新课程通知详情信息
   * @param {Object} courseMessage 课程通知对象
   * 参数含义:
   * - id: 通知id
   * - course_name: 课程名称
   * - teacher_name: 教师用户名
   * - teacher_nick_name: 教师姓名
   * - class_id: 班级id
   * - class_name: 班级名称（非数据库字段）
   * - message: 通知内容
   * - createDate: 创建时间
   */
  update(courseMessage) {
    return request({
      url: '/CourseMessage',
      method: 'put',
      data: courseMessage
    })
  },

  /**
   * 查询课程通知详情信息
   * @param {String} id 课程通知ID
   */
  viewById(id) {
    return request({
      url: `/CourseMessage/${id}`,
      method: 'get'
    })
  },

  /**
   * 查询课程通知列表
   * @param {Object} req 分页查询条件
   * 参数含义:
   * - current: 当前页码
   * - size: 每页数量
   * - course: 课程名称
   * - classes: 班级
   * - username: 所属的用户名
   * {"current": 1, "size": 1}
   * {
   *     "code": 20000,
   *     "message": "操作成功",
   *     "data": {
   *         "records": [
   *             {
   *                 "id": "2",
   *                 "course_name": "线性代数",
   *                 "teacher_name": "zhangsan",
   *                 "teacher_nick_name": "张三",
   *                 "class_id": "202003102",
   *                 "class_name": "20计科2班",
   *                 "message": "test2",
   *                 "createDate": "2023-12-09T21:42:52.000+00:00",
   *                 "createDateStr": "2023-12-10 05:42:52"
   *             }
   *         ],
   *         "total": 3,
   *         "size": 1,
   *         "current": 1,
   *         "orders": [],
   *         "hitCount": false,
   *         "searchCount": true,
   *         "pages": 1
   *     }
   * }
   */
  listPage(req) {
    return request({
      url: '/CourseMessage/list',
      method: 'post',
      data: req
    })
  },

  /**
   * 查询课程通知的班级信息
   * 无参数，返回值包含该教师所教学的课程及班级信息
   */
  courseName() {
    return request({
      url: '/CourseMessage/courseInfo',
      method: 'post'
    })
  },

  /**
   * 查询学生课程通知列表
   * 参数含义:
   * - current: 当前页码
   * - size: 每页数量
   * - course: 课程名称
   * - classes: 班级
   * - username: 所属的用户名
   * {"current": 1, "size": 10 }
   * {
   *     "code": 20000,
   *     "message": "操作成功",
   *     "data": {
   *         "records": [
   *             {
   *                 "id": "1",
   *                 "course_name": "高等数学",
   *                 "teacher_name": "zhangsan",
   *                 "teacher_nick_name": "张三",
   *                 "class_id": "202003101",
   *                 "class_name": "20计科1班",
   *                 "message": "test",
   *                 "createDateStr": ""
   *             },
   *             {
   *                 "id": "4",
   *                 "course_name": "高等数学",
   *                 "teacher_name": "zhangsan",
   *                 "teacher_nick_name": "张三",
   *                 "class_id": "202003101",
   *                 "class_name": "20计科1班",
   *                 "message": "test4",
   *                 "createDateStr": ""
   *             }
   *         ],
   *         "total": 2,
   *         "size": 10,
   *         "current": 1,
   *         "orders": [],
   *         "hitCount": false,
   *         "searchCount": true,
   *         "pages": 1
   *     }
   * }
   */
  classMessageList(req) {
    return request({
      url: '/CourseMessage/classMessageList',
      method: 'post',
      data: req
    })
  }
}
