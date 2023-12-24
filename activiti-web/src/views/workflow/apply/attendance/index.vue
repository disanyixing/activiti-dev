<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称">
        <el-input v-model.trim="query.course" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="query.createtime"
          type="date"
          placeholder="请选择开始时间"
          align="right"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="queryData"
        >查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 20px">
      <el-button
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="clickShowForm('新增')"
      >新建考勤</el-button>
    </el-row>
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="50" />
      <el-table-column
        align="center"
        prop="name"
        label="课程名称"
        min-width="90"
      />
      <el-table-column
        align="center"
        prop="teacher_name"
        label="任课老师"
        min-width="160"
      />
      <el-table-column
        align="center"
        prop="time"
        label="上课时间"
        min-width="90"
      />
      <el-table-column
        align="center"
        prop="student_num"
        label="班级总人数"
        width="160"
      />
      <el-table-column
        align="center"
        prop="statusStr"
        label="业务状态"
        width="90"
      >

        <template slot-scope="{ row }">
          <el-tag
            :type="
              row.status == 0
                ? 'warning'
                :
                  'success'

            "
          >{{ row.status==="0"?'未考勤':'已考勤' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createDateStr"
        label="创建时间"
        width="160"
      />
      <el-table-column
        align="center"
        prop="updateDateStr"
        label="修改时间"
        width="160"
      />
      <el-table-column align="center" label="操作" fixed="right" width="220">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status == 0 || row.status == 1"
            type="text"
            @click="clickShowForm('编辑', row)"
          >编辑</el-button>
          <el-button
            v-if="row.status == 0"
            type="text"
            @click="clickShowListForm('提交考勤', row)"
          >提交考勤</el-button>
          <el-button
            v-if="row.status == 1"
            type="text"
            @click="clickShowListForm('编辑考勤',row)"
          >编辑考勤</el-button>
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
    <!-- 考勤表单 -->
    <el-dialog
      :title="operate"
      :visible.sync="attendFormVisible"
      width="1000px"
      destroy-on-close
      @close="closeForm(false)"
    >
      <attendance-form
        :operate="operate"
        :cont="JSON.parse(JSON.stringify(row))"
        @close="closeForm"
      />
    </el-dialog>
    <!-- 考勤详情表单 -->
    <el-dialog
      :title="operate"
      :visible.sync="attendListFormVisible"
      width="1000px"
      destroy-on-close
      @close="closeForm(false)"
    >
      <attend-list-form
        :operate="operate"
        :cont="JSON.parse(JSON.stringify(row))"
        @close="closeForm"
      />
    </el-dialog>
  </div>
</template>
<script>
import AttendanceForm from '@/components/Process/Form/attendanceForm'
import AttendListForm from '@/components/Process/Form/attendListForm'

import api from '@/api/attend'
import { getall } from '@/api/getuser'
export default {
  name: 'Leave',
  components: { AttendanceForm, AttendListForm },
  data() {
    return {
      list: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {},
      operate: '新增',
      row: {},
      attendFormVisible: false,
      attendListFormVisible: false,
      selectdata: []
    }
  },
  created() {
    this.fetchData()
    this.getelect()
  },
  methods: {
    getelect() {
      getall().then((res) => {
        this.selectdata = res.data
      })
    },
    // 查询考勤列表
    async fetchData() {
      const { data } = await api.attendPage(
        this.query,
        this.page.current,
        this.page.size
      )
      this.list = data.records
      this.page.total = data.total
    },
    handleSizeChange(value) {
      this.page.size = value
      this.fetchData()
    },
    handleCurrentChange(value) {
      this.page.current = value
      this.fetchData()
    },
    queryData() {
      this.fetchData()
    },
    reload() {
      this.page.current = 1
      this.query = {}
      this.fetchData()
    },
    // 点击显示考勤表单
    clickShowForm(operate, row = {}) {
      this.operate = operate
      this.row = row
      this.attendFormVisible = true
    },
    // 点击显示考勤列表表单
    clickShowListForm(operate, row = {}) {
      this.operate = operate
      const data = { ...row }
      data.formList = []
      this.row = data
      this.attendListFormVisible = true
    },
    // 关闭表单
    closeForm(refresh) {
      // 清空点击数据
      this.row = {}
      // 隐藏
      this.attendFormVisible = false
      this.attendListFormVisible = false
      // 刷新列表
      if (refresh) {
        this.fetchData()
      }
    }
  }
}
</script>
