<!--
 * ArticleParticulars.vue - 文章详情展示组件
 *
 * 功能：
 * 1. 展示单篇文章的完整内容，包括标题、摘要、正文等
 * 2. 提供文章目录导航功能
 * 3. 支持返回上一页操作
 *
 * 技术实现：
 * - 使用markdown-it解析Markdown内容
 * - 使用highlight.js实现代码高亮
 * - 动态生成文章目录(TOC)
 * - 响应式设计适配不同设备
 *
 * 数据接口：
 * - 通过Vuex store获取文章数据
 * - 使用Vue Router处理页面导航
 *
 * 注意事项：
 * - 需要处理XSS安全风险
 * - 目录生成需要等待DOM渲染完成
-->
<template>
    <div class="particulars_box">
        <div class="floating_back_btn">
            <button class="back_btn" @click="backBtn"><span>返回上一页</span></button>
        </div>
        <h1 class="title">{{ particulars.title }}</h1>
        <div class="content_box">
            <div class="message_box">
                <span class="category">{{ particulars.category }}</span>
                <span>创建时间：{{ formatDate(particulars.created_at) }}</span>
                <span>更新时间：{{ formatDate(particulars.updated_at) }}</span>
            </div>
            <div class="abstract_box">
                <p>{{ particulars.abstract }}</p>
            </div>
            <div class="article_content markdown-body">
                <div v-html="sanitizeContent(particulars.content)"></div>
            </div>
        </div>
        <div v-if="tocItems.length > 0" 
             :class="['catalogue', { 'expanded': tocExpanded }]">
            <div class="toc-header" @click="toggleToc">
                <div class="toc-title">目录</div>
                <div class="toc-toggle" :class="{ 'expanded': tocExpanded }">▼</div>
            </div>
            <transition name="slide-fade">
                <div class="toc-content" v-show="tocExpanded">
                    <div class="toc-items">
                        <template v-for="(item, index) in processedTocItems" :key="index">
                            <div 
                                :class="[
                                    'toc-item',
                                    `level-${item.level}`,
                                    { 'has-children': item.hasChildren },
                                    { 'collapsed': item.collapsed }
                                ]"
                                @click.stop="handleTocItemClick(item, index)"
                            >
                                <span class="toc-item-content">
                                    <span 
                                        v-if="item.hasChildren" 
                                        class="toggle-icon"
                                        :class="{ 'expanded': !item.collapsed }"
                                    >
                                        ▶
                                    </span>
                                    {{ item.text }}
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang='ts'>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { myStore } from '@/stores/counter';
import { Utils } from '@/utils';
// @ts-ignore
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 文章数据接口定义
interface ArticleData {
    title: string;
    content: string;
    abstract: string;
    category: string;
    categoryId: number;
    created_at: string;
    updated_at: string;
}

// 分类数据接口
interface Category {
    id: number;
    name: string;
}

// 目录项接口
interface TocItem {
    id: string;
    level: number;
    text: string;
    hasChildren?: boolean;
    collapsed?: boolean;
    isChild?: boolean;
}

// 创建 markdown-it 实例
const createMarkdownIt = () => {
    const md = new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
        highlight: (str: string, lang: string) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (error) {
                    console.warn(`语法高亮失败: ${error}`);
                }
            }
            return ''; // 使用默认的转义
        }
    });

    return md;
};

