<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="标题">
        <el-input v-model.trim="query.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="query.status" clearable placeholder="请选择">
          <el-option v-for="item in processStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom:20px">
      <el-button icon="el-icon-plus" size="small" type="primary" @click="clickShowForm('新增')">新增申请</el-button>
    </el-row>
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="50" />
      <el-table-column align="center" prop="username" label="请假人" min-width="90" />
      <el-table-column align="center" prop="title" label="标题" min-width="160" />
      <el-table-column align="center" prop="leaveTypeStr" label="请假类型" min-width="90" />
      <el-table-column align="center" prop="startDateStr" label="请假开始时间" width="160" />
      <el-table-column align="center" prop="endDateStr" label="请假结束时间" width="160" />
      <el-table-column align="center" prop="statusStr" label="业务状态" width="90">
        <template slot-scope="{row}">
          <el-tag :type="row.status==0?'warning':row.status==3?'success':row.status==4?'danger':'info'">{{ row.statusStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createDateStr" label="创建日期" width="160" />
      <el-table-column align="center" label="操作" fixed="right" width="220">
        <template slot-scope="{row}">
          <!-- 0已撤回，1未提交，2处理中，3已完成 4已作废-->
          <el-button v-if="row.status == 0 || row.status == 1" type="text" @click="clickShowForm('编辑', row)">编辑</el-button>
          <el-button v-if="row.status == 2 || row.status == 3 || row.status == 5" type="text" @click="clickShowForm('详情', row)">详情</el-button>
          <el-button v-if="row.status == 2" type="text" @click="clickCancelProcess(row)">撤回</el-button>
          <el-button v-if="row.status == 0" type="text" @click="clickSubmitApply(row)">重新申请</el-button>
          <el-button v-if="row.status == 1" type="text" @click="clickSubmitApply(row)">提交申请</el-button>
          <el-button v-if="row.status == 2 || row.status == 3 || row.status == 4" type="text" @click="clickProcessHistory(row)">审批历史</el-button>
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
    <!-- 请假表单 -->
    <el-dialog :title="operate" :visible.sync="formVisible" width="1000px" destroy-on-close @close="closeForm(false)">
      <leave-form :operate="operate" :business-key="row.id" @close="closeForm" />
    </el-dialog>
    <!-- 提交申请 -->
    <submit-apply v-if="selectdata.length" ref="sumbitApplyRef" :selectdata="selectdata" :row="row" />
    <!-- 撤回申请 -->
    <cancel-apply ref="cancelRef" :business-key="row.id" :proc-inst-id="row.processInstanceId" />
    <!-- 审批历史 -->
    <history ref="historyRef" :business-key="row.id" :process-instance-id="row.processInstanceId" />
  </div>
</template>
<script>

import LeaveForm from '@/components/Process/Form/LeaveForm'
import SubmitApply from './components/SubmitApply'
import CancelApply from './components/CancelApply'
import History from '@/components/Process/History'
import api from '@/api/leave'
import { getall } from '@/api/getuser'

export default {
  name: 'Leave',
  components: { LeaveForm, SubmitApply, CancelApply, History },
  data() {
    return {
      list: [
        {
          'id': 'leave2:3:62509',
          'username': 'meng',
          'title': '怀孕了',
          'leaveTypeStr': '事假',
          'startDateStr': '2022-02-24 08:12:12',
          'endDateStr': '2023-04-15 15:37:36',
          'statusStr': '处理中',
          'status': 2,
          'createDateStr': '2022-01-24 17:07:16'
        },
        {
          'id': 'test:1:60011',
          'username': 'xue',
          'title': '调休22',
          'leaveTypeStr': '调休',
          'startDateStr': '2022-02-24 08:12:12',
          'endDateStr': '2023-04-15 15:37:36',
          'statusStr': '已撤回',
          'status': 0,
          'createDateStr': '2022-01-24 17:07:16'
        }
      ],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {},
      processStatus: [
        { value: 0, label: '已撤回' },
        { value: 1, label: '待提交' },
        { value: 2, label: '处理中' },
        { value: 3, label: '已完成' },
        { value: 4, label: '已作废' },
        { value: 5, label: '已删除' }
      ],
      operate: '新增',
      row: {},
      formVisible: false,
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
    // 分页条件查询文章列表
    async fetchData() {
      const { data } = await api.getList(this.query, this.page.current, this.page.size)
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
    // 点击显示表单
    clickShowForm(operate, row = {}) {
      this.operate = operate
      this.row = row
      this.formVisible = true
    },
    // 关闭表单
    closeForm(refresh) {
      // 清空点击数据
      this.row = {}
      // 隐藏
      this.formVisible = false
      // 刷新列表
      if (refresh) {
        this.fetchData()
      }
    },
    // 撤回
    clickCancelProcess(row) {
      this.row = row
      this.$refs.cancelRef.visible = true
    },
    // 提交申请
    clickSubmitApply(row) {
      this.row = row
      this.$refs.sumbitApplyRef.visible = true
    },
    // 审批历史
    clickProcessHistory(row) {
      this.row = row
      this.$refs.historyRef.visible = true
    }
  }
}
</script>
