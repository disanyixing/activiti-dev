package org.fosu.workflow.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.fosu.workflow.entities.Teacher;
import org.fosu.workflow.mapper.TeacherMapper;
import org.fosu.workflow.service.TeacherService;
import org.springframework.stereotype.Service;

@Service
public class TeacherServiceImpl extends ServiceImpl<TeacherMapper, Teacher> implements TeacherService {

}
