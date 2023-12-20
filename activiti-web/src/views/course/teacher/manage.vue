<template>
  <div class="app-container">
    <!-- stripe 带斑马纹 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="课程名称:">
        <el-input v-model.trim="query.course" placeholder="请输入" />
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
      <el-table-column align="center" prop="id" label="序号" width="90" />
      <!--      <el-table-column align="center" prop="tchId" label="用户名" min-width="150" />-->
      <el-table-column align="center" prop="name" label="课程名称" min-width="150" />
      <!--      <el-table-column align="center" prop="nick_name" label="任课老师" min-width="90" />-->
      <el-table-column align="center" prop="room" label="上课地点" min-width="80" />
      <el-table-column align="center" prop="class_name" label="班级名称" min-width="90" />
      <el-table-column align="center" prop="createDateStr" label="建课日期" width="160" />
      <el-table-column align="center" prop="statusStr" label="课程状态" width="90">
        <template slot-scope="{row}">
          <el-tag :type="row.status==0?'warning':row.status==3?'success':row.status==4?'danger':''" effect="plain">
            {{ row.statusStr }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="220">
        <template slot-scope="{row}">
          <!-- 0已撤回，1未提交，2处理中，3已完成 4已作废-->
          <el-button v-if="row.status == 0 || row.status == 1" type="text" @click="clickShowForm('编辑', row)">编辑
          </el-button>
          <el-button
            v-if="row.status == 2 || row.status == 3 || row.status == 5"
            type="text"
            @click="clickShowForm('详情', row)"
          >详情
          </el-button>
          <el-button v-if="row.status == 2" type="text" @click="clickCancelProcess(row)">撤回</el-button>
          <el-button v-if="row.status == 0" type="text" @click="clickSubmitApply(row)">重新申请</el-button>
          <el-button v-if="row.status == 1" type="text" @click="clickSubmitApply(row)">提交申请</el-button>
          <el-button
            v-if="row.status == 2 || row.status == 3 || row.status == 4"
            type="text"
            @click="clickProcessHistory(row)"
          >审批历史
          </el-button>
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
    <!-- 表单 -->
    <el-dialog :title="operate" :visible.sync="formVisible" width="1000px" destroy-on-close @close="closeForm(false)">
      <loan-form :operate="operate" :business-key="row.id" :cont="JSON.parse(JSON.stringify(row))" @close="closeForm" />
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
import api from '@/api/course'
import SubmitApply from '../../workflow/apply/components/SubmitApply'
import CancelApply from '../../workflow/apply/components/CancelApply'
import History from '@/components/Process/History'
import LoanForm from '@/components/Process/Form/CourseForm.vue'
import { getall } from '@/api/getuser'

export default {
  name: 'CourseManager',
  components: { SubmitApply, CancelApply, History, LoanForm },
  data() {
    return {
      query: {},
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      list: [],
      selectdata: [],
      row: {},
      processStatus: [
        { value: 0, label: '已撤回' },
        { value: 1, label: '待提交' },
        { value: 2, label: '处理中' },
        { value: 3, label: '已完成' },
        { value: 4, label: '已作废' },
        { value: 5, label: '已删除' }
      ],
      formVisible: false,
      operate: '新增'

    }
  },
  created() {
    this.fetchData()
    this.getElect()
  },
  methods: {
    getElect() {
      getall().then((res) => {
        this.selectdata = res.data
      })
    },
    async fetchData() {
      const { data } = await api.listPage(this.query, this.page.current, this.page.size)
      this.list = data.records
      this.page.total = data.total
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
    // 新增、编辑、详情
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
    // 撤回申请
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
