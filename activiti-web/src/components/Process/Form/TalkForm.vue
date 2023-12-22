<template>
  <el-form
    ref="formData"
    v-loading="loading"
    :rules="rules"
    :model="formData"
    label-suffix=":"
    label-width="100px"
    size="small"
    style="max-width:600px;"
  >
    <!-- 动态显示课程信息 -->
    <el-form-item label="主题名" prop="name">
      <el-input v-model="formData.name" placeholder="请输入课程名称" />
    </el-form-item>

    <el-form-item v-if="operate != '详情'" align="right">
      <el-button type="primary" size="small" @click="submitForm('formData')">确定</el-button>
      <el-button size="small" @click="clickClose()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import api from '@/api/course'

export default {
  props: {
    operate: { // 操作标识：新增，编辑，详情
      type: String,
      default: '详情'
    },
    businessKey: {
      type: String,
      default: null
    },
    cont: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      formData: {},
      classStudentCount: 0,
      rules: {
        name: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    cont: {
      immediate: true, // 很重要！！！
      handler(content) {
        this.cont = content
      }
    }
  },
  methods: {
    // 提交表单
    async submitForm(formName) {
      const { data: { name: tch_id, nickName: nick_name }} = await api.getCurrentTeacher()
      this.formData.tch_id = tch_id
      this.formData.nick_name = nick_name
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          this.loading = true
          try {
            let response = {}
            if (this.operate === '新增') {
              console.log(this.formData)
              response = await api.add(this.formData)
            } else if (this.operate === '编辑') {
              response = await api.update(this.formData)
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    clickClose(refresh = false) {
      // 将表单清空
      this.$refs['formData'].resetFields()
      this.$emit('close', refresh)
    }
  }
}
</script>
