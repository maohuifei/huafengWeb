<!--
首页视图 - 展示网站介绍、推荐文章和技术栈
1. home_box: 主容器，包含所有内容区块
2. web_introduction_box: 网站介绍区块
3. middle_box: 推荐文章区块
   - card_box: 文章卡片容器
   - card_class: 单个文章卡片
   - view-more-btn: 查看更多按钮
4. technique_box: 技术栈展示区块
   - 分为全局、后端和前端三部分技术展示
-->
<template>
    <div class="home_box">
        <div class="web_introduction_box">
            <h1 style="font-size: 50px;" class="welcome-title">欢迎来到HuaFeng，我的在线知识库</h1>
            <p class="welcome-text">
                这个网站是我个人学习、生活感悟及技术实践的记录空间，并非公开宣传的站点
            </p>
            <p class="welcome-text">
                如果你偶然间访问到了这里，那或许就是一种奇妙的缘分
            </p>
            <h2 class="welcome-text">
                网站设计遵循
                <span class="significant">"更简单、更纯粹"</span>
                的原则
            </h2>
            <p class="welcome-text">
                它包含了我的思想理念，记录了我的成长轨迹，也见证了我与众多先行者思想的碰撞与共鸣
            </p>
            <p class="welcome-text">
                对于意外到访的你，如果有任何建议或想法，欢迎通过关于界面的联系方式与我沟通
            </p>
        </div>

        <div class="middle_box">
            <h1>推荐文章</h1>
            <div class="card_box">
                <div class="card_class" v-for="(article, index) in articleList" :key="index">
                    <h2 class="title_txt">{{ article.title }}</h2>
                    <span class="updata_txt">更新时间：{{ article.updated_at }}</span>
                    <div class="abstract_container" ref="abstractContainers">
                        <p class="abstract_box" ref="abstractBoxes">{{ article.abstract || "此处为摘要" }}</p>
                    </div>
                    <button 
                        class="all_btn" 
                        :class="{ 'loading': article.isLoading }"
                        :disabled="article.isLoading"
                        @click="viewArticle(article.id, index)"
                    >
                        <span class="btn-text">{{ article.isLoading ? '加载中' : '阅读' }}</span>
                        <span class="loading-spinner"></span>
                    </button>
                </div>
            </div>
            <button 
                class="view-more-btn"
                :class="{ 'loading': isViewMoreLoading }"
                :disabled="isViewMoreLoading"
                @click="viewMoreArticles"
            >
                <span class="btn-text">{{ isViewMoreLoading ? '跳转中' : '查看更多' }}</span>
                <span class="loading-spinner"></span>
            </button>
        </div>

        <div class="technique_box">
            <h1>网站技术</h1>
            <div class="marquee-container">
                <div class="marquee-track" 
                     @mouseenter="pauseMarquee" 
                     @mouseleave="resumeMarquee">
                    <a v-for="(item, index) in [...overallList, ...serverList, ...clientList]" 
                       :key="index" 
                       :href="item.url" 
                       target="_blank" 
                       class="card_class">
                        <svg class="icon technique_icon" aria-hidden="true">
                            <use :href="item.icon"></use>
                        </svg>
                        <p>{{ item.name }}</p>
                        <p>{{ item.versions }}</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<!--
脚本部分 - 处理首页数据和交互
1. 导入依赖:
   - Vue组合式API: ref, onMounted等
   - Pinia状态管理
   - vue-router
2. 响应式数据:
   - articleList: 文章列表数据
   - overallList/serverList/clientList: 技术栈数据
   - loading状态控制
3. 方法:
   - viewArticle: 查看文章详情
   - viewMoreArticles: 查看更多文章
   - checkTextOverflow: 检查文本溢出
   - handleScroll: 滚动加载更多
