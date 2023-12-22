<template>
  <el-container>
    <el-aside width="25%">
      <!-- 信息区 -->
      <div class="info-section">
        <div class="back-section">
          <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <div class="total-score">
          <h3>总分值： {{ totalScore }}</h3>
        </div>
        <div class="score-details">
          <p>选择题总分: {{ choiceTotal }}</p>
          <p>简答题总分: {{ essayTotal }}</p>
        </div>
        <hr>
        <div class="question-preview-list">
          <h4>选择题列表</h4>
          <div
            v-for="(question, index) in choiceQuestions"
            :key="question.id"
            :ref="`preview_${question.id}`"
            class="question-preview"
            :class="{ 'editing': editingStatus[question.id], 'selected': question.id === currentSelectedQuestionId }"
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
            :class="{ 'editing': editingStatus[question.id], 'selected': question.id === currentSelectedQuestionId }"
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
          <div v-if="!editingStatus[question.id]">
            <!-- 显示选择题 -->
            <p>{{ question.description }}</p>
            <p>A: {{ question.choiceA }}</p>
            <p>B: {{ question.choiceB }}</p>
            <p>C: {{ question.choiceC }}</p>
            <p>D: {{ question.choiceD }}</p>
            <p>分值: {{ question.score }}</p>
            <p v-if="question.answer">答案: {{ answerLabel(question.answer) }}</p>
            <el-button type="primary" @click="setEditStatus(question.id, true)">编辑</el-button>
            <el-button type="danger" @click="deleteChoiceQuestion(question.id)">删除</el-button>
          </div>
          <!-- 编辑选择题 -->
          <div v-else class="editing-container">
            <el-form
              :key="question.id"
              :ref="`questionForm-${question.id}`"
              :model="question"
              :rules="rules"
              label-position="left"
              label-width="100px"
            >
              <el-form-item label="题目描述" prop="description">
                <el-input v-model="question.description" placeholder="请输入题目描述" />
              </el-form-item>
              <el-form-item label="选项A" prop="choiceA">
                <el-input v-model="question.choiceA" placeholder="请输入选项A内容" />
              </el-form-item>
              <el-form-item label="选项B" prop="choiceB">
                <el-input v-model="question.choiceB" placeholder="请输入选项B内容" />
              </el-form-item>
              <el-form-item label="选项C" prop="choiceC">
                <el-input v-model="question.choiceC" placeholder="请输入选项C内容" />
              </el-form-item>
              <el-form-item label="选项D" prop="choiceD">
                <el-input v-model="question.choiceD" placeholder="请输入选项D内容" />
              </el-form-item>
              <el-form-item label="分值" prop="score">
                <el-input-number v-model="question.score" placeholder="请输入分值" :min="1" />
              </el-form-item>
              <el-form-item label="正确答案" prop="answer">
                <el-select v-model="question.answer" placeholder="请选择正确答案">
                  <el-option label="A" :value="1" />
                  <el-option label="B" :value="2" />
                  <el-option label="C" :value="3" />
                  <el-option label="D" :value="4" />
                </el-select>
              </el-form-item>
              <el-button type="success" @click="saveChoiceQuestion(question)">保存</el-button>
              <el-button type="danger" @click="cancelEdit(question.id)">取消</el-button>
            </el-form>
          </div>
        </div>
        <el-button
          type="primary"
          class="add-question-button"
          @click="addNewChoiceQuestion"
        >新增选择题
        </el-button>

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
          <div v-if="!editingStatus[question.id]">
            <!-- 显示简答题 -->
            <p>{{ question.description }}</p>
            <p>分值: {{ question.score }}</p>
            <el-button type="primary" @click="setEditStatus(question.id, true)">编辑</el-button>
            <el-button type="danger" @click="deleteEssayQuestion(question.id)">删除</el-button>
          </div>
          <div v-else class="editing-container">
            <el-form
              :key="question.id"
              :ref="`questionForm-${question.id}`"
              :model="question"
              :rules="rules"
              label-position="left"
              label-width="100px"
            >
              <el-form-item label="题目描述" prop="description">
                <el-input v-model="question.description" placeholder="题目内容" />
              </el-form-item>
              <el-form-item label="分值" prop="score">
                <el-input-number v-model="question.score" placeholder="请输入分值" :min="0" />
              </el-form-item>
              <el-button type="success" @click="saveEssayQuestion(question)">保存</el-button>
              <el-button type="danger" @click="cancelEdit(question.id)">取消</el-button>
            </el-form>
          </div>
        </div>
        <el-button
          type="primary"
          class="add-question-button"
          @click="addNewEssayQuestion"
        >新增简答题
        </el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import capi from '@/api/choicequestion' // 引入API方法
import saapi from '@/api/saquestion'

