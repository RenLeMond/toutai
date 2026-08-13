![投胎模拟器](./images/banner.png)

**项目网站**：https://toutai.online/

投胎模拟器：如果来世再投一次，你会出生在哪里？

顶部可在三个版本间切换：

- **[中国版](https://toutai.online/)**：按最新出生人口数据，模拟省份、性别、城乡与孩次
- **[世界版](https://toutai.online/world)**：按世界银行全球出生人口，模拟国家与大洲
- **[王朝版](https://toutai.online/dynasty)**：按国祚 × 代表人口加权，抽取秦至清 13 朝与 6 阶身份，收集图鉴

### 数据来源

**中国版**

- 中国大陆：[第七次人口普查](https://www.stats.gov.cn/sj/pcsj/rkpc/7rp/zk/indexch.htm)（2019.11.1 - 2020.10.31）
- 香港特别行政区：[香港政府统计处](https://www.censtatd.gov.hk/tc/web_table.html?id=3)（2023）
- 澳门特别行政区：[统计暨普查局](https://www.dsec.gov.mo/zh-MO/Statistic?id=101)（2023）
- 台湾地区：[人口统计资料](https://www.ris.gov.tw/app/portal/346)（2023）

**世界版**

- [世界银行](https://data.worldbank.org/) 2024 年人口与粗出生率统计

**王朝版**

- 秦至清 13 朝 × 6 阶示意性历史分层模型，按「国祚 × 代表人口」加权；非人口普查数据，仅供娱乐

### 开发

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- 部署：[Cloudflare Pages](https://pages.cloudflare.com/)（静态导出）

```bash
npm install
npm run build:themes
npm run build
```

### 致谢

- 灵感来源：[uahh.site/reborn](https://uahh.site/reborn)
- 上游项目：[hahahumble/rebirth](https://github.com/hahahumble/rebirth)
