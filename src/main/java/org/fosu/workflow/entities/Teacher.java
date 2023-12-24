package org.fosu.workflow.entities;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("教师类")
@TableName("mxg_teacher")
public class Teacher {
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;
    @ApiModelProperty("教师用户名")
    private String name;
    @ApiModelProperty("教师姓名")
    private String nick_name;
    @ApiModelProperty("角色")
    private String post;
}