export default {
    name: 'ArticleParticulars',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = myStore();
        const utils = new Utils();
        const tocItems = ref<TocItem[]>([]);
        const tocExpanded = ref(true);
        const md = createMarkdownIt();

        // 文章详情数据
        const particulars = ref<ArticleData>({
            title: '',
            content: '',
            abstract: '',
            category: '',
            categoryId: 0,
            created_at: '',
            updated_at: ''
        });

        /**
         * 获取文章分类信息
         */
        const getCategoryList = async () => {
            try {
                const response = await store.actions.getDataToServer('categories/list', { type: "文章分类" });
                if (!response.success) {
                    throw new Error(response.message || '获取分类列表失败');
                }
                
                const categories: Category[] = response.data;
                const matchingCategory = categories.find(category => category.id === particulars.value.categoryId);
                if (matchingCategory) {
                    particulars.value.category = matchingCategory.name;
                }
            } catch (error) {
                console.error('获取分类列表出错:', error);
                // 可以在这里添加用户提示
            }
        };

        /**
         * 生成目录
         */
        const generateToc = () => {
            setTimeout(() => {
                const content = document.querySelector('.article_content');
                if (!content) return;

                const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
                const items: TocItem[] = Array.from(headings).map((heading, index) => {
                    const id = `heading-${index}`;
                    heading.setAttribute('id', id);
                    return {
                        id,
                        level: parseInt(heading.tagName.charAt(1)),
                        text: heading.textContent || ''
                    };
                });

                tocItems.value = items;
            }, 100);
        };

        /**
         * 跳转到指定标题
         */
        const scrollToHeading = (id: string) => {
            const element = document.getElementById(id);
            if (element) {
                // 计算元素到视口顶部的距离
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                
                // 平滑滚动
                window.scrollTo({
                    top: middle,
                    behavior: 'smooth'
                });

                // 添加高亮效果
                element.classList.add('highlight-heading');
                setTimeout(() => {
                    element.classList.remove('highlight-heading');
                }, 1000); // 1秒后移除高亮
            }
        };

        /**
         * 获取文章详情数据
         * @param id 文章ID
         */
        const getParticulars = async (id: number) => {
            try {
                const response = await store.actions.getDataToServer("article/content", { id });
                if (!response.success) {
                    throw new Error(response.message || '获取文章详情失败');
                }

                particulars.value = {
                    ...response.data,
                    category: '',
                    created_at: response.data.created_at || '',
                    updated_at: response.data.updated_at || ''
                };

                await getCategoryList();
                generateToc();
            } catch (error) {
                console.error('获取文章详情出错:', error);
                // 可以在这里添加用户提示
            }
        };

        /**
         * 格式化日期显示
         * @param dateString 日期字符串
         */
        const formatDate = (dateString: string): string => {
            if (!dateString) return '';
            try {
                return new Date(dateString).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch {
                return dateString;
            }
        };

        /**
         * 解析 Markdown 内容并清理 HTML
         * @param content Markdown/HTML 内容
         */
        const sanitizeContent = (content: string): string => {
            if (!content) return '';
            
            try {
                // 转换Markdown为HTML
                let htmlContent = md.render(content);
                
                // 提取并处理样式
                const styleMatches = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
                const styles = styleMatches?.map(style => {
                    return style.replace(
                        /<style[^>]*>([\s\S]*?)<\/style>/i,
                        (_, p1) => `<style>${p1.replace(/([^{}]+){/g, '.article_content $1{')}</style>`
                    );
                }).join('') || '';
                
                // 清理HTML
                htmlContent = htmlContent
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<html[^>]*>|<\/html>|<head>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');
                
                return styles + htmlContent;
            } catch (error) {
                console.error('内容处理失败:', error);
                return '内容处理失败';
            }
        };

        /**
         * 返回上一页
         */
        const backBtn = () => {
            router.back();
        };

        // 切换目录展开状态
        const toggleToc = () => {
            tocExpanded.value = !tocExpanded.value;
        };

        const processedTocItems = computed(() => {
            return tocItems.value;
        });

        const handleTocItemClick = (item: TocItem, index: number) => {
            scrollToHeading(item.id);
        };

        // 监听滚动事件
        onMounted(() => {
            const id = Number(route.query.id);
            if (isNaN(id)) {
                console.error('无效的文章ID');
                router.push('/article');
                return;
            }
            getParticulars(id);
        });

        return {
            particulars,
            backBtn,
            formatDate,
            sanitizeContent,
            tocItems,
            scrollToHeading,
            tocExpanded,
            toggleToc,
            processedTocItems,
            handleTocItemClick
        };
    }
};
</script>

