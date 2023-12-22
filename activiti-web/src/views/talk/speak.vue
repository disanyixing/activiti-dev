<template>
  <el-dialog :visible.sync="dialogVisible" :width="width" top="10vh" custom-class="custom-dialog">
    <div class="chat-window">
      <el-input v-model="message" placeholder="请输入消息" class="message-input">
        <el-button slot="append" type="primary" @click="sendMessage">发表</el-button>
      </el-input>

      <div class="refresh-control">
        <el-button type="text" @click="refreshMessages">
          <i class="el-icon-refresh" /> 刷新
        </el-button>
      </div>

      <el-divider />

      <div class="messages">
        <div v-for="(item, index) in messages" :key="index" class="message">
          <div class="info-badge" :style="{ backgroundColor: badgeColor }">
            {{ item.speaker }} | 楼层 {{ calculateFloor(index) }}
          </div>
          <div class="speaker-badge" :style="{ backgroundColor: getBadgeColor(item.speaker) }">
            {{ getBadgeText(item.speaker) }}
          </div>
          <div class="time-badge">{{ formatTime(item.createDate) }}</div>
          <div class="text-bubble" :style="{ backgroundColor: bubbleColor }">{{ item.text }}</div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import userApi from '@/api/speak'
import { getInfo } from '@/api/user' // 引入API接口
export default {
  props: {
    talkid: {
      type: String,
      default: '1'
    },
    teacherId: {
      type: String,
      default: '1'
    },
    width: {
      type: String,
      default: '30%'
    },
    badgeColor: {
      type: String,
      default: '#409EFF' // 默认蓝色
    },
    bubbleColor: {
      type: String,
      default: '#FFFFFF' // 默认白色
    }
  },
  data() {
    return {
      dialogVisible: true,
      message: '',
      messages: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      userInfo: null
    }
  },
  created() {
    this.fetchUserInfo()
    this.fetchMessages()
  },
  methods: {
    fetchMessages() {
      userApi.listPage(this.talkid, this.currentPage, this.pageSize).then(response => {
        console.log(response.data.records)
        this.messages = response.data.records
        this.total = response.data.total
      })
    },
    fetchUserInfo() {
      getInfo().then(response => {
        this.userInfo = response.data
      })
    },
    getBadgeColor(speaker) {
      if (speaker === this.userInfo.username) return 'green'
      if (speaker === this.teacherId) return 'red'
      return 'grey' // 默认颜色
    },
    getBadgeText(speaker) {
      if (speaker === this.userInfo.username) return '我'
      if (speaker === this.teacherId) return '教师'
      return '' // 默认不显示文本
    },
    sendMessage() {
      if (!this.message.trim()) return
      const speak = {
        talkId: this.talkid,
        text: this.message,
        username: 'admin' // 根据实际情况调整
      }
      userApi.add(speak).then(() => {
        this.message = ''
        this.fetchMessages()
      })
    },
    refreshMessages() {
      this.fetchMessages()
    },
    formatTime(timeString) {
      const date = new Date(timeString)
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      return new Intl.DateTimeFormat('zh-CN', options).format(date)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchMessages()
    },
    calculateFloor(index) {
      // 总消息数减去 (当前页起始索引 + 当前消息的索引)
      return this.total - (this.currentPage - 1) * this.pageSize - index
    }
  }
}
</script>

<style scoped>
.custom-dialog /deep/ {
  min-width: 300px; /* 设置el-dialog的最小宽度 */
}

.message-input {
  flex-grow: 1;
  margin-right: 10px; /* 发表按钮的左边距 */
  margin-bottom: 15px;
  border-radius: 10px;
}

.message-input textarea {
  resize: none; /* 禁止手动调整大小 */
}

/* 聊天窗口基本样式 */
.chat-window {
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 信息badge样式 */
.info-badge {
  background-color: #409EFF; /* 默认颜色 */
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  display: inline-block;
  margin-top: 10px;
}

/* 新增的气泡badge样式 */
.speaker-badge {
  padding: 5px 8px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  font-size: 10px;
  border-radius: 8px;
  color: white;
  display: inline-block;
  margin-left: 2px; /* 左边距 */
}

/* 消息气泡样式调整 */
.text-bubble {
  background-color: #FFFFFF; /* 设置为白色 */
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  display: block; /* 修改为块级元素 */
  margin-top: 5px; /* 添加顶部外边距 */
  width: 100%; /* 占满容器宽度 */
}

/* 时间badge样式 */
.time-badge {
  display: inline-block;
  background-color: grey;
  color: white;
  padding: 5px 8px;
  font-size: 10px;
  border-radius: 8px;
  margin-left: 2px;
}

/* 分页控制样式 */
.pagination {
  text-align: right;
  margin-top: 15px;
}

/* 分页按钮的自定义样式 */
.pagination .el-pagination button {
  border-radius: 4px;
}

/* 当前页按钮的样式 */
.pagination .el-pagination button.is-current {
  background-color: #409EFF;
  color: white;
}

.message-input textarea {
  resize: none; /* 禁止手动调整大小 */
}

/* 刷新控制样式 */
.refresh-control {
  text-align: right;
  font-size: 12px;
}

</style>
