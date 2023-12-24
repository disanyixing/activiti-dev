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
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="上课时间" prop="time">
      <el-input v-model="formData.time" />
    </el-form-item>
    <el-form-item label="班级总人数" prop="student_num">
      {{ student_num || formData.student_num }}
    </el-form-item>

    <el-form-item v-if="operate != '详情'" align="right">
      <el-button type="primary" size="small" @click="submitForm('formData')">确定</el-button>
      <el-button size="small" @click="clickClose()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import api from '@/api/attend'

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
      student_num: '',
      loading: false,
      formData: {},
      rules: {
        name: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请输入上课时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    cont: {
      immediate: true, // 很重要！！！
      handler(content) {
        console.log(content)
        this.formData = content
      }
    }
  },
  created() {
    this.getCourse()
  },
  methods: {
    handleCourseChange() {
      this.getStudentNum(this.formData.name)
    },
    async getStudentNum(prop) {
      const { data } = await api.getStudentNum(prop)
      this.student_num = data.length
    },
    async getCourse() {
      const { data } = await api.getCourse()
      this.options = data
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
