<!--
关于页面 - 展示个人信息和联系方式
1. about_box: 主容器，包含所有内容区块
2. content_section: 内容区块，包含:
   - 个人介绍
   - 所在地信息
   - 联系方式列表
   - 参与项目展示
3. contact_list: 联系方式列表，包含:
   - Email链接
   - GitHub链接
   - 微信二维码
   - X(Twitter)链接
4. project_cards: 项目卡片展示区
-->
<template>
    <div class="about_box">
        <h1>关于我</h1>
        <div class="content_section">
            <h2>个人介绍</h2>
            <p>你好，我是画风（huafeng），一个普通人，对于编程和设计有一定涉猎</p>
        </div>
        <div class="content_section">
            <h2>所在地：青岛</h2>
            <p>
                青岛地处黄海之滨、山东半岛南部，是中国北方一座富有人文魅力、自然禀赋优越的沿海开放城市
            </p>
            <p>
                位于东经119°30′～121°00′、北纬35°35′～37°09′，全市总面积为11293平方千米
            </p>

        </div>
        <div class="content_section">
            <h2>联系方式</h2>
            <div class="contact_list">
                <a href="mailto:jzwbuer@163.com" class="contact_item">
                    <svg class="icon" aria-hidden="true" >
                        <use href="#icon-weibiaoti554"></use>
                    </svg>
                    <span>Email</span>
                </a>
                <a href="https://github.com/maohuifei" target="_blank" class="contact_item">
                    <svg class="icon" aria-hidden="true">
                        <use href="#icon-github"></use>
                    </svg>
                    <span>GitHub</span>
                </a>
                <div class="contact_item qrcode-container">
                    <svg class="icon" aria-hidden="true">
                        <use href="#icon-weixin1"></use>
                    </svg>
                    <span>WeChat</span>
                    <div class="qrcode">
                        <img src="/weixin.jpg" alt="WeChat QR Code">
                    </div>
                </div>
                <div class="contact_item qrcode-container" @click="XClick">
                    <svg class="icon" aria-hidden="true">
                        <use href="#icon-yooxi"></use>
                    </svg>
                    <span>X</span>
                </div>

            </div>
        </div>
        <div class="content_section">
            <h2>我参与的项目</h2>
            <div class="project_cards">
                <div class="project_card">
                    <svg class="project_icon" aria-hidden="true">
                        <use href="#icon-xiangmu"></use>
                    </svg>
                    <h3>huafengWeb</h3>
                    <p>本站github开源地址，欢迎访问</p>
                    <a href="https://github.com/maohuifei/myWeb" class="project_link">前往查看</a>
                </div>
                <div class="project_card">
                    <svg class="project_icon" aria-hidden="true">
                        <use href="#icon-xiangmu"></use>
                    </svg>
                    <h3>青岛市北不可移动文物巡查</h3>
                    <p>该项目旨在对青岛市北区的不可移动文物进行巡查和保护，确保文化遗产的安全。</p>
                    <a href="https://www.baidu.com/" class="project_link">前往查看</a>
                </div>
                <div class="project_card">
                    <svg class="project_icon" aria-hidden="true">
                        <use href="#icon-xiangmu"></use>
                    </svg>
                    <h3>青岛自贸人才港</h3>
                    <p>青岛自贸人才港项目致力于吸引和培养高端人才，推动区域经济发展。</p>
                    <a href="https://www.baidu.com/" class="project_link">前往查看</a>
                </div>
            </div>
        </div>
    </div>
</template>

<!--
脚本部分 - 处理页面交互逻辑
1. 导入依赖:
   - vue-router: 用于页面导航
2. 方法:
   - XClick: 处理X(Twitter)图标点击，跳转到维护页面
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 处理联系方式点击
const XClick = () => {
    router.push('/maintenance')
}
</script>

