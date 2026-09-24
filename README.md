**简体中文** | [English](./README.en.md)

<p align="center">
  <a href="https://shanxi-kug.github.io/"><img src="https://github.com/user-attachments/assets/d651ddbd-5bd4-49c5-b9dd-3821b46959b4" width="460" alt="ShanXi Kotlin User Group"></a>
</p>

<h3 align="center">山西 Kotlin 用户组 · 活动主页</h3>

<p align="center">一起学习 Kotlin，参与线上线下活动。发布活动只需一份 markdown。</p>

<p align="center">
  <a href="https://shanxi-kug.github.io/"><img alt="site" src="https://img.shields.io/website?url=https%3A%2F%2Fshanxi-kug.github.io&style=flat-square&label=site&labelColor=161B08&up_color=844EFE&up_message=online&logo=kotlin&logoColor=white"></a>
  <a href="https://github.com/ShanXi-KUG/shanxi-kug.github.io/graphs/contributors"><img alt="contributors" src="https://img.shields.io/github/contributors/ShanXi-KUG/shanxi-kug.github.io?style=flat-square&labelColor=161B08&color=9D4ADC&logo=github&logoColor=white"></a>
  <a href="https://github.com/ShanXi-KUG/shanxi-kug.github.io/commits"><img alt="commits" src="https://img.shields.io/github/commit-activity/m/ShanXi-KUG/shanxi-kug.github.io?style=flat-square&labelColor=161B08&color=B646BA&logo=git&logoColor=white"></a>
  <a href="https://github.com/ShanXi-KUG/shanxi-kug.github.io/issues"><img alt="issues" src="https://img.shields.io/github/issues/ShanXi-KUG/shanxi-kug.github.io?style=flat-square&labelColor=161B08&color=D04197&logo=github&logoColor=white"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/github/license/ShanXi-KUG/shanxi-kug.github.io?style=flat-square&labelColor=161B08&color=E93D75&logo=opensourceinitiative&logoColor=white"></a>
</p>

<p align="center">
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3.5-844EFE?style=flat-square&logo=vuedotjs&logoColor=white&labelColor=161B08">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-984BE3?style=flat-square&logo=vite&logoColor=white&labelColor=161B08">
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-4-AC47C7?style=flat-square&logo=pinia&logoColor=white&labelColor=161B08">
  <img alt="VueUse" src="https://img.shields.io/badge/VueUse-15-C144AC?style=flat-square&logo=vueuse&logoColor=white&labelColor=161B08">
  <img alt="Less" src="https://img.shields.io/badge/Less-4-D54090?style=flat-square&logo=less&logoColor=white&labelColor=161B08">
  <img alt="Pug" src="https://img.shields.io/badge/Pug-3-E93D75?style=flat-square&logo=pug&logoColor=white&labelColor=161B08">
</p>

<p align="center">
  <a href="https://shanxi-kug.github.io/"><b>访问主页</b></a> ·
  <a href="./docs/维护指南.md"><b>维护指南</b></a> ·
  <a href="./docs/模板/活动目录名"><b>活动模板</b></a> ·
  <a href="https://kotlinlang.org/docs/home.html"><b>Kotlin 文档</b></a>
</p>

## 发布活动

1. 复制 `docs/模板/活动目录名/` 到 `src/activity/new/`，目录名随意。
2. 填写 `card.md`，删掉用不到的文件。
3. 提交 PR，检查通过即可合入。

```yaml
---
title: Kotlin 分享会
enroll: ["2026-09-20T00:00:00+08:00", "2026-10-16T23:59:59+08:00"]
during: ["2026-10-18T19:00:00+08:00", "2026-10-18T21:30:00+08:00"]
venue: 太原理工大学明向校区
online:
  - ["哔哩哔哩直播间", "https://live.bilibili.com/"]
action: "[点我报名!](https://报名链接)"
---
```

## 目录

```
src/activity/
├─ new/                    报名中、进行中
│  └─ 2026-10-kotlin-share/
│     ├─ card.md           必需，卡片正面
│     ├─ detail.md         正文
│     ├─ signup.md         报名须知
│     ├─ back.md           卡背
│     └─ assets/           图片、PPT、视频
└─ history/                已结束
   └─ 2026-03-kotlin-conf-global/
      ├─ card.md
      └─ recap.md          回顾，替代 detail.md
```

## 字段

|    字段    | 必填 |           说明            |
|:--------:|:--:|:-----------------------:|
| `title`  | 是  |          活动名称           |
| `during` | 是  |  活动起止 `["开始", "结束"]`  |
| `enroll` | 否  |        报名起止，写法同上        |
| `weight` | 否  |     排序权重，默认 50，大者在前     |
|   `sp`   | 否  |       跨栏参与排序，默认否        |
| `venue`  | 否  |          线下地点           |
| `online` | 否  |   线上渠道 `["文字", "链接"]`   |
| `action` | 否  |  按钮 `[文字](链接)`，不填则不跳转  |

## 阶段

由 `enroll` 与 `during` 自动推算，延期只改 `during`。

|        时间        |  阶段  |   时间轴圆点   |
|:----------------:|:----:|:---------:|
|    `enroll` 内     | 报名中  |  向内聚集的涟漪  |
|    报名截止至开场     | 进行中  |    纯圆环    |
|    `during` 内     | 进行中  |  向外发散的涟漪  |
|    `during` 之后    | 已结束  |   灰色半透明   |

结束后自动归入历史栏，移到 `history/` 仅为归档。

## 排序

同栏按 `weight` 降序。`sp: true` 让活动跨栏比较，已结束的活动可借此回到最新活动栏，停在第一个权重比它小的活动之前。

## 开发

<a href="https://github.com/ShanXi-KUG/shanxi-kug.github.io/actions/workflows/check-content.yaml"><img alt="content" src="https://img.shields.io/github/actions/workflow/status/ShanXi-KUG/shanxi-kug.github.io/check-content.yaml?branch=main&style=flat-square&labelColor=161B08&label=content&logo=githubactions&logoColor=white"></a>

```bash
npm install
npm run dev
node scripts/check-content.mjs
npm run build
```

`main` 开发，`./publish-page.sh` 快进到 `release` 后自动部署。

|  流水线  |          触发           |          职责          |
|:-----:|:---------------------:|:--------------------:|
| 构建发布  |    push 到 `release`    |   部署到 GitHub Pages   |
| 内容检查  | 改动 `src/activity/` | 校验字段、日期与资料引用 |
| 依赖巡检  |    每月 1 日、16 日    | 升级 npm 依赖与 Actions，构建通过则开 PR |

## 联系我们

|                                   QQ                                    |                                            微信                                            |                     邮箱                     |                     GitHub                     |
|:-----------------------------------------------------------------------:|:----------------------------------------------------------------------------------------:|:------------------------------------------:|:----------------------------------------------:|
| [3222087513](https://wpa.qq.com/msgrd?v=3&uin=3222087513&site=qq&menu=yes) | [扫码添加](https://github.com/user-attachments/assets/b160b5ac-5c99-42f3-9bfa-491bd00941d1) | [chengkelfan@qq.com](mailto:chengkelfan@qq.com) | [ShanXi-KUG](https://github.com/ShanXi-KUG) |

## 许可

[MIT](./LICENSE) © 2024 China ShanXi Kotlin User Group
