/**
 * 用户相关的数据验证规则
 * 使用Joi库进行请求参数的验证
 */
import Joi from 'joi'

/**
 * 用户登录时的数据验证规则
 * - username: 必填的字符串
 * - password: 必填的字符串
 */
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});
//修改用户信息
const reviseSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string(),
    password: Joi.string(),
    nickname: Joi.string(),
    avatar: Joi.string(),
    declaration: Joi.string(),
    address: Joi.string(),
    position: Joi.string(),
});
//查询用户信息
const querySchema = Joi.object({
    id: Joi.number().required(),
});

/**
 * 通用的数据验证函数
 * @param schema Joi验证模式
 * @param data 待验证的数据
 * @throws Error 当验证失败时抛出错误
 * @returns 验证通过的数据
 */
function verifyAction(schema:Joi.Schema,data:any){
    const {error,value}=schema.validate(data)
    if(error){
        throw new Error(`校验失败: ${error.details[0].message}`);
    }
    return value
}

export {
    verifyAction,
    loginSchema,
    reviseSchema,
    querySchema,
}