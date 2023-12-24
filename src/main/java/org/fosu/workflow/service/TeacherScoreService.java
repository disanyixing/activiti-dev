package org.fosu.workflow.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.fosu.workflow.entities.TeacherScore;
import org.fosu.workflow.req.courseManagerREQ;
import org.fosu.workflow.utils.Result;

public interface TeacherScoreService extends IService<TeacherScore> {
    Result add(TeacherScore teacherScore);

    Result listPage(courseManagerREQ req);

    Result listStuPage(courseManagerREQ req);
}
