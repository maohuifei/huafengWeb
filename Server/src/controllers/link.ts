/**
 * 链接控制器
 * 处理所有与文章链接相关的HTTP请求
 */
import { Context } from "koa";
import { addLinkSchema, delLinkSchema, getLinkSchema,putLinkSchema, verifyAction } from "../utils/validation/link";
import { LinkDataService } from "../models/link";

// 创建链接服务实例
const linkDataService = new LinkDataService();

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
 * 添加新链接
 * @param ctx Koa上下文
 * POST /api/Link
 */
const addLink = async (ctx: Context) => {
    try {
        const value = verifyAction(addLinkSchema, ctx.request.body);
        await linkDataService.addLink(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "添加链接成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};

/**
 * 删除链接
 * @param ctx Koa上下文
 * DELETE /api/Link/:id
 */
const delLink = async (ctx: Context) => {
    try {
        const value = verifyAction(delLinkSchema, ctx.params);
        await linkDataService.delLink(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "删除链接成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};
/**
 * 更新链接
 * @param ctx Koa上下文
 * PUT /api/article
 */
const putLink = async (ctx: Context) => {
    try {
        const value = verifyAction(putLinkSchema, ctx.request.body)
        await linkDataService.putLink(value)
        ctx.status = 200
        ctx.body = { success: true, message: "修改链接成功" }
    } catch (error) {
        handleError(ctx, error);
    }
}
/**
 * 获取链接列表
 * @param ctx Koa上下文
 * GET /api/Link
 */
const getLink = async (ctx: Context) => {
    try {
        const value = verifyAction(getLinkSchema, ctx.request.query);
        const LinkList = await linkDataService.getLink(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: LinkList,
            message: "获取链接列表成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};

export {
    addLink,
    delLink,
    getLink,
    putLink,
};