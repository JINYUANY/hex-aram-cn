# 海克斯战局 · 国服海克斯大乱斗图鉴

**[直接打开在线版](https://jinyuany.github.io/hex-aram-cn/) · [下载免安装版 ZIP](https://github.com/JINYUANY/hex-aram-cn/raw/refs/heads/main/hex-aram-cn.zip)**

解压后双击 **海克斯战局.html**，即可在电脑浏览器里查英雄、海克斯和装备。下载和使用都免登录。可将这个页面或 ZIP 直接分享给朋友。

- **英雄**　查出场、胜率和技能，按名称、简称或拼音搜索。点英雄预览，再点一次进入专属海克斯库。
- **海克斯**　查图标、效果、英雄持有率和技能键位；可区分官方实例、实战记录、文字条件和历史修复。
- **装备与搭配**　查装备属性、合成、普通装备胜率和三件套。多枚强化共现只展示有来源的实测场数。
- **更新**　离线使用内置样本，联网时尝试检查腾讯公告、AramHex 普通模式和 ARAMGG 公开清单。浏览器跨域或网络限制会影响个别来源，页面保留最近的有效结果并标注时间。关闭文件后停止检查。

软件也会自动检查更新。打开下载版、恢复联网、回到页面或页面可见满五分钟时，发现更新会在浏览器中打开最新公开版。磁盘上的 HTML 保留作离线副本；要把新版留在本地，可重新下载 ZIP。

## 资料和版权

[AramHex 国服统计](https://github.com/czgreat/aramhex-data) 按 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans) 开放，需署名并限非商业使用。本站整理排行榜、换算比例，保留版本、样本量和数据截止时间。英雄技能及图像来自 [Riot Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) 和 [CommunityDragon](https://raw.communitydragon.org/)。海克斯胜率受 [Riot 游戏政策](https://developer.riotgames.com/docs/lol#game-policy) 限制。

海克斯战局 is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

## 开发和自托管

[下载项目源文件](https://github.com/JINYUANY/hex-aram-cn/raw/refs/heads/main/hex-aram-cn-source.zip)。使用 Node.js 22 或以上版本运行 `node server.mjs`，打开 http://127.0.0.1:4187 。无需安装 npm 依赖。自托管版可以在服务端用环境变量 `ARAMGG_API_KEY` 接入有授权的英雄榜与三枚组合。密钥只配置在服务端。

运行 `node --test test/*.test.mjs` 检查统计逻辑。`node scripts/build-download.mjs` 构建单文件 HTML，再运行 `python3 scripts/package-download.py` 制作 ZIP，并生成位于 dist/publish 的完整发布文件。同步提交该目录的内容到公开仓库 main 分支根目录，由 GitHub Pages 发布。
