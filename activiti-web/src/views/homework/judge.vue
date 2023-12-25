<template>
  <el-container>
    <el-aside width="10%">
      <!-- 信息区 -->
      <div class="info-section">
        <div class="back-section">
          <el-button type="text" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <div class="total-score">
          <h3>作业批改</h3>
        </div>
        <div class="score-details">
          <p>作业批改情况：{{ completedCount }}/{{ students.length }}</p>
          <p>作业名称：{{ title }}</p>
          <p>课程名：{{ courseName }}</p>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="table-section">
        <!-- 筛选区域 -->
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-select v-model="filterStatus" placeholder="批改情况">
              <el-option label="未完成" value="uncompleted" />
              <el-option label="已完成" value="completed" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filterClass" placeholder="班级">
              <el-option v-for="classId in classes" :key="classId" :label="classId" :value="classId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="filterStudents">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 学生表格 -->
        <el-table :data="filteredStudents" stripe border style="width: 100%">
          <el-table-column prop="classId" label="班级" width="180" />
          <el-table-column prop="nick_name" label="姓名" width="180" />
          <el-table-column label="批改情况">
            <template v-slot="{ row }">
              <el-tag :type="row.gradedAnswers === row.totalQuestions ? 'success' : 'warning'">
                {{ row.gradedAnswers }}/{{ row.totalQuestions }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="text" @click="judgePaper(row)">批改作业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { checkStudentsPaper } from '@/utils/exam'
import capi from '@/api/course'

export default {
  data() {
    return {
      title: '',
      courseName: '',
      endDate: new Date(),
      paperId: '',

      remainingTime: '',
      classes: [],
      students: [],
      filteredStudents: [],
      filterStatus: '',
      filterClass: '',
      totalQuestions: 0,
      completedCount: 0
    }
  },
  created() {
    if (this.$route.query.id) {
      this.paperId = this.$route.query.id
      this.title = this.$route.query.title
      this.courseName = this.$route.query.courseId
      this.endDate = new Date(this.$route.query.endDate)
    } else {
      this.$router.push('/exam/teacher/list')
    }
    this.fetchStudents()
    this.refresh = setInterval(() => {
      this.fetchStudents()
    }, 1000 * 5)
  },
  beforeDestroy() {
    clearTimeout(this.refresh)
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async fetchStudents() {
      const response = await capi.getAllStudents(this.courseName)
      this.students = response.data.map(student => ({
        ...student,
        gradedAnswers: 0, // 初始化已批改的答案数量
        totalQuestions: 0 // 初始化总题数
      }))
      this.classes = [...new Set(response.data.map(student => student.classId))]
      await this.checkIfStudentsCompletedPaper()
    },
    async checkIfStudentsCompletedPaper() {
      const studentNames = this.students.map(s => s.student_name)
      const results = await checkStudentsPaper(this.paperId, studentNames)
      this.students.forEach(student => {
        const result = results.studentResults[student.student_name]
        student.gradedAnswers = result.gradedAnswers // 更新已批改的答案数量
        student.totalQuestions = results.totalQuestions // 更新总题数
      })
      this.filteredStudents = this.students
      this.completedCount = this.students.filter(s => s.gradedAnswers === s.totalQuestions).length
    },
    async filterStudents() {
      await this.fetchStudents()
      this.filteredStudents = this.students.filter(student => {
        return (!this.filterStatus || (this.filterStatus === 'completed' && student.completed) || (this.filterStatus === 'uncompleted' && !student.completed)) &&
          (!this.filterClass || student.classId.includes(this.filterClass))
      })
    },
    resetFilter() {
      this.filterStatus = ''
      this.filterClass = ''
      this.filteredStudents = this.students
    },
    judgePaper(row) {
      console.log(row)
      this.$router.push({
        path: '/exam/paper/score',
        query: {
          id: this.paperId,
          creator: row.student_name
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

.table-section {
  text-align: center;
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
