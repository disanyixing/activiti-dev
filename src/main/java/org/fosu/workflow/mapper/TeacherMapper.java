package org.fosu.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.fosu.workflow.entities.Teacher;
import org.fosu.workflow.entities.courseManager;

import java.util.ArrayList;

public interface TeacherMapper extends BaseMapper<Teacher> {
    Teacher getNickNameByTeacherName(String name);

}
