<template>
  <el-form ref="courseMessageForm" :model="courseMessageForm" :rules="rules" label-width="100px">
    <el-form-item label="课程名称" prop="courseName">
      <el-select v-model="courseMessageForm.courseName" placeholder="请选择课程" @change="onCourseChange">
        <el-option
          v-for="course in uniqueCourses"
          :key="course.id"
          :label="course.name"
          :value="course.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="班级名称" prop="classId">
      <el-select v-model="courseMessageForm.classId" placeholder="请选择班级">
        <el-option
          v-for="classInfo in classes"
          :key="classInfo.classId"
          :label="classInfo.class_name"
          :value="classInfo.classId"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="通知内容" prop="message">
      <el-input v-model="courseMessageForm.message" type="textarea" />
    </el-form-item>

    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ formType }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import capi from '@/api/course'
import mapi from '@/api/message'

export default {
  props: {
    formType: {
      type: String,
      default: '新建'
    },
    cont: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      courses: [],
      uniqueCourses: [],
      classes: [],
      courseMessageForm: {
        courseName: '',
        classId: '',
        message: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择班级名称', trigger: 'change' }
        ],
        message: [
          { required: true, message: '请填写通知内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    cont: {
      immediate: true,
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.courseMessageForm = { ...newVal }
          if (newVal.courseName) {
            this.onCourseChange(newVal.courseName)
          }
        }
      }
    },
    'courseMessageForm.courseName'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.onCourseChange(newVal)
      }
    }
  },
  created() {
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      const response = await capi.listPage({}, 1, -1)
      this.courses = response.data.records
      this.uniqueCourses = [...new Map(this.courses.map(course => [course['name'], course])).values()]
    },
    onCourseChange(courseName) {
      const sortedClasses = this.courses
        .filter(course => course.name === courseName)
        .sort((a, b) => a.classId - b.classId)

      this.classes = [...new Map(sortedClasses.map(cls => [cls.class_name, cls])).values()]
        .map(course => ({ classId: course.classId, class_name: course.class_name }))
    },
    submitForm() {
      this.$refs.courseMessageForm.validate(async(valid) => {
        if (valid) {
          const apiFunc = this.formType === '新建' ? mapi.add : mapi.update
          const response = await apiFunc(this.courseMessageForm)
          if (response.code === 20000) {
            this.$message.success('新建通知成功')
            this.$emit('close')
          }
        }
      })
    }
  }
}
</script>

<style>
/* 样式内容 */
</style>
