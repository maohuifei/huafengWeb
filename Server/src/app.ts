/**
 * 应用程序入口文件
 * 配置和启动Koa服务器
 */
import Koa from 'koa';
import koaBody from 'koa-body';
import jsonError from 'koa-json-error';
import userRouter from './routes/user';
import ariticleRouter from './routes/article'
import categoriesRouter from './routes/categories'
import linkRouter from './routes/link'
import { AppDataSource } from './data-source';
import cors from 'koa2-cors'
import { authenticate } from './utils/tokenAuth';
import 'reflect-metadata';
import { UserDataService } from './models/user';
import { Context } from 'koa';

// 导入敏感数据,需修改敏感数据模版文件并重命名
import sensitiveData from './sensitiveData';

// 创建Koa应用实例
const app = new Koa();

/**
 * CORS中间件配置选项
 */
const corsOptions = {
    origin: (ctx: Context) => {
        const origin = ctx.request.header.origin;
        // 允许的域名列表
        const whitelist = sensitiveData.whitelist;
        if (!origin || whitelist.includes(origin)) {
            return origin || '';
        }
        return false;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'Content-Range'],
    maxAge: 86400, // 24小时
};

// 使用CORS中间件
app.use(cors(corsOptions));

// 使用认证中间件
app.use(async (ctx, next) => {
    await authenticate(ctx, next);
});

// 使用请求体解析中间件
app.use(koaBody({
    json: true, // 支持JSON格式的请求体
}));

// 使用错误处理中间件
app.use(jsonError());

// 初始化数据库连接
AppDataSource.initialize()
    .then(async () => {
        // 初始化管理员账号
        const userService = new UserDataService();
        await userService.initAdmin();

        // 注册路由
        app.use(userRouter.routes());
        app.use(ariticleRouter.routes()).use(ariticleRouter.allowedMethods());
        app.use(categoriesRouter.routes()).use(categoriesRouter.allowedMethods());
        app.use(linkRouter.routes()).use(linkRouter.allowedMethods());

        // 启动服务器
        app.listen(3000, () => {
            console.log("服务运行：http://localhost:3000");
        });
    })
    .catch((error) => {
        console.error('数据源初始化时出错:', error);
    });