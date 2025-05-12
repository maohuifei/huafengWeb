import Router from 'koa-router'

import { articleAdd,articleDel,articlePut,articleGet,articleContentGet } from '../controllers/article';

const router = new Router({
    prefix: '/api/article'
})

//增
router.post('/add', async (ctx) => {
    await articleAdd(ctx)
})
//删
router.delete('/delete/:id', async (ctx) => {
    await articleDel(ctx)
});

//改
router.put('/put', async (ctx) => {
    await articlePut(ctx)
});
//查
router.get('/list', async (ctx) => {
    await articleGet(ctx)
})
//获取单个文章内容
router.get('/content', async (ctx) => {
    await articleContentGet(ctx)
})

export default router