import request from '@/utils/request'

// Course Manager API
export default {

  // Add a new course
  add(courseManager) {
    return request({
      url: '/courseManager',
      method: 'post',
      data: courseManager
    })
  },

  // Get all classes
  getAllClasses() {
    return request({
      url: '/courseManager/classes',
      method: 'get'
    })
  },

  // Get all courses of the current teacher
  getTeacherCourse() {
    return request({
      url: '/courseManager/teacherCourse',
      method: 'post'
    })
  },

  // Get all students of a specific course taught by a teacher
  getAllStudents(courseName) {
    return request({
      url: `/courseManager/${courseName}/allStudents`,
      method: 'get'
    })
  },

  // Get students by class ID
  getStudentsByClass(classId) {
    return request({
      url: `/courseManager/classes/${classId}/students`,
      method: 'get'
    })
  },

  // List page of course management
  listPage(data, current, size) {
    return request({
      url: '/courseManager/list',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // Get a unique list of all course names and teachers
  allCourseNameAndTeacherlist(req) {
    return request({
      url: '/courseManager/allCourseNameAndTeacherlist',
      method: 'post',
      data: req
    })
  },

  // Get a unique list of course names and teachers for a class
  classCourseNameAndTeacherlist(req) {
    return request({
      url: '/courseManager/classCourseNameAndTeacherlist',
      method: 'post',
      data: req
    })
  },

  // GetCurrentTeacher
  getCurrentTeacher() {
    return request({
      url: '/courseManager/currentTeacher',
      method: 'get'
    })
  },

  // Update course management details
  update(courseManager) {
    return request({
      url: '/courseManager',
      method: 'put',
      data: courseManager
    })
  },

  // View details of course management by ID
  viewById(id) {
    return request({
      url: `/courseManager/${id}`,
      method: 'get'
    })
  },

  // View class information for student courses
  stuClassInfoList(data, current, size) {
    return request({
      url: '/courseManager/classInfolist',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // View elective course information
  viewElectiveCourse(data, current, size) {
    return request({
      url: '/courseManager/electiveCourse',
      method: 'post',
      data: { ...data, current, size }
    })
  },

  // Select an elective course
  selectElectiveCourse(id) {
    return request({
      url: `/courseManager/selectElectiveCourse/${id}`,
      method: 'post'
    })
  },

  // Delete an elective course
  deleteElectiveCourse(id) {
    return request({
      url: `/courseManager/deleteElectiveCourse/${id}`,
      method: 'delete'
    })
  },

  // Get a unique list of all course names, teachers, and classes
  allCourseNameAndTeacherAndClasslist(req) {
    return request({
      url: '/courseManager/allCourseNameAndTeacherAndClasslist',
      method: 'post',
      data: req
    })
  },

  // Get a unique list of course names, teachers, and classes for a class
  classCourseNameAndTeacherAndClasslist(req) {
    return request({
      url: '/courseManager/classCourseNameAndTeacherAndClasslist',
      method: 'post',
      data: req
    })
  }

}
