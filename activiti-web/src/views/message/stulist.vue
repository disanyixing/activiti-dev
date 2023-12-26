<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model="query.courseName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="班级：">
        <el-input v-model="query.className" placeholder="请输入班级" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchClassMessages">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 学生课程通知表格 -->
    <el-table :data="classMessages" border stripe style="width: 100%">
      <el-table-column type="index" align="center" label="序号" />
      <el-table-column align="center" prop="course_name" label="课程名称" />
      <el-table-column align="center" prop="teacher_nick_name" label="任课老师" />
      <el-table-column align="center" prop="class_name" label="班级" />
      <el-table-column align="center" prop="message" label="通知内容" />
      <el-table-column align="center" prop="createDateStr" label="创建时间" />
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
import cmapi from '@/api/message'

export default {
  data() {
    return {
      classMessages: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {
        courseName: '',
        className: ''
      }
    }
  },
  created() {
    this.fetchClassMessages()
  },
  methods: {
    async fetchClassMessages() {
      const response = await cmapi.classMessageList({
        course: this.query.courseName,
        classes: this.query.className,
        current: this.page.current,
        size: this.page.size
      })
      this.classMessages = response.data.records
      this.page.total = response.data.total
    },

    resetQuery() {
      this.query = {
        courseName: '',
        className: ''
      }
      this.fetchClassMessages()
    },

    handleSizeChange(value) {
      this.page.size = value
      this.fetchClassMessages()
    },

    handleCurrentChange(data) {
      this.page.current = data
      this.fetchClassMessages()
    }
  }
}
</script>
