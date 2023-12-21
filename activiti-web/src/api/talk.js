// 话题管理 API
import request from '@/utils/request'

export default {

  // 新增话题申请
  // 方法名: add, 接收参数: Talk
  add(talk) {
    return request({
      url: '/talk',
      method: 'post',
      data: talk
    })
  },

  // 查询话题申请列表
  // 注意区分标题title和内容text
  // 方法名: listPage, 接收参数: TalkREQ
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
  // 方法名: update, 接收参数: Talk
  update(talk) {
    return request({
      url: '/talk',
      method: 'put',
      data: talk
    })
  },

  // 查询话题详情信息
  // 方法名: view, 接收参数: id
  view(id) {
    return request({
      url: `/talk/${id}`,
      method: 'get'
    })
  }

}
