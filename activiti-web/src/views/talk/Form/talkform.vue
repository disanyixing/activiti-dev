<template>
  <el-form ref="talkForm" :model="talkForm" :rules="rules" label-width="100px">
    <el-form-item label="话题标题" prop="title">
      <el-input v-model="talkForm.title" />
    </el-form-item>

    <el-form-item label="话题内容" prop="text">
      <el-input v-model="talkForm.text" type="textarea" />
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
import talkApi from '@/api/talk'

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
      talkForm: {
        id: '',
        courseId: '',
        title: '',
        text: '',
        creator: '',
        createDate: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入话题标题', trigger: 'blur' }
        ],
        courseId: [
          { required: true, message: '请选择所属课程', trigger: 'change' }
        ],
        text: [
          { required: true, message: '请输入话题简介', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    cont: {
      immediate: true,
      handler(newValue) {
        if (this.formType === '编辑' && newValue) {
          this.talkForm = { ...newValue }
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.talkForm = {
        id: '',
        courseId: this.cont.courseId || '',
        title: '',
        text: '',
        creator: this.cont.creator || '',
        createDate: new Date().toISOString()
      }

      this.$nextTick(() => {
        if (this.$refs.paperForm) {
          this.$refs.paperForm.clearValidate()
        }
      })
    },
    submitForm() {
      this.$refs.talkForm.validate(async(valid) => {
        if (valid) {
          let response = {}
          if (this.formType === '添加') {
            this.talkForm.id = null
            response = await talkApi.add(this.talkForm)
          } else {
            response = await talkApi.update(this.talkForm)
          }
          if (response.code === 20000) {
            this.$message.success('话题' + this.formType + '成功')
            this.$emit('close')
          }
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
  margin-right: 25px;
}
</style>
