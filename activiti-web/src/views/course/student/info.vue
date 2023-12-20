<template>
  <div class="app-container">
    <!-- stripe 带斑马纹 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model.trim="query.course" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="任课老师：">
        <el-input v-model.trim="query.teacher" placeholder="请输入任课老师名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" prop="id" label="序号" width="90" />
      <el-table-column align="center" prop="name" label="课程名称" min-width="150" />
      <el-table-column align="center" prop="nick_name" label="任课老师" min-width="90" />
      <el-table-column align="center" prop="time" label="上课时间" min-width="200" />
      <el-table-column align="center" prop="room" label="上课地点" min-width="80" />
      <el-table-column align="center" label="选择状态" min-width="160">
        <template slot-scope="{row}">
          <el-tag
            :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'"
            effect="plain"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.status === 0" type="text" @click="confirmSelection(row.id, true)">选课</el-button>
          <el-button v-if="row.status === 1" type="text" @click="confirmSelection(row.id, false)">退选</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import api from '@/api/course'

export default {
  name: 'StudentEnroll',
  components: {},
  data() {
    return {
      query: {},
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      list: [],
      row: {},
      processStatus: [
        { value: 0, label: '未选' },
        { value: 1, label: '已选' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // eslint-disable-next-line no-unused-vars
      const { status, ...queryWithoutStatus } = this.query
      const {
        data: {
          data: {
            records: electiveCourses,
            total
          }
        }
      } = await api.viewElectiveCourse(queryWithoutStatus, this.page.current, this.page.size)
      const { data: { data: { records: classInfos }}} = await api.stuClassInfoList('', 1, -1)

      electiveCourses.forEach(course => {
        if (classInfos.some(classInfo => classInfo.id === course.id)) {
          course.status = 1
        } else {
          course.status = 0
        }
      })

      this.list = electiveCourses
      this.page.total = total
    },
    // 页数
    handleSizeChange(value) {
      this.page.size = value
      this.fetchData()
    },
    // 切换页码
    handleCurrentChange(data) {
      this.page.current = data
      this.fetchData()
    },
    // 查询
    queryData() {
      this.page.current = 1
      this.fetchData()
    },
    reload() {
      this.query = {}
      this.page.current = 1
      this.page.size = 10
      this.fetchData()
    },
    getStatusLabel(status) {
      const statusItem = this.processStatus.find(item => item.value === status)
      return statusItem ? statusItem.label : '出错'
    },
    async selectCourse(id) {
      try {
        await api.selectElectiveCourse(id)
        this.fetchData() // Reload data
      } catch (error) {
        // Handle error (e.g., display a notification)
      }
    },

    async deleteCourse(id) {
      try {
        await api.deleteElectiveCourse(id)
        this.fetchData() // Reload data
      } catch (error) {
        // Handle error
      }
    },
    confirmSelection(id, isSelect) {
      this.$confirm(`确定要${isSelect ? '选课' : '退选'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isSelect) {
          this.selectCourse(id)
        } else {
          this.deleteCourse(id)
        }
      }).catch(() => {
        // Handle cancel
      })
    }
  }
}
</script>
