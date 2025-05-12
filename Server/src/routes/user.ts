/**
 * 用户相关路由定义
 * 处理所有与用户相关的HTTP路由
 */
import Router from 'koa-router'
import { loginPot, revisePot, queryPot } from '../controllers/user';

/**
 * 创建路由实例
 * 所有用户相关的路由都以/api/user为前缀
 */
const router = new Router({
    prefix: '/api/user'
})
/**
 * 用户登录
 * POST /api/user/login
 * Body: { username: string, password: string }
 * 返回: { message: string, token: string }
 */
router.post('/login', async (ctx) => {
    await loginPot(ctx)
})

//修改用户信息
router.put('/revise', async (ctx) => {
    await revisePot(ctx)
})

//查询用户信息
router.get('/query', async (ctx) => {
    await queryPot(ctx)
})

export default router