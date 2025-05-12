// 类别表
// id：类别id；主键，自增
// name：类别名称；
// type：类别类型；

import Joi from "joi";
//获取列表
const getCategoriesSchema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string(),
    type: Joi.string(),
});
//根据id删除类别
const delCategoriesSchema = Joi.object({
    id: Joi.number().integer().required(),
});
//新增类别
const addCategoriesSchema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string(),
    type: Joi.string(),
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
    getCategoriesSchema,
    delCategoriesSchema,
    addCategoriesSchema,
    verifyAction
}