<style scoped>
.particulars_box {
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content_box {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.message_box {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    color: #666;
}

.abstract_box {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
}

.article_content {
    line-height: 1.8;
    margin-top: 2rem;
}

.title {
    font-size: 2rem;
    margin: 2rem 0;
    color: var(--txtColor);
    text-align: center;
    width: 100%;
    max-width: 800px;
}

.catalogue {
    position: fixed;
    right: 20px;
    top: 80px;
    width: 250px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.floating_back_btn {
    position: fixed;
    top: 80px;
    left: 40px;
    z-index: 1000;
}

.back_btn {
    background-color: var(--systemColor);
    color: var(--outElementColor);
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.95em;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
}

.back_btn::before {
    content: "←";
    display: inline-block;
    transition: transform 0.3s ease;
}

.back_btn:hover {
    opacity: 0.95;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateX(-5px);
}

.back_btn:hover::before {
    transform: translateX(-3px);
}

.category {
    color: var(--elementColor);
    font-weight: bold;
    background-color:black;
    color: white;
    padding:0px 5px;
    border-radius: 5px;
}

/* Markdown 内容样式 */
:deep(.markdown-body) {
    color: inherit;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
}

:deep(.markdown-body pre) {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
}

:deep(.markdown-body code) {
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
    padding: 0.2em 0.4em;
    font-size: 85%;
}

:deep(.markdown-body pre code) {
    background-color: transparent;
    padding: 0;
}

.toc-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    background-color: white;
    border-radius: 8px 8px 0 0;
}

.toc-title {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--systemColor);
}

.toc-toggle {
    font-size: 0.9em;
    color: #666;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-toggle.expanded {
    transform: rotate(180deg);
}

.toc-content {
    padding: 20px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    transition: padding 0.3s ease;
}

.toc-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.toc-item {
    position: relative;
    cursor: pointer;
    color: #666;
    transition: all 0.2s ease;
    font-size: 0.95em;
    line-height: 1.4;
    padding: 6px 0;
}

.toc-item-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toggle-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 10px;
    color: #999;
    transition: transform 0.3s ease;
}

.toggle-icon.expanded {
    transform: rotate(90deg);
}

.toc-item.has-children {
    font-weight: 500;
}

.toc-item.collapsed + .toc-item[class*="level-"] {
    display: none;
}

.toc-item:hover {
    color: var(--systemColor);
}

.toc-item.has-children:hover > .toc-item-content .toggle-icon {
    color: var(--systemColor);
}

/* 优化层级缩进 */
.level-1 { padding-left: 0; font-weight: 600; }
.level-2 { padding-left: 1.5em; }
.level-3 { padding-left: 3em; }
.level-4 { padding-left: 4.5em; }
.level-5 { padding-left: 6em; }
.level-6 { padding-left: 7.5em; }

/* 添加层级连接线 */
.toc-item:not(.level-1)::before {
    content: '';
    position: absolute;
    left: 0.5em;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: #eee;
}

.toc-item:not(.level-1)::after {
    content: '';
    position: absolute;
    left: 0.5em;
    top: 50%;
    width: 0.75em;
    height: 1px;
    background-color: #eee;
}

/* 添加滚动条样式 */
.catalogue::-webkit-scrollbar {
    width: 4px;
}

.catalogue::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.catalogue::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
}

.catalogue::-webkit-scrollbar-thumb:hover {
    background: #999;
}

/* 目录收放过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* 箭头旋转动画 */
.toc-toggle {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-toggle.expanded {
    transform: rotate(180deg);
}

/* 添加标题高亮样式 */
:deep(.highlight-heading) {
    background-color: var(--systemColor);
    color: var(--outElementColor) !important;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 2px 12px rgba(var(--systemColor-rgb), 0.3);
    padding: 0.8em 1.2em !important;
    transform: scale(1.02);
}

:deep(.highlight-heading)::after {
    content: '';
    position: absolute;
    left: -20px;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: var(--systemColor);
    border-radius: 2px;
    opacity: 1;
    box-shadow: 0 0 8px rgba(var(--systemColor-rgb), 0.5);
}

/* 确保标题可见 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
    scroll-margin-top: calc(50vh - 1em);
    padding: 0.5em 1em;
    margin: 1em -1em;
    border-radius: 4px;
    transition: all 0.3s ease;
}
</style>