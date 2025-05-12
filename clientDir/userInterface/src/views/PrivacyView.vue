<!--
 * PrivacyView.vue - 隐私声明页面视图组件
 *
 * 功能：
 * 1. 展示网站声明和隐私政策内容
 * 2. 提供开源项目链接
 *
 * 设计要点：
 * - 分区块展示不同类型声明内容
 * - 悬停效果增强交互体验
 * - 响应式布局适配不同设备
-->
<template>
    <div class="privacy_box">
        <!-- 主标题 -->
        <h1>网站声明</h1>
        <!-- 内容区块 -->
        <div class="content_section">
            <h2>开源项目</h2>
            <p>此网站项目源代码已经在 GitHub 上开源，欢迎访问并参与贡献。</p>
            <a href="https://github.com/maohuifei/myWeb" target="_blank">前往 GitHub 查看项目</a>
        </div>
        <!-- 内容区块 -->
        <div class="content_section">
            <h2>关于本网站</h2>
            <p>本网站由我独立开发与维护，不会主动对外推广，主要记录我自己的学习历程和心得。</p>
            <p>网站内的所有资料均来源于互联网，经过我个人的整理、分析和总结得出。</p>
            <p>这些资料仅供学习记录之用，不具备任何商业性质，如果有涉及侵权之处，请及时与我联系。</p>
        </div>

        <!-- 内容区块 -->
        <div class="content_section">
            <h2>关于网站内容的使用</h2>
            <p>本网站的内容仅代表我个人的观点和理解，可能并不完全准确或完整。</p>
            <p>因此，在使用这些内容时，请务必自行判断其准确性和适用性。</p>
            <p>我明确禁止任何人以任何形式（包括商业和非商业）对网站内的内容进行传播、推广或盈利。</p>
            <p>对于网站内的原创内容，仅供个人学习使用，不得进行任何形式的恶意复制、转载或分享。</p>
            <p>如果发现有人违反此规定，我将采取必要的反制措施。</p>
        </div>

        <!-- 内容区块 -->
        <div class="content_section">
            <h2>关于数据处理</h2>
            <p>本网站可能包含来自其他网站的嵌入内容。这些外部网站可能会收集您的数据、使用Cookies，并可能跟踪您与这些嵌入内容的交互。</p>
            <p>请注意，我无法控制这些外部网站的行为，亦不对其行为负责。</p>
        </div>

        <!-- 内容区块 -->
        <div class="content_section">
            <h2>更新日期</h2>
            <p>特此公告</p>
            <p>更新日期：2024年4月4日</p>
        </div>
    </div>
</template>

<script lang='ts'>
export default {
    setup() {
        return {
        }
    }
}
</script>

<!-- 组件样式区域 -->
<style scoped lang="less">
/* 隐私声明主容器样式 */
.privacy_box {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;

    h1 {
        font-size: 2.8em;
        color: var(--systemColor);
        text-align: center;
        margin-bottom: 60px;
        position: relative;
        font-weight: 600;

        &::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 4px;
            background: var(--systemColor);
            border-radius: 2px;
        }
    }

    /* 内容区块样式 */
    .content_section {
        margin: 50px 0;
        padding: 35px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.4s ease;
        position: relative;

        &:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        h2 {
            font-size: 2em;
            color: var(--systemColor);
            margin-bottom: 25px;
            text-align: left;
            font-weight: 600;
            position: relative;
            padding-left: 20px;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 28px;
                background: var(--systemColor);
                border-radius: 3px;
            }
        }

        p {
            font-size: 1.15em;
            line-height: 2.2;
            color: #2c3e50;
            text-align: justify;
            letter-spacing: 0.6px;
            margin: 0 20px 20px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>