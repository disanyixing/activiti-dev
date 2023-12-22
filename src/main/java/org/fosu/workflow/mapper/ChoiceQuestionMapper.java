package org.fosu.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.fosu.workflow.entities.ChoiceQuestion;
import org.fosu.workflow.req.QuestionREQ;

import java.util.ArrayList;

public interface ChoiceQuestionMapper extends BaseMapper<ChoiceQuestion> {
    IPage<ChoiceQuestion> getQuestionList(IPage page, @Param("req") QuestionREQ req);

    ArrayList<ChoiceQuestion> getTotalScore(String paperId);

    void deleteChoiceQuestion(String question_id);

    @Insert("INSERT INTO mxg_question_choice (id, paper_id, description, choice_a, choice_b, choice_c, choice_d, answer, score, create_date) VALUES (#{id}, #{paperId}, #{description}, #{choiceA}, #{choiceB}, #{choiceC}, #{choiceD}, #{answer}, #{score}, #{createDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ChoiceQuestion question);
}
