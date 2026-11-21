# 海克斯战局维护手册

[返回玩家首页](README.md) · [线上查询页](https://jinyuany.github.io/hex-aram-cn/) · [查看采集运行](https://github.com/JINYUANY/hex-aram-cn/actions/workflows/sync-data.yml)

## 一次国服游戏更新的流程

| 内容 | 谁去检查 | 通过校验后 |
| --- | --- | --- |
| 腾讯公告、热修、模式平衡与具名供选规则 | 云端计划任务；自托管服务也可以直接采集 | 写入 `live-data.json`。用户打开页面或点同步后读取 |
| AramHex 新样本 | 查询页按上游发布清单取得固定批次 | 校验模式、版本、样本窗口与分母后替换统计。部分装备表可能沿用上一版 |
| 英雄、技能、装备、海克斯资料 | 数据适配器及浏览器按样本对应的版本取源 | 资料迟于样本时可在同一批次补齐；来源错误保留可核验的内容 |
| ARAMGG | 公开清单免密钥；授权榜单由维护者的服务请求 | 云端只发布经过校验的国服英雄统计。三强化明细由有密钥的自托管服务按需读取 |
| 程序功能或手工核对的专项资料 | 维护者发布程序及更新公告 | 在线页换新；使用旧 ZIP 的玩家可检查新版或重新下载 |

根目录为可直接发布的成品。项目源文件在 [源码 ZIP](https://github.com/JINYUANY/hex-aram-cn/raw/refs/heads/main/hex-aram-cn-source.zip) 内。游戏公告、新批次统计接入后能独立于程序版本更新。

## 云端采集与状态

GitHub Actions 工作流 `.github/workflows/sync-data.yml` 在 main 分支运行。每小时的第 7、22、37 和 52 分钟计划触发，更新源码包或工作流也会触发。手动重查请在 Actions 中打开 **Sync CN game data → Run workflow**。页面里的同步按钮读取已发布的公告快照，不能触发维护者的 GitHub 任务。

采集脚本检查腾讯公告、热修，维护分玩法的英雄平衡记录；有已配置的授权来源时一并读取。数据变化立即写入；仅检查时间变化时最多每四小时提交一次。遇到部分来源出错，工作流可先发布通过校验的内容，再用红色运行状态提示检查失败。手动点同步会同时核对 GitHub Raw 和 Contents 两个镜像，按公告版本、成功采集时间取较新的内容。热修链接暂时打不开时，其正文会标记待重试。核对 `live-data.json` 中的版本、各栏来源与时间，比只看提交时间准确。

| 现象 | 核查位置 |
| --- | --- |
| 腾讯已有新公告，页面仍为上版 | 检查 Actions 最近实际运行时间、腾讯公告目录和镜像的 `official.checkedAt` |
| 新公告到了，统计或装备仍是旧版 | 点「检查并同步游戏数据 → 查看逐项结果」，核对 AramHex 的批次和每张表的截止时间 |
| 一位英雄只有某一种模式的数值 | 检查英雄详情中的来源与版本；只保留能落实到英雄、模式、指标的证据 |
| 统计更新，部分图标或技能说明稍后才出现 | 检查对应版本的 Data Dragon 和 CommunityDragon；恢复联网后点同步重试 |
| ARAMGG 有新批次但无英雄榜 | 区分公开清单与授权样本，在 Actions 或自托管服务查看授权、额度和返回版本 |
| GitHub Pages 还是旧界面 | 确认 main 成品文件、Pages 部署状态，以及线上 `version.json` 的版本与构建标识 |

## 可选接口配置

公开版无需任何密钥。需要扩展时，只在可控服务端配置获得授权的来源。

- `ARAMGG_API_KEY` 放入 GitHub 仓库 **Settings → Secrets and variables → Actions → Secrets**，或自托管进程的同名环境变量。工作流发布获授权的英雄汇总，用户浏览器只读取公开快照。开发者自行向 ARAMGG 查询授权范围、配额及使用条款。[开发者入口](https://data.dtodo.cn/developer.html)
- `HERO_POOL_URL` 填在 Actions 的 **Variables** 或自托管环境。只接受有权公开的 HTTPS 规则数据，按国服、普通模式、精确客户端版本匹配。结构、必填来源及完整性校验见源码 `src/hero-pool.mjs` 与 `test/hero-pool.test.mjs`。空表可表达尚无证据。
- 自托管的已核验组合由 `src/augment-pairs.mjs` 校验。需要同英雄、同模式、同版本、实际同局的汇总场数和来源。持有次数、三枚组合子集不能替代精确两枚场数。

## 本地运行、测试和打包

解压源码，在包含 `package.json` 的目录运行。构建使用 Node.js 22 或更高版本和 Python 3。

```sh
node --test test/*.test.mjs
node scripts/build-download.mjs
python3 scripts/package-download.py
```

用浏览器打开 `dist/download/海克斯战局.html` 即可验收下载版。要运行有后端的本地服务，请执行 `node server.mjs`，然后打开 `http://127.0.0.1:4187/`。服务使用 `.cache/` 保存最近的有效数据。玩家下载的 ZIP 只需浏览器。

## 发布程序与维护公告

1. 改动程序时提高 `app-release.json` 中的版本号，在 `CHANGELOG.md` 顶部写入日期和玩家能感受到的变化。单独维护公告时可直接更新公开仓库的同名文件。
2. 跑测试并构建。确认在线版、下载版都能从英雄榜进入详情和搭配，离线也可查看内置样本；点击同步核对各张表的版本和来源。
3. 将 `dist/publish/` 的成品一起提交到公开仓库 main 根目录。程序、`version.json`、公告和两份 ZIP 应来自同一次构建。云端负责写入 `live-data.json`。
4. 在 GitHub Releases 给对应提交打版本标签，把 `hex-aram-cn.zip` 作为同名附件发布。首页的固定下载链接指向最新正式 Release 的该附件。
5. 在无登录浏览器检查在线页、下载附件和程序更新；在 Actions 核对 Pages 部署与云端数据采集各自的结果。

玩家只想获取新数据时，直接在原页面点游戏数据同步即可。需要新界面或新解析逻辑时，以新程序发布；磁盘上的旧 HTML 可由玩家重新下载替换。
