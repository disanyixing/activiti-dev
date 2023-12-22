<template>
  <el-container>
    <el-aside width="25%">
      <!-- 信息区 -->
      <div class="info-section">
        <div class="back-section">
          <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <!-- 考试剩余时间和未答题目统计 -->
        <div class="exam-timer">
          <h3>剩余时间： {{ remainingTime }}</h3>
        </div>
        <div class="unanswered-questions">
          <p>未答选择题: {{ unansweredChoiceQuestions }}</p>
          <p>未答简答题: {{ unansweredEssayQuestions }}</p>
        </div>
        <hr>
        <div class="question-preview-list">
          <h4>选择题列表</h4>
          <div
            v-for="(question, index) in choiceQuestions"
            :key="question.id"
            :ref="`preview_${question.id}`"
            class="question-preview"
            :class="{ 'selected': question.id === currentSelectedQuestionId, 'answered': question.isAnswered,
                      'error': question.isError }"
            @click="scrollToQuestion(question.id)"
          >
            <span>{{ index + 1 }}</span>
          </div>
          <h4>简答题列表</h4>
          <div
            v-for="(question, index) in essayQuestions"
            :key="question.id"
            :ref="`preview_${question.id}`"
            class="question-preview"
            :class="{ 'selected': question.id === currentSelectedQuestionId, 'answered': question.isAnswered,
                      'error': question.isError }"
            @click="scrollToQuestion(question.id)"
          >
            <span>{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </el-aside>
    <el-main>
      <!-- 题目区 -->
      <div class="question-section">
        <!-- 选择题区 -->
        <h2>一、选择题</h2>
        <el-divider />
        <div
          v-for="question in choiceQuestions"
          :key="question.id"
          :ref="`question_${question.id}`"
          class="question-item"
          @click="scrollToQuestion(question.id)"
        >
          <p>{{ question.description }}</p>
          <el-radio-group v-model="question.userAnswer" @change="onChoiceChange(question)">
            <el-radio :label="1">A: {{ question.choiceA }}</el-radio>
            <el-radio :label="2">B: {{ question.choiceB }}</el-radio>
            <el-radio :label="3">C: {{ question.choiceC }}</el-radio>
            <el-radio :label="4">D: {{ question.choiceD }}</el-radio>
          </el-radio-group>
        </div>

        <!-- 简答题区 -->
        <h2>二、简答题</h2>
        <el-divider />
        <div
          v-for="question in essayQuestions"
          :key="question.id"
          :ref="`question_${question.id}`"
          class="question-item"
          @click="scrollToQuestion(question.id)"
        >
          <p>{{ question.description }}</p>
          <el-input
            v-model="question.userAnswer"
            type="textarea"
            placeholder="请输入您的答案"
            @input="onEssayInput(question)"
            @blur="onEssayBlur(question)"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import capi from '@/api/choicequestion' // 选择题目的 API 方法
import saapi from '@/api/saquestion' // 简答题目的 API 方法
import answerApi from '@/api/answer' // 答案的 API 方法

export default {
  props: {
    examType: {
      type: String,
      default: 'choice'
    },
    paperId: {
      type: Number,
      default: 3
    },
    endTime: {
      type: String,
      default: '2023-12-30T21:50:51.000+00:00'
    },
    creator: {
      type: String,
      default: 'zhangsan'
    }
  },
  data() {
    return {
      choiceQuestions: [],
      essayQuestions: [],
      remainingTime: '', // 剩余时间
      unansweredChoiceQuestions: 0,
      unansweredEssayQuestions: 0,
      currentSelectedQuestionId: null,
      debounceTimers: {} // 存储防抖定时器的ID
    }
  },
  mounted() {
    this.fetchQuestions()
    this.calculateRemainingTime()
    // 每秒钟更新剩余时间
    setInterval(this.calculateRemainingTime, 1000)
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },
  beforeDestroy() {
    // 移除事件监听器
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
  methods: {
    async fetchQuestions() {
      const choiceResponse = await capi.listChoiceQuestions({ paperId: this.paperId, size: -1 })
      this.choiceQuestions = choiceResponse.data.records.map(q => ({
        ...q,
        userAnswer: null,
        isAnswered: false,
        isError: false
      }))

      const essayResponse = await saapi.listSaQuestions({ paperId: this.paperId, size: -1 })
      this.essayQuestions = essayResponse.data.records.map(q => ({
        ...q,
        userAnswer: null,
        isAnswered: false,
        isError: false
      }))

      await this.fetchAnswers() // 在获取题目后获取答案
    },
    async fetchAnswers() {
      const response = await answerApi.listAnswers({
        paperId: this.paperId,
        creator: this.creator,
        current: 1,
        size: -1
      })

      response.data.records.forEach(answer => {
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === answer.questionId)
        if (question) {
          const numAnswer = parseInt(answer.answer, 10)
          this.$set(question, 'userAnswer', numAnswer)
          this.$set(question, 'answerId', answer.id)
          question.isAnswered = true
        }
      })

      this.essayQuestions.forEach(question => {
        const answer = response.data.records.find(a => a.questionId === question.id)
        if (answer) {
          this.$set(question, 'userAnswer', answer.answer)
          this.$set(question, 'answerId', answer.id)
          question.isAnswered = true
        }
      })

      this.calculateUnansweredQuestions()
    },
    calculateRemainingTime() {
      const endTime = new Date(this.endTime).getTime()
      const currentTime = new Date().getTime()
      const timeLeft = endTime - currentTime

      if (timeLeft > 0) {
        this.remainingTime = this.formatTime(timeLeft)
      } else {
        this.remainingTime = '考试时间结束'
        setInterval(() => this.$router.go(-1), 5000)
      }
    },
    formatTime(time) {
      const hours = Math.floor(time / (3600 * 1000))
      const minutes = Math.floor((time % (3600 * 1000)) / 60000)
      const seconds = Math.floor((time % 60000) / 1000)
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
    calculateUnansweredQuestions() {
      this.unansweredChoiceQuestions = this.choiceQuestions.filter(q => !q.isAnswered).length
      this.unansweredEssayQuestions = this.essayQuestions.filter(q => !q.isAnswered).length
    },
    async uploadAnswer(questionId, answer) {
      try {
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === questionId)
        if (question) {
          if (question.answerId) {
            // 更新答案
            await answerApi.updateAnswer({
              id: question.answerId,
              answer: answer
            })
          } else {
            // 新增答案
            const response = await answerApi.addAnswer({
              paperId: this.paperId,
              questionId: questionId,
              answer: answer
            })
            question.id = response.data // 存储答案ID
          }
          question.isError = false
          question.isAnswered = !!answer
        }
        this.calculateUnansweredQuestions()
      } catch (error) {
        console.error('Error uploading answer:', error)
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === questionId)
        if (question) {
          question.isError = true
        }
      }
    },
    // 修改选择题和简答题的交互逻辑
    onChoiceChange(question) {
      this.uploadAnswer(question.id, question.userAnswer)
    },
    onEssayBlur(question) {
      this.uploadAnswer(question.id, question.userAnswer)
    },
    confirmNavigation(onConfirm, onCancel) {
      const hasUnansweredQuestions = this.choiceQuestions.some(q => !q.isAnswered || !q.isError) || this.essayQuestions.some(q => !q.isAnswered || !q.isError)
      if (hasUnansweredQuestions) {
        this.$confirm('您有未完成/未保存的题目，确定要离开吗?', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(onConfirm).catch(onCancel)
      } else {
        onConfirm()
      }
    },
    goBack() {
      this.confirmNavigation(() => {
        this.$router.go(-1)
      }, () => {
        // 可以处理取消导航的逻辑
      })
    },
    handleBeforeUnload(event) {
      if (this.isAnyQuestionEditing()) {
        const message = '您有未完成/未保存的题目，确定要离开吗?'
        event.returnValue = message
        return message
      }
    },
    // 页面滚动到对应题目
    scrollToQuestion(questionId) {
      this.$nextTick(() => {
        this.currentSelectedQuestionId = questionId // 设置当前选中题目的 ID
        const questionElement = this.$refs[`question_${questionId}`][0]
        const previewElement = this.$refs[`preview_${questionId}`][0]
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    onEssayInput(question) {
      question.isAnswered = false
      // 清除现有的定时器（如果有）
      if (this.debounceTimers[question.id]) {
        clearTimeout(this.debounceTimers[question.id])
      }
      // 设置新的定时器
      this.debounceTimers[question.id] = setTimeout(() => {
        this.uploadAnswer(question.id, question.userAnswer)
      }, 5000) // 5秒后触发
      // 标记为未回答
    }
  }
}
</script>

<style scoped>
/* 全局样式调整 */
.el-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 更易读的字体 */
}

.el-form-item__label:before {
  content: '*';
  color: #409EFF; /* 更改星号颜色 */
  margin-right: 4px;
}

/* 按钮样式 */
.el-button {
  padding: 10px 20px; /* 适度调整按钮内填充 */
  font-size: 14px; /* 减小字体大小 */
  border-radius: 4px; /* 圆角边框 */
  margin-right: 10px; /* 与其他按钮的间距 */
}

/* 主按钮样式 */
.el-button--primary {
  background-color: #409EFF; /* 柔和的蓝色 */
  color: white;
}

/* 成功按钮样式 */
.el-button--success {
  background-color: #67c23a; /* 柔和的绿色 */
}

/* 危险按钮样式 */
.el-button--danger {
  background-color: #f56c6c; /* 柔和的红色 */
}

/* 鼠标悬停时的样式变化 */
.el-button:hover {
  opacity: 0.8; /* 稍微降低透明度 */
}

.el-button:focus,
.el-button:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2); /* 按钮悬停时的阴影效果 */
}

.back-section {
  text-align: left; /* 或者根据需要调整对齐 */
  margin-bottom: 10px;
}

/* 信息区域样式 */
.info-section {
  background-color: #f9fafc; /* 淡色背景 */
  padding: 20px;
  border-right: 1px solid #ebeef5; /* 添加分割线 */
  height: calc(100vh - 60px); /* 视口高度减去头部高度 */
  overflow-y: auto;
}

.total-score h3 {
  font-size: 24px; /* 字体放大 */
  color: #303133; /* 字体颜色加深 */
  margin-bottom: 10px;
}

.score-details p {
  font-size: 16px; /* 分数详情的字体大小 */
  color: #606266; /* 分数详情的字体颜色 */
}

/* 题目预览列表样式 */
.question-preview-list {
  margin-top: 20px;
}

.question-preview {
  background-color: #fff; /* 背景色 */
  margin: 5px;
  padding: 10px 15px;
  border: 1px solid #dcdfe6; /* 边框颜色 */
  border-radius: 4px;
  cursor: pointer; /* 鼠标悬停手势 */
  transition: background-color 0.25s, border-color 0.5s; /* 平滑过渡效果 */
}

.question-preview:hover {
  background-color: #ecf5ff; /* 鼠标悬停时变色 */
}

.question-preview.answered {
  background-color: #e8f5e9; /* 已回答题目的绿色背景 */
}

.question-preview.selected {
  border: 2px solid #409EFF; /* 设置一个显著的边框 */
  padding: calc(10px); /* 减去边框宽度保持原有的总大小 */
}

.question-preview.error {
  background-color: #f56c6c; /* 错误时的红色背景 */
}
/* 题目区域样式 */

.el-main {
  padding-bottom: 0;
}

/* 为新增按钮添加间隔 */
.add-question-button {
  margin-bottom: 20px; /* 例如，顶部间隔为20px */
}

.question-section {
  height: calc(100vh - 100px); /* 视口高度减去头部高度 */
  overflow-y: auto;
  padding: 20px;
}

.question-item {
  background-color: #fff; /* 背景色 */
  border: 1px solid #dcdfe6; /* 边框颜色 */
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.question-item h2 {
  font-size: 20px; /* 题型标题字体大小 */
  color: #303133; /* 题型标题字体颜色 */
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF; /* 标题下划线 */
  margin-bottom: 20px; /* 与题目间距 */
}

/* 选择题和简答题共同样式 */
.question-item p {
  font-size: 16px; /* 增加字体大小 */
  color: #333; /* 深色字体增加可读性 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 添加文本阴影 */
  margin-left: 5px;
  line-height: 1.25;
}

/* 为Webkit浏览器设置滚动条样式 */
.info-section::-webkit-scrollbar,
.question-section::-webkit-scrollbar {
  width: 5px; /* 设置滚动条宽度为5px */
}

.info-section::-webkit-scrollbar-track,
.question-section::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道背景颜色 */
}

.info-section::-webkit-scrollbar-thumb,
.question-section::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条的颜色 */
}

.info-section::-webkit-scrollbar-thumb:hover,
.question-section::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滚动条hover时的颜色 */
}

</style>
