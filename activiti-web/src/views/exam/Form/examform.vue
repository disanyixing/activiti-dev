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

    <el-form-item label="班级总人数" prop="size">
      <el-input v-model="paperForm.size" readonly />
    </el-form-item>

    <el-form-item label="开始时间" prop="startDate">
      <el-date-picker v-model="paperForm.startDate" type="datetime" placeholder="选择日期时间" />
    </el-form-item>

    <el-form-item label="结束时间" prop="endDate">
      <el-date-picker v-model="paperForm.endDate" type="datetime" placeholder="选择日期时间" />
    </el-form-item>

    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import api from '@/api/paper'
import course from '@/api/course'

export default {
  props: {
    type: {
      required: true
    },
    formType: {
      type: String,
      default: '添加',
      required: true
    },
    cont: {
      type: Object
    }
  },
  data() {
    return {
      courses: [],
      paperForm: {
        id: '',
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
        startDate: [
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' },
          { validator: this.validateEndDate, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'paperForm.courseId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.calculateClassSize(newVal)
      }
    },
    'paperForm.startDate'(newValue) {
      this.calculateExamDuration()
    },
    'paperForm.endDate'(newValue) {
      this.calculateExamDuration()
    },
    cont: {
      immediate: true,
      handler(newVal) {
        if (newVal === '添加') {
          this.resetForm()
        } else if (newVal === '修改' && this.cont) {
          this.initializeForm(this.cont)
        }
      }
    }
  },
  methods: {
    initializeForm(data) {
      // 使用对象展开运算符复制 cont 对象到 paperForm
      this.paperForm = { ...data }

      // 单独处理日期时间字段
      if (data.startDate) {
        this.paperForm.startDate = new Date(data.startDate)
      }
      if (data.endDate) {
        this.paperForm.endDate = new Date(data.endDate)
      }
      this.loadCourses()
    },
    async loadCourses() {
      const response = await course.getTeacherCourse()
      this.courses = response.data
    },
    async calculateClassSize(courseName) {
      const response = await course.getAllStudents(courseName)
      this.paperForm.size = response.data.length
    }, validateEndDate(rule, value, callback) {
      if (value && this.paperForm.startDate && value < this.paperForm.startDate) {
        callback(new Error('结束时间不得早于开始时间'))
      } else {
        callback()
      }
    },
    calculateExamDuration() {
      if (this.paperForm.startDate && this.paperForm.endDate) {
        const start = new Date(this.paperForm.startDate)
        const end = new Date(this.paperForm.endDate)
        const duration = end - start
        if (duration > 0) {
          const hours = Math.floor(duration / 3600000)
          const minutes = Math.floor((duration % 3600000) / 60000)
          this.examDuration = `${hours}小时${minutes}分钟`
        } else {
          this.examDuration = ''
        }
      }
    },
    submitForm() {
      this.$refs.paperForm.validate(async(valid) => {
        if (valid) {
          let response = {}
          if (this.formType === '添加') {
            response = await api.add(this.paperForm)
          } else {
            response = await api.update(this.paperForm)
          }
          if (response.code === 20000) {
            this.$emit('close')
          }
        }
      })
    },
    resetForm() {
      // 重置表单数据
      this.paperForm = {
        title: '',
        courseId: '',
        type: this.type,
        size: 0,
        startDate: null,
        endDate: null
      }

      // 清除表单校验结果
      this.$nextTick(() => {
        if (this.$refs.paperForm) {
          this.$refs.paperForm.clearValidate()
        }
      })
    }
  }
}
</script>

<style>
.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
}

.el-form {
  margin-right: 10px;
}
</style>
