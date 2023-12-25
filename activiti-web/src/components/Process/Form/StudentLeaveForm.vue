<template>
  <el-form
    ref="formData"
    v-loading="loading"
    :rules="rules"
    :model="formData"
    label-width="100px"
    size="small"
    style="max-width:600px;"
  >
    <!-- 选择课程名称 -->
    <el-form-item label="课程名称" prop="course_name">
      <el-select v-model="formData.course_name" placeholder="请选择课程名称" @change="onCourseChange">
        <el-option
          v-for="course in coursesList"
          :key="course.id"
          :label="course.name"
          :value="course.name"
        />
      </el-select>
    </el-form-item>

    <!-- 选择任课老师 -->
    <el-form-item label="任课老师" prop="teacher_nick_name">
      <el-select v-model="formData.teacher_nick_name" placeholder="请选择任课老师" @change="onTeacherChange">
        <el-option
          v-for="teacher in teachersList"
          :key="teacher.id"
          :label="teacher.nick_name"
          :value="teacher.nick_name"
        />
      </el-select>
    </el-form-item>

    <!-- 选择上课时间 -->
    <el-form-item label="上课时间" prop="time">
      <el-select v-model="formData.time" placeholder="请选择上课时间">
        <el-option
          v-for="time in timeList"
          :key="time.id"
          :label="time.time"
          :value="time.time"
        />
      </el-select>
    </el-form-item>

    <!-- 填写请假理由 -->
    <el-form-item label="请假理由" prop="reason">
      <el-input v-model="formData.reason" type="textarea" placeholder="请输入请假理由" />
    </el-form-item>

    <el-form-item align="center">
      <el-button type="primary" size="small" @click="submitForm('formData')">提交</el-button>
      <el-button size="small" @click="clickClose()">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import api from '@/api/studentleave'
import capi from '@/api/course'

export default {
  props: {
    operate: { type: String, default: '详情' },
    businessKey: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      formData: {
        course_name: '',
        teacher_nick_name: '',
        time: '',
        reason: ''
      },
      coursesList: [],
      teachersList: [],
      timeList: [],
      rules: {
        course_name: [{ required: true, message: '请选择课程名称', trigger: 'change' }],
        teacher_nick_name: [{ required: true, message: '请选择任课老师', trigger: 'change' }],
        time: [{ required: true, message: '请选择上课时间', trigger: 'change' }],
        reason: [{ required: true, message: '请输入请假理由', trigger: 'blur' }]
      }
    }
  },
  watch: {
    businessKey: {
      immediate: true,
      async handler(newVal) {
        if (newVal && this.operate !== '新增') {
          await this.initStates()
          await this.getById(newVal)
        } else {
          await this.initStates()
        }
      }
    }
  },
  methods: {
    async initStates() {
      const response = await capi.stuClassInfoList({}, 1, -1)
      this.uniqueCourses = {}
      this.teacherTimeMap = {}

      response.data.data.records.forEach(course => {
        if (!this.uniqueCourses[course.name]) {
          this.uniqueCourses[course.name] = new Set()
        }
        this.uniqueCourses[course.name].add(course.nick_name)

        if (!this.teacherTimeMap[course.nick_name]) {
          this.teacherTimeMap[course.nick_name] = new Set()
        }
        this.teacherTimeMap[course.nick_name].add(course.time)
      })

      this.coursesList = Object.keys(this.uniqueCourses).map(courseName => ({
        name: courseName
      }))
    },

    onCourseChange(courseName) {
      const teachers = this.uniqueCourses[courseName] || new Set()
      this.teachersList = Array.from(teachers).map(nick_name => ({
        nick_name
      }))

      this.formData.teacher_nick_name = ''
      this.formData.time = ''
    },

    onTeacherChange(teacherName) {
      const times = this.teacherTimeMap[teacherName] || new Set()
      this.timeList = Array.from(times).map(time => ({
        time
      }))

      this.formData.time = ''
    },

    async getById(id) {
      const response = await api.viewStudentLeave(id)
      this.formData = response.data.data[0]
      // this.onCourseChange(this.formData.course_name)
      // this.onTeacherChange(this.formData.teacher_nick_name)
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          let response
          if (this.operate === '新增') {
            response = await api.addStudentLeave(this.formData)
          } else if (this.operate === '编辑') {
            response = await api.updateStudentLeave(this.formData)
          }
          if (response.code === 20000) {
            this.loading = false
            this.$message.success('操作成功')
            this.$emit('close')
          } else {
            this.$message.error('操作失败')
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    clickClose() {
      // 重置表单数据
      this.formData = {
        course_name: '',
        teacher_nick_name: '',
        time: '',
        reason: ''
      }
      this.teachersList = []
      this.timeList = []

      // 关闭表单
      this.$emit('close')
    }
  }
}
</script>
