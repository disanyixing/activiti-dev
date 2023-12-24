// 话题管理 API
import request from '@/utils/request'

export default {

  // 新增话题申请
  // 方法名: add, 接收参数: Talk (话题实体类)
  // 参数含义:
  // - courseId: 所属课程ID
  // - title: 话题标题
  // - text: 话题简介
  // - creator: 创建人用户名
  // - createDate: 创建时间
  add(talk) {
    return request({
      url: '/talk',
      method: 'post',
      data: talk
    })
  },

  // 查询话题申请列表
  // 方法名: listPage, 接收参数: TalkREQ (话题请求实体类)
  // 参数含义:
  // - courseId: 所属课程的ID
  // - current: 当前页码
  // - size: 每页显示的记录数
  // {"courseId": "1", "current":"1", "size":"1"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "0",
  //                 "courseId": "1",
  //                 "title": "title0",
  //                 "text": "text0",
  //                 "creator": "admin",
  //                 "createDate": "2023-12-06T16:00:00.000+00:00"
  //             }
  //         ],
  //         "total": 6,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 6
  //     }
  // }
  listPage(courseId, current, size) {
    return request({
      url: '/talk/list',
      method: 'post',
      data: { courseId, current, size }
    })
  },

  // 更新话题详情信息
  // 方法名: update, 接收参数: Talk (话题实体类)
  // - id: 唯一标识符
  // - courseId: 所属课程ID
  // - title: 话题标题
  // - text: 话题简介
  // - creator: 创建人用户名
  // - createDate: 创建时间
  update(talk) {
    return request({
      url: '/talk',
      method: 'put',
      data: talk
    })
  },

  // 查询话题详情信息
  // 方法名: view, 接收参数: id (话题ID)
  view(id) {
    return request({
      url: `/talk/${id}`,
      method: 'get'
    })
  },

  // 删除话题
  // 方法名: delete, 接收参数: id (话题ID)
  delete(id) {
    return request({
      url: `/talk/${id}`,
      method: 'delete'
    })
  }

}
