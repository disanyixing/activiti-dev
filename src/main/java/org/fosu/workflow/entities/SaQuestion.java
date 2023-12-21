package org.fosu.workflow.entities;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
@ApiModel("简答题实体类")
@TableName("mxg_question_sa")
public class SaQuestion {
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;
    @ApiModelProperty("所属试卷id")
    private String paperId;
    @ApiModelProperty("题目描述")
    private String description;
    @ApiModelProperty("分数")
    private int score;
    @ApiModelProperty("创建时间")
    private Date createDate;
}
