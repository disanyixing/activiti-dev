// speakApi.js
// 发言管理 API
import request from '@/utils/request'

export default {

  // 新增发言申请
  // 方法名: add, 接收参数: Speak
  add(speak) {
    return request({
      url: '/speak',
      method: 'post',
      data: speak
    })
  },

  // 查询发言申请列表
  // 方法名: listPage, 接收参数: SpeakREQ
  // {"talkId": "1","current":"1","size":"1"}
  // {
  //     "code": 20000,
  //     "message": "操作成功",
  //     "data": {
  //         "records": [
  //             {
  //                 "id": "1732778348219310081",
  //                 "talkId": "1",
  //                 "text": "text0",
  //                 "speaker": "admin",
  //                 "createDate": "2023-12-06T16:00:00.000+00:00"
  //             }
  //         ],
  //         "total": 2,
  //         "size": 1,
  //         "current": 1,
  //         "orders": [],
  //         "hitCount": false,
  //         "searchCount": true,
  //         "pages": 2
  //     }
  // }
  listPage(talkId, current, size) {
    return request({
      url: '/speak/list',
      method: 'post',
      data: { talkId, current, size }
    })
  },

  // 更新发言详情信息
  // 方法名: update, 接收参数: Speak
  update(speak) {
    return request({
      url: '/speak',
      method: 'put',
      data: speak
    })
  },

  // 查询发言详情信息
  // 方法名: view, 接收参数: id
  view(id) {
    return request({
      url: `/speak/${id}`,
      method: 'get'
    })
  }

}
