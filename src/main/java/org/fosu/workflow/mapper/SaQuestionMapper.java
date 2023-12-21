package org.fosu.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Param;
import org.fosu.workflow.entities.ChoiceQuestion;
import org.fosu.workflow.entities.SaQuestion;
import org.fosu.workflow.req.QuestionREQ;

import java.util.ArrayList;

public interface SaQuestionMapper extends BaseMapper<SaQuestion> {
    IPage<SaQuestion> getQuestionList(IPage page, @Param("req") QuestionREQ req);
    ArrayList<SaQuestion> getTotalScore(String paperId);
}
