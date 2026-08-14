import dynastiesData from '@/data/dynasties.json';

export type ClassLevel = 1 | 2 | 3 | 4 | 5 | 6;
export const DEFAULT_CLASS_LEVEL: ClassLevel = 3;

export interface DynastyClass {
  id: string;
  name: string;
  level: ClassLevel;
  prob: number;
  desc: string;
  descriptions?: string[];
}

export interface Dynasty {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  duration: number;
  popWan: number;
  weight: number;
  dynastyProb: number;
  capital?: string;
  founder?: string;
  feature?: string;
  classes: DynastyClass[];
}

export interface DynastyBirthResult {
  dynastyId: string;
  dynastyName: string;
  classId: string;
  className: string;
  classLevel: ClassLevel;
  classDesc: string;
  gender: 'male' | 'female';
  probability: number;
}

export const CLASS_STAMPS: Record<
  ClassLevel,
  { name: string; border: string; text: string; glow: string }
> = {
  // CSGO: ★ 金色（刀/手套）
  1: {
    name: '皇室',
    border: '#e4ae39',
    text: '#f0c55a',
    glow: 'rgba(228, 174, 57, 0.45)'
  },
  // CSGO: 隐秘 Covert 红
  2: {
    name: '贵族',
    border: '#eb4b4b',
    text: '#ef5350',
    glow: 'rgba(235, 75, 75, 0.4)'
  },
  // CSGO: 保密 Classified 粉
  3: {
    name: '官僚',
    border: '#f249b8',
    text: '#ff6ec7',
    glow: 'rgba(242, 73, 184, 0.38)'
  },
  // CSGO: 受限 Restricted 真紫（不用靛蓝，避免和军规蓝糊在一起）
  4: {
    name: '士绅',
    border: '#8847ff',
    text: '#c4b5fd',
    glow: 'rgba(136, 71, 255, 0.38)'
  },
  // CSGO: 军规 Mil-Spec 蓝
  5: {
    name: '平民',
    border: '#4b69ff',
    text: '#93c5fd',
    glow: 'rgba(75, 105, 255, 0.28)'
  },
  // 暖石灰（不用消费级钢蓝，避免和军规蓝仍偏同色）
  6: {
    name: '底层',
    border: '#b5a89c',
    text: '#e8e0d8',
    glow: 'rgba(181, 168, 156, 0.24)'
  }
};

export const DYNASTY_GROUPS: { label: string; ids: string[] }[] = [
  {
    label: '秦汉',
    ids: ['QIN', 'WESTERN_HAN', 'XIN', 'EASTERN_HAN']
  },
  {
    label: '三国 · 晋 · 南北朝',
    ids: ['THREE_KINGDOMS', 'JIN', 'SOUTHERN_NORTHERN']
  },
  {
    label: '隋唐',
    ids: ['SUI', 'TANG']
  },
  {
    label: '宋元',
    ids: ['SONG', 'YUAN']
  },
  {
    label: '明清',
    ids: ['MING', 'QING']
  }
];

export const dynasties = dynastiesData as Dynasty[];

export const TOTAL_DYNASTY_WEIGHT = dynasties.reduce((sum, d) => sum + d.weight, 0);
const GENDER_FACTOR = 0.5;

export const DYNASTY_FLAVORS: Record<
  string,
  Partial<Record<ClassLevel, string[]>>
