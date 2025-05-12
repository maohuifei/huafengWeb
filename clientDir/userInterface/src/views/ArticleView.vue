<!--
文章列表页面 - 展示所有文章列表
1. article_box: 主容器，包含所有文章卡片
2. card_box: 文章卡片容器
3. card_class: 单个文章卡片，包含:
   - 文章标题
   - 更新时间
   - 文章摘要
   - 阅读按钮
4. loading-indicator: 加载指示器
-->
<template>
    <div class="article_box">
        <div class="card_box">
            <div class="card_class" v-for="article in articleList" :key="article.id">
                <h2 class="title_txt">{{ article.title }}</h2>
                <span class="updata_txt">更新时间：{{ article.updated_at }}</span>
                <div style="height: 170px;">
                    <div class="abstract_container" ref="abstractContainers">
                        <p class="abstract_box" ref="abstractBoxes">{{ article.abstract || "此处为摘要" }}</p>
                    </div>
                </div>
                <button class="all_btn" 
                    :class="{ 'loading': article.isLoading }"
                    :style="{ cursor: article.isLoading ? 'wait' : 'pointer' }"
                    :disabled="article.isLoading"
                    @click="ToParticulars(article.id)"
                >
                    <span class="btn-text">{{ article.isLoading ? '加载中' : '阅读' }}</span>
                    <span class="loading-spinner"></span>
                </button>
            </div>
        </div>
        <div v-if="loading" class="loading-indicator">
            <div class="loader"></div>
        </div>
    </div>
</template>

<!--
脚本部分 - 处理文章列表数据和交互
1. 导入依赖:
   - Vue组合式API: ref, onMounted等
   - Pinia状态管理
   - 工具类
   - vue-router
2. 响应式数据:
   - articleList: 文章列表数据
   - loading状态控制
   - 分页参数
3. 方法:
   - getArticleList: 获取文章列表
   - handleScroll: 滚动加载更多
   - checkTextOverflow: 检查文本溢出
   - ToParticulars: 查看文章详情
-->
<script lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { myStore } from '@/stores/counter';
import { Utils } from '@/utils';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const articleList = ref<any[]>([]);
        const stores = myStore();
        const utils = new Utils();
        const pageQuery = ref({
            page: 1,
            pageSize: 12, // 初始加载6个文章
            state: true,
        });
        const totalCount = ref(0);
        const pageCount = ref(1);
        const abstractBoxes = ref<HTMLElement[]>([]);
        const abstractContainers = ref<HTMLElement[]>([]);
        const loading = ref(false); // 加载状态

        onMounted(async () => {
            await getArticleList();
            nextTick(() => {
                checkTextOverflow();
            });
            window.addEventListener('scroll', handleScroll);
        });

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 10) {
                if (pageQuery.value.page < pageCount.value) {
                    pageQuery.value.page++;
                    getArticleList();
                }
            }
        };

        const getArticleList = async () => {
            loading.value = true; // 开始加载
            try {
                const returned = await stores.actions.getDataToServer('article/list', pageQuery.value);
                totalCount.value = returned.totalCount;
                pageCount.value = Math.ceil(returned.totalCount / pageQuery.value.pageSize);
                const articles = returned.data;
                const formattedArticles = articles.map((article: { updated_at: string; }) => ({
                    ...article,
                    updated_at: utils.formatDate(article.updated_at)
                }));

                // 如果是第一页，清空 articleList
                if (pageQuery.value.page === 1) {
                    articleList.value = formattedArticles;
                } else {
                    articleList.value = [...articleList.value, ...formattedArticles]; // 追加新文章
                }
            } catch (error) {
                console.error('获取列表失败');
            } finally {
                loading.value = false; // 加载完成
            }
        };

        const router = useRouter();
        const ToParticulars = async (articleId: number) => {
            const article = articleList.value.find(a => a.id === articleId);
            if (article) {
                article.isLoading = true; // 设置加载状态
            }
            await router.push({
                path: '/articleParticulars',
                query: { id: articleId }
            });
            if (article) {
                article.isLoading = false; // 重置加载状态
            }
        };

        const checkTextOverflow = () => {
            abstractBoxes.value.forEach((box, index) => {
                const container = abstractContainers.value[index];
                if (box && container) {
                    const isOverflowing = box.scrollHeight > box.clientHeight;
                    if (isOverflowing) {
                        container.classList.add('has-overflow');
                    } else {
                        container.classList.remove('has-overflow');
                    }
                }
            });
        };

        return {
            ToParticulars,
            getArticleList,
            articleList,
            totalCount,
            pageCount,
            abstractBoxes,
            abstractContainers,
            handleScroll,
            loading,
        };
    }
}
</script>

<!--
样式部分 - 文章列表页面特定样式
1. article_box: 主容器样式
2. card_box: 文章卡片容器样式
3. card_class: 单个文章卡片样式
   - 标题样式
   - 更新时间样式
   - 摘要区域样式
   - 阅读按钮样式
4. loading-indicator: 加载指示器样式
-->
<style scoped lang="less">
.article_box {
    color: var(--txtColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;

    .card_box {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 1200px;

        .card_class {
            border: 1px solid var(--systemColor);
            width: 280px;
            height: 320px;
            margin: 15px;
            padding: 20px;
            background: transparent;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: var(--systemColor);
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.3s ease;
            }

            &:hover::before {
                transform: scaleX(1);
            }

            .title_txt {
                font-weight: bold;
                font-size: 1.2em;
                margin-bottom: 10px;
                color: var(--systemColor);
            }

            .updata_txt {
                font-size: 0.9em;
                font-weight: 500;
                margin: 10px 0;
                color: #666;
            }

            .abstract_container {
                flex: 1;
                overflow: hidden;
                margin: 10px 0;
                position: relative;

                &.has-overflow::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 20px;
                    background: linear-gradient(transparent, white);
                }

                .abstract_box {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 6;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.95em;
                    line-height: 1.5;
                    color: #333;
                }
            }

            .all_btn {
                width: 80px;
                margin: 15px auto 0;
                background-color: var(--systemColor);
                color: var(--outElementColor);
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                transition: all 0.3s ease;
                cursor: pointer;

                &:hover {
                    opacity: 0.9;
                    transform: scale(1.05);
                }
            }
        }
    }

    .loading-indicator {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loader {
        border: 8px solid rgba(255, 255, 255, 0.3);
        border-left-color: var(--systemColor);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
}
</style>