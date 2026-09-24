# 开发说明

## 结构

|          位置           |                   职责                   |
|:---------------------:|:--------------------------------------:|
|    `src/content/`     | 构建期读取 `src/activity/**` 的 markdown，推算阶段与排序 |
|  `src/components/`   |      页眉、页脚、时间轴、卡流、明信片、弹窗等组件      |
|    `src/stores/`     |   pinia：主题、布局（手机 / 减弱动效）、卡流聚焦   |
| `src/assets/mixins.less` | 混入，经 Vite 注入每个组件，本身不产出 CSS |
|  `src/assets/main.less`  | 色板、字体、全局规则，只由 `main.ts` 引入一次 |
|  `src/glint.ts`   |        `v-glint`：悬停或按下时播放一次渐变动效        |

## 约定

- 状态放 pinia，浏览器能力走 VueUse，不手写 `matchMedia`、`localStorage` 与事件解绑。
- 样式写在组件内的嵌套规则里，媒体查询跟着规则走，断点用区间语法 `(width < 768px)`。
- 主题：首访跟随 `prefers-color-scheme`，手动切换后写入 `data-theme` 并持久化。
- 色板沿用另一个私人项目「时枪」的通用方案，未用到的色值是有意保留的。
- 选择器只作用于 class 与 id，不写裸标签选择器，免得影响 markdown 与嵌入的 HTML。

## 分支

`main` 为开发分支。`./publish-page.sh` 把已推送的 `main` 快进到 `release`，CI 随即部署到 `gh-pages`；不能快进时脚本直接失败。

## 待验证

1. 手机与平板旋转屏幕后，主题开关与两栏标题的位置是否稳定。
2. 宽度小于 456px 时的布局是否还需收紧。
