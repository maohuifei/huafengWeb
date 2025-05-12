
import Joi from "joi";
//获取列表
const getLinkSchema = Joi.object({
  id: Joi.number().integer(),
  category: Joi.string(),
  icon: Joi.string(),
  name: Joi.string(),
  summary: Joi.string(),
  url: Joi.string(),
});
//根据id删除
const delLinkSchema = Joi.object({
    id: Joi.number().integer().required(),
});
//新增类别
const addLinkSchema = Joi.object({
  id: Joi.number().integer(),
  category: Joi.string(),
  icon: Joi.string(),
  name: Joi.string(),
  summary: Joi.string(),
  url: Joi.string(),
});

//修改类别
const putLinkSchema = Joi.object({
  id: Joi.number().integer(),
  category: Joi.string(),
  icon: Joi.string(),
  name: Joi.string(),
  summary: Joi.string(),
  url: Joi.string(),
});

//校验行为
function verifyAction(schema: Joi.Schema, data: any) {
    const { error, value } = schema.validate(data)
    if (error) {
        throw new Error(`校验失败: ${error.details[0].message}`);
    }
    return value
}

export {
    getLinkSchema,
    delLinkSchema,
    addLinkSchema,
    putLinkSchema,
    verifyAction
}