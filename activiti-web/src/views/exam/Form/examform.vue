<template>
  <el-form ref="paperForm" :model="paperForm" :rules="rules" label-width="100px">
    <el-form-item label="测试名称" prop="title">
      <el-input v-model="paperForm.title" />
    </el-form-item>

    <el-form-item label="课程名称" prop="courseId">
      <el-select v-model="paperForm.courseId" placeholder="请选择课程">
        <el-option
          v-for="course in courses"
          :key="course.name"
          :label="course.name"
          :value="course.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="测试类型" prop="type">
      <el-radio-group v-model="paperForm.type">
        <el-radio :label="1">平时测试</el-radio>
        <el-radio :label="2">考试</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="班级总人数" prop="size">
      <el-input v-model="paperForm.size" readonly />
    </el-form-item>

    <el-form-item label="开始时间" prop="startDate">
      <el-date-picker v-model="paperForm.startDate" type="datetime" placeholder="选择日期时间" />
    </el-form-item>

    <el-form-item label="结束时间" prop="endDate">
      <el-date-picker v-model="paperForm.endDate" type="datetime" placeholder="选择日期时间" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import api from '@/api/paper'
import course from '@/api/course'

export default {
  props: {
    type: {
      default: 1
    },
    formType: {
      type: String,
      default: '添加'
    },
    cont: {
      type: Object
    }
  },
  data() {
    return {
      courses: [],
      paperForm: {
        title: '',
        courseId: '',
        type: this.type,
        size: 0,
        startDate: '',
        endDate: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入测试名称', trigger: 'blur' }
        ],
        courseId: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择测试类型', trigger: 'change' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'paperForm.courseId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.calculateClassSize(newVal)
      }
    }
  },
  created() {
    this.loadCourses()
    if (this.formType === '修改' && this.cont) {
      this.paperForm = { ...this.cont }
      this.calculateClassSize(this.paperForm.courseId)
    }
  },
  methods: {
    async loadCourses() {
      try {
        const response = await this.getTeacherCourse()
        this.courses = response.data
      } catch (error) {
        // 处理错误
        console.error(error)
      }
    },
    async calculateClassSize(courseName) {
      const response = await course.getAllStudents(courseName)
      this.paperForm.size = response.data.length
    }
  },
  submitForm() {
    this.$refs.paperForm.validate(async(valid) => {
      if (valid) {
        if (this.formType === '添加') {
          await api.add(this.paperForm)
        } else {
          await api.update(this.paperForm)
        }
      }
    })
  }
}
</script>
