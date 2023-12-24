<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model="query.course" placeholder="请输入课程名称" />
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
        course: ''
      }
    }
  },
  created() {
    this.fetchAllCourses()
  },
  methods: {
    async fetchAllCourses() {
      const response = await courseApi.stuClassInfoList({}, this.page.current, this.page.size)

      // 选择id最小的记录去重显示
      const coursesMap = new Map()
      for (const record of response.data.data.records) {
        if (!coursesMap.has(record.name) || coursesMap.get(record.name).id > record.id) {
          coursesMap.set(record.name, record)
        }
      }

      this.courses = Array.from(coursesMap.values())
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
    },

    enterDiscussionBoard(row) {
      this.$router.push({
        path: '/talk/topic',
        query: {
          courseId: row.id,
          teacherUsername: row.tchId
        }
      })
    }
  }
}
</script>
