/**
 * 文章控制器
 * 处理所有与文章相关的HTTP请求
 */
import { Context } from 'koa';//引入koa类型信息，不然ctx会报错

import { addArticleSchema, delArticleSchema, putArticleSchema, getArticleSchema,getArticleContentSchema,verifyAction } from '../utils/validation/article'
import  {ArticleDataService}  from '../models/article';

// 创建文章服务实例
const articleDataService =new ArticleDataService()

/**
 * 统一的错误处理函数
 * @param ctx Koa上下文
 * @param error 捕获的错误
 */
const handleError = (ctx: Context, error: unknown) => {
    ctx.status = 400;
    if (error instanceof Error) {
        ctx.body = { success: false, message: error.message };
    } else {
        ctx.body = { success: false, message: `未知错误：${error}` };
    }
};

/**
 * 添加新文章
 * @param ctx Koa上下文
 * POST /api/article
 */
const articleAdd = async (ctx: Context) => {
    try {
        //校验参数
        const value = verifyAction(addArticleSchema, ctx.request.body)
        //crud
        await articleDataService.addArticle(value)
        ctx.status = 200
        ctx.body = { success: true, message: "添加文章成功" }
    } catch (error) {
        handleError(ctx, error);
    }
}

/**
 * 删除文章
 * @param ctx Koa上下文
 * DELETE /api/article/:id
 */
const articleDel = async (ctx: Context) => {
    try {
        const value = verifyAction(delArticleSchema, ctx.params)
        await articleDataService.delArticle(value)
        ctx.status = 200
        ctx.body = { success: true, message: "删除文章成功" }
    } catch (error) {
        handleError(ctx, error);
    }
}

/**
 * 更新文章
 * @param ctx Koa上下文
 * PUT /api/article
 */
const articlePut = async (ctx: Context) => {
    try {
        const value = verifyAction(putArticleSchema, ctx.request.body)
        await articleDataService.putArticle(value)
        ctx.status = 200
        ctx.body = { success: true, message: "修改文章成功" }
    } catch (error) {
        handleError(ctx, error);
    }
}

/**
 * 获取文章列表
 * @param ctx Koa上下文
 * GET /api/article
 */
const articleGet = async (ctx: Context) => {
    try {
        const value = verifyAction(getArticleSchema, ctx.query)
        const {articlelist,totalCount}=await articleDataService.getArticle(value)
        ctx.status = 200
        ctx.body = {
            success: true,
            data:articlelist,
            totalCount:totalCount,
            message:"获取文章列表成功"
        }
    } catch (error) {
        handleError(ctx, error);
    }
}

/**
 * 获取文章详情
 * @param ctx Koa上下文
 * GET /api/article/content
 */
const articleContentGet = async (ctx: Context) => {
    try {
        const value = verifyAction(getArticleContentSchema, ctx.query)
        const data=await articleDataService.getArticleContent(value)
        ctx.status = 200
        ctx.body = {
            success: true,
            data:data,
            message:"获取文章详情成功"
        }
    } catch (error) {
        handleError(ctx, error);
    }
}

export {
    articleAdd,
    articleDel,
    articlePut,
    articleGet,
    articleContentGet
}