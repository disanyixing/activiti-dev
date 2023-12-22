package org.fosu.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.fosu.workflow.entities.Answer;
import org.fosu.workflow.entities.ChoiceQuestion;
import org.fosu.workflow.entities.SaQuestion;
import org.fosu.workflow.req.QuestionREQ;

import java.util.ArrayList;

public interface SaQuestionMapper extends BaseMapper<SaQuestion> {
    IPage<SaQuestion> getQuestionList(IPage page, @Param("req") QuestionREQ req);
    ArrayList<SaQuestion> getTotalScore(String paperId);
    void deletesaQuestion(String question_id,String paper_id);
    @Insert("INSERT INTO mxg_question_sa (id, paper_id, description, score, create_date) VALUES (#{id}, #{paperId}, #{description}, #{score}, #{createDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SaQuestion question);

}