> = {
  QIN: {
    1: [
      '六王毕，四海一！朕统六国，天下归一，大秦祖龙血统登顶！',
      '岂曰无衣？与子同袍！赳赳老秦，共赴国难！',
      '秦王扫六合，虎视何雄哉！挥剑决浮云，诸侯尽西来！'
    ],
    2: [
      '六王毕，四海一！朕统六国，天下归一，大秦祖龙血统登顶！',
      '岂曰无衣？与子同袍！赳赳老秦，共赴国难！'
    ],
    3: [
      '奉公守法，法行天下！在大秦，升迁全凭商君之法！',
      '商君之法，严丝合缝，奉公守法方得长久。'
    ],
    4: [
      '奉公守法，法行天下！在大秦，升迁全凭商君之法！',
      '商君之法，严丝合缝，奉公守法方得长久。'
    ],
    5: [
      '车同轨，书同文，万里长城守护华夏安宁！',
      '普天之下莫非王土，大秦帝国的坚实基石。'
    ],
    6: [
      '王侯将相宁有种乎！大泽乡集合的号角已吹响！',
      '天下苦秦久矣，乱世豪杰即将在风云中登场！'
    ]
  },
  WESTERN_HAN: {
    1: [
      '大风起兮云飞扬，威加海内兮归故乡！大汉正统天命在身！',
      '寇可往，我亦可往！封狼居胥，凡日月所照皆为汉土！',
      '明犯强汉者，虽远必诛！大汉雄风威震西域！'
    ],
    2: [
      '大风起兮云飞扬，威加海内兮归故乡！大汉正统天命在身！',
      '寇可往，我亦可往！封狼居胥，凡日月所照皆为汉土！'
    ],
    3: [
      '罢黜百家，独尊儒术。经学治国，出将入相。',
      '张骞凿空西域，丝绸之路上的盛世官绅。'
    ],
    4: [
      '罢黜百家，独尊儒术。经学治国，出将入相。',
      '张骞凿空西域，丝绸之路上的盛世官绅。'
    ],
    5: [
      '文景之治天下殷富，京师之钱累百巨万，贯朽而不可校！',
      '天下安平，长乐未央，汉家百姓的安居岁月。'
    ],
    6: [
      '汉武雄图万里远征，无数民夫工匠默默扛起了帝国脊梁。',
      '盐铁官营虽辛苦，一身锻造手艺走遍天下都不怕。'
    ]
  },
  XIN: {
    1: [
      '位面之子依旧权威！穿越者王莽：信我，我真的是从现代回来的！',
      '推行王田制、手握游标卡尺，奈何昆阳城外天降流星陨石！',
      '托古改制虽超前，终究敌不过光武大帝的天命！'
    ],
    2: [
      '位面之子依旧权威！穿越者王莽：信我，我真的是从现代回来的！',
      '推行王田制、手握游标卡尺，奈何昆阳城外天降流星陨石！'
    ],
    3: [
      '五均六筦，国有专卖！古代最早的国家计划经济推行者。',
      '官名一天改八遍，朝堂之上人人都在忙着查字典。'
    ],
    4: [
      '五均六筦，国有专卖！古代最早的国家计划经济推行者。',
      '官名一天改八遍，朝堂之上人人都在忙着查字典。'
    ],
    5: [
      '货币一天换一个样，谁手里留铜钱谁就是大冤种。',
      '理想很丰满现实很骨感，王田制下的一代懵懂百姓。'
    ],
    6: [
      '绿林赤眉四海烽烟起，昆阳城外流星即将天降！',
      '改制改到天翻地覆，且看天下大势如何翻转！'
    ]
  },
  EASTERN_HAN: {
    1: [
      '位面之子光武中兴！大魔法师召唤流星，天降正义再造大汉！',
      '仕宦当作执金吾，娶妻当得阴丽华！人生赢家开局！'
    ],
    2: [
      '位面之子光武中兴！大魔法师召唤流星，天降正义再造大汉！',
      '仕宦当作执金吾，娶妻当得阴丽华！'
    ],
    3: [
      '汝南袁氏四世三公，门生故吏遍天下，世家门阀永不倒！',
      '太学名士品评天下，清谈激扬，士林领袖风光无限。'
    ],
    4: [
      '汝南袁氏四世三公，门生故吏遍天下，世家门阀永不倒！',
      '太学名士品评天下，清谈激扬，士林领袖风光无限。'
    ],
    5: [
      '光武度田豪强抗命，寻常百姓且耕且读求安宁。',
      '豪强兼并庄园如云，普通小农夹缝求生盼丰年。'
    ],
    6: [
      '苍天已死，黄天当立！岁在甲子，天下大吉！跟大贤良师冲了！',
      '神仙斗法豪强兼并，乱世风暴即将来袭！'
    ]
  },
  THREE_KINGDOMS: {
    1: [
      '今天下英雄，唯使君与操耳！煮酒论英雄，天下三分！',
      '接着奏乐，接着舞！开局汉室宗亲，匡扶汉室在此一举！',
      '生子当如孙仲谋！天下三分，坐断东南战未休。'
    ],
    2: [
      '今天下英雄，唯使君与操耳！煮酒论英雄，天下三分！',
      '生子当如孙仲谋！天下三分，坐断东南战未休。'
    ],
    3: [
      '羽扇纶巾，谈笑间，樯橹灰飞烟灭！入幕为军师，指点江山！',
      '九品官人法问世，天下英才皆出名门世族！'
    ],
    4: [
      '羽扇纶巾，谈笑间，樯橹灰飞烟灭！入幕为军师，指点江山！',
      '九品官人法问世，天下英才皆出名门世族！'
    ],
    5: [
      '仓廪实而知礼节，天下大乱唯许下军垦独安。',
      '隆中对策三分天下，草庐深处自有安身之所。'
    ],
    6: [
      '白骨露于野，千里无鸡鸣。宁为太平犬，不做乱世人。',
      '乱世风云英雄辈出，底层打工人也在铸就传奇史诗！'
    ]
  },
  JIN: {
    1: [
      '何不食肉糜？洛阳珊瑚树斗富，八王之乱前最后的狂欢！',
      '旧时王谢堂前燕，飞入寻常百姓家。繁华如梦，过眼云烟。'
    ],
    2: [
      '何不食肉糜？洛阳珊瑚树斗富，八王之乱前最后的狂欢！',
      '旧时王谢堂前燕，飞入寻常百姓家。繁华如梦，过眼云烟。'
    ],
    3: [
      '上品无寒门，下品无势族！王与马共天下，门阀说了算！',
      '清谈玄学，纵酒放歌，竹林名士的魏晋风骨千古流芳！'
    ],
    4: [
      '上品无寒门，下品无势族！王与马共天下，门阀说了算！',
      '清谈玄学，纵酒放歌，竹林名士的魏晋风骨千古流芳！'
    ],
    5: [
      '太康之治短暂安乐，天下寻常百姓且过且珍惜。',
      '江南水乡采菱歌，偏安一隅乐得避开北方烽烟。'
    ],
    6: [
      '永嘉之乱衣冠南渡，洛阳已成焦土，泪满长江南下避乱。',
      '五胡烽烟乱世起，颠沛流离之中苦寻一丝生机。'
    ]
  },
  SOUTHERN_NORTHERN: {
    1: [
      '气吞万里如虎！金粉六朝兰陵缭乱，谁与争锋！',
      '关陇军事贵族暗中结盟，隋唐大一统的种子正在悄然萌芽！'
    ],
    2: [
      '气吞万里如虎！金粉六朝兰陵缭乱，谁与争锋！',
      '关陇军事贵族暗中结盟，隋唐大一统的种子正在悄然萌芽！'
    ],
    3: [
      '南朝四百八十寺，多少楼台烟雨中。名士清流诗酒风流。',
      '北魏孝文汉化改制，胡汉交融孕育全新盛世华章。'
    ],
    4: [
      '南朝四百八十寺，多少楼台烟雨中。名士清流诗酒风流。',
      '北魏孝文汉化改制，胡汉交融孕育全新盛世华章。'
    ],
    5: [
      '天苍苍野茫茫风吹草低见牛羊！敕勒川下辽阔壮美。',
      '江南佳丽地，金陵帝王州。烟雨平民自有一份安详。'
    ],
    6: [
      '万里赴戎机，关山度若飞！木兰当户织，自备鞍马从军。',
      '乱世风云变幻莫测，苦寒磨砺出最坚韧的血脉。'
    ]
  },
  SUI: {
    1: [
      '开皇之治天下丰足，四海升平！千古一帝开辟新局！',
      '尽道隋亡为此河，至今千里赖通波。功在千秋，苦在当代！'
    ],
    2: [
      '开皇之治天下丰足，四海升平！千古一帝开辟新局！',
      '尽道隋亡为此河，至今千里赖通波。功在千秋，苦在当代！'
    ],
    3: [
      '考公鼻祖！科举制度初创，天下英雄入吾彀中矣！',
      '三省六部制奠定千年根基，大隋官僚正值制度红利期。'
    ],
    4: [
      '考公鼻祖！科举制度初创，天下英雄入吾彀中矣！',
      '三省六部制奠定千年根基，大隋官僚正值制度红利期。'
    ],
    5: [
      '含嘉仓洛口仓粮食满溢，天下大丰年，四海尽归一统。',
      '大隋初定天下太平，均田百姓迎来了难得的休养生息。'
    ],
    6: [
      '修完大运河又筑大兴城，千古工程背后是千百万苦难民夫。',
      '大运河通波千里，无数无名工匠将名字刻在了山川河流间。'
    ]
  },
  TANG: {
    1: [
      '九天阊阖开宫殿，万国衣冠拜冕旒！盛唐气象，唯我独尊！',
      '忆昔开元全盛日，小邑犹藏万家室！天命盛世，梦回大唐！',
      '太宗皇帝想和我们崔卢联姻？抱歉，门第太高，高攀不起！'
    ],
    2: [
      '太宗皇帝想和我们崔卢联姻？抱歉，门第太高，高攀不起！',
      '九天阊阖开宫殿，万国衣冠拜冕旒！盛唐气象，唯我独尊！'
    ],
    3: [
      '春风得意马蹄疾，一日看尽长安花！慈恩塔下十七人中最少年！',
      '天生我材必有用，千金散尽还复来！盛唐文人的千古豪情！'
    ],
    4: [
      '渔阳鼙鼓动地来，惊破霓裳羽衣曲！天高皇帝远，大帅说了算！',
      '春风得意马蹄疾，一日看尽长安花！'
    ],
    5: [
      '胡姬压酒劝客尝，长安夜市不夜城！盛世人间烟火醉太平！',
      '长安回望绣成堆，山顶千门次第开。盛唐平民的安乐岁月。'
    ],
    6: [
      '莫道盛世无苦辛，千千万万番匠默默撑起了大明宫的巍峨！',
      '盛极必衰风云变，乱世之后唯有坚韧自强能立于天地！'
    ]
  },
  SONG: {
    1: [
      '杯酒释兵权，与士大夫共天下！天下至富，风雅大宋！',
      '靖康耻，犹未雪；臣子恨，何时灭！繁华背后须记家国忧患！'
    ],
    2: ['杯酒释兵权，与士大夫共天下！天下至富，风雅大宋！'],
    3: [
      '万般皆下品，唯有读书高！先天下之忧而忧，后天下之乐而乐！',
      '奉旨填词柳三变，东坡肉就西湖醋鱼，文人待遇全史第一！'
    ],
    4: [
      '万般皆下品，唯有读书高！先天下之忧而忧，后天下之乐而乐！',
      '奉旨填词柳三变，东坡肉就西湖醋鱼，文人待遇全史第一！'
    ],
    5: [
      '夜市千灯照碧云，高头街底勾栏听曲去！做大宋市民超安逸！',
      '东南形胜，三吴都会，钱塘自古繁华，烟柳画桥风帘翠幕！'
    ],
    6: [
      '人生自古谁无死？留取丹心照汗青！大宋风骨长存天地！',
      '岁币年年送边关，好在市井百工兴旺，靠双手亦能自立！'
    ]
  },
  YUAN: {
    1: [
      '一代天骄成吉思汗，弯弓射大雕！草原铁骑横扫欧亚大陆！',
      '大都繁华连通四海，马可波罗惊叹的东方庞大帝国！'
    ],
    2: [
      '一代天骄成吉思汗，弯弓射大雕！草原铁骑横扫欧亚大陆！',
      '大都繁华连通四海，马可波罗惊叹的东方庞大帝国！'
    ],
    3: [
      '虽无科举，且做关汉卿，在杂剧窦娥冤里写尽人间离合！',
      '地跨欧亚大帝国，驿站飞驰万里，商贾畅行无阻。'
    ],
    4: [
      '虽无科举，且做关汉卿，在杂剧窦娥冤里写尽人间离合！',
      '地跨欧亚大帝国，驿站飞驰万里，商贾畅行无阻。'
    ],
    5: [
      '八娼九儒十丐，莫道石人一只眼，挑动黄河天下反！',
      '塞外江南织锦绣，元曲声声唱尽市井儿女情长。'
    ],
    6: [
      '乱世狂澜即将来袭，红巾起义的怒火已在大地悄然汇聚！',
      '世袭打铁不能改，一把菜刀三家轮流用，苦熬待天明。'
    ]
  },
  MING: {
    1: [
      '开局一个碗，结局一个国！天子守国门，君王死社稷！',
      '不和亲、不赔款、不割地、不纳贡！大明风骨硬气千秋！'
    ],
    2: [
      '开局一个碗，结局一个国！天子守国门，君王死社稷！',
      '丹书铁券在手，只要不谋反……等等，洪武大帝又在查账了！'
    ],
    3: [
      '朝为田舍郎，暮登天子堂！六部九卿舌战群儒，东林党争正当时！',
      '八股文章取士，内阁辅臣运筹帷幄，大明官僚巅峰岁月！'
    ],
    4: [
      '朝为田舍郎，暮登天子堂！六部九卿舌战群儒，东林党争正当时！',
      '江南缙绅富甲天下，庄园桑蚕机房遍布，乐得清闲自在。'
    ],
    5: [
      '郑和七下西洋带回麒麟神兽，大明盛世万国来朝！',
      '永乐盛世天下丰安，里甲自耕百姓安居乐业种桑麻。'
    ],
    6: [
      '锦衣卫东厂四处巡察，老老实实做个顺民，千万别去煤山看歪脖子树！',
      '苦一苦百姓骂名我来担！明末风云突变，好自为之！'
    ]
  },
  QING: {
    1: [
      '穿金戴银住紫禁城，九子夺嫡谁能笑到最后？',
      '铁杆庄稼旱涝保收，提笼架鸟大栅栏听戏，优哉游哉！'
    ],
    2: [
      '穿金戴银住紫禁城，九子夺嫡谁能笑到最后？',
      '铁杆庄稼旱涝保收，提笼架鸟大栅栏听戏，优哉游哉！'
    ],
    3: [
      '十年寒窗金榜题名，三年清知府十万雪花银！裱糊匠的自强路。',
      '四库全书馆编修官，每天战战兢兢校对，生怕引来文字狱。'
    ],
    4: [
      '十年寒窗金榜题名，三年清知府十万雪花银！裱糊匠的自强路。',
      '晋商徽商票号通天下，腰缠万贯，富甲海内。'
    ],
    5: [
      '康乾盛世红薯香，闭关锁国不知世界坚船利炮已变天！',
      '京城胡同大碗茶，市井繁华平淡是真，且乐生平岁月长。'
    ],
    6: [
      '大清自有国情在此，留头不留发，且在这市井烟火中求生存。',
      '三千年未有之大变局已来临，旧时代正在悄然落幕！'
    ]
  }
};

