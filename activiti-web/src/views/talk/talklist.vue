<template>
  <div class="discussion-container">
    <el-dialog
      :visible.sync="isFullScreen"
      :before-close="handleClose"
      fullscreen
    >
      <el-container>
        <el-header>
          <el-page-header
            content="讨论区"
            @back="handleClose"
          />
        </el-header>

        <el-main>
          <el-table
            :data="discussions.records"
            style="width: 100%"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="80"
            />
            <el-table-column
              prop="title"
              label="标题"
              width="180"
            />
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
              prop="text"
              label="内容"
            />
          </el-table>

          <el-pagination
            :total="discussions.total"
            :page-size="discussions.size"
            :current-page="discussions.current"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DiscussionBoard',
  props: {
    className: String,
    courseId: String,
    teacherUsername: String
  },
  data() {
    return {
      isFullScreen: true,
      discussions: {
        records: [],
        total: 6,
        size: 10,
        current: 1
      }
    }
  },
  created() {
    this.discussions.records = this.getMockData()
    // this.fetchData(); // 实际使用时，您将调用这个函数而不是使用mock数据
  },
  methods: {
    handleClose(done) {
      this.$emit('on-close')
      done()
    },
    handleSizeChange(newSize) {
      // 在这里实现更改分页大小的逻辑
      this.discussions.size = newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      // 在这里实现更改当前页面的逻辑
      this.discussions.current = newPage
      this.fetchData()
    },
    fetchData() {
      // 在这里实现API请求的逻辑，现在使用mock数据
      // 实际使用时，您需要替换这部分逻辑以与您的后端API通信
      console.log(`Fetching data for course ID: ${this.courseId}, Page: ${this.discussions.current}, Size: ${this.discussions.size}`)
    },
    getMockData() {
      // 实际使用时，您将从后端API获取数据
      return [
        // 您提供的数据结构
        {
          id: '0',
          courseId: '1',
          title: 'title0',
          text: 'text0',
          creator: 'admin',
          createDate: '2023-12-06T16:00:00.000+00:00'
        },
        {
          id: '4123',
          courseId: '1',
          title: 'title666',
          text: 'text666',
          creator: 'admin',
          createDate: '2023-12-06T16:00:00.000+00:00'
        },
        {
          id: '1732049547533283329',
          courseId: '1',
          title: 'title2',
          text: 'text2',
          creator: 'admin',
          createDate: '2023-12-04T16:00:00.000+00:00'
        }
        // ...其余数据
      ]
    }
  }
}
</script>

<style scoped>
.discussion-container {
  margin: 0;
}
</style>
