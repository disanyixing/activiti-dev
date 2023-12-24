<template>
  <el-form ref="courseMessageForm" :model="courseMessageForm" :rules="rules" label-width="100px">
    <el-form-item label="课程名称" prop="course_name">
      <el-select v-model="courseMessageForm.course_name" placeholder="请选择课程" @change="onCourseChange">
        <el-option
          v-for="course in uniqueCourses"
          :key="course.id"
          :label="course.name"
          :value="course.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="班级名称" prop="class_id">
      <el-select v-model="courseMessageForm.class_id" placeholder="请选择班级">
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
        course_name: '',
        class_id: '',
        message: '',
        teacher_nick_name: ''
      },
      rules: {
        course_name: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        class_id: [
          { required: true, message: '请选择班级名称', trigger: 'change' }
        ],
        message: [
          { required: true, message: '请填写通知内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    formType(newType) {
      if (newType === '新建') {
        this.resetForm()
      }
    },
    cont: {
      immediate: true,
      handler(newVal) {
        if (this.formType === '编辑') {
          this.courseMessageForm = {
            id: newVal.id,
            course_name: newVal.course_name,
            class_id: newVal.class_id,
            message: newVal.message
          }
          if (newVal.course_name) {
            this.onCourseChange(newVal.course_name)
          }
        }
      }
    },
    'courseMessageForm.course_name'(newVal, oldVal) {
      if (this.formType === '编辑' && newVal !== oldVal) {
        this.onCourseChange(newVal)
      }
    }
  },
  created() {
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      this.courseMessageForm.teacher_nick_name = (await capi.getCurrentTeacher()).data.nickName
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

      // 如果是编辑模式且当前选中的班级ID已存在，确保班级下拉列表正确显示
      if (this.formType === '编辑' && this.courseMessageForm.class_id) {
        const selectedClass = this.classes.find(c => c.classId === this.courseMessageForm.class_id)
        if (selectedClass) {
          this.courseMessageForm.class_id = selectedClass.classId
        }
      }
    },
    submitForm() {
      this.$refs.courseMessageForm.validate(async(valid) => {
        if (valid) {
          const apiFunc = this.formType === '新建' ? mapi.add : mapi.update
          const response = await apiFunc(this.courseMessageForm)
          if (response.code === 20000) {
            const successMessage = this.formType === '新建' ? '新建通知成功' : '编辑通知成功'
            this.$message.success(successMessage)
            this.$emit('close')
          }
        }
      })
    },
    resetForm() {
      this.courseMessageForm = {
        course_name: '',
        class_id: '',
        message: ''
      }

      this.$nextTick(() => {
        if (this.$refs.courseMessageForm) {
          this.$refs.courseMessageForm.clearValidate()
        }
      })
    }
  }
}
</script>
