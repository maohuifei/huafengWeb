import { AppDataSource } from '../data-source'
import { Article } from './entity/articleEntity'

export class ArticleDataService {
    //添加/新建文章
    async addArticle(value: any) {
        const articleRepository = AppDataSource.getRepository(Article)
        const newArticle = articleRepository.create(value)
        await articleRepository.save(newArticle)
    }
    //根据id删除文章
    async delArticle(value: any) {
        const articleRepository = AppDataSource.getRepository(Article)
        const waitDelArticle = await articleRepository.findOneBy({ id: value.id })
        if (waitDelArticle) {
            await articleRepository.remove(waitDelArticle)
        } else {
            throw new Error('文章未找到');
        }
    }
    //修改文章
    async putArticle(value: any) {
        const articleRepository = AppDataSource.getRepository(Article)
        const waitPutArticle = await articleRepository.findOneBy({ id: value.id })
        if (waitPutArticle) {
            waitPutArticle.title = value.title
            waitPutArticle.content = value.content
            waitPutArticle.categoryId = value.categoryId
            waitPutArticle.abstract = value.abstract
            waitPutArticle.recommend = value.recommend
            waitPutArticle.state = value.state
            await articleRepository.save(waitPutArticle)
        } else {
            throw new Error('文章未找到');
        }
    }
    //获取文章列表 
    async getArticle(value: any) {
        //定义返回字段格式
        const ARTICLE_SELECT_FIELDS = [
            'article.id',
            'article.title',
            'article.abstract',
            'article.categoryId',
            'article.recommend',
            'article.state',
            'article.created_at',
            'article.updated_at'
        ]

        const articleRepository = AppDataSource.getRepository(Article)
        const { page, pageSize, state, recommend, categoryId } = value;
        const skip = (page - 1) * pageSize;

        let queryBuilder = articleRepository.createQueryBuilder('article')
            .select(ARTICLE_SELECT_FIELDS)
            .skip(skip)
            .take(pageSize);

        ///根据文章是否上架状查询列表
        if (state !== undefined) {
            queryBuilder = queryBuilder.andWhere('article.state = :state', { state: state });
        }
        //根据文章是否推荐查询列表
        if (recommend !== undefined) {
            queryBuilder = queryBuilder.andWhere('article.recommend = :recommend', { recommend: recommend });
        }
        //根据文章类别id查询列表
        if (categoryId !== undefined) {
            queryBuilder = queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId: categoryId });
        }

        const [articlelist, totalCount] = await queryBuilder
            .getManyAndCount(); // 使用 getManyAndCount 方法同时获取结果和总数  

        return { articlelist, totalCount };
    }
    //根据文章id获取文章内容
    async getArticleContent(value: any) {
        const articleRepository = AppDataSource.getRepository(Article)
        const waitGetArticleContent = await articleRepository.findOneBy({ id: value.id })
        if (waitGetArticleContent) {
            return waitGetArticleContent
        } else {
            throw new Error('文章未找到');
        }
    }
}