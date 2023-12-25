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
        <el-button type="primary" @click="fetchMessages">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="openFormForAdd">新建课程通知</el-button>
    <!-- 课程通知表格 -->
    <el-table :data="messages" border stripe style="width: 100%">
      <el-table-column type="index" align="center" label="序号" />
      <el-table-column align="center" prop="course_name" label="课程名称" min-width="100" />
      <el-table-column align="center" prop="teacher_nick_name" label="任课老师" min-width="60" />
      <el-table-column align="center" prop="class_name" label="班级" min-width="100" />
      <el-table-column align="center" prop="message" label="通知内容" min-width="250" />
      <!--      <el-table-column align="center" prop="createDateStr" label="创建时间" min-width="150" />-->
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="openForm(row)">编辑</el-button>
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

    <!-- 课程通知表单弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="课程通知" width="30%">
      <course-message-form :form-type="formType" :cont="selectedMessage" @close="handleDialogClose" />
    </el-dialog>
  </div>
</template>

<script>
import CourseMessageForm from './Form/mform.vue'
import cmapi from '@/api/message'

export default {
  components: {
    CourseMessageForm
  },
  data() {
    return {
      messages: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      selectedMessage: {},
      formType: '',
      query: {
        courseName: '',
        className: ''
      }
    }
  },
  created() {
    this.fetchMessages()
  },
  methods: {
    async fetchMessages() {
      const response = await cmapi.listPage({
        course: this.query.courseName,
        classes: this.query.className,
        current: this.page.current,
        size: this.page.size
      })
      this.messages = response.data.records
      this.page.total = response.data.total
    },

    resetQuery() {
      this.query = {
        courseName: '',
        className: ''
      }
      this.fetchMessages()
    },

    openFormForAdd() {
      this.dialogVisible = true
      this.selectedMessage = {}
      this.formType = '新建'
    },
    handleSizeChange(value) {
      this.page.size = value
      this.fetchMessages()
    },
    handleCurrentChange(data) {
      this.page.current = data
      this.fetchMessages()
    },
    openForm(message) {
      this.dialogVisible = true
      this.selectedMessage = message
      this.formType = '编辑'
    },
    handleDialogClose() {
      this.dialogVisible = false
      this.fetchMessages()
    }
  }
}
</script>