export default {
  props: {
    examType: {
      type: String,
      default: 'choice'
    },
    paperId: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      choiceQuestions: [],
      essayQuestions: [],
      editingStatus: {}, // 存储每个题目的编辑状态
      currentSelectedQuestionId: null,
      totalScore: 0,
      choiceTotal: 0,
      essayTotal: 0,
      rules: {
        description: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ],
        choiceA: [
          { required: true, message: '请输入选项A内容', trigger: 'blur' }
        ],
        choiceB: [
          { required: true, message: '请输入选项B内容', trigger: 'blur' }
        ],
        choiceC: [
          { required: true, message: '请输入选项C内容', trigger: 'blur' }
        ],
        choiceD: [
          { required: true, message: '请输入选项D内容', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入分值', trigger: 'blur' },
          { type: 'number', min: 0, message: '分值不能为负数', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请选择正确答案', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    choiceQuestions: {
      handler: 'calculateTotalScore',
      deep: true
    },
    essayQuestions: {
      handler: 'calculateTotalScore',
      deep: true
    }
  },
  mounted() {
    this.fetchQuestions()
    // 添加事件监听器
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },
  beforeDestroy() {
    // 移除事件监听器
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
  methods: {
    async fetchQuestions() {
      // 获取选择题
      const choiceResponse = await capi.listChoiceQuestions({ paperId: this.paperId, size: -1 })
      this.choiceQuestions = choiceResponse.data.records

      // 获取简答题
      const essayResponse = await saapi.listSaQuestions({ paperId: this.paperId, size: -1 })
      this.essayQuestions = essayResponse.data.records

      // 初始化编辑状态
      this.choiceQuestions.forEach(q => this.$set(this.editingStatus, q.id, false))
      this.essayQuestions.forEach(q => this.$set(this.editingStatus, q.id, false))
    },
    confirmNavigation(onConfirm, onCancel) {
      if (this.isAnyQuestionEditing()) {
        this.$confirm('您似乎有编辑未完成，确定要离开吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(onConfirm).catch(onCancel)
      } else {
        onConfirm()
      }
    },
    handleBeforeUnload(event) {
      if (this.isAnyQuestionEditing()) {
        const message = '您似乎有编辑未完成，确定要离开吗？'
        event.returnValue = message
        return message
      }
    },
    goBack() {
      this.confirmNavigation(() => {
        this.$router.go(-1)
      }, () => {
      })
    },
    // 计算总分和各题型分数
    calculateTotalScore() {
      let choiceScore = 0
      let essayScore = 0

      this.choiceQuestions.forEach(q => choiceScore += q.score)
      this.essayQuestions.forEach(q => essayScore += q.score)

      this.choiceTotal = choiceScore
      this.essayTotal = essayScore
      this.totalScore = choiceScore + essayScore
    },
    // 选择题答案标签
    answerLabel(value) {
      const labels = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' }
      return labels[value] || value
    },
    // 添加新选择题
    addNewChoiceQuestion() {
      const newQuestion = {
        id: Date.now(), // 临时ID，用于前端识别
        paperId: this.paperId,
        description: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        answer: null,
        score: 0,
        isNew: true // 标记为新题目
      }
      this.choiceQuestions.push(newQuestion)
      this.setEditStatus(newQuestion.id, true)
    },
    isAnyQuestionEditing() {
      return Object.values(this.editingStatus).some(status => status)
    },

    // 保存选择题
    async saveChoiceQuestion(question) {
      const formRef = this.$refs[`questionForm-${question.id}`][0]
      if (formRef) {
        formRef.validate(async(valid) => {
          if (valid) {
            if (question.isNew) {
              // 新增题目
              const response = await capi.addChoiceQuestion(question)
              console.log(response)
              question.id = response.data
              // 移除isNew标记
              delete question.isNew
            } else {
              // 更新现有题目
              await capi.updateChoiceQuestion(question)
            }
            this.setEditStatus(question.id, false)
          } else {
            return false
          }
        })
      } else {
        console.error('Form reference not found for question:', question.id)
      }
    },

    // 删除选择题
    async deleteChoiceQuestion(questionId) {
      await capi.deleteChoiceQuestion(questionId)
      this.choiceQuestions = this.choiceQuestions.filter(q => q.id !== questionId)
    },

    // 添加新简答题
    addNewEssayQuestion() {
      const newQuestion = {
        id: Date.now(), // 临时ID
        paperId: this.paperId,
        description: '',
        score: 0,
        isNew: true
      }
      this.essayQuestions.push(newQuestion)
      this.setEditStatus(newQuestion.id, true)
    },
    // 保存简答题
    async saveEssayQuestion(question) {
      const formRef = this.$refs[`questionForm-${question.id}`][0]
      if (formRef) {
        formRef.validate(async(valid) => {
          if (valid) {
            // 验证通过，进行保存逻辑
            if (question.isNew) {
              await saapi.addSaQuestion(question)
              delete question.isNew
            } else {
              await saapi.updateSaQuestion(question)
            }
            this.setEditStatus(question.id, false)
          } else {
            // 验证未通过
            return false
          }
        })
      } else {
        console.error('Form reference not found for question:', question.id)
      }
    },

    // 删除简答题
    async deleteEssayQuestion(questionId) {
      await saapi.deletesaQuestion(questionId)
      this.essayQuestions = this.essayQuestions.filter(q => q.id !== questionId)
    },

    // 设置题目的编辑状态
    setEditStatus(questionId, status) {
      this.$set(this.editingStatus, questionId, status)
    },
    cancelEdit(questionId) {
      if (this.editingStatus[questionId]) {
        // 如果是新增的题目，直接移除
        if (this.choiceQuestions.find(q => q.id === questionId && q.isNew)) {
          this.choiceQuestions = this.choiceQuestions.filter(q => q.id !== questionId)
        } else if (this.essayQuestions.find(q => q.id === questionId && q.isNew)) {
          this.essayQuestions = this.essayQuestions.filter(q => q.id !== questionId)
        }
        this.setEditStatus(questionId, false)
      }
    },
    // 页面滚动到对应题目
    scrollToQuestion(questionId) {
      this.$nextTick(() => {
        this.currentSelectedQuestionId = questionId // 设置当前选中题目的ID
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
  margin-left: 0;
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

.question-preview.editing {
  background-color: #f0f0f0; /* 编辑状态的背景色 */
}

.question-preview.selected {
  border: 2px solid #409EFF; /* 设置一个显著的边框 */
  padding: calc(10px); /* 减去边框宽度保持原有的总大小 */
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

/* 编辑组件样式 */
.editing-container {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editing-container .el-form-item {
  margin-bottom: 20px; /* 增加表单项间距 */
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
