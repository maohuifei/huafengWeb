/**
 * 分类控制器
 * 处理所有与文章分类相关的HTTP请求
 */
import { Context } from "koa";
import { addCategoriesSchema, delCategoriesSchema, getCategoriesSchema, verifyAction } from "../utils/validation/categories";
import { CategoriesDataService } from "../models/categories";

// 创建分类服务实例
const categoriesDataService = new CategoriesDataService();

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
 * 添加新分类
 * @param ctx Koa上下文
 * POST /api/categories
 */
const addCategories = async (ctx: Context) => {
    try {
        const value = verifyAction(addCategoriesSchema, ctx.request.body);
        await categoriesDataService.addCategories(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "添加分类成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};

/**
 * 删除分类
 * @param ctx Koa上下文
 * DELETE /api/categories/:id
 */
const delCategories = async (ctx: Context) => {
    try {
        const value = verifyAction(delCategoriesSchema, ctx.params);
        await categoriesDataService.delCategories(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "删除分类成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};

/**
 * 获取分类列表
 * @param ctx Koa上下文
 * GET /api/categories
 */
const getCategories = async (ctx: Context) => {
    try {
        const value = verifyAction(getCategoriesSchema, ctx.request.query);
        const categoriesList = await categoriesDataService.getCategories(value);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: categoriesList,
            message: "获取分类列表成功"
        };
    } catch (error) {
        handleError(ctx, error);
    }
};

export {
    addCategories,
    delCategories,
    getCategories,
};