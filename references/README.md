# 产品展示参考作品

收录 **12 个参考作品**：牙膏与口腔方向 6 个，母婴方向 6 个。来源内容整理于 **2026-10-17**。

本地用浏览器打开 [index.html](index.html)，即可按主题筛选、搜索品牌或交互关键词。GitHub 文件页不执行 HTML，可以直接使用下方目录访问原站。

## 牙膏与口腔护理

| 作品与原站 | 产品类型 | 建议参考的风格 | 页面与交互借鉴 |
| --- | --- | --- | --- |
| [Marvis](https://www.marvis.com/en/) · [牙膏系列](https://www.marvis.com/en/toothpastes/) | 牙膏 | 复古艺术 | 彩色包装与品牌故事；页面提供引导、跳过引导和滚动提示，可借鉴图文分段呈现。 |
| [Boka — Flavors](https://www.boka.com/pages/flavors) | 牙膏口味系列 | 自然清新 | Mint / Fruity / Floral / Spiced 分类与产品图片；适合口味分组、柔和配色和质地特写。 |
| [Hismile — Toothpaste](https://uk.hismileteeth.com/products/toothpaste?rdr=1) | 西瓜味牙膏 | 年轻活力 | 产品图库、膏体展示、数量控件与加购入口；可借鉴色块、变体切换和购买反馈。 |
| [Bite — Toothpaste Bits](https://bitetoothpastebits.com/) | 牙膏片 | 环保简洁 | 产品卡片、购买选项和使用步骤；适合留白、图标和逐步解释使用流程。 |
| [DEW](https://www.framer.com/marketplace/templates/dew/) · [演示](https://dew-skincare.framer.website/) | 护肤单品 Framer 模板，跨品类参考 | 柔和高级 | 模板作者描述包含柔和入场、配方切换与滑出式购物袋；可借鉴奶油色与质地特写。 |
| [Essentia](https://www.framer.com/marketplace/templates/essentia/) · [演示](https://essentia.framer.media/) | 护肤单品 Framer 模板，跨品类参考 | 极简滚动叙事 | 模板作者描述包含固定产品、逐段特性展示和固定加购条；适合围绕同一单品解释细节。 |

## 母婴产品

| 作品与原站 | 产品类型 | 建议参考的风格 | 页面与交互借鉴 |
| --- | --- | --- | --- |
| [Mushie — Feeding](https://mushie.com/collections/feeding) | 餐盘、围兜、杯具与套装 | 奶油简约 | 柔和配色、产品分类与颜色选项；可借鉴材质展示、整齐网格和颜色切换。 |
| [Bubbsi](https://lovebubbsi.com/) | 婴幼儿护理、套装与补充装 | 童趣插画 | 圆润包装、笑脸插画、护理分类和轮播入口；适合轻盈的分类切换与步骤引导。 |
| [Pipette — Baby Shampoo + Wash](https://www.pipettebaby.com/products/shampoo-wash) | 婴幼儿洗护单品 | 自然柔和 | 产品选项、使用方法、成分介绍与常见问题；可借鉴产品信息的分层组织。 |
| [BabyBjörn](https://www.babybjorn.com/) | 婴儿背带与摇椅 | 温暖生活方式 | 家庭场景摄影、材质、颜色与比较入口；适合场景照片和产品近景结合。 |
| [Frida Mom — Kits & Gifts](https://frida.com/collections/frida-mom-kits-gifts) | 母婴套装与礼品 | 清晰功能 | 需求筛选、产品卡片和购买入口；可借鉴套装逐件展示与功能分组。 |
| [Nanit — Smart Baby Monitor](https://www.nanit.com/products/smart-baby-monitor) | 智能婴儿监视设备 | 现代科技 | 设备与应用界面、安装方式及套装选项；适合设备和界面联动展示。 |

## 收录口径

- 上述风格名称、配色与“可以借鉴”的动效是本项目的设计分析；不代表品牌的官方分类。
- 页面结构和可见控件来自公开页面内容。浏览页单独列出“来源记录”，明确哪些交互由模板作者描述，哪些原站动画尚未验证。
- DEW、Essentia 是护肤模板，作为牙膏单品展示的跨品类参考；仓库只收录链接和分析，不包含模板源码或授权。
- 卡片封面是文字与配色索引，不是原站截图。访问作品链接查看实际页面；页面可能因地区、时间或设备而变化。
- 选集关注产品展示、信息层级和交互，不收录产品功效结论。

## 维护与运行

| 文件 | 用途 |
| --- | --- |
| [catalog.js](catalog.js) | 作品数据：`id`、`topic`、`name`、`product`、`style`、`kind`、`colors`、`url`、`structure`、`evidence`、`idea`、`tags`；可选第二链接 `detailUrl` / `detailLabel`。 |
| [index.html](index.html) | 浏览页结构与作品卡片模板。 |
| [app.js](app.js) | 分类筛选、搜索、结果计数和卡片渲染。 |
| [styles.css](styles.css) | 响应式样式、键盘焦点与减少动态效果支持。 |

直接打开 `index.html`，或在仓库根目录执行 `python -m http.server 8000` 后访问 `http://localhost:8000/references/`。无需安装依赖或构建。

新增作品时同步更新 `catalog.js` 与本目录表格。`topic` 使用 `oral` 或 `baby`，`id` 保持唯一，`colors` 为背景色、文字色、强调色。作品条目用纯文本渲染；来源链接使用官方 HTTPS 地址。新增分类或改变总量时，同时更新浏览页导语与说明。

## 关联主题

- [Issue #1：固定内容跨风格对比](https://github.com/amsasw/web-ref-set/issues/1)
- [Issue #2：牙膏产品展示主题](https://github.com/amsasw/web-ref-set/issues/2)
- [Issue #3：母婴产品参考与主题候选](https://github.com/amsasw/web-ref-set/issues/3)

本次交付为参考作品目录与浏览入口。仓库已有 [清序 · 薄荷牙膏四风格交互原型](../toothpaste_theme_demo.html)，可体验固定产品的视图切换与并排对比；母婴主题继续在相关 issue 中推进。
