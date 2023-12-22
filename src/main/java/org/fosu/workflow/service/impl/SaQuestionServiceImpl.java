package org.fosu.workflow.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.fosu.workflow.entities.ChoiceQuestion;
import org.fosu.workflow.entities.SaQuestion;
import org.fosu.workflow.mapper.SaQuestionMapper;
import org.fosu.workflow.req.QuestionREQ;
import org.fosu.workflow.service.SaQuestionService;
import org.fosu.workflow.utils.Result;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;

@Service
public class SaQuestionServiceImpl extends ServiceImpl<SaQuestionMapper, SaQuestion> implements SaQuestionService {
    @Override
    @Transactional
    public Result add(SaQuestion question) {
        question.setCreateDate(new Date());
        if(baseMapper.insert(question) == 1)
            return Result.ok();
        return Result.error("添加新简答失败");
    }

    @Override
    public Result listPage(QuestionREQ req) {
        IPage<SaQuestion> page = baseMapper.getQuestionList(req.getPage(), req);
        return Result.ok(page);
    }

    @Override
    public Result update(SaQuestion question) {
        if (question == null || StringUtils.isEmpty(question.getId())) {
            return Result.error("数据不合法");
        }
        //查询元数据
        SaQuestion entity = baseMapper.selectById(question.getId());
        // 拷贝新数据
        BeanUtils.copyProperties(question, entity);
        baseMapper.updateById(entity);
        return Result.ok();
    }

    @Override
    public int getTotalScore(String paperId) {
        ArrayList<SaQuestion> list = baseMapper.getTotalScore(paperId);
       /* if(list.size() > 0)
        {
            ChoiceQuestion que = list.get(0);
            if(que != null)
                return que.getScore();
        }*/
        int sum=0;
        for (int i = 0; i < list.size(); i++) {
            sum+=list.get(i).getScore();
        }
        return sum;
    }
}