export const UNIVERSAL_FLAVORS: Record<ClassLevel, string[]> = {
  1: [
    '天命所归，贵不可言！这一抽直接少走五百年弯路！',
    '欧气爆棚，万中无一！开局直接保送历史巅峰！',
    '奉天承运，你就是历史钦定的天选之子！',
    '金玉满堂，富贵滔天，这投胎技术简直是门艺术！',
    '开局即是罗马！建议把这把欧气截图裱起来供着。'
  ],
  2: [
    '天命所归，贵不可言！这一抽直接少走五百年弯路！',
    '欧气爆棚，万中无一！开局直接保送历史巅峰！',
    '奉天承运，你就是历史钦定的天选之子！',
    '金玉满堂，富贵滔天，这投胎技术简直是门艺术！',
    '开局即是罗马！建议把这把欧气截图裱起来供着。'
  ],
  3: [
    '朝中有人好做官，进可入仕光宗耀祖，退可收租乐得逍遥。',
    '书香门第，小有前程；衣食无忧，未来可期。',
    '官宦世家，不愁吃穿，妥妥的历史中产生活！',
    '知书达理通人情，乱世中也有立足安身之地。',
    '前人栽树后人乘凉，生在这一层，这辈子稳了。'
  ],
  4: [
    '朝中有人好做官，进可入仕光宗耀祖，退可收租乐得逍遥。',
    '书香门第，小有前程；衣食无忧，未来可期。',
    '官宦世家，不愁吃穿，妥妥的历史中产生活！',
    '知书达理通人情，乱世中也有立足安身之地。',
    '前人栽树后人乘凉，生在这一层，这辈子稳了。'
  ],
  5: [
    '布衣一生，倒也踏实；日出而作，日入而息。',
    '寻常烟火，平平淡淡；人间至味，不过一碗粗茶淡饭。',
    '虽无泼天富贵，倒也远离了朝堂险恶与深宫算计。',
    '勤俭持家，春耕秋收，做个逍遥自在的世外散人。',
    '只要天下太平不打仗，平凡日子也能过得有滋有味。'
  ],
  6: [
    '开局即地狱难度……这运气，建议立刻再抽一次！',
    '底层开局，命途多舛。请问现在去陈胜吴广那里报名还来得及吗？',
    '天崩开局！不过乱世出英雄，逆风局才能见证神操作！',
    '把生活的苦难全吃了一遍，下辈子高低得给个皇帝当当！',
    '别慌！朱元璋当年开局只有一个破碗，现在立刻开始你的逆袭剧本！'
  ]
};

