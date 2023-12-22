<template>
  <div class="discussion-container">
    <el-dialog
      :visible.sync="isFullScreen"
      :before-close="handleClose"
      fullscreen
    >
      <el-container>
        <el-header>
          <div class="header-content">
            <el-page-header
              content="讨论区"
              @back="handleClose"
            />
            <el-button type="primary" @click="clickShowForm('新建话题')">新建话题</el-button>
          </div>
        </el-header>

        <el-main>
          <el-table :data="this.records" stripe border style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              width="80"
            >
              <template slot-scope="scope">
                <div class="text-ellipsis">{{ scope.row.id }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"
              width="180"
            />
            <el-table-column
              prop="createDate"
              label="创建日期"
              width="180"
            />
            <el-table-column
              prop="title"
              label="主题"
              align="center"
            />
            <el-table-column
              label="回复总数"
              align="center"
            >
              <template slot-scope="scope">
                <div class="content-cell">
                  <div class="content-cell-footer">
                    <el-button type="text" icon="el-icon-message" />
                    <span>{{ scope.row.total || 0 }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <div class="cell-actions">
                  <!-- 删除按钮 -->
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    :disabled="scope.row.speaker !== username"
                    @click="confirmDelete(scope.row)"
                  />
                </div>
              </template>
            </el-table-column>

            <el-pagination
              :total="page.total"
              :page-size="page.size"
              :page-sizes="[10, 20, 30, 50]"
              :current-page="page.current"
              layout="total, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
            <el-dialog
              :title="operate"
              :visible.sync="formVisible"
              width="1000px"
              destroy-on-close
              @close="closeForm(false)"
            >
              <talk-form
                :operate="operate"
                :cont="this.$props"
                @close="closeForm"
              />
            </el-dialog>
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/talk'
import LoanForm from '@/components/Process/Form/CourseForm.vue'
import TalkForm from '@/components/Process/Form/TalkForm.vue'
import speakApi from '@/api/speak'
import { getInfo } from '@/api/user'

export default {
  name: 'DiscussionBoard',
  components: { TalkForm, LoanForm },
  props: {
    courseId: {
      type: String,
      default: '1'
    },
    className: String,
    teacherUsername: String
  },
  data() {
    return {
      isFullScreen: true,
      page: {
        total: 0,
        size: 10,
        current: 1
      },
      records: [],
      formVisible: false,
      operate: '详情',
      username: ''
    }
  },
  created() {
    // this.discussions.records = this.getMockData()
    this.fetchData()
  },
  methods: {
    handleClose(done) {
      this.$emit('on-close')
      done()
    },
    handleSizeChange(newSize) {
      this.page.size = newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      this.page.current = newPage
      this.fetchData()
    },
    async fetchData() {
      const { data: { records, total }} = await api.listPage(this.courseId, this.page.current, this.page.size)
      const { data: { username }} = await getInfo()
      this.username = username
      this.records = records
      this.page.total = total
      await Promise.all(this.records.map(record => this.fetchSpeakData(record)))
    },
    async fetchSpeakData(record) {
      const { data } = await speakApi.listPage(record.id, 1, 0)
      this.$set(record, 'total', data.total)
    },
    // 新增、编辑、详情
    clickShowForm(operate) {
      this.operate = operate
      this.formVisible = true
    },
    closeForm(refresh) {
      // 清空点击数据
      this.row = {}
      // 隐藏
      this.formVisible = false
      // 刷新列表
      if (refresh) {
        this.fetchData()
      }
    }
  }
}
</script>

<style scoped>
.discussion-container {
  margin: 0;
}

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
