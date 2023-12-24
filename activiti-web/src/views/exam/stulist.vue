<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="试卷名称：">
        <el-input v-model.trim="query.title" placeholder="请输入试卷名称" />
      </el-form-item>
      <el-form-item label="课程名：">
        <el-input v-model.trim="query.courseId" placeholder="请输入课程ID" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 试卷列表表格 -->
    <el-table :data="papers" stripe border style="width: 100%">
      <el-table-column align="center" prop="title" label="考试名称" min-width="150" />
      <el-table-column align="center" prop="courseId" label="课程名" min-width="120" />
      <el-table-column align="center" prop="nick_name" label="老师" width="120" />
      <el-table-column align="center" label="考试时间" min-width="180">
        <template v-slot="{ row }">
          {{ formatStartEndDates(row.startDate, row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="150">
        <template v-slot="{ row }">
          <el-tag :type="getExamStatusAndTime(row.startDate, row.endDate).type">
            {{ getExamStatusAndTime(row.startDate, row.endDate).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template v-slot:default="{ row }">
          <el-button
            type="text"
            :disabled="!isDuringExam(row.startDate, row.endDate)"
            @click="enterExam(row)"
          >进入考试
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page.current"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="isDialogVisible" title="试卷信息" width="30%">
      <Examform :cont="currentPaper" :form-type="formType" :type="2" @close="closePaperDialog" />
    </el-dialog>
  </div>
</template>
<script>
import Examform from '@/views/exam/Form/examform.vue'
import { getInfo } from '@/api/user'
import api from '@/api/paper'

export default {
  name: 'TeacherPapers',
  components: { Examform },
  data() {
    return {
      query: {
        title: '',
        courseId: '',
        creator: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      papers: [],
      isDialogVisible: false,
      currentPaper: {},
      formType: {},
      username: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // 使用getStudentPaperList API获取数据
      const response = await api.getStudentPaperList({
        ...this.query,
        current: this.page.current,
        size: this.page.size,
        type: 2
      })
      this.papers = response.data.records
      this.page.total = response.data.total
      this.username = (await getInfo()).data.username
    },
    handleSizeChange(value) {
      this.page.size = value
      this.fetchData()
    },
    handleCurrentChange(data) {
      this.page.current = data
      this.fetchData()
    },
    resetQuery() {
      this.query = {
        title: '',
        courseId: '',
        creator: ''
      }
      this.fetchData()
    },
    // 判断当前时间是否在试卷进行中（开始时间和结束时间之间）
    isDuringExam(startDate, endDate) {
      const now = new Date()
      return new Date(startDate) <= now && now <= new Date(endDate)
    },
    // 打开新建/编辑试卷的弹窗
    openPaperDialog(paper = {}, formType = '添加') {
      this.currentPaper = paper
      this.formType = formType
      this.isDialogVisible = true
    },
    // 关闭弹窗
    closePaperDialog() {
      this.isDialogVisible = false
      this.currentPaper = {}
      this.fetchData() // 刷新数据
    },
    // 格式化开始和结束时间
    formatStartEndDates(startDate, endDate) {
      const start = new Date(startDate).toLocaleString('zh-CN', { hour12: false })
      const end = new Date(endDate).toLocaleString('zh-CN', { hour12: false })
      return `${start} - ${end}`
    },
    // 获取考试状态和距离开始/结束的时间
    getExamStatusAndTime(startDate, endDate) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)
      let label, type

      const formatTimeRemaining = (timeDiff) => {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60)
        if (hours > 0) {
          return `${hours}小时${minutes}分钟`
        }
        return `${minutes}分钟`
      }

      if (now < start) {
        // 如果考试未开始
        const diff = start - now
        label = diff < 24 * 60 * 60 * 1000 ? `开始还有 ${formatTimeRemaining(diff)}` : `开始还有 ${Math.floor(diff / (1000 * 60 * 60 * 24))}天${Math.floor((diff / (1000 * 60 * 60)) % 24)}小时`
        type = 'warning'
      } else if (now >= start && now <= end) {
        // 如果考试进行中
        const diff = end - now
        label = diff < 24 * 60 * 60 * 1000 ? `结束还有 ${formatTimeRemaining(diff)}` : `结束还有 ${Math.floor(diff / (1000 * 60 * 60 * 24))}天${Math.floor((diff / (1000 * 60 * 60)) % 24)}小时`
        type = 'success'
      } else {
        // 如果考试已结束
        label = '已结束'
        type = 'info'
      }

      return { label, type }
    },

    enterExam(row) {
      this.$router.push(
        {
          path: '/exam/paper/answer',
          query: {
            paperId: row.id,
            creator: this.username,
            endTime: row.endDate
          }
        })
    }
  }
}
</script>
