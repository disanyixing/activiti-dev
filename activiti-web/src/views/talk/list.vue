<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model="query.name" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="班级名称：">
        <el-input v-model="query.class_name" placeholder="请输入班级名称" />
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
      <el-table-column align="center" prop="class_name" label="班级" min-width="150px" />
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
import { getInfo } from '@/api/user'

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
        class_name: ''
      },
      nick_name: '',
      username: ''
    }
  },
  created() {
    getInfo().then(res => {
      this.nick_name = res.data.nickName
      this.username = res.data.username
      this.fetchAllCourses()
    })
  },
  methods: {
    async fetchAllCourses() {
      const response = await courseApi.allCourseNameAndTeacherAndClasslist({
        course: this.query.name,
        class_name: this.query.class_name,
        teacher: this.nick_name,
        current: this.page.current,
        size: this.page.size
      })

      this.courses = response.data.records
      this.page.total = response.data.total
    },

    resetQuery() {
      this.query = {
        course: '',
        class_name: ''
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

    enterDiscussionBoard(row) {
      this.$router.push({
        path: '/talk/topic',
        query: {
          courseId: row.id,
          teacherUsername: this.username
        }
      })
    }
  }
}
</script>
