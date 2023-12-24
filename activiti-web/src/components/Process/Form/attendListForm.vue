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
      <sapn style="margin-right:10px">{{ item.nick_name }}</sapn>
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
      formData: {},
      list: [],
      formList: []
    }
  },
  watch: {
    cont: {
      immediate: true, // 很重要！！！
      handler(content) {
        this.formData = content
      }
    }
  },
  created() {
    this.getStudentNum(this.formData.name)
    this.getListDetail()
  },
  methods: {
    // 获取当前课程的考勤列表(提交考勤)
    async getStudentNum(prop) {
      this.courseName = prop
      const { data } = await api.getStudentNum(prop)
      this.list = data
    },
    // 获取当前课程的考勤列表(编辑考勤)
    async getListDetail() {
      if (this.operate === '编辑考勤') {
        const params = this.formData.id
        const { data } = await api.getListDetail(params)
        console.log(data)
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
            if (this.operate === '提交考勤') {
              const data = this.list.map((item, index) => {
                return {
                  attend_id: this.formData.id,
                  status: this.formData.formList[index],
                  student_id: item.student_id,
                  student_name: item.nick_name
                }
              })
              const params = this.formData.id
              response = await api.addList(data, params)
            } else if (this.operate === '编辑考勤') {
              const params = this.formData.id
              response = await api.getListDetail({}, params)
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
