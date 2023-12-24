<template>
  <div class="app-container">
    <div class="header-content">
      <el-page-header content="讨论区" @back="handleClose" />
      <br>
      <div class="toolbar">
        <el-button type="primary" size="small" class="add-topic" @click="clickShowForm('添加')">新建话题</el-button>
        <div class="search-bar">
          <el-input
            v-model="searchQueries.creator"
            placeholder="按用户搜索"
            style="width: 150px; margin-right: 5px;"
            size="small"
          />
          <el-input
            v-model="searchQueries.title"
            placeholder="按主题搜索"
            style="width: 150px; margin-right: 5px;"
            size="small"
          />
          <el-input
            v-model="searchQueries.text"
            placeholder="按内容搜索"
            style="width: 150px; margin-right: 10px;"
            size="small"
          />
          <el-button type="primary" size="small" @click="applySearch">搜索</el-button>
          <el-button size="small" @click="resetSearch">重置</el-button>
        </div>
      </div>
      <el-table
        :data="this.records"
        stripe
        border
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <!-- ID列 -->
        <el-table-column
          prop="id"
          label="ID"
          max-width="80"
          align="center"
        >
          <template v-slot="scope">
            <div class="text-ellipsis">{{ scope.row.id }}</div>
          </template>
        </el-table-column>

        <!-- 创建者列 -->
        <el-table-column
          prop="creator"
          label="创建者"
          min-width="90"
          align="center"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.creator === teacherUsername" type="success">任课老师</el-tag>
            {{ scope.row.creator }}
          </template>
        </el-table-column>

        <!-- 创建日期列 -->
        <el-table-column
          prop="createDate"
          label="创建日期"
          min-width="150"
          align="center"
        >
          <template v-slot="scope">
            {{ formatDate(scope.row.createDate) }}
          </template>
        </el-table-column>

        <!-- 主题列 -->
        <el-table-column
          prop="title"
          label="主题"
          min-width="120"
          align="center"
        />

        <!-- 内容列 -->
        <el-table-column
          prop="text"
          label="内容"
          min-width="180"
          align="center"
        />

        <!-- 回复总数列 -->
        <el-table-column
          label="回复总数"
          min-width="120"
          align="center"
        >
          <template v-slot="scope">
            <div class="content-cell">
              <div class="content-cell-footer">
                <el-button type="text" icon="el-icon-message" />
                <span>{{ scope.row.total || 0 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 最后回复时间列 -->
        <el-table-column
          prop="lastReplyDate"
          label="最后回复时间"
          min-width="150"
          align="center"
        >

          <template v-slot="scope">
            <span v-if="scope.row.lastReplyDate">{{ formatDate(scope.row.lastReplyDate) }}</span>
            <span v-else>暂无回复</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="120"
          align="center"
        >
          <template v-slot="scope">
            <div class="cell-actions">
              <el-button
                type="text"
                icon="el-icon-edit"
                :disabled="scope.row.creator !== username && scope.row.creator !== teacherUsername"
                @click="clickShowForm('编辑', scope.row)"
              />
              <span class="action-separator" />
              <el-popconfirm
                title="确定要删除这条记录吗？"
                placement="bottom"
                @confirm="confirmDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-delete"
                  :disabled="scope.row.creator !== username && scope.row.creator !== teacherUsername"
                />
              </el-popconfirm>
            </div>
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
      <el-dialog :visible.sync="formVisible" :title="operate" width="30%">
        <TalkForm :cont="selectedRow" :form-type="operate" @close="closeForm" />
      </el-dialog>
      <SpeakDialogComponent ref="speakDialog" />
    </div>
  </div>
</template>

<script>
import api from '@/api/talk'
import TalkForm from '@/views/talk/Form/talkform.vue'
import speakApi from '@/api/speak'
import { getInfo } from '@/api/user'
import SpeakDialogComponent from './speak.vue'

export default {
  name: 'DiscussionBoard',
  components: { SpeakDialogComponent, TalkForm },
  data() {
    return {
      courseId: '',
      teacherUsername: '',

      allRecords: [], // 存储所有记录
      records: [], // 存储过滤后的记录

      searchQueries: {
        creator: '',
        title: '',
        text: ''
      },

      page: {
        total: 0,
        size: 10,
        current: 1
      },

      formVisible: false,
      operate: '',
      username: '',
      selectedRow: {}
    }
  },
  created() {
    this.courseId = this.$route.query.courseId
    this.teacherUsername = this.$route.query.teacherUsername
    this.fetchData()
  },
  methods: {
    handleClose() {
      this.$router.go(-1)
    },
    handleSizeChange(newSize) {
      this.page.size = newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      this.page.current = newPage
      this.fetchData()
    },
    // 讨论区对话框
    handleRowClick(row, column, event) {
      if (column.property === '操作') return
      // 显示 speak 对话框
      this.$refs.speakDialog.openDialog({ talkId: row.id, teacherId: this.teacherUsername })
    },
    formatDate(isoString) {
      const date = new Date(isoString)
      return date.toLocaleString('zh-CN', { hour12: false })
    },
    async fetchData() {
      this.username = await getInfo()

      const response = await api.listPage(this.courseId, 1, -1) // 请求所有数据
      this.allRecords = response.data.records

      // 为每个话题获取最后回复时间和回复总数
      await Promise.all(this.allRecords.map(async(record) => {
        const speakResponse = await speakApi.listPage(record.id, 1, -1)
        this.$set(record, 'total', speakResponse.data.records.length)
        if (speakResponse.data.records.length > 0) {
          const lastReply = speakResponse.data.records[0]
          this.$set(record, 'lastReplyDate', lastReply.createDate)
        } else {
          this.$set(record, 'lastReplyDate', null) // 设置为 null 表示暂无回复
        }
      }))

      this.sortAndFilterData() // 对数据进行排序和过滤
    },
    sortAndFilterData() {
      // 先根据搜索条件过滤数据
      let filteredData = [...this.allRecords]
      if (this.searchQueries.creator) {
        filteredData = filteredData.filter(item =>
          item.creator.includes(this.searchQueries.creator)
        )
      }
      if (this.searchQueries.title) {
        filteredData = filteredData.filter(item =>
          item.title.includes(this.searchQueries.title)
        )
      }
      if (this.searchQueries.text) {
        filteredData = filteredData.filter(item =>
          item.text.includes(this.searchQueries.text)
        )
      }

      // 然后对过滤后的数据进行排序
      // 置顶老师的话题
      filteredData.sort((a, b) => {
        if (a.creator === this.teacherUsername) return -1
        if (b.creator === this.teacherUsername) return 1
        return 0
      })

      // 根据最后回复时间排序
      filteredData.sort((a, b) => {
        const dateA = a.lastReplyDate ? new Date(a.lastReplyDate) : new Date(0)
        const dateB = b.lastReplyDate ? new Date(b.lastReplyDate) : new Date(0)
        return dateB - dateA
      })

      // 更新表格数据
      this.records = filteredData
      this.page.total = filteredData.length // 更新总记录数
    },
    // 新增、编辑、详情
    clickShowForm(operate, row = {}) {
      this.operate = operate
      this.selectedRow = row
      if (operate === '添加') {
        row.courseId = this.courseId
      }
      this.formVisible = true
    },
    applySearch() {
      // 应用搜索查询
      this.fetchData()
    },

    resetSearch() {
      // 重置搜索查询
      this.searchQueries = {
        creator: '',
        title: '',
        text: ''
      }
      this.fetchData()
    },
    async confirmDelete(row) {
      const response = await api.delete(row.id)
      if (response.code === 20000) {
        this.$message.success('话题删除成功')
        await this.fetchData()
      } else {
        this.$message.error('删除失败')
      }
    },
    closeForm() {
      this.formVisible = false
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.add-topic {
  margin-right: 10px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}

</style>