-->
<script lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { myStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
import { Utils } from '@/utils';

export default {
    setup() {
        const stores = myStore()
        const pageQuery = ref({
            page: 1,
            pageSize: 10,
            recommend: true
        })
        const articleList = ref()
        const abstractBoxes = ref<HTMLElement[]>([])
        const abstractContainers = ref<HTMLElement[]>([])
        const isViewMoreLoading = ref(false)

        onMounted(async () => {
            await getArticleList()
            // 等待DOM更新后检查文本是否溢出
            nextTick(() => {
                checkTextOverflow()
            })
        })

        const utils = new Utils()
        const getArticleList = async () => {
            try {
                const returned = await stores.actions.getDataToServer('article/list', pageQuery.value)

                // 假设 returned.data 是一个包含多个对象的数组，每个对象都有一个 updated_at 字段  
                const articles = returned.data;

                // 使用 map 方法来遍历数组并格式化每个对象的 updated_at 字段  
                const formattedArticles = articles.map((article: { updated_at: string; }) => ({
                    ...article, // 复制文章对象的所有属性  
                    updated_at: utils.formatDate(article.updated_at), // 使用 Utils 类的 formatDate 方法来格式化 updated_at 字段  
                    isLoading: false // 添加加载状态
                }));

                // 现在 formattedArticles 包含了格式化后的文章数据  
                articleList.value = formattedArticles; // 假设 articleList 是一个响应式引用  

            } catch (error) {
                console.error('获取列表失败');
            }
        }

        const router = useRouter()
        const viewArticle = async (articleId: number, index: number) => {
            try {
                // 设置加载状态
                if (articleList.value && articleList.value[index]) {
                    articleList.value[index].isLoading = true
                }
                
                // 跳转前等待一小段时间，确保加载动画显示
                await new Promise(resolve => setTimeout(resolve, 100))
                
                await router.push({
                    path: '/articleParticulars',
                    query: { id: articleId }
                })
            } catch (error) {
                console.error('跳转失败:', error)
            } finally {
                // 重置加载状态
                if (articleList.value && articleList.value[index]) {
                    articleList.value[index].isLoading = false
                }
            }
        }

        const viewMoreArticles = async () => {
            try {
                isViewMoreLoading.value = true
                await router.push('/article')
            } catch (error) {
                console.error('跳转失败:', error)
            } finally {
                isViewMoreLoading.value = false
            }
        }

        //全局技术
        const overallList = [
            {
                icon: "#icon-typescript",
                name: "TypeScript",
                versions: "5.4.0",
                url: "https://www.typescriptlang.org/"
            },
            {
                icon: "#icon-Nodejs",
                name: "Node.js",
                versions: "20.18.01",
                url: "https://nodejs.org/"
            }
        ]

        //客户端技术
        const clientList = [
            {
                icon: "#icon-Vue",
                name: "Vue",
                versions: "3.4.29",
                url: "https://vuejs.org/"
            },
            {
                icon: "#icon-element-plus",
                name: "Element Plus",
                versions: "2.5.6",
                url: "https://element-plus.org/"
            },
            {
                icon: "#icon-GSAP",
                name: "GSAP",
                versions: "3.12.5",
                url: "https://greensock.com/gsap/"
            }
        ]

        //服务器技术
        const serverList = [
            {
                icon: "#icon-ubuntu",
                name: "Ubuntu",
                versions: "22.04",
                url: "https://ubuntu.com/"
            },
            {
                icon: "#icon-Nginx",
                name: "Nginx",
                versions: "1.24.0",
                url: "https://nginx.org/"
            },
            {
                icon: "#icon-ic_taskedit_kafka",
                name: "Koa.js",
                versions: "2.15.3",
                url: "https://koajs.com/"
            },
            {
                icon: "#icon-mysql1",
                name: "mySQL",
                versions: "3.11.0",
                url: "https://www.mysql.com/"
            }
        ]

        const checkTextOverflow = () => {
            abstractBoxes.value.forEach((box, index) => {
                const container = abstractContainers.value[index]
                if (box && container) {
                    // 检查文本是否溢出
                    const isOverflowing = box.scrollHeight > box.clientHeight
                    if (isOverflowing) {
                        container.classList.add('has-overflow')
                    } else {
                        container.classList.remove('has-overflow')
                    }
                }
            })
        }

        const pauseMarquee = () => {
            const track = document.querySelector<HTMLElement>('.marquee-track')
            if (track) {
                track.style.animationPlayState = 'paused'
            }
        }

        const resumeMarquee = () => {
            const track = document.querySelector<HTMLElement>('.marquee-track')
            if (track) {
                track.style.animationPlayState = 'running'
            }
        }

        return {
            overallList,
            serverList,
            clientList,
            pageQuery,
            getArticleList,
            articleList,
            viewArticle,
            abstractBoxes,
            abstractContainers,
            isViewMoreLoading,
            viewMoreArticles,
            pauseMarquee,
            resumeMarquee
        }
    }
}
</script>

<!--
样式部分 - 首页特定样式
1. home_box: 主容器样式
2. web_introduction_box: 网站介绍区块样式
3. middle_box: 推荐文章区块样式
   - card_box: 文章卡片容器样式
   - card_class: 单个文章卡片样式
4. technique_box: 技术栈展示区块样式
   - 技术卡片样式和布局
-->
<style scoped lang="less">
.home_box {
    display: flex;
    flex-direction: column;
    padding-top: 60px;

    .web_introduction_box,
    .my_introduction_box,
    .middle_box,
    .technique_box {
        text-align: center;
        width: 100%;
        max-width: 1200px;
        min-height: 100vh;
        padding: 120px 20px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h1 {
            font-size: 2.5em;
            color: var(--systemColor);
            margin-bottom: 40px;
            position: relative;
        }

        p {
            font-size: 1.1em;
            line-height: 1.8;
            margin: 15px 0;
            max-width: 800px;
            color: #333;
        }
    }

    .web_introduction_box {
        min-height: calc(100vh - 60px);
        padding: 40px 20px;
        padding-top: 0;
        justify-content: flex-start;
        padding-top: 15vh;

        .welcome-title {
            opacity: 0;
            animation: fadeIn 1s ease forwards;
            animation-delay: 0.3s;
        }

        .welcome-text {
            opacity: 0;
            animation: fadeIn 1s ease forwards;
            
            &:nth-child(2) { animation-delay: 0.5s; }
            &:nth-child(3) { animation-delay: 0.7s; }
            &:nth-child(4) { animation-delay: 0.9s; }
            &:nth-child(5) { animation-delay: 1.1s; }
            &:nth-child(6) { animation-delay: 1.3s; }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    }

    .my_introduction_box,
    .middle_box,
    .technique_box {
        padding: 120px 20px;
    }

    .web_introduction_box,
    .my_introduction_box {
        .significant {
            font-size: 1.3em;
            font-weight: bold;
            color: var(--systemColor);
            padding: 0 5px;
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--systemColor);
                transform: scaleX(0);
                transition: transform 0.3s ease;
                transform-origin: right;
            }

            &:hover::after {
                transform: scaleX(1);
                transform-origin: left;
            }
        }

        p {
            font-size: 1.1em;
            line-height: 1.6;
            margin: 12px auto;
            max-width: 800px;
            color: #333;
            letter-spacing: 0.5px;
            text-align: center;
            
            &:hover {
                color: #000;
                transition: color 0.3s ease;
            }
        }
    }

    .my_introduction_box,
    .middle_box,
    .technique_box {
        h1 {
            &::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 120px;
                height: 3px;
                background: var(--systemColor);
            }
        }
    }

    .middle_box {
        .card_box {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;

            .card_class {
                width: 280px;
                height: 320px;
                display: flex;
                text-align: center;
                flex-direction: column;
                border: 1px solid var(--systemColor);
                padding: 25px;
                background: white;
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
                    position: relative;
                    overflow: hidden;

                    .btn-text {
                        position: relative;
                        z-index: 1;
                        transition: opacity 0.3s ease;
                    }

                    .loading-spinner {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 20px;
                        height: 20px;
                        border: 2px solid #000;  /* 改为黑色边框 */
                        border-top-color: #000;  /* 顶部边框改为黑色 */
                        border-radius: 50%;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }

                    &:hover:not(.loading) {
                        opacity: 0.9;
                        transform: scale(1.05);
                    }

                    &.loading {
                        cursor: wait;
                        
                        .btn-text {
                            opacity: 0.7;
                        }
                        
                        .loading-spinner {
                            opacity: 1;
                            animation: spin 1s linear infinite;
                        }
                    }

                    &:disabled {
                        cursor: wait;
                        opacity: 0.8;
                    }
                }
            }
        }

        .view-more-btn {
            width: 400px;
            margin: 40px auto 0;
            background-color: transparent;
            color: var(--systemColor);
            padding: 10px 30px;
            border: 2px solid var(--systemColor);
            font-size: 1.2em;
            font-weight:900;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            .btn-text {
                position: relative;
                z-index: 1;
                transition: opacity 0.3s ease;
            }

            .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border: 2px solid #000;  /* 改为黑色边框 */
                border-top-color: #000;  /* 顶部边框改为黑色 */
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &:hover:not(.loading) {
                background-color: var(--systemColor);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            &.loading {
                cursor: wait;
                
                .btn-text {
                    opacity: 0.7;
                }
                
                .loading-spinner {
                    opacity: 1;
                    animation: spin 1s linear infinite;
                }
            }

            &:disabled {
                cursor: wait;
                opacity: 0.8;
            }
        }
    }

    .technique_box {
        h1 {
            margin-bottom: 40px;
        }

        .marquee-container {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            padding: 20px;
        }

        .marquee-track {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 10s linear infinite;
        }

        .card_class {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--systemColor);
            padding: 20px;
            width: 150px;
            height: 180px;
            background: white;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            cursor: pointer;
            margin-right: 20px;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .technique_icon {
                width: 70px;
                height: 70px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
                fill: var(--systemColor);
            }

            &:hover .technique_icon {
                transform: scale(1.1);
            }

            p {
                margin: 5px 0;
                font-size: 1em;

                &:first-of-type {
                    font-weight: bold;
                    color: var(--systemColor);
                }

                &:last-of-type {
                    font-size: 0.9em;
                    color: #666;
                }
            }
        }

        @keyframes marquee {
            0% { transform: translateX(0); }
            40% { transform: translateX(-25%); }
            50% { transform: translateX(-25%); }  // 暂停1秒 (50%-40%=10% of 10s)
            90% { transform: translateX(0); }
            100% { transform: translateX(0); }    // 暂停1秒 (100%-90%=10% of 10s)
        }
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>