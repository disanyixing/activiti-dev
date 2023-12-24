<template>
  <div class="app-container">
    <!-- 查询组件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称：">
        <el-input v-model="query.courseName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="任课老师：">
        <el-input v-model="query.teacherName" placeholder="请输入任课老师名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchScores">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="openFormForAdd">添加评分</el-button>
    <el-table :data="scores" border stripe style="width: 100%">
      <el-table-column align="center" prop="name" label="课程名称" />
      <el-table-column align="center" prop="nick_name" label="任课老师" />
      <el-table-column align="center" prop="average_score" label="平均分数" />
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="openForm(row)">查看</el-button>
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

    <!-- 评分表单弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="教师评分" width="30%">
      <teacherscore-form :form-type="formType" :cont="selectedScore" @formSubmitted="fetchScores" />
    </el-dialog>
  </div>
</template>

<script>
import TeacherscoreForm from './Form/tscform.vue'
import tsapi from '@/api/teacherscore'

export default {
  components: {
    TeacherscoreForm
  },
  data() {
    return {
      scores: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      selectedScore: {},
      formType: '',
      query: {
        courseName: '',
        teacherName: ''
      }
    }
  },
  created() {
    this.fetchScores()
  },
  methods: {
    async fetchScores() {
      const response = await tsapi.listStuTeacherScores({
        course: this.query.courseName,
        teacher: this.query.teacherName,
        current: this.page.current,
        size: this.page.size
      })
      this.scores = response.data.data.records
      this.page.total = response.data.data.total
    },

    resetQuery() {
      this.query = {
        course: '',
        teacherName: ''
      }
      this.fetchScores()
    },

    openFormForAdd() {
      this.dialogVisible = true
      this.selectedScore = {}
      this.formType = '添加'
    },
    handleSizeChange(value) {
      this.page.size = value
      this.fetchScores()
    },
    handleCurrentChange(data) {
      this.page.current = data
      this.fetchScores()
    },
    openForm(score) {
      this.dialogVisible = true
      this.selectedScore = score
      this.formType = '查看'
    }
  }
}
</script>