<!--
样式部分 - 页面特定样式
1. about_box: 主容器样式
2. content_section: 内容区块样式
3. contact_list: 联系方式列表样式
   - contact_item: 单个联系方式样式
   - qrcode: 二维码容器样式
4. project_cards: 项目卡片区域样式
   - project_card: 单个项目卡片样式
   - project_link: 项目链接样式
-->
<style scoped lang="less">
.about_box {
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 20px 40px;

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

    .content_section {
        margin: 50px 0;
        padding: 35px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.4s ease;

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
            line-height: 1.8;
            color: #2c3e50;
            text-align: justify;
            letter-spacing: 0.6px;
            margin: 0 20px 20px;
        }

        .tech_list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 30px 20px;

            .tech_category {
                h3 {
                    font-size: 1.4em;
                    color: var(--systemColor);
                    margin-bottom: 15px;
                    font-weight: 500;
                }

                ul {
                    list-style: none;
                    padding: 0;

                    li {
                        font-size: 1.1em;
                        color: #2c3e50;
                        margin: 12px 0;
                        padding-left: 25px;
                        position: relative;

                        &::before {
                            content: '•';
                            position: absolute;
                            left: 0;
                            color: var(--systemColor);
                            font-size: 1.5em;
                            line-height: 1;
                        }
                    }
                }
            }
        }

        .project_cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 30px 20px;

            .project_card {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                transition: all 0.4s ease;
                padding: 30px;
                height: 100%;
                position: relative;

                .project_link {
                    display: inline-block;
                    padding: 10px 20px;
                    background: var(--systemColor);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.4s ease;
                    margin: auto auto 0 auto;
                    align-self: flex-end;
                    width: 40%;
                    text-align: center;
                }

                &:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }

                .project_icon {
                    width: 40px;
                    height: 40px;
                    margin-bottom: 20px;
                }

                h3 {
                    font-size: 1.4em;
                    color: var(--systemColor);
                    margin-bottom: 15px;
                    font-weight: 500;
                }

                p {
                    font-size: 1.1em;
                    color: #2c3e50;
                    margin: 0 0 20px;
                }

                .project_link {
                    display: inline-block;
                    padding: 10px 20px;
                    background: var(--systemColor);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.4s ease;

                    &:hover {
                        background: var(--systemColor);
                        color: white;
                    }
                }
            }
        }

        .contact_list {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 35px;
            flex-wrap: wrap;

            .contact_item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 30px;
                border: 2.5px solid var(--systemColor);
                border-radius: 12px;
                text-decoration: none;
                color: var(--systemColor);
                transition: all 0.4s ease;
                background: transparent;
                position: relative;
                overflow: visible;
                cursor: pointer;

                .icon {
                    width: 24px;
                    height: 24px;
                    transition: all 0.3s ease;
                }

                &:hover {
                    color: white;
                    background-color: black;
                }

                &.qrcode-container {
                    .qrcode {
                        position: absolute;
                        bottom: calc(100% + 15px);
                        left: 50%;
                        transform: translateX(-50%) scale(0);
                        background: white;
                        padding: 10px;
                        border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                        transition: all 0.3s ease;
                        opacity: 0;
                        z-index: 100;
                        pointer-events: none;

                        img {
                            width: 150px;
                            height: 150px;
                            display: block;
                        }

                        &::after {
                            content: '';
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            border-width: 8px;
                            border-style: solid;
                            border-color: white transparent transparent transparent;
                        }
                    }

                    &:hover .qrcode {
                        transform: translateX(-50%) scale(1);
                        opacity: 1;
                    }
                }

                span {
                    font-size: 1.1em;
                    font-weight: 500;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .about_box {
        padding: 60px 15px 30px;

        h1 {
            font-size: 2.2em;
        }

        .content_section {
            padding: 25px;
            margin: 30px 0;

            .contact_list {
                gap: 20px;

                .contact_item {
                    padding: 12px 20px;
                }
            }
        }
    }
}
</style>