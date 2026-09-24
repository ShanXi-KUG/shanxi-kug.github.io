[简体中文](./README.md) | **English**

<p align="center">
  <a href="https://shanxi-kug.github.io/"><img src="https://github.com/user-attachments/assets/d651ddbd-5bd4-49c5-b9dd-3821b46959b4" width="460" alt="ShanXi Kotlin User Group"></a>
</p>

<h3 align="center">ShanXi Kotlin User Group · Events</h3>

<p align="center">Learn Kotlin together, online and offline. One markdown file publishes an event.</p>

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
  <a href="https://shanxi-kug.github.io/"><b>Website</b></a> ·
  <a href="./docs/维护指南.md"><b>Maintainer guide (zh)</b></a> ·
  <a href="./docs/模板/活动目录名"><b>Event template</b></a> ·
  <a href="https://kotlinlang.org/docs/home.html"><b>Kotlin docs</b></a>
</p>

## Publish an event

1. Copy `docs/模板/活动目录名/` into `src/activity/new/`; name the directory freely.
2. Fill in `card.md`; delete files you don't need.
3. Open a PR; merge once the check passes.

```yaml
---
title: Kotlin Meetup
enroll: ["2026-09-20T00:00:00+08:00", "2026-10-16T23:59:59+08:00"]
during: ["2026-10-18T19:00:00+08:00", "2026-10-18T21:30:00+08:00"]
venue: Taiyuan University of Technology
online:
  - ["Bilibili live", "https://live.bilibili.com/"]
action: "[Sign up!](https://signup-link)"
---
```

## Layout

```
src/activity/
├─ new/                    enrolling, ongoing
│  └─ 2026-10-kotlin-share/
│     ├─ card.md           required, card front
│     ├─ detail.md         body
│     ├─ signup.md         sign-up notes
│     ├─ back.md           card back
│     └─ assets/           images, slides, videos
└─ history/                finished
   └─ 2026-03-kotlin-conf-global/
      ├─ card.md
      └─ recap.md          recap, replaces detail.md
```

## Fields

|  Field   | Required |               Meaning               |
|:--------:|:--------:|:-----------------------------------:|
| `title`  |   yes    |             Event name              |
| `during` |   yes    |    Event span `["start", "end"]`    |
| `enroll` |    no    |       Sign-up span, same format       |
| `weight` |    no    |    Sort weight, default 50, higher first    |
|   `sp`   |    no    |   Sort across sections, default off   |
| `venue`  |    no    |            Offline venue            |
| `online` |    no    |    Online channel `["label", "link"]`    |
| `action` |    no    | Button `[text](link)`; no link if omitted |

## Status

Derived from `enroll` and `during`; to postpone, change `during` only.

|        Time        |  Status   |      Timeline dot      |
|:------------------:|:---------:|:----------------------:|
|    in `enroll`     | Enrolling | ripples moving inward  |
|  sign-up closed to start  |  Ongoing  |       plain ring       |
|    in `during`     |  Ongoing  | ripples moving outward |
|   after `during`   | Finished  | grey, semi-transparent |

Finished events move to the history section automatically; moving the directory to `history/` is only archiving.

## Ordering

Sorted by `weight`, descending, within a section. `sp: true` sorts across sections, so a finished event can return to the upcoming section; it stops before the first event with a lower weight.

## Development

<a href="https://github.com/ShanXi-KUG/shanxi-kug.github.io/actions/workflows/check-content.yaml"><img alt="content" src="https://img.shields.io/github/actions/workflow/status/ShanXi-KUG/shanxi-kug.github.io/check-content.yaml?branch=main&style=flat-square&labelColor=161B08&label=content&logo=githubactions&logoColor=white"></a>

```bash
npm install
npm run dev
node scripts/check-content.mjs
npm run build
```

Develop on `main`; `./publish-page.sh` fast-forwards `release`, which deploys.

|    Workflow    |           Trigger            |                Job                |
|:--------------:|:----------------------------:|:---------------------------------:|
| Build & deploy |      push to `release`       |      Deploy to GitHub Pages       |
| Content check  | changes in `src/activity/` | Check fields, dates and assets |
|   Dep bump    |     1st and 16th monthly     | Bump npm deps and Actions, open a PR if green |

## Contact

|                           Mail                            |                                               WeChat                                               |                   GitHub                    |
|:---------------------------------------------------------:|:--------------------------------------------------------------------------------------------------:|:-------------------------------------------:|
| [chengkelfanke@gmail.com](mailto:chengkelfanke@gmail.com) | [Scan the QR code](https://github.com/user-attachments/assets/5ba49f32-05ef-473a-b0df-a95efe3d0d61) | [ShanXi-KUG](https://github.com/ShanXi-KUG) |

## License

[MIT](./LICENSE) © 2024 China ShanXi Kotlin User Group
