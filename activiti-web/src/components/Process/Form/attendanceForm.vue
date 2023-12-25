<template>
  <el-form
    ref="formData"
    v-loading="loading"
    :rules="rules"
    :model="formData"
    label-suffix=":"
    label-width="170px"
    size="small"
    align="left"
    style="max-width:900px"
  >
    <el-form-item label="课程名称" prop="name">
      <el-select v-model="formData.name" filterable @change="handleCourseChange">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="上课时间" prop="time">
      <el-select v-model="formData.time" filterable @change="handleTimeChange">
        <el-option
          v-for="time in timeOptions"
          :key="time"
          :label="time"
          :value="time"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="班级名称">
      <span>{{ classNames.join(', ') }}</span>
    </el-form-item>
    <el-form-item label="班级总人数" prop="student_num">
      {{ student_num }}
    </el-form-item>

    <el-form-item v-if="operate != '详情'" align="right">
      <el-button type="primary" size="small" @click="submitForm('formData')">确定</el-button>
      <el-button size="small" @click="clickClose()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import api from '@/api/attend'
import capi from '@/api/course'

export default {

  props: {
    operate: { // 操作标识：新增，编辑，详情
      type: String,
      default: '详情'
    },
    cont: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      options: [],
      timeOptions: [],
      classNames: [],
      courseData: {},
      student_num: 0,
      loading: false,
      formData: {},
      rules: {
        name: [
          { required: true, message: '请选择课程名称', trigger: 'submit' }
        ],
        time: [
          { required: true, message: '请输入上课时间', trigger: 'submit' }
        ]
      }
    }
  },

  watch: {
    cont: {
      immediate: true,
      async handler(content) {
        if (this.operate !== '编辑') {
          // 如果不是编辑状态，则重置表单
          this.resetForm()
        } else if (content) {
          // 如果是编辑状态，根据cont内容设置表单
          this.formData = { ...content }
          await this.getCourse()
          if (this.formData.name) {
            await this.handleCourseChange()
            if (this.formData.time) {
              await this.handleTimeChange()
            }
          }
        }
      }
    }
  },
  created() {
    this.getCourse()
  },
  methods: {
    async getCourse() {
      const { data } = await capi.listPage({}, 1, -1)
      this.options = data.records.map(item => item.name).filter((value, index, self) => self.indexOf(value) === index)

      // 处理课程数据，将每个课程的不同时间和班级关联起来
      this.courseData = data.records.reduce((acc, record) => {
        if (!acc[record.name]) {
          acc[record.name] = []
        }
        acc[record.name].push({ time: record.time, class_name: record.class_name })
        return acc
      }, {})
    },

    handleCourseChange() {
      // 更新上课时间选项并确保时间去重
      const courseInfo = this.courseData[this.formData.name] || []
      const uniqueTimes = new Set(courseInfo.map(item => item.time))
      this.timeOptions = Array.from(uniqueTimes)
      this.formData.time = ''
      this.student_num = 0
      this.classNames = []
      // 判断是否需要从 cont 中恢复时间选项
      if (this.cont && this.cont.name === this.formData.name && this.cont.time) {
        this.formData.time = this.cont.time
      }
    },

    async handleTimeChange() {
      // 获取选择的时间对应的所有班级信息
      const selectedTimeClasses = this.courseData[this.formData.name].filter(item => item.time === this.formData.time)
      this.classNames = selectedTimeClasses.map(item => item.class_name)

      // 获取指定课程的所有学生并计算总数
      const response = await capi.getAllStudents(this.formData.name)
      if (response && response.data && response.data) {
        this.student_num = response.data.length
      } else {
        this.student_num = 0
      }
    },

    // 提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          this.loading = true
          try {
            let response = {}
            if (this.operate === '新增') {
              const data = { student_num: this.student_num, ...this.formData }
              response = await api.add(data)
            } else if (this.operate === '编辑') {
              const data = { student_num: this.student_num, ...this.formData }
              response = await api.update(data)
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
    resetForm() {
      this.formData = { name: '', time: '', student_num: 0 } // 重置为初始状态
      this.timeOptions = []
      this.classNames = []
      this.student_num = 0
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
