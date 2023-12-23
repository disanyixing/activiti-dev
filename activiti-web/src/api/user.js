import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: data // params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// {
//     "code": 20000,
//     "message": "操作成功",
//     "data": {
//         "id": "12",
//         "username": "zhangsan",
//         "password": "$2a$10$EHkq/r6PTCCYEDOQYNi/ZORb8S.G8yxu4jsxqvjGWEytyrrPx5FVS",
//         "nickName": "张三",
//         "imageUrl": "group1/M00/00/00/J2y7ZGA2IheAESCfAABBqgX_-Lk92.jpeg",
//         "accountNonExpired": true,
//         "accountNonLocked": true,
//         "credentialsNonExpired": true,
//         "enabled": true
//     }
// }
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/* export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}*/

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

