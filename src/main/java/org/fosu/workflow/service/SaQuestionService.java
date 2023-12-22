package org.fosu.workflow.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.fosu.workflow.entities.SaQuestion;
import org.fosu.workflow.req.QuestionREQ;
import org.fosu.workflow.utils.Result;

public interface SaQuestionService extends IService<SaQuestion> {
    Result add(SaQuestion question);

    Result listPage(QuestionREQ req);

    Result update(SaQuestion question);

    int getTotalScore(String paperId);

    Result deletesaQuestion(String question_id);

}