export function formatDynastyYear(year: number): string {
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
}

export function formatDynastyProbability(probability: number): string {
  return `${(probability * 100).toPrecision(2)}%`;
}

export function translateDynastyGender(gender: 'male' | 'female'): string {
  return gender === 'male' ? '男' : '女';
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickWeightedDynasty(): Dynasty {
  let rnd = Math.random() * TOTAL_DYNASTY_WEIGHT;
  for (const dynasty of dynasties) {
    if (rnd < dynasty.weight) return dynasty;
    rnd -= dynasty.weight;
  }
  return dynasties[dynasties.length - 1];
}

function pickWeightedClass(dynasty: Dynasty): DynastyClass {
  const totalWeight = dynasty.classes.reduce((sum, c) => sum + c.prob, 0);
  let rnd = Math.random() * totalWeight;
  for (const cls of dynasty.classes) {
    if (rnd < cls.prob) return cls;
    rnd -= cls.prob;
  }
  return dynasty.classes[dynasty.classes.length - 1];
}

export function getDynastyClassProbability(
  dynastyId: string,
  classId: string
): number {
  const dynasty = dynasties.find(d => d.id === dynastyId);
  if (!dynasty) return 0;
  const cls = dynasty.classes.find(c => c.id === classId);
  if (!cls) return 0;
  return dynasty.dynastyProb * cls.prob * GENDER_FACTOR;
}

export function getDynastyProbabilityFormula(): string {
  return String.raw`\displaystyle{P = p_{\text{朝代}} \times p_{\text{阶级}} \times \frac{1}{2}}`;
}

export function getDynastyProbabilityExplanation(): string {
  return String.raw`p_{\text{朝代}} = \frac{\text{国祚} \times \text{代表人口}}{\sum(\text{国祚} \times \text{代表人口})}`;
}

export function getFlavorLine(
  level: ClassLevel,
  dynastyId?: string
): string {
  if (dynastyId && DYNASTY_FLAVORS[dynastyId]) {
    const specificList = DYNASTY_FLAVORS[dynastyId][level];
    if (specificList && specificList.length > 0 && Math.random() < 0.75) {
      return pickRandom(specificList);
    }
  }

  const universalList = UNIVERSAL_FLAVORS[level] ?? UNIVERSAL_FLAVORS[5];
  return pickRandom(universalList);
}

export function getClassDescription(cls: DynastyClass): string {
  if (cls.descriptions && cls.descriptions.length > 0) {
    return pickRandom(cls.descriptions);
  }
  return cls.desc;
}

export function simulateDynastyBirth(): DynastyBirthResult {
  const dynasty = pickWeightedDynasty();
  const chosenClass = pickWeightedClass(dynasty);
  const gender: 'male' | 'female' = Math.random() < 0.5 ? 'male' : 'female';
  const probability = getDynastyClassProbability(dynasty.id, chosenClass.id);

  return {
    dynastyId: dynasty.id,
    dynastyName: dynasty.name,
    classId: chosenClass.id,
    className: chosenClass.name,
    classLevel: chosenClass.level,
    classDesc: getClassDescription(chosenClass),
    gender,
    probability
  };
}

export const dynastyOptions = dynasties.map(d => ({
  label: d.name,
  value: d.id
}));

export function getClassOptions(dynastyId: string) {
  const dynasty = dynasties.find(d => d.id === dynastyId);
  if (!dynasty) return [];
  return dynasty.classes.map(c => ({
    label: `${CLASS_STAMPS[c.level].name} · ${c.name}`,
    value: c.id
  }));
}

export function getDynastyById(id: string) {
  return dynasties.find(d => d.id === id);
}

export function simulateEqualDynastyBirth(
  targetLevel?: ClassLevel
): DynastyBirthResult {
  const dynasty = dynasties[Math.floor(Math.random() * dynasties.length)];
  let chosenClass: DynastyClass;

  if (targetLevel) {
    const match = dynasty.classes.find(c => c.level === targetLevel);
    chosenClass = match ??
      dynasty.classes[Math.floor(Math.random() * dynasty.classes.length)];
  } else {
    chosenClass =
      dynasty.classes[Math.floor(Math.random() * dynasty.classes.length)];
  }

  const gender: 'male' | 'female' = Math.random() < 0.5 ? 'male' : 'female';
  const probability = getDynastyClassProbability(dynasty.id, chosenClass.id);

  return {
    dynastyId: dynasty.id,
    dynastyName: dynasty.name,
    classId: chosenClass.id,
    className: chosenClass.name,
    classLevel: chosenClass.level,
    classDesc: getClassDescription(chosenClass),
    gender,
    probability
  };
}

