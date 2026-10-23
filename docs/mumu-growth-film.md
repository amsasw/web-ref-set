# 步行成长短片

现有角色共八个。新增五个角色均由内置 image_gen 生成独立 RGBA 步行图集，再用现有 Canvas 时间轴制作四阶段成长短片，每段 28 秒、960×540、24 fps。年龄变化是创意角色演绎。

| 角色 | 标识 | 场景 | 视频 | 原图与完整提示词 |
| --- | --- | --- | --- | --- |
| 纳西妲 | nahida | 森林萤光 | [MP4](../assets/mumu-nahida-growing-up.mp4) | [PNG](../assets/mumu-nahida-sheet.png) / [提示词](../assets/mumu-nahida-sheet.prompt.md) |
| 可莉 | klee | 暖色草地 | [MP4](../assets/mumu-klee-growing-up.mp4) | [PNG](../assets/mumu-klee-sheet.png) / [提示词](../assets/mumu-klee-sheet.prompt.md) |
| 甘雨 | ganyu | 雪山飘雪 | [MP4](../assets/mumu-ganyu-growing-up.mp4) | [PNG](../assets/mumu-ganyu-sheet.png) / [提示词](../assets/mumu-ganyu-sheet.prompt.md) |
| 珊瑚宫心海 | kokomi | 海底水母 | [MP4](../assets/mumu-kokomi-growing-up.mp4) | [PNG](../assets/mumu-kokomi-sheet.png) / [提示词](../assets/mumu-kokomi-sheet.prompt.md) |
| 月亮公主 | moon | 月夜星光 | [MP4](../assets/mumu-moon-growing-up.mp4) | [PNG](../assets/mumu-moon-sheet.png) / [提示词](../assets/mumu-moon-sheet.prompt.md) |

重导出：`node tests/export-growth-film.cjs 标识`。全角色交互回归：`node tests/growth-film.cjs`。新增角色 20 个阶段截图及五个视频元数据检查：`node tests/review-new-cast.cjs`。页面支持 `?character=nahida#feeding` 等直接定位角色。

新增芙宁娜角色（银白蓝发、礼帽、蓝白戏剧服装），默认显示最新角色；页面提供三个角色切换。素材与提示词为 `assets/mumu-furina-sheet.png` 和 `assets/mumu-furina-sheet.prompt.md`。视频为 `assets/mumu-furina-growing-up.mp4`，可用 `node tests/export-growth-film.cjs furina` 重导出。

新增金发公主角色，默认展示公主，可通过页面按钮切回棕发女孩；切换保留当前进度与播放状态。公主素材为 `assets/mumu-princess-sheet.png`，提示词保存在同名 `.prompt.md` 中。独立视频为 `assets/mumu-princess-growing-up.mp4`；运行 `node tests/export-growth-film.cjs princess` 重新导出，原角色使用参数 `original`。

页面：`milk_formula_theme.html#feeding`。视频：`assets/mumu-growing-up.mp4`，28 秒，960×540，24 fps，H.264，无音轨。

同一棕发女孩朝右步行，依次呈现幼儿、儿童、少女与成年形态，每阶段保留奶瓶或奶杯。背景分层后移，角色脚底保持在同一基线，成长交接持续 1.2 秒，使用同一步伐相位进行缩放和透明度过渡。每阶段 4 帧、每秒 7 帧；这是二维角色动画，人物局部动作来自生成的步行帧。

生成原图：`assets/mumu-walk-sheet.png`（1254×1254，RGBA）。提示词：`assets/mumu-walk-sheet.prompt.md`。原图排列并非精确网格，因此逐帧测量有效区域；裁剪矩形存于 `assets/mumu-walk.js` 的 `frames`。角色以脚底中心为锚点，无碰撞逻辑。

播放使用浏览器 Canvas 与 requestAnimationFrame；暂停、拖动、后台标签页与减少动态效果设置均受支持。没有安装额外前端依赖。

验证：`node tests/growth-film.cjs`。重新导出：先启动 8010 端口的静态服务器，再运行 `node tests/export-growth-film.cjs`；需要本机 Playwright、Edge 和 FFmpeg。导出脚本逐帧渲染同一 Canvas，直接送入 FFmpeg 编码。
