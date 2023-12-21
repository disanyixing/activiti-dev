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
  // 方法名: listPage, 接收参数: TalkREQ
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
