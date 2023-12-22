package org.fosu.workflow.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.fosu.workflow.entities.SaQuestion;
import org.fosu.workflow.req.QuestionREQ;
import org.fosu.workflow.service.SaQuestionService;
import org.fosu.workflow.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api("简答题申请控制层")
@ResponseBody
@RestController
@RequestMapping("/saQuestion")
public class SaQuestionController {
    @Autowired
    SaQuestionService saQuestionService;

    @ApiOperation("新增简答题申请")
    @PostMapping
    public Result add(@RequestBody SaQuestion question) {
        return saQuestionService.add(question);
    }

    @ApiOperation("查询简答题申请列表")
    @PostMapping("/list")
    public Result listPage(@RequestBody QuestionREQ req) {
        return saQuestionService.listPage(req);
    }

    @ApiOperation("更新简答题详情信息")
    @PutMapping
    public Result update(@RequestBody SaQuestion question) {
        return saQuestionService.update(question);
    }

    @ApiOperation("查询简答题详情信息")
    @GetMapping("/{id}")
    public Result view(@PathVariable String id) {
        SaQuestion entity = saQuestionService.getById(id);
        return Result.ok(entity);
    }

    @ApiOperation("查询某试卷的简答题总分")
    @GetMapping("/total/{id}")
    public Result total(@PathVariable String id) {
        return Result.ok(saQuestionService.getTotalScore(id));
    }

    @ApiOperation("删除简答题")
    @DeleteMapping("/deletesaQuestion/{question_id}")
    public Result deletesaQuestion(@PathVariable String question_id) {
        return Result.ok(saQuestionService.deletesaQuestion(question_id));
    }
}
