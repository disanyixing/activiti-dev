<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchQuery" size="small">
      <el-form-item label="课程名：">
        <el-select v-model="searchQuery.courseId" placeholder="请选择课程">
          <el-option
            v-for="item in courses"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任课老师：">
        <el-input v-model="searchQuery.teacherName" placeholder="请输入任课老师名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchGrades">查询成绩</el-button>
        <el-button @click="resetSearch">重置搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 成绩列表表格 -->
    <el-table :data="grades" stripe border style="width: 100%">
      <el-table-column align="center" prop="courseName" label="课程名称" min-width="180" />
      <el-table-column align="center" prop="teacherName" label="任课老师" min-width="180" />
      <el-table-column align="center" prop="usualGrade" label="平时成绩" min-width="120" />
      <el-table-column align="center" prop="examGrade" label="考试成绩" min-width="120" />
      <el-table-column align="center" prop="finalGrade" label="最终成绩" min-width="120" />
    </el-table>
  </div>
</template>

<script>
import capi from '@/api/course'
import papi from '@/api/paper'
import { checkStudentsPaper } from '@/utils/exam'
import { getInfo } from '@/api/user'

export default {
  data() {
    return {
      username: '', // 存储用户名
      courses: [],
      grades: [],
      searchQuery: {
        courseId: '', // 用于搜索的课程ID
        teacherName: '' // 用于搜索的任课老师
      }
    }
  },
  async created() {
    await this.fetchUserInfo()
    await this.fetchCourses()
    await this.fetchGrades()
  },
  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      const userInfo = await getInfo()
      this.username = userInfo.data.username
    },
    // 获取课程列表
    async fetchCourses() {
      const response = await capi.classCourseNameAndTeacherlist({ current: 1, size: -1 })
      this.courses = response.data.records
    },
    // 根据搜索条件获取成绩
    async fetchGrades() {
      this.grades = []
      for (const course of this.courses) {
        if ((this.searchQuery.courseId && course.name !== this.searchQuery.courseId) ||
          (this.searchQuery.teacherName && course.nick_name !== this.searchQuery.teacherName)) {
          continue
        }
        await this.fetchGradesForCourse(course.name, course)
      }
    },
    // 获取特定课程的成绩
    async fetchGradesForCourse(courseId, course) {
      const gradeResponse = await papi.getGrade({ current: 1, size: -1, courseId, creator: this.username })
      const gradesData = gradeResponse.data

      // 查询试卷
      const paperResponse = await papi.getStudentPaperList({ current: 1, size: -1, courseId })
      const papers = paperResponse.data.records

      let usualGrade = gradesData[0]
      let examGrade = gradesData[1]
      let finalGrade = gradesData[2]

      for (const paper of papers) {
        const checkResponse = await checkStudentsPaper(paper.id, [this.username])
        if (checkResponse.totalQuestions !== checkResponse.studentResults[this.username].gradedAnswers) {
          usualGrade = '暂无成绩'
          examGrade = '暂无成绩'
          finalGrade = '暂无成绩'
          break
        }
      }

      this.grades.push({
        courseName: courseId,
        teacherName: course.nick_name,
        usualGrade,
        examGrade,
        finalGrade
      })
    },
    // 重置搜索条件
    resetSearch() {
      this.searchQuery.courseId = ''
      this.searchQuery.teacherName = ''
      this.fetchGrades()
    }
  }
}
</script>
