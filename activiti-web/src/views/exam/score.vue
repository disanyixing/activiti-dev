<template>
  <el-container>
    <el-aside width="25%">
      <!-- 信息区 -->
      <div class="info-section">
        <div class="back-section">
          <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <div class="total-score">
          <h3>当前评分：{{ currentTotalScore }} / {{ totalScore }} </h3>
        </div>
        <div class="score-details">
          <p>选择题总分: {{ currentChoiceScore }} / {{ totalChoiceScore }}</p>
          <p>简答题总分: {{ currentEssayScore }} / {{ totalEssayScore }}</p>
        </div>
        <!-- 未评分题目统计 -->
        <hr>
        <div class="unjudged-questions">
          <p>未评分选择题: {{ unjudgedChoiceQuestions }}</p>
          <p>未评分简答题: {{ unjudgedEssayQuestions }}</p>
        </div>
        <hr>
        <!-- 题目预览列表 -->
        <div class="question-preview-list">
          <h4>选择题列表</h4>
          <div
            v-for="(question, index) in choiceQuestions"
            :key="question.id"
            :ref="`preview_${question.id}`"
            class="question-preview"
            :class="{ 'selected': question.id === currentSelectedQuestionId, 'judged': question.isJudged,
                      'error': question.isError }"
            @click="scrollToQuestion(question.id)"
          >
            <span>{{ index + 1 }}  (分数: {{ question.score }}/{{ question.maxScore }})</span>
          </div>
          <h4>简答题列表</h4>
          <div
            v-for="(question, index) in essayQuestions"
            :key="question.id"
            :ref="`preview_${question.id}`"
            class="question-preview"
            :class="{ 'selected': question.id === currentSelectedQuestionId, 'judged': question.isJudged,
                      'error': question.isError }"
            @click="scrollToQuestion(question.id)"
          >
            <span>{{ index + 1 }}  (分数: {{ question.score }}/{{ question.maxScore }})</span>
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
          v-for="(question, index) in choiceQuestions"
          :key="question.id"
          :ref="`question_${question.id}`"
          class="question-item"
          :class="{
            'judged': question.isJudged,
            'selected': question.id === currentSelectedQuestionId,
            'last-choice-question': index === choiceQuestions.length - 1 }"
          @click="highlightQuestion(question.id)"
        >
          <p>
            {{ question.description }}
            <span class="score-info"> (正确答案: {{ formatAnswer(question.answer) }}, 分值: {{
              question.maxScore
            }})</span>
            <span v-if="!question.isAnswered" class="unanswered-label">用户未作答</span> <!-- 未作答的提示 -->
          </p>
          <el-radio-group v-model="question.userAnswer" disabled>
            <el-radio :label="1">A: {{ question.choiceA }}</el-radio>
            <el-radio :label="2">B: {{ question.choiceB }}</el-radio>
            <el-radio :label="3">C: {{ question.choiceC }}</el-radio>
            <el-radio :label="4">D: {{ question.choiceD }}</el-radio>
          </el-radio-group>
          <div class="grading-section">
            <el-input-number
              v-model="question.score"
              :min="0"
              :max="question.maxScore"
              @change="onScoreChange(question)"
            />
            <el-button type="primary" @click="gradeQuestion(question)">确认评分</el-button>
          </div>
        </div>

        <!-- 简答题区 -->
        <h2>二、简答题</h2>
        <el-divider />
        <div
          v-for="question in essayQuestions"
          :key="question.id"
          :ref="`question_${question.id}`"
          class="question-item"
          :class="{
            'judged': question.isJudged,
            'selected': question.id === currentSelectedQuestionId
          }"
          @click="highlightQuestion(question.id)"
        >
          <p>
            {{ question.description }}
            <span class="score-info"> (分值: {{ question.maxScore }})</span>
            <span v-if="!question.isAnswered" class="unanswered-label">用户未作答</span> <!-- 未作答的提示 -->
          </p>
          <el-input
            v-model="question.userAnswer"
            type="textarea"
            placeholder=""
            disabled
          />
          <div class="grading-section">
            <el-input-number
              v-model="question.score"
              :min="0"
              :max="question.maxScore"
              @change="onScoreChange(question)"
            />
            <el-button type="primary" @click="gradeQuestion(question)">确认评分</el-button>
          </div>
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
  data() {
    return {
      choiceQuestions: [],
      essayQuestions: [],
      unjudgedChoiceQuestions: 0,
      unjudgedEssayQuestions: 0,
      currentSelectedQuestionId: null,
      totalChoiceScore: 0,
      totalEssayScore: 0,
      currentChoiceScore: 0,
      currentEssayScore: 0,
      animatedTimeout: null
    }
  },
  computed: {
    totalScore() {
      return this.totalChoiceScore + this.totalEssayScore
    },
    currentTotalScore() {
      return this.currentChoiceScore + this.currentEssayScore
    }
  },
  created() {
    this.paperId = this.$route.query.id
    this.creator = this.$route.query.creator
  },
  mounted() {
    this.fetchQuestions()
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
        isError: false,
        isJudged: false,
        maxScore: q.score
      }))

      const essayResponse = await saapi.listSaQuestions({ paperId: this.paperId, size: -1 })
      this.essayQuestions = essayResponse.data.records.map(q => ({
        ...q,
        userAnswer: null,
        isAnswered: false,
        isError: false,
        isJudged: false,
        maxScore: q.score
      }))

      await this.fetchAnswers() // 在获取题目后获取答案
    },
    formatAnswer(answer) {
      const answersMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' }
      return answersMap[answer] || ''
    },
    async fetchAnswers() {
      const response = await answerApi.listAnswers({
        paperId: this.paperId,
        creator: this.creator,
        current: 1,
        size: -1
      })

      response.data.records.forEach(answer => {
        // 合并选择题和论述题数组，然后查找相应的问题
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === answer.questionId)

        if (question) {
          if (!answer || !answer.answer || answer.answer === '') {
          } else {
            question.isAnswered = true
            // 检查问题类型并相应地处理答案
            if (this.choiceQuestions.some(q => q.id === question.id)) {
              question.userAnswer = parseInt(answer.answer, 10)
            } else {
              question.userAnswer = answer.answer
            }
            question.isAnswered = true
          }

          // 设置其他相关的属性
          question.isJudged = answer.score !== -1
          question.answerId = answer.id
          question.score = answer.score
        }
      })

      this.calculateUnjudgedQuestions()
      this.calculateAllScores()
    },
    calculateCurrentScores() {
      let currentChoiceScore = 0
      let currentEssayScore = 0

      this.choiceQuestions.forEach(question => {
        if (question.isJudged) {
          currentChoiceScore += question.score
        }
      })
      this.essayQuestions.forEach(question => {
        if (question.isJudged) {
          currentEssayScore += question.score
        }
      })
      this.currentChoiceScore = currentChoiceScore
      this.currentEssayScore = currentEssayScore
    },
    calculateAllScores() {
      let totalChoiceScore = 0
      let totalEssayScore = 0

      console.log(this.choiceQuestions)

      this.choiceQuestions.forEach(question => {
        totalChoiceScore += question.maxScore
      })
      this.essayQuestions.forEach(question => {
        totalEssayScore += question.maxScore
      })

      this.calculateCurrentScores()

      this.totalChoiceScore = totalChoiceScore
      this.totalEssayScore = totalEssayScore
    },
    calculateUnjudgedQuestions() {
      this.unjudgedChoiceQuestions = this.choiceQuestions.filter(q => !q.isJudged).length
      this.unjudgedEssayQuestions = this.essayQuestions.filter(q => !q.isJudged).length
    },
    gradeQuestion(question) {
      // 调用uploadAnswer方法来修改分数
      clearTimeout(this.animatedTimeout)
      this.uploadAnswer(question.id, question.userAnswer, question.score)
      this.calculateUnjudgedQuestions()
    },
    async uploadAnswer(questionId, answer, score) {
      try {
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === questionId)
        question.isJudged = false
        if (!question.answerId) {
          const response = await answerApi.addAnswer({
            paperId: this.paperId,
            creator: this.creator,
            answer,
            questionId,
            score
          })
          question.answerId = response.data // 存储答案ID
        }

        await answerApi.updateAnswer({
          id: question.answerId,
          paperId: this.paperId,
          creator: this.creator,
          answer,
          questionId,
          score
        })
        question.isError = false
        this.animatedTimeout = setTimeout(() => {
          question.isJudged = true
          this.calculateAllScores()
          this.calculateUnjudgedQuestions()
        }, 300)
      } catch (error) {
        console.error('Error uploading answer:', error)
        const question = this.choiceQuestions.concat(this.essayQuestions).find(q => q.id === questionId)
        if (question) {
          question.isError = true
        }
      }
    },
    onScoreChange(question) {
      // 当分数输入框的值发生变化时执行
      this.$set(question, 'isJudged', false)
      clearTimeout(this.animatedTimeout)
      // 可以在这里调用其他逻辑，如计算未评分题目数量
      this.calculateCurrentScores()
      this.calculateUnjudgedQuestions()
    },
    hasUnjudgedQuestions() {
      return this.choiceQuestions.some(q => !q.isJudged || q.isError) ||
        this.essayQuestions.some(q => !q.isJudged || q.isError)
    },
    confirmNavigation(onConfirm, onCancel) {
      if (this.hasUnjudgedQuestions()) {
        // 如果有未评分的题目，提示用户
        this.$confirm('您有未评分的题目，确定要离开吗?', '确认信息', {
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
        // 取消导航的逻辑
      })
    },
    handleBeforeUnload(event) {
      // 修改离开页面前的提示逻辑
      if (this.hasUnjudgedQuestions()) {
        const message = '您有未评分的题目，确定要离开吗?'
        event.returnValue = message
        return message
      }
    },
    // 页面滚动到对应题目
    highlightQuestion(questionId) {
      this.currentSelectedQuestionId = questionId // 设置当前选中题目的 ID
    },
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

.question-preview.judged {
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

/* 题目评分标签 */
.score-info {
  color: #333;
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
  transition: box-shadow 0.3s ease, background-color 0.3s ease; /* 阴影和背景色渐变效果 */
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

.question-item.judged {
  background-color: #e8f5e9; /* 已回答题目的绿色背景 */
}

.unanswered-label {
  margin-left: 10px;
  color: #ff4d4f !important; /* 红色，表示警告或未完成 */
  font-style: italic;
}

.grading-section {
  margin-top: 20px;
}

/* 当题目被选中时的样式 */
.question-item.selected {
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2); /* 强阴影效果 */
}

/* 选择题最后一项的样式 */
.last-choice-question {
  margin-bottom: 50px;
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
