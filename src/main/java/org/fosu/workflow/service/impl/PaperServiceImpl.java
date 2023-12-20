package org.fosu.workflow.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.fosu.workflow.entities.Paper;
import org.fosu.workflow.entities.Speak;
import org.fosu.workflow.mapper.PaperMapper;
import org.fosu.workflow.req.AnswerREQ;
import org.fosu.workflow.req.PaperREQ;
import org.fosu.workflow.service.AnswerService;
import org.fosu.workflow.service.ChoiceQuestionService;
import org.fosu.workflow.service.PaperService;
import org.fosu.workflow.utils.Result;
import org.fosu.workflow.utils.UserUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class PaperServiceImpl extends ServiceImpl<PaperMapper, Paper> implements PaperService {
    @Autowired
    ChoiceQuestionService choiceService;
    @Autowired
    AnswerService answerService;
    @Override
    @Transactional
    public Result add(Paper paper) {
        paper.setCreator(UserUtils.getUsername());
        paper.setCreateDate(new Date());
        if(baseMapper.insert(paper) == 1)
            return Result.ok();
        return Result.error("添加新试卷失败");
    }

    @Override
    public Result listPage(PaperREQ req) {
        IPage<Paper> page = baseMapper.getPaperList(req.getPage(), req);
        return Result.ok(page);
    }

  @Override
    public Result getStudentPaperList(PaperREQ req) {
        IPage<Paper> page = baseMapper.getStudentPaperList(req.getPage(), req);
        return Result.ok(page);
    }

    @Override
    public Result update(Paper paper) {
        if (paper == null || StringUtils.isEmpty(paper.getId())) {
            return Result.error("数据不合法");
        }
        //查询元数据
        Paper entity = baseMapper.selectById(paper.getId());
        // 拷贝新数据
        BeanUtils.copyProperties(paper, entity);
        baseMapper.updateById(entity);
        return Result.ok();
    }

    @Override
    public int getTotalScore(String id) {
        int total = 0;
        total += choiceService.getTotalScore(id);
        return total;
    }

    @Override
    public Result getGrading(PaperREQ req) {
        req.setSize(999999);
        float[] grade = new float[3];
        int testScore = 0;//学生测试得分
        int testTotal = 0;//测试总分
        int examScore = 0;//学生考试得分
        int examTotal = 0;//考试总分
        IPage<Paper> page = baseMapper.getStudentPaperList(req.getPage(), req);//得到学生某个课程的所有试卷
        AnswerREQ answerREQ = new AnswerREQ();
        for (Paper paper : page.getRecords()) {
            if (paper != null)
            {
                answerREQ.setPaperId(paper.getId());//设置试卷id
                answerREQ.setCreator(req.getCreator());//设置学生用户名
                int paperType = paper.getType();
                if(paperType == 1)//平时测试试卷
                {
                    testScore += answerService.getScore(answerREQ);//获取学生在该试卷得分
                    testTotal += getTotalScore(paper.getId());//获取试卷总分
                }
                else if(paperType == 2)//考试试卷
                {
                    examScore += answerService.getScore(answerREQ);//获取学生在该试卷得分
                    examTotal += getTotalScore(paper.getId());//获取试卷总分
                }
            }
        }
        //平时成绩
        if(testTotal == 0)
            grade[0] = 100;
        else
            grade[0] = testScore / (float)testTotal * 100f;
        //考试成绩
        if(examTotal == 0)
            grade[1] = 100;
        else
            grade[1] = examScore / (float)examTotal * 100f;
        grade[2] = grade[0] * 0.3f + grade[1] * 0.7f;//最终成绩
        return Result.ok(grade);
    }
}
