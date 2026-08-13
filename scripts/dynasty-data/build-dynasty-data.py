#!/usr/bin/env python3
"""Build dynasty JSON data from the Excel source workbook."""

from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT.parent / "秦至清王朝综合数据_完整版v4_修正版.xlsx"
OUT = ROOT / "app" / "_data"

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

CLASS_MERGE_INDICES = [
    [0],
    [1],
    [2],
    [3],
    [4, 5],
    [6, 7, 8],
]


def merge_class_defs(class_defs: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Keep name and description from the same source class (the first in the merge)."""
    merged: list[tuple[str, str]] = []
    for indices in CLASS_MERGE_INDICES:
        merged.append(class_defs[indices[0]])
    return merged


def merge_class_probs(probs_9: list[float]) -> list[float]:
    merged = []
    for indices in CLASS_MERGE_INDICES:
        merged.append(round(sum(probs_9[i] for i in indices), 6))
    return merged


DYNASTY_MERGE_GROUPS: dict[str, dict] = {
    "THREE_KINGDOMS": {
        "name": "三国",
        "source_ids": ["WEI", "SHU", "WU"],
        "capital": "洛阳",
        "founder": "曹丕",
        "feature": "魏蜀吴鼎立，英雄辈出，乱世争雄",
    },
    "JIN": {
        "name": "晋",
        "source_ids": ["WESTERN_JIN", "EASTERN_JIN"],
        "capital": "洛阳",
        "founder": "司马炎",
        "feature": "太康之治，八王之乱，永嘉南渡，衣冠南渡",
    },
    "SOUTHERN_NORTHERN": {
        "name": "南北朝",
        "source_ids": [
            "SONG_LIU",
            "QI",
            "LIANG",
            "CHEN",
            "NORTHERN_WEI",
            "EASTERN_WEI",
            "WESTERN_WEI",
            "NORTHERN_QI",
            "NORTHERN_ZHOU",
        ],
        "capital": "建康",
        "founder": "拓跋珪",
        "feature": "南北分裂，民族融合，均田制，文风鼎盛",
    },
    "SONG": {
        "name": "宋",
        "source_ids": ["NORTHERN_SONG", "SOUTHERN_SONG"],
        "capital": "开封",
        "founder": "赵匡胤",
        "feature": "杯酒释兵权，重文轻武，靖康南渡，偏安江南",
    },
}


DYNASTY_ID_MAP = {
    "秦": "QIN",
    "西汉": "WESTERN_HAN",
    "新": "XIN",
    "东汉": "EASTERN_HAN",
    "三国·魏": "WEI",
    "三国·蜀": "SHU",
    "三国·吴": "WU",
    "西晋": "WESTERN_JIN",
    "东晋": "EASTERN_JIN",
    "南朝·宋": "SONG_LIU",
    "南朝·齐": "QI",
    "南朝·梁": "LIANG",
    "南朝·陈": "CHEN",
    "北魏": "NORTHERN_WEI",
    "东魏": "EASTERN_WEI",
    "西魏": "WESTERN_WEI",
    "北齐": "NORTHERN_QI",
    "北周": "NORTHERN_ZHOU",
    "隋": "SUI",
    "唐": "TANG",
    "北宋": "NORTHERN_SONG",
    "南宋": "SOUTHERN_SONG",
    "元": "YUAN",
    "明": "MING",
    "清": "QING",
}

# Population share when splitting national totals (illustrative)
POP_SHARE = {
    "WEI": 0.45,
    "SHU": 0.15,
    "WU": 0.40,
    "WESTERN_JIN": 0.55,
    "EASTERN_JIN": 0.45,
    "SONG_LIU": 0.22,
    "QI": 0.18,
    "LIANG": 0.22,
    "CHEN": 0.18,
    "NORTHERN_WEI": 0.55,
    "EASTERN_WEI": 0.15,
    "WESTERN_WEI": 0.12,
    "NORTHERN_QI": 0.10,
    "NORTHERN_ZHOU": 0.08,
    "NORTHERN_SONG": 0.65,
    "SOUTHERN_SONG": 0.35,
}

CLASS_NAMES: dict[str, list[tuple[str, str]]] = {
    "QIN": [
        ("嬴姓宗室", "皇族血脉，享有最高特权。"),
        ("列侯封君", "军功封爵，食邑万户。"),
        ("公卿二千石", "三公九卿，掌中枢大权。"),
        ("军功爵户", "斩首授爵，免除部分徭役。"),
        ("编户齐民", "自耕农人，随时面临兵役与长城徭役。"),
        ("依附佃农", "租种豪强土地，人身依附。"),
        ("官工匠", "官府征发，修陵筑长城。"),
        ("贾人", "市井商贩，地位不高。"),
        ("刑徒奴婢", "服劳役修陵修长城，性命悬于一线。"),
    ],
    "WESTERN_HAN": [
        ("刘氏宗室", "汉室宗亲，封王封侯。"),
        ("列侯勋贵", "功臣封侯，食邑传家。"),
        ("公卿大夫", "三公九卿，经学入仕。"),
        ("地方豪强", "兼并土地，拥有部曲。"),
        ("编户自耕农", "承担算赋与口赋，抗灾能力微弱。"),
        ("佃客雇农", "租种地主土地，依附豪强。"),
        ("官营工匠", "盐铁官营体系下的手工业者。"),
        ("商贾富民", "丝绸之路上的贸易者。"),
        ("奴婢刑徒", "人身依附，可买卖。"),
    ],
    "XIN": [
        ("王莽宗室", "新朝皇族，托古改制核心。"),
        ("新朝列侯", "改制受益者，地位不稳。"),
        ("新朝官僚", "托古改制执行者。"),
        ("豪强地主", "抵制王田制，暗中兼并。"),
        ("编户农民", "改制下负担沉重。"),
        ("流民佃农", "绿林赤眉起义主力。"),
        ("官工匠", "五均六筦体系下的手工业者。"),
        ("市井商贩", "商业受管制。"),
        ("奴婢贱民", "可被买卖，地位最低。"),
    ],
    "EASTERN_HAN": [
        ("刘氏宗室", "汉室宗亲，多已衰落。"),
        ("外戚勋贵", "窦、梁、何、袁等世家。"),
        ("经学官僚", "察举制下的士大夫。"),
        ("州郡豪强", "兼并土地，拥有私人武装。"),
        ("编户自耕农", "承担赋役，抗灾能力弱。"),
        ("佃客部曲", "豪强私人附庸。"),
        ("官营工匠", "盐铁恢复官营。"),
        ("商贾豪富", "洛阳长安的富商。"),
        ("奴婢贱民", "可被买卖，地位卑微。"),
    ],
    "WEI": [
        ("曹氏宗室", "曹魏皇族，九品中正受益者。"),
        ("公侯勋贵", "曹魏开国功臣之后。"),
        ("九品官僚", "中正官评定，士族垄断。"),
        ("地方豪强", "拥兵自重，政治博弈剧烈。"),
        ("屯田民", "曹操屯田制下的自耕农。"),
        ("佃农部曲", "豪强私人附庸。"),
        ("官工匠", "兵器铠甲制造者。"),
        ("商贾", "乱世中谨慎经商。"),
        ("奴婢贱民", "可被买卖，地位最低。"),
    ],
    "SHU": [
        ("刘氏宗室", "汉室宗亲，刘备一脉。"),
        ("功臣勋贵", "关羽张飞之后，地位尊崇。"),
        ("丞相府僚", "诸葛亮治蜀的核心官僚。"),
        ("益州豪强", "本地士族，与荆州派博弈。"),
        ("屯田农户", "诸葛亮屯田制下的自耕农。"),
        ("佃客部曲", "豪强私人附庸。"),
        ("蜀锦工匠", "蜀汉重要手工业。"),
        ("市井商贩", "成都街市的商人。"),
        ("刑徒奴婢", "可被征发劳役。"),
    ],
    "WU": [
        ("孙氏宗室", "东吴皇族，开发江南。"),
        ("江东勋贵", "顾陆朱张等江东大族。"),
        ("东吴官僚", "经学入仕的士大夫。"),
        ("江南豪强", "开发江南的地方势力。"),
        ("自耕农户", "江南开发中的普通农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("造船工匠", "东吴水师依赖的工匠。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "可被买卖。"),
    ],
    "THREE_KINGDOMS": [
        ("宗室皇族", "魏蜀吴各有宗室，享有特权。"),
        ("公侯勋贵", "开国功臣封侯，食邑传家。"),
        ("官僚士族", "九品中正，士族垄断仕途。"),
        ("地方豪强", "拥兵自重，割据一方。"),
        ("屯田农户", "曹操屯田与江南自耕农。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("官工匠", "兵器铠甲与造船工匠。"),
        ("商贾", "乱世中谨慎经商。"),
        ("奴婢贱民", "可被买卖，地位最低。"),
    ],
    "WESTERN_JIN": [
        ("司马宗室", "晋室宗亲，八王之乱核心。"),
        ("公侯勋贵", "晋朝开国功臣。"),
        ("门阀士族", "上品无寒门，高门垄断。"),
        ("地方豪强", "兼并土地，拥兵自重。"),
        ("编户农民", "经八王之乱，人口锐减。"),
        ("佃客部曲", "豪强私人附庸。"),
        ("官工匠", "兵器铠甲制造者。"),
        ("商贾", "太康年间商业恢复。"),
        ("奴婢贱民", "五胡乱华中最为脆弱。"),
    ],
    "EASTERN_JIN": [
        ("司马宗室", "晋室南渡，偏安江南。"),
        ("侨姓士族", "王谢袁萧等南渡大族。"),
        ("门阀官僚", "王与马共天下。"),
        ("吴姓士族", "江南本地豪强。"),
        ("侨民农户", "南渡流民中的自耕农。"),
        ("佃客部曲", "依附士族的农民。"),
        ("工匠", "建康城的手工业者。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "可被买卖。"),
    ],
    "JIN": [
        ("司马宗室", "晋室宗亲，八王之乱与南渡核心。"),
        ("公侯勋贵", "晋朝开国功臣之后。"),
        ("门阀士族", "上品无寒门，侨姓吴姓共治。"),
        ("地方豪强", "兼并土地，拥兵自重。"),
        ("编户农户", "经战乱南渡，自耕与佃农并存。"),
        ("佃客部曲", "依附士族的农民。"),
        ("官工匠", "兵器铠甲与建康手工业者。"),
        ("商贾", "南北贸易者。"),
        ("奴婢贱民", "五胡乱华中最为脆弱。"),
    ],
    "SONG_LIU": [
        ("刘氏宗室", "刘宋皇族，宗室相残。"),
        ("公侯勋贵", "刘裕开国功臣。"),
        ("门阀官僚", "寒门崛起，士族衰落。"),
        ("地方豪强", "元嘉北伐中的地方势力。"),
        ("自耕农户", "江南开发中的农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("工匠", "建康城的手工业者。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "可被买卖。"),
    ],
    "QI": [
        ("萧氏宗室", "南齐皇族，永明之治。"),
        ("公侯勋贵", "萧道成开国功臣。"),
        ("门阀官僚", "竟陵八友等文学官僚。"),
        ("地方豪强", "江南本地势力。"),
        ("自耕农户", "永明之治下的农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("工匠", "建康城的手工业者。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "东昏侯暴政下的底层。"),
    ],
    "LIANG": [
        ("萧氏宗室", "南梁皇族，梁武帝崇佛。"),
        ("公侯勋贵", "萧衍开国功臣。"),
        ("门阀官僚", "崇佛佞佛的士大夫。"),
        ("地方豪强", "江南本地势力。"),
        ("自耕农户", "天监之治下的农民。"),
        ("佃农部曲", "侯景之乱前的农民。"),
        ("工匠", "佛寺营造的工匠。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "侯景之乱中的难民。"),
    ],
    "CHEN": [
        ("陈氏宗室", "南陈皇族，陈后主亡国。"),
        ("公侯勋贵", "陈霸先开国功臣。"),
        ("门阀官僚", "南朝最后的士大夫。"),
        ("地方豪强", "江南本地势力。"),
        ("自耕农户", "天嘉之治下的农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("工匠", "建康城的手工业者。"),
        ("商贾", "江南贸易者。"),
        ("奴婢贱民", "隋灭陈时的底层。"),
    ],
    "NORTHERN_WEI": [
        ("拓跋宗室", "北魏皇族，孝文帝汉化。"),
        ("鲜卑贵族", "八部大人之后，与汉士族通婚。"),
        ("汉化官僚", "孝文帝改革后的官僚。"),
        ("汉地豪强", "均田制下的地方势力。"),
        ("均田农户", "北魏均田制下的自耕农。"),
        ("佃客部曲", "依附豪强的农民。"),
        ("匠户", "云冈龙门石窟的工匠。"),
        ("商贾", "丝绸之路上的贸易者。"),
        ("营户奴婢", "军队世袭户，地位低下。"),
    ],
    "EASTERN_WEI": [
        ("元氏宗室", "东魏傀儡皇族。"),
        ("鲜卑贵族", "高欢集团的核心。"),
        ("官僚", "高欢专权下的官僚。"),
        ("地方豪强", "邺城周边的地方势力。"),
        ("自耕农户", "均田制下的农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("匠户", "邺城营造的工匠。"),
        ("商贾", "北方贸易者。"),
        ("奴婢贱民", "可被买卖。"),
    ],
    "WESTERN_WEI": [
        ("元氏宗室", "西魏傀儡皇族。"),
        ("关陇贵族", "宇文泰集团，府兵制创立者。"),
        ("官僚", "宇文泰改革下的官僚。"),
        ("地方豪强", "关中本地势力。"),
        ("府兵农户", "府兵制下的自耕农。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("匠户", "长安营造的工匠。"),
        ("商贾", "关中贸易者。"),
        ("奴婢贱民", "可被买卖。"),
    ],
    "NORTHERN_QI": [
        ("高氏宗室", "北齐皇族，后主荒淫。"),
        ("鲜卑贵族", "北齐核心统治集团。"),
        ("官僚", "北齐官僚体系。"),
        ("地方豪强", "邺城周边的地方势力。"),
        ("自耕农户", "均田制下的农民。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("匠户", "邺城营造的工匠。"),
        ("商贾", "北方贸易者。"),
        ("奴婢贱民", "胡汉矛盾下的底层。"),
    ],
    "NORTHERN_ZHOU": [
        ("宇文宗室", "北周皇族，武帝灭佛。"),
        ("关陇贵族", "府兵制核心集团。"),
        ("官僚", "北周改革下的官僚。"),
        ("地方豪强", "关中本地势力。"),
        ("府兵农户", "府兵制下的自耕农。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("匠户", "长安营造的工匠。"),
        ("商贾", "关中贸易者。"),
        ("奴婢贱民", "周武帝灭佛后的底层。"),
    ],
    "SOUTHERN_NORTHERN": [
        ("皇室宗室", "南朝宋齐梁陈与北朝皇族。"),
        ("鲜卑贵族", "北魏至北周的核心统治集团。"),
        ("门阀官僚", "南北士族共治朝堂。"),
        ("地方豪强", "江南与关陇的地方势力。"),
        ("均田农户", "北魏均田与江南自耕农。"),
        ("佃农部曲", "依附豪强的农民。"),
        ("匠户", "云冈龙门与建康营造工匠。"),
        ("商贾", "南北丝路与江南贸易者。"),
        ("营户贱民", "匠户奴婢，地位低下。"),
    ],
    "SUI": [
        ("杨氏宗室", "隋朝皇族，开皇之治。"),
        ("公侯勋贵", "隋朝开国功臣。"),
        ("科举官僚", "科举制初创的官僚。"),
        ("地方豪强", "大运河沿线的势力。"),
        ("编户农民", "均田制下的自耕农。"),
        ("佃农", "租种地主土地。"),
        ("匠户", "大运河营造的工匠。"),
        ("商贾", "丝绸之路上的贸易者。"),
        ("奴婢贱民", "隋末起义中的底层。"),
    ],
    "TANG": [
        ("李唐宗室", "五姓七望与李唐宗室，极具名望。"),
        ("五姓七望", "关陇贵族，门第最高。"),
        ("科举士大夫", "进士及第，朝堂新贵。"),
        ("形势户藩镇", "掌兵一方，朝堂新贵。"),
        ("均田农户", "长安洛阳均田农户，生活相对平稳。"),
        ("客户佃农", "租种土地，负担租税。"),
        ("番匠", "官府征发的手工业者。"),
        ("坊市商人", "长安洛阳的市井商贩。"),
        ("部曲杂户", "人身依附，不得参加科举。"),
    ],
    "NORTHERN_SONG": [
        ("赵氏宗室", "北宋皇族，杯酒释兵权后。"),
        ("公侯勋贵", "开国功臣之后。"),
        ("科举士大夫", "重文轻武，科举正途。"),
        ("乡村主户", "上等主户，资产雄厚。"),
        ("乡村客户", "佃农，租种土地。"),
        ("雇农", "无地流民，打零工为生。"),
        ("工匠", "汴京的手工业者。"),
        ("坊郭富民", "城关商贾，资产雄厚。"),
        ("禁军厢军", "刺字招募入军，地位不高。"),
    ],
    "SOUTHERN_SONG": [
        ("赵氏宗室", "南宋皇族，偏安江南。"),
        ("公侯勋贵", "南渡后的勋贵。"),
        ("科举士大夫", "朱熹理学下的官僚。"),
        ("乡绅地主", "江南本地士绅。"),
        ("自耕农户", "江南水田区的农民。"),
        ("佃农", "租种地主土地。"),
        ("工匠", "临安城的手工业者。"),
        ("商贾", "海上贸易者。"),
        ("贱役流民", "靖康之变后的难民。"),
    ],
    "SONG": [
        ("赵氏宗室", "两宋皇族，杯酒释兵权后。"),
        ("公侯勋贵", "开国功臣与南渡勋贵。"),
        ("科举士大夫", "重文轻武，科举正途。"),
        ("乡绅主户", "汴京与江南的上等户。"),
        ("乡村客户", "佃农，租种土地。"),
        ("雇农", "无地流民，打零工为生。"),
        ("工匠", "汴京临安的手工业者。"),
        ("坊郭商贾", "城关商贾与海上贸易者。"),
        ("禁军贱役", "刺字招募入军，地位不高。"),
    ],
    "YUAN": [
        ("黄金家族", "蒙古皇族，享最高特权。"),
        ("蒙古色目贵胄", "一二等民，政治经济特权。"),
        ("汉人世侯", "降将之后的汉地贵族。"),
        ("汉地士绅", "地方汉地地主。"),
        ("汉南平民", "三四等民，赋税沉重。"),
        ("佃农", "租种地主土地。"),
        ("世袭匠户", "专供官府打铁造物。"),
        ("回回商人", "色目人中的商业群体。"),
        ("驱口奴婢", "战争俘虏，沦为奴隶。"),
    ],
    "MING": [
        ("朱氏宗室", "朱氏宗室，享国家供养。"),
        ("勋贵功臣", "开国功臣之后，铁券护身。"),
        ("科举绅衿", "考取功名，免役免税。"),
        ("缙绅地主", "地方上有功名、有田产者。"),
        ("世袭民户", "普通民籍自耕农。"),
        ("佃农", "租种地主土地。"),
        ("匠户", "世袭匠籍，供官府造作。"),
        ("商贾", "徽晋商贾，资产雄厚。"),
        ("军户贱籍", "卫所世袭，军饷屡遭扣剥。"),
    ],
    "QING": [
        ("爱新觉罗宗室", "宗室贵胄，享有铁杆花生米钱粮。"),
        ("满洲八旗王公", "满洲蒙古八旗上层。"),
        ("汉人官绅", "总督巡抚或地方士绅。"),
        ("缙绅地主", "地方上有田产有影响力者。"),
        ("自耕旗民", "编入八旗兵额或汉民自耕农。"),
        ("佃户", "租种地主土地。"),
        ("匠役", "供官府造作的手工业者。"),
        ("商贾买办", "十三行巨商票号东家。"),
        ("乐户雇工", "无地流民与伴当，处于最底层。"),
    ],
}


def col_row(ref: str):
    m = re.match(r"([A-Z]+)(\d+)", ref)
    return m.group(1), int(m.group(2))


def cell_val(c):
    t = c.attrib.get("t")
    if t == "inlineStr":
        return "".join(x.text or "" for x in c.iter(f"{NS}t"))
    v = c.find(f"{NS}v")
    if v is None or v.text is None:
        return None
    if t == "n" or t is None:
        try:
            num = float(v.text)
            return int(num) if num.is_integer() else num
        except ValueError:
            return v.text
    return v.text


def load_sheet(z, index: int):
    root = ET.fromstring(z.read(f"xl/worksheets/sheet{index}.xml"))
    rows = {}
    for row in root.find(f"{NS}sheetData"):
        r = int(row.attrib["r"])
        rows[r] = {}
        for c in row.findall(f"{NS}c"):
            col, _ = col_row(c.attrib["r"])
            rows[r][col] = cell_val(c)
    return rows


def parse_year_token(token: str) -> int | None:
    token = token.strip()
    if not token:
        return None
    if token.startswith("约"):
        token = token[1:]
    if token.startswith("前"):
        return -int(re.sub(r"\D", "", token[1:]))
    m = re.search(r"-?\d+", token)
    if not m:
        return None
    return int(m.group())


def parse_year_range(text: str) -> tuple[int | None, int | None]:
    if not text:
        return None, None
    text = text.replace("–", "-").replace("—", "-").replace("－", "-")
    parts = text.split("-")
    if len(parts) == 1:
        y = parse_year_token(parts[0])
        return y, y
    return parse_year_token(parts[0]), parse_year_token(parts[-1])


def parse_population(text: str) -> float | None:
    if not text:
        return None
    m = re.search(r"([\d.]+)", str(text).replace("约", ""))
    return float(m.group(1)) if m else None


def interpolate_pop(year: int, pop_points: list[tuple[int, float]]) -> float:
    points = sorted(pop_points, key=lambda x: x[0])
    if year <= points[0][0]:
        return points[0][1]
    if year >= points[-1][0]:
        return points[-1][1]
    for i in range(len(points) - 1):
        y0, p0 = points[i]
        y1, p1 = points[i + 1]
        if y0 <= year <= y1:
            ratio = (year - y0) / (y1 - y0)
            return p0 + (p1 - p0) * ratio
    return points[-1][1]


def merge_dynasties(
    dynasties: list[dict],
    pop_points: list[tuple[int, float]],
) -> list[dict]:
    by_id = {d["id"]: d for d in dynasties}
    merged_source_ids = set()
    merged_dynasties: list[dict] = []

    for merge_id, config in DYNASTY_MERGE_GROUPS.items():
        sources = [by_id[sid] for sid in config["source_ids"] if sid in by_id]
        if not sources:
            continue

        merged_source_ids.update(config["source_ids"])
        total_source_weight = sum(s["weight"] for s in sources)
        start_year = min(s["startYear"] for s in sources)
        end_year = max(s["endYear"] for s in sources)
        duration = max(1, end_year - start_year)
        mid_year = start_year + duration // 2
        pop_wan = round(interpolate_pop(mid_year, pop_points), 1)
        weight = round(duration * pop_wan, 1)

        class_probs = [0.0] * 6
        for source in sources:
            share = source["weight"] / total_source_weight if total_source_weight else 0
            for index, cls in enumerate(source["classes"]):
                class_probs[index] += cls["prob"] * share

        prob_total = sum(class_probs) or 1.0
        class_probs = [round(prob / prob_total, 6) for prob in class_probs]

        class_defs_9 = CLASS_NAMES.get(merge_id, [])
        class_defs = merge_class_defs(class_defs_9) if class_defs_9 else []
        classes = []
        for i, (prob, (cname, cdesc)) in enumerate(zip(class_probs, class_defs), start=1):
            classes.append({
                "id": f"{merge_id.lower()}_{i}",
                "name": cname,
                "level": i,
                "prob": prob,
                "desc": cdesc,
            })

        merged_dynasties.append({
            "id": merge_id,
            "name": config["name"],
            "startYear": start_year,
            "endYear": end_year,
            "duration": duration,
            "popWan": pop_wan,
            "weight": weight,
            "capital": config.get("capital"),
            "founder": config.get("founder"),
            "feature": config.get("feature"),
            "classes": classes,
        })

    kept = [d for d in dynasties if d["id"] not in merged_source_ids]
    result = kept + merged_dynasties
    result.sort(key=lambda d: d["startYear"])
    return result


def sync_existing_json(path: Path) -> int:
    dynasties = json.loads(path.read_text(encoding="utf-8"))
    for dynasty in dynasties:
        dynasty.pop("theme", None)
        dynasty.pop("cardImage", None)
        defs = CLASS_NAMES.get(dynasty["id"])
        if not defs:
            continue
        merged = merge_class_defs(defs)
        for cls, (name, desc) in zip(dynasty["classes"], merged):
            cls["name"] = name
            cls["desc"] = desc
    path.write_text(
        json.dumps(dynasties, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return len(dynasties)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / "dynasties.json"

    if not XLSX.exists():
        if not out_path.exists():
            raise SystemExit(f"Missing xlsx: {XLSX}")
        count = sync_existing_json(out_path)
        print(f"Synced class copy for {count} dynasties in {out_path}")
        return

    with zipfile.ZipFile(XLSX) as z:
        overview = load_sheet(z, 1)
        population = load_sheet(z, 3)
        class_matrix = load_sheet(z, 5)

    pop_points: list[tuple[int, float]] = []
    for r, cols in population.items():
        if r == 1:
            continue
        year = parse_year_token(str(cols.get("B", "")))
        pop = parse_population(str(cols.get("C", "")))
        if year is not None and pop is not None:
            pop_points.append((year, pop))

    matrix_by_name: dict[str, list[float]] = {}
    for r, cols in class_matrix.items():
        if r == 1:
            continue
        name = cols.get("A")
        probs = []
        for col in "BCDEFGHIJ":
            val = cols.get(col)
            probs.append(float(val) / 100 if val is not None else 0)
        matrix_by_name[name] = probs[:9]

    dynasties = []
    for r, cols in overview.items():
        if r == 1:
            continue
        name = cols.get("B")
        if not name:
            continue
        dynasty_id = DYNASTY_ID_MAP[name]
        start_year, end_year = parse_year_range(str(cols.get("C", "")))
        duration = int(cols.get("D") or (end_year - start_year))
        mid_year = start_year + duration // 2
        base_pop = interpolate_pop(mid_year, pop_points)
        share = POP_SHARE.get(dynasty_id, 1.0)
        pop_wan = round(base_pop * share, 1)
        weight = round(duration * pop_wan, 1)
        class_probs_9 = matrix_by_name.get(name, [0.001] * 9)
        class_probs = merge_class_probs(class_probs_9)
        class_defs_9 = CLASS_NAMES.get(dynasty_id, [])
        class_defs = merge_class_defs(class_defs_9) if class_defs_9 else []
        classes = []
        for i, (prob, (cname, cdesc)) in enumerate(zip(class_probs, class_defs), start=1):
            classes.append({
                "id": f"{dynasty_id.lower()}_{i}",
                "name": cname,
                "level": i,
                "prob": round(prob, 6),
                "desc": cdesc,
            })
        dynasties.append({
            "id": dynasty_id,
            "name": name,
            "startYear": start_year,
            "endYear": end_year,
            "duration": duration,
            "popWan": pop_wan,
            "weight": weight,
            "capital": cols.get("F"),
            "founder": cols.get("E"),
            "feature": cols.get("G"),
            "classes": classes,
        })

    dynasties = merge_dynasties(dynasties, pop_points)

    total_weight = sum(d["weight"] for d in dynasties)
    for d in dynasties:
        d["dynastyProb"] = round(d["weight"] / total_weight, 8)

    (OUT / "dynasties.json").write_text(
        json.dumps(dynasties, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Wrote {len(dynasties)} dynasties")


if __name__ == "__main__":
    main()
