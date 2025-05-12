import Router from 'koa-router'
import { addCategories, delCategories, getCategories } from '../controllers/categories'

const router = new Router({
    prefix: '/api/categories'
})

router.get('/list', async (ctx) => {
    await getCategories(ctx)
})

router.delete('/delete/:id', async (ctx) => {
    await delCategories(ctx)
})
router.post('/add', async (ctx) => {
    await addCategories(ctx)
})

export default router