<template>
  <el-form
    ref="formData"
    v-loading="loading"
    :model="formData"
    label-suffix=":"
    label-width="170px"
    size="small"
    align="left"
    style="max-width:900px"
  >
    <el-form-item v-for="(item,index) in list" :key="index">
      <span style="margin-right:10px">{{ item.student_id }}</span>
      <span style="margin-right:10px">{{ item.nick_name }}</span>
      <el-select v-model="formData.formList[index]" filterable>
        <el-option
          v-for="option in options"
          :key="option.id"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item align="right">
      <el-button type="primary" size="small" @click="submitForm('formData')">确定</el-button>
      <el-button size="small" @click="clickClose()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import api from '@/api/attend'

export default {
  props: {
    cont: {
      type: Object,
      default: null
    },
    operate: { // 操作标识：新增，编辑，详情
      type: String,
      default: '详情'
    }
  },
  data() {
    return {
      options: [{
        id: 0,
        label: '出勤',
        value: '0'
      },
      {
        id: 1,
        label: '事假',
        value: '1'
      }, {
        id: 2,
        label: '病假',
        value: '2'
      }, {
        id: 3,
        label: '迟到',
        value: '3'
      }, {
        id: 4,
        label: '早退',
        value: '4'
      }, {
        id: 5,
        label: '旷课',
        value: '5'
      }],
      loading: false,
      formData: {
        formList: []
      },
      list: [],
      formList: []
    }
  },
  watch: {
    cont: {
      immediate: true,
      async handler(newVal) {
        this.formData = newVal
        if (this.operate === '编辑考勤') {
          this.formData.id = newVal.id
          await this.getStudentNum(newVal.name)
          await this.getListDetail()
        } else {
          await this.getStudentNum(newVal.name)
        }
      }
    }
  },
  methods: {
    // 根据课程名获取学生列表
    async getStudentNum(prop) {
      this.courseName = prop
      const { data } = await api.getStudentList(prop)
      this.list = data
      this.formData.formList = this.list.map(() => '0') // 默认设置所有学生状态为出勤
      console.log(this.formList)
    },
    // 获取当前课程的考勤列表（编辑考勤）
    async getListDetail() {
      const { data } = await api.attendList(this.formData.id)
      this.list = data.map(record => ({
        student_id: record.student_id,
        nick_name: record.student_name, // 使用 record.student_name 更新 username
        attend_status: record.status, // 使用 record.status 更新 attend_status
        id: record.id
      }))
      this.formData.formList = this.list.map(item => item.attend_status)
    },
    // 提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          this.loading = true
          try {
            let response = {}
            const data = this.list.map((item, index) => {
              return {
                id: item.id, // 编辑时包含每个记录的 id
                attend_id: this.formData.id,
                status: this.formData.formList[index],
                student_id: item.student_id,
                student_name: item.nick_name
              }
            })
            if (this.operate === '提交考勤') {
              // 新建考勤，调用 addList 方法
              response = await api.addList(data, this.formData.id)
            } else if (this.operate === '编辑考勤') {
              // 编辑考勤，调用 updateAttendList 方法
              response = await api.updateAttendList(data)
            }
            if (response.code === 20000) {
              // 将表单清空
              this.$refs['formData'].resetFields()
              // 关闭窗口
              this.clickClose(true)
              this.$message.success('提交成功')
            }
            this.loading = false
          } catch (e) {
            this.loading = false
          }
        }
      })
    },
    clickClose(refresh = false) {
      // 将表单清空
      this.$refs['formData'].resetFields()
      this.$emit('close', refresh)
    }
  }
}
</script>

<style >

</style>
