/**
 * 用户控制器
 * 处理所有与用户相关的HTTP请求
 */
import { Context } from 'koa';//引入koa类型信息，不然ctx会报错

import { verifyAction, loginSchema, reviseSchema, querySchema } from '../utils/validation/user'
import { UserDataService } from '../models/user';

import { signToken } from '../utils/jwt';

// 创建用户服务实例
const userDataService = new UserDataService()

/**
 * 用户登录
 * @param ctx Koa上下文对象
 * POST /api/user/login
 * 成功时返回JWT token
 */
const loginPot = async (ctx:Context) => {
    try {
        // 验证登录信息
        const value = verifyAction(loginSchema, ctx.request.body)
        const data = await userDataService.potLogin(value)
        // 生成JWT token
        const token = signToken(data.id, data.username, data.password)
        ctx.status = 200
        ctx.body = {
            message: "登录成功",
            token: token
        }
    } catch (error) {
        if (error instanceof Error) {
            ctx.status = 400;
            ctx.body = error.message
        } else {
            ctx.status = 400;
            ctx.body = `未知错误：${error}`
        }
    }
}

//修改用户信息
const revisePot = async (ctx:Context) => {
    try {
        const value = verifyAction(reviseSchema, ctx.request.body)
        await userDataService.reviseUser(value)
        ctx.status = 200
        ctx.body = { message: "修改用户信息成功" }
    } catch (error) {
        if (error instanceof Error) {
            ctx.status = 400;
            ctx.body = `Error错误：${error}`
        } else {
            ctx.status = 400;
            ctx.body = `其他错误：${error}`
        }
    }
}

//查询用户信息
const queryPot = async (ctx:Context) => {
    const value = verifyAction(querySchema, ctx.request.query)
    const data = await userDataService.queryUser(value)
    ctx.status = 200
    ctx.body = {
        data:data,
        message:"查询用户信息成功"
    }
}

export {
    loginPot,
    revisePot,
    queryPot,
}