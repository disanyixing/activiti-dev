<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model="query.course" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="教师名称：">
        <el-input v-model="query.teacher" placeholder="请输入教师名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchAllCourses">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 课程讨论区表格 -->
    <el-table :data="courses" border stripe style="width: 100%">
      <el-table-column align="center" type="index" label="序号" min-width="80px" />
      <el-table-column align="center" prop="name" label="课程名称" min-width="150px" />
      <el-table-column align="center" prop="nick_name" label="任课老师" min-width="150px" />
      <el-table-column align="center" label="操作" min-width="100px">
        <template v-slot="{row}">
          <el-button type="text" @click="enterDiscussionBoard(row)">进入课程讨论区</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      :current-page="page.current"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import courseApi from '@/api/course'

export default {
  data() {
    return {
      courses: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {
        course: '',
        teacher: ''
      }
    }
  },
  created() {
    this.fetchAllCourses()
  },
  methods: {
    async fetchAllCourses() {
      const response = await courseApi.classCourseNameAndTeacherAndClasslist({
        current: this.page.current,
        size: this.page.size
      })
      this.courses = response.data.records
      this.page.total = response.data.total
    },

    resetQuery() {
      this.query = {
        course: ''
      }
      this.fetchAllCourses()
    },

    handleSizeChange(value) {
      this.page.size = value
      this.fetchAllCourses()
    },

    handleCurrentChange(data) {
      this.page.current = data
      this.fetchAllCourses()
    },

    async enterDiscussionBoard(row) {
      const res = await courseApi.viewById(row.id)
      this.$router.push({
        path: '/talk/topic',
        query: {
          courseId: row.id,
          teacherUsername: res.data.data[0].tchId
        }
      })
    }
  }
}
</script>
