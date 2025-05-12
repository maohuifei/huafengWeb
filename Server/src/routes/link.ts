import Router from 'koa-router'
import { addLink, delLink,getLink,putLink } from '../controllers/link'

const router = new Router({
  prefix: '/api/link'
})

router.post('/add', addLink)
//改
router.put('/put', async (ctx) => {
  await putLink(ctx)
});
router.get('/list', getLink)
router.delete('/delete/:id', delLink)

export default router