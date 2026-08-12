![banner.png](images%2Fbanner.png)

**项目网站**：https://toutai.online/

本项目根据公布的最新出生人口数据，同时包括了性别，计算出生在某地区的可能性。

### 数据来源

- 中国大陆：[第七次人口普查](https://www.stats.gov.cn/sj/pcsj/rkpc/7rp/zk/indexch.htm)（2019.11.1 - 2020.10.31）
- 香港特别行政区：[香港政府统计处](https://www.censtatd.gov.hk/tc/web_table.html?id=3)（2023）
- 澳门特别行政区：[统计暨普查局](https://www.dsec.gov.mo/zh-MO/Statistic?id=101)（2023）
- 台湾地区：[人口统计资料](https://www.ris.gov.tw/app/portal/346)（2023）

### 开发

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- 部署：[Cloudflare Pages](https://pages.cloudflare.com/)（静态导出）

```bash
npm install
npm run build:themes
npm run build
```

### 环境变量（可选）

复制 `.env.example` 为 `.env.local` 并填写：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 发布商 ID |
| `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense 广告位 ID |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics Token |

### 致谢

- 灵感来源：[uahh.site/reborn](https://uahh.site/reborn)
- 上游项目：[hahahumble/rebirth](https://github.com/hahahumble/rebirth)
