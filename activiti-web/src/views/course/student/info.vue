<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-select v-model="query.course" placeholder="请选择课程" @change="fetchAllCourses">
          <el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="任课老师：">
        <el-input v-model.trim="query.teacher" placeholder="请输入任课老师" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchAllCourses">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 课程讨论区表格 -->
    <el-table :data="courses" border stripe style="width: 100%">
      <el-table-column align="center" type="index" label="序号" min-width="80px" />
      <el-table-column align="center" prop="name" label="课程名称" min-width="100px" />
      <el-table-column align="center" prop="nick_name" label="任课老师" min-width="80px" />
      <el-table-column align="center" prop="time" label="上课时间" min-width="150px" />
      <el-table-column align="center" prop="room" label="上课地点" min-width="100px" />
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
        course: ''
      },
      teacherList: '',
      courseList: ''
    }
  },
  created() {
    this.fetchAllCourses()
  },
  methods: {
    async fetchAllCourses() {
      const response = await courseApi.stuClassInfoList(this.query, this.page.current, this.page.size)

      // 解析课程和老师的信息
      const teacherSet = new Set()
      const courseSet = new Set()
      for (const record of response.data.data.records) {
        if (record.nick_name) {
          teacherSet.add({ tchId: record.tchId, nick_name: record.nick_name })
        }
        if (record.name) {
          courseSet.add({ id: record.id, name: record.name })
        }
      }

      this.teacherList = Array.from(teacherSet)
      this.courseList = Array.from(courseSet)

      // 更新课程列表
      this.courses = response.data.data.records
      this.page.total = response.data.data.total
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
    }

  }
}
</script>
