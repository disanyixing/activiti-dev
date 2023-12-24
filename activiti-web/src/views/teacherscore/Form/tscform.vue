<template>
  <el-form ref="evalForm" :model="evalForm" :rules="rules" label-width="100px" :disabled="isFormDisabled">
    <el-form-item label="课程名称" prop="courseName">
      <el-select v-model="evalForm.courseName" placeholder="请选择课程" @change="fetchTeacherName">
        <el-option
          v-for="course in courses"
          :key="course.id"
          :value="course.name"
          :label="formatCourseLabel(course.name)"
          :disabled="disabledCourses.includes(course.name)"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="任课老师">
      <el-input v-model="evalForm.teacherName" readonly />
    </el-form-item>

    <el-form-item label="教学内容" prop="contentScore">
      <el-select v-model="evalForm.contentScore" placeholder="请选择评价">
        <el-option label="优秀" value="24" />
        <el-option label="良好" value="18" />
        <el-option label="及格" value="12" />
        <el-option label="糟糕" value="6" />
      </el-select>
    </el-form-item>

    <el-form-item label="教学方法" prop="methodScore">
      <el-select v-model="evalForm.methodScore" placeholder="请选择评价">
        <el-option label="优秀" value="24" />
        <el-option label="良好" value="18" />
        <el-option label="及格" value="12" />
        <el-option label="糟糕" value="6" />
      </el-select>
    </el-form-item>

    <el-form-item label="教学状态" prop="stateScore">
      <el-select v-model="evalForm.stateScore" placeholder="请选择评价">
        <el-option label="优秀" value="24" />
        <el-option label="良好" value="18" />
        <el-option label="及格" value="12" />
        <el-option label="糟糕" value="6" />
      </el-select>
    </el-form-item>

    <el-form-item label="教学效果" prop="effectScore">
      <el-select v-model="evalForm.effectScore" placeholder="请选择评价">
        <el-option label="优秀" value="24" />
        <el-option label="良好" value="18" />
        <el-option label="及格" value="12" />
        <el-option label="糟糕" value="6" />
      </el-select>
    </el-form-item>

    <el-row v-if="formType !== '查看'" type="flex" justify="center">
      <el-col :span="8">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import tsapi from '@/api/teacherscore'
import capi from '@/api/course'

export default {
  props: {
    formType: {
      type: String,
      default: '添加',
      required: true
    },
    cont: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      courses: [],
      disabledCourses: [],
      evalForm: {
        courseName: '',
        teacherName: '',
        contentScore: '',
        methodScore: '',
        stateScore: '',
        effectScore: ''
      },
      rules: {
        courseName: [{ required: true, message: '请选择课程名称', trigger: 'change' }],
        contentScore: [{ required: true, message: '请选择教学内容评价', trigger: 'change' }],
        methodScore: [{ required: true, message: '请选择教学方法评价', trigger: 'change' }],
        stateScore: [{ required: true, message: '请选择教学状态评价', trigger: 'change' }],
        effectScore: [{ required: true, message: '请选择教学效果评价', trigger: 'change' }]
      }
    }
  },
  computed: {
    isFormDisabled() {
      return this.formType === '查看'
    }
  },
  watch: {
    cont: {
      immediate: true,
      handler() {
        if (this.formType === '查看' && this.cont && this.cont.id) {
          this.fetchTeacherScoreById(this.cont.id)
        } else if (this.formType === '添加') {
          this.loadCourses()
          this.loadEvaluatedCourses()
          this.resetForm()
        }
      }
    }
  },
  methods: {
    async fetchTeacherScoreById(id) {
      const response = await tsapi.viewTeacherScoreById(id)
      this.initializeForm(response.data)
    },
    async loadCourses() {
      const response = await capi.classCourseNameAndTeacherAndClasslist({ current: 1, size: 10 })
      this.courses = response.data.records
    },
    async loadEvaluatedCourses() {
      const response = await tsapi.listStuTeacherScores({ current: 1, size: 10 })
      this.disabledCourses = response.data.data.records.map(record => record.name)
    },
    fetchTeacherName() {
      const selectedCourse = this.courses.find(course => course.name === this.evalForm.courseName)
      this.evalForm.teacherName = selectedCourse ? selectedCourse.nick_name : ''
    },
    initializeForm(data) {
      this.evalForm = {
        courseName: data.name,
        teacherName: this.cont.nick_name,
        contentScore: data.score1,
        methodScore: data.score2,
        stateScore: data.score3,
        effectScore: data.score4
      }
    },
    formatCourseLabel(courseName) {
      return this.disabledCourses.includes(courseName) ? `${courseName}（已完成）` : courseName
    },
    submitForm() {
      this.$refs.evalForm.validate(async(valid) => {
        if (valid) {
          const teacherScore = {
            name: this.evalForm.courseName,
            nick_name: this.evalForm.teacherName,
            score1: this.evalForm.contentScore,
            score2: this.evalForm.methodScore,
            score3: this.evalForm.stateScore,
            score4: this.evalForm.effectScore
          }
          const response = await tsapi.addTeacherScore(teacherScore)
          if (response.code === 20000) {
            this.$emit('formSubmitted')
          }
        }
      })
    },
    resetForm() {
      this.evalForm = {
        course: '',
        teacherName: '',
        contentScore: '',
        methodScore: '',
        stateScore: '',
        effectScore: ''
      }
      this.$nextTick(() => {
        this.$refs.evalForm.clearValidate()
      })
    }
  }
}
</script>
