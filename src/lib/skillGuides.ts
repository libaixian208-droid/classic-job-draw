import type { Job } from '../types'

export interface SkillPriority {
  skill: string
  /** Exact target, e.g. "→ 1" / "→ 30（點滿）" */
  points: string
  note?: string
}

export interface SkillStage {
  title: string
  /** One-line ordered recipe shown above the list */
  summary: string
  priorities: SkillPriority[]
}

export interface StatBuild {
  name: string
  summary: string
  details: string[]
}

export interface GearNote {
  label: string
  text: string
}

export interface LevelRoute {
  range: string
  /** Main maps / monsters for this bracket */
  spots: string
  /** How to get there, party tips, etc. */
  note?: string
  /** Quieter / less contested alternative maps */
  quiet?: string
  /** Preferred elemental weakness for this bracket (TW label) */
  weak?: string
}

export interface SkillGuide {
  job: Job
  path: string
  role: string
  statBuilds: StatBuild[]
  gearNotes: GearNote[]
  stages: SkillStage[]
  /** One-line overview of the leveling path */
  levelingIntro: string
  leveling: LevelRoute[]
  tips: string[]
  disclaimer: string
}

export const SERVER_RULES = {
  title: '經典版核心規則（本站預設）',
  items: [
    '等級上限暫定 100 級',
    '目前最高開放至四轉（技能可點範圍仍受等級與技能書限制）',
    '配點可走純血統（如全智法）或常規配點',
    '換裝前務必核對力量／敏捷／智力／幸運門檻',
  ],
}

const DISCLAIMER =
  '粉絲向加點／練功參考（100 級／最高四轉）。技能與地圖名稱採台服常見寫法；實際名稱、入口與怪種以你的伺服器為準。'

function step(
  skill: string,
  points: string,
  note: string,
): SkillPriority {
  return { skill, points, note }
}

function route(
  range: string,
  spots: string,
  note: string,
  quiet?: string,
  weak?: string,
): LevelRoute {
  const out: LevelRoute = { range, spots, note }
  if (quiet) out.quiet = quiet
  if (weak) out.weak = weak
  return out
}

/** Shared late-game routes (classic ~70–100). Map names: TW classic. */
const LATE_GAME: LevelRoute[] = [
  route(
    '70–85',
    '天空之城・雲彩公園Ⅲ（星光精靈／月光精靈）；玩具城・時間之路、遺失的時間（進化妖魔）；每日組隊任務',
    '三轉後優先組隊任務經驗；單刷選密度高、路線短的圖。掉寶（卷軸）可補裝。',
    '人少：遺失的時間2、雲彩公園外圍支線；避開時間之路1尖峰。',
    '弱火／弱冰（精靈系）；妖魔看版本',
  ),
  route(
    '85–100',
    '天空之城高經驗圖、車隊練等點、固定隊副本／組隊任務；有開放再往冰原雪域過渡',
    '本服 100 封頂。衝等以車隊＋每日組隊為主；野圖當補經驗與打寶。',
    '人少：非熱門頻道的天空之城支線、冰原雪域入口過渡圖；尖峰改清組隊任務。',
    '依圖調整屬性彈／屬性魔',
  ),
]

const MAGE_EARLY: LevelRoute[] = [
  route(
    '1–8／10',
    '楓之島主線清完 → 搭船至維多利亞港 → 魔法森林找漢斯一轉',
    '建議至少 10 等再一轉。智力門檻達標即可。',
  ),
  route(
    '8–15',
    '南部森林訓練場1～2（綠水靈／藍水靈）；任務斷檔再野圖',
    '魔力爪成型前別硬闖高防圖。缺藍就回城補。',
    '人少：南部森林訓練場3～4、藍菇菇樹林外圍。',
  ),
  route(
    '15–22',
    '豬的海岸（維多利亞港→三叉路，花叢隱藏傳點進入）、藍菇菇樹林',
    '經典中低等掛機點；注意走位。人多先換頻道。',
    '人少：肥肥海岸、海岸草叢1～3、野豬的領土1（替補）。',
  ),
  route(
    '22–30',
    '林中之城・螞蟻洞1～2、螞蟻廣場（刺菇菇／殭屍菇菇／火獨眼獸）',
    '由魔法森林→大木林→林中之城進入。衝 30 二轉，SP 用完再轉。',
    '人少：螞蟻洞2、幽深的螞蟻洞；避開螞蟻洞1尖峰。',
  ),
]

const WARRIOR_EARLY: LevelRoute[] = [
  route(
    '1–10',
    '楓之島主線 → 勇士之村找武術教練一轉',
    '力量達標即可一轉；建議清完島上任務再走。',
  ),
  route(
    '10–15',
    '西部岩山1～2（木妖等）、勇士之村西部訓練',
    '自身強化優先；紅藥備足。',
    '人少：西部岩山3～4（較深處）。',
  ),
  route(
    '15–22',
    '豬的海岸、遺跡發掘地1～2',
    '劍氣縱橫拉怪清；人潮多可換鄰近圖。',
    '人少：遺跡發掘地3、東方岩石山支線、肥肥海岸。',
  ),
  route(
    '22–30',
    '螞蟻洞1～2；或火焰之地・火野豬一帶過渡',
    '近戰注意回血。30 等 SP 用完二轉。',
    '人少：火焰之地1～3、火野豬相關圖（常比螞蟻洞1空）、螞蟻洞2。',
  ),
]

const ARCHER_EARLY: LevelRoute[] = [
  route(
    '1–10',
    '楓之島 → 弓箭手村一轉',
    '敏捷達標；訓練場練二連射手感。',
  ),
  route(
    '10–15',
    '弓箭手訓練場1～2（花蘑菇）',
    '站高台風箏；箭矢夠再出發。',
    '人少：弓箭手訓練場3。',
  ),
  route(
    '15–22',
    '豬的海岸、弓箭手村東部森林／東部草叢',
    '保持距離；無形之箭可減箭耗。',
    '人少：弓箭手村西部小山、肥肥海岸。',
  ),
  route(
    '22–30',
    '螞蟻洞1～2；石人寺院門外／石人寺院1 過渡',
    '入口：弓箭手村迷宮入口下方牌子→石人寺院門外。衝 30 二轉。',
    '人少：石人寺院門外、石人寺院1（比螞蟻洞1空）、螞蟻洞2。',
  ),
]

const THIEF_EARLY: LevelRoute[] = [
  route(
    '1–10',
    '楓之島 → 廢棄都市盜賊一轉',
    '幸運／敏捷依路線；先摸熟隱身與雙飛斬。',
  ),
  route(
    '10–15',
    '北方工地（綠水靈＋花蘑菇）',
    '工地怪密；注意掉落與藥水。',
    '人少：北方工地頂端、墮落城市南方工地（較少人）。',
  ),
  route(
    '15–22',
    '豬的海岸、廢棄都市地鐵低等車廂',
    '遠程鏢可風箏；近戰俠盜向注意貼臉。',
    '人少：地鐵較空車廂、沼澤地1～2、肥肥海岸。',
  ),
  route(
    '22–30',
    '螞蟻洞1～2；三眼章魚隱藏圖（廢棄都市）可過渡',
    '鏢耗／紅藥成本上升。30 二轉。',
    '人少：三眼章魚隱藏圖、螞蟻洞2（避開螞蟻洞1尖峰）。',
  ),
]

const PIRATE_EARLY: LevelRoute[] = [
  route(
    '1–10',
    '楓之島 → 諾特勒斯碼頭找卡伊琳一轉',
    '打手力量／槍手敏捷達標；先熟悉衝鋒或雙彈。',
  ),
  route(
    '10–15',
    '諾特勒斯碼頭周邊訓練圖、港口外圍',
    '能量／子彈管理從現在養成。',
    '人少：諾特勒斯外圍支線訓練圖。',
  ),
  route(
    '15–22',
    '豬的海岸、維多利亞港郊外／海岸草叢',
    '打手貼臉拉怪；槍手站位風箏。',
    '人少：海岸草叢1～3、肥肥海岸。',
  ),
  route(
    '22–30',
    '林中之城・螞蟻洞1～2',
    '與其他職業相同衝 30 二轉。',
    '人少：螞蟻洞2；換頻道優先。',
  ),
]

const MID_PARTY: LevelRoute[] = [
  route(
    '30–35',
    '廢棄都市組隊任務；玩具城・愛奧斯塔（小幽靈等）；野圖過渡火肥肥／黑肥肥領土',
    '二轉技能未滿前以組隊經驗最穩；單刷等主力技點起來再換圖。',
    '人少野圖：黑肥肥領土、黑肥肥領土2、鋼之黑肥肥之地。',
  ),
]

const CRAB_ROUTE: LevelRoute[] = [
  route(
    '36–43',
    '黃金海岸：熱帶沙灘 → 紅螃蟹海灘1 → 紅螃蟹海灘2（隱藏）',
    '維多利亞港找水手佩森買船票（約 15000 楓幣）。紅螃蟹海灘2：海灘1最上方大螺殼處按↑進入。',
    '人少：紅螃蟹海灘2（常比1空）；1爆滿先換頻再換圖。',
    '弱雷',
  ),
  route(
    '43–55',
    '青螃蟹海灘1～2、海龜沙灘；人滿可改猴子森林1～2／猴子迷宮',
    '青螃蟹海灘2：海灘1右側樹上跳躍平台隱藏傳點。注意補給。',
    '人少：海龜沙灘、猴子森林2、猴子迷宮、青螃蟹海灘2。',
    '弱雷／弱毒（依怪種）',
  ),
]

const MID_50_70: LevelRoute[] = [
  route(
    '50–60',
    '石人寺院1～4（黑曜石巨人等）；玩具城・時間之路／遺失的時間（進化妖魔）；女神之塔組隊',
    '石人寺院：弓箭手村迷宮入口下方→石人寺院門外→石人寺院入口。女神之塔在天空之城。',
    '人少：石人寺院3～4、遺失的時間2；避開石人寺院1與時間之路1尖峰。',
    '弱聖／弱火（石人系偏聖；妖魔看版本）',
  ),
  route(
    '60–70',
    '迷霧森林／龍族巢穴一帶（林中之城深處）、火焰之地較高層；天空之城入口圖過渡',
    '準備三轉。龍系怪較硬，裝與藥水要到位；組隊更穩。',
    '人少：迷霧森林支線、火焰之地4～5；尖峰改女神之塔組隊。',
    '弱冰／弱雷（龍巢）；火焰地帶弱冰',
  ),
]

const MAGE_1ST: SkillStage = {
  title: '一轉・法師（Lv.8～30）・加點順序',
  summary:
    '魔靈彈 1 → 魔力淨化 5 → 魔力擴展 10 → 魔力爪 20 → 魔力淨化補滿 16 → 魔心防禦 20',
  priorities: [
    step('魔靈彈', '→ 1', '第1步・解鎖後續'),
    step('魔力淨化', '→ 5', '第2步・先有回魔'),
    step('魔力擴展', '→ 10（點滿）', '第3步・拉高 MP'),
    step('魔力爪', '→ 20（點滿）', '第4步・一轉主力清怪'),
    step('魔力淨化', '→ 16（補滿）', '第5步・續航'),
    step('魔心防禦', '→ 20（點滿）', '第6步・補防；SP 有剩再點'),
  ],
}

const WARRIOR_1ST: SkillStage = {
  title: '一轉・劍士（Lv.10～30）・加點順序',
  summary:
    '自身強化 20 → 生命恢復（適量）→ 劍氣縱橫（主力）→ 武器精通（點滿）',
  priorities: [
    step('自身強化', '→ 盡快拉高／點滿', '第1步・減傷生存'),
    step('生命恢復', '→ 適量', '第2步・省紅藥；可與輸出交錯'),
    step('劍氣縱橫', '→ 主力點滿', '第3步・一轉清怪'),
    step('武器精通', '→ 點滿', '第4步・命中＋傷害；依武器系'),
    step('聖甲術等', '→ 剩餘', '有剩 SP 再補'),
  ],
}

const ARCHER_1ST: SkillStage = {
  title: '一轉・弓箭手（Lv.10～30）・加點順序',
  summary: '二連射優先 → 無形之箭 → 箭術精通 → 霸王箭（視版本）',
  priorities: [
    step('二連射', '→ 盡快點滿', '第1步・一轉主力'),
    step('無形之箭', '→ 點滿', '第2步・省箭／便利'),
    step('箭術精通', '→ 點滿', '第3步・命中與傷害'),
    step('霸王箭／穿透類', '→ 剩餘', '第4步・依版本技能名'),
  ],
}

const THIEF_1ST: SkillStage = {
  title: '一轉・盜賊（Lv.10～30）・加點順序',
  summary: '雙飛斬 → 敏捷身體／輕功 → 隱身 → 補精通與回復',
  priorities: [
    step('雙飛斬', '→ 盡快點滿', '第1步・一轉輸出'),
    step('敏捷身體／輕功', '→ 優先', '第2步・機動與命中'),
    step('隱身術', '→ 適量～點滿', '第3步・保命與過圖'),
    step('恢復術／幸運類', '→ 剩餘', '第4步・依版本'),
  ],
}

const PIRATE_1ST: SkillStage = {
  title: '一轉・海盜（Lv.10～30）・加點順序',
  summary: '衝鋒／雙彈射擊依路線 → 能力強化 → 精通類',
  priorities: [
    step('衝鋒（打手向）／雙彈射擊（槍手向）', '→ 主力', '第1步・一轉輸出'),
    step('能力強化／忍耐類', '→ 優先', '第2步・生存'),
    step('精通／命中類', '→ 點滿', '第3步・穩定輸出'),
    step('其餘被動', '→ 剩餘', '第4步'),
  ],
}

/**
 * Fan-made guides: ordered SP recipes for classic (lv.100 / up to 4th).
 */
export const SKILL_GUIDES: Record<Job, SkillGuide> = {
  冰雷巫師: {
    job: '冰雷巫師',
    path: '法師 → 冰雷巫師 → 冰雷魔導士 → 冰雷大魔導士',
    role: '遠程雷電群攻＋冰控；練功效率高、控場強',
    statBuilds: [
      {
        name: '全智法（推薦）',
        summary: '智力全點；幸運靠裝或晚補。',
        details: [
          '創角智力拉高，力量／敏捷維持最低',
          '命中不足先換武器／眼鏡，勿亂點幸運',
          '高幸運門檻裝等有裝再考慮',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '多看智力；部分高階裝要幸運。換裝前對照需求。',
      },
      {
        label: '裝備方向',
        text: '魔法攻擊、智力、MP；杖／傘依弱屬調整。',
      },
      { label: '藥水', text: '藍藥必備；電閃清圖非常耗藍。' },
    ],
    stages: [
      MAGE_1ST,
      {
        title: '二轉・冰雷巫師（Lv.30～70）・加點順序（練功向・雷優先）',
        summary:
          '瞬間移動 1 → 電閃雷鳴 30 → 瞬間移動補滿 20 → 魔力吸收 20 → 精神強化 20 → 冰錐術 30 → 緩速術 1',
        priorities: [
          step('瞬間移動', '→ 1', '第1步・先有保命位移'),
          step('電閃雷鳴', '→ 30（點滿）', '第2步・清怪核心，優先滿'),
          step('瞬間移動', '→ 20（補滿）', '第3步・機動拉滿'),
          step('魔力吸收', '→ 20（點滿）', '第4步・攻擊回魔，續航'),
          step('精神強化', '→ 20（點滿）', '第5步・魔攻＋MP'),
          step('冰錐術', '→ 30（點滿）', '第6步・冰控／補輸出'),
          step('緩速術', '→ 1', '第7步・夠用即可'),
        ],
      },
      {
        title: '二轉替代・冰優先（控場向）',
        summary:
          '瞬間移動 1 → 冰錐術 30 → 電閃雷鳴 30 → 再補瞬移／吸收／精神／緩速',
        priorities: [
          step('瞬間移動', '→ 1', '第1步'),
          step('冰錐術', '→ 30（點滿）', '第2步・先控場'),
          step('電閃雷鳴', '→ 30（點滿）', '第3步・再補群攻'),
          step('瞬間移動／魔力吸收／精神強化', '→ 各補滿', '第4步・與主流相同'),
          step('緩速術', '→ 1', '第5步'),
        ],
      },
      {
        title: '三轉・冰雷魔導士（約 Lv.70）・加點順序',
        summary:
          '冰風暴 30 → 魔力激發 30 → 極速詠唱（先關鍵級）→ 冰雷合擊 30 → 魔法封印／抵抗補滿',
        priorities: [
          step('冰風暴', '→ 30（點滿）', '第1步・三轉主力清怪控場'),
          step('魔力激發', '→ 30（點滿）', '第2步・爆發魔攻'),
          step('極速詠唱', '→ 先點實用級再補滿', '第3步・輸出節奏'),
          step('冰雷合擊／終極魔法', '→ 30（點滿）', '第4步・單體／補傷'),
          step('魔法封印／冰雷抵抗', '→ 補滿', '第5步・依版本'),
        ],
      },
      {
        title: '四轉・冰雷大魔導士（本服上限 Lv.100）・加點順序',
        summary:
          '有書先學：閃電連擊 → 暴風雪 → 魔力無限 → 再補楓葉祝福等；能點的主力先滿',
        priorities: [
          step('閃電連擊', '→ 能點先點／點滿', '第1步・主力輸出（需技能書）'),
          step('暴風雪', '→ 優先', '第2步・大範圍清場'),
          step('魔力無限', '→ 優先', '第3步・續航'),
          step('楓葉祝福／淨化類', '→ 組隊優先', '第4步・有書再點'),
          step('寒冰地獄／反射等', '→ 剩餘', '第5步・依掉書與等級'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 魔法森林一轉 → 豬的海岸／螞蟻洞衝 30 → 電閃後紅／青螃蟹海灘 → 石人寺院／龍巢 → 天空之城車隊至 100',
    leveling: [
      ...MAGE_EARLY,
      route(
        '30–35',
        '黑肥肥領土過渡；同步清廢棄都市組隊、愛奧斯塔',
        '電閃雷鳴尚未滿前先過渡圖，別硬闖螃蟹。組隊補經驗最快。',
        '人少：黑肥肥領土2、鋼之黑肥肥之地。',
      ),
      ...CRAB_ROUTE,
      route(
        '35–43（電閃成型後）',
        '紅螃蟹海灘1～2為主；人滿改青螃蟹海灘／海龜沙灘',
        '電閃點滿後此段效率最高。藍藥帶雙倍量。',
        '人少：紅螃蟹海灘2；海灘1爆滿先換頻。',
        '弱雷',
      ),
      ...MID_50_70,
      ...LATE_GAME,
    ],
    tips: [
      '加點請嚴格照「順序」：先電閃再補被動，練功差很多。',
      '藍藥斷貨＝停擺；魔力吸收點滿前多帶藍。',
      '四轉技能多半看技能書，有書再依上表優先序點。',
    ],
    disclaimer: DISCLAIMER,
  },

  火毒巫師: {
    job: '火毒巫師',
    path: '法師 → 火毒巫師 → 火毒魔導士 → 火毒大魔導士',
    role: '毒霧 DoT 清怪；單刷／打寶效率高',
    statBuilds: [
      {
        name: '全智法（推薦）',
        summary: '智力全點，開荒最省心。',
        details: ['力量／敏捷最低', '幸運以穿裝為原則'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '智力為主；幸運看防具。' },
      { label: '裝備方向', text: '魔攻、智力、MP。' },
      {
        label: '藥水',
        text: '毒霧不觸發魔力吸收，藍／紅仍要備；吸收可晚點滿。',
      },
    ],
    stages: [
      MAGE_1ST,
      {
        title: '二轉・火毒巫師（Lv.30～70）・加點順序',
        summary:
          '瞬間移動 1 → 火焰箭 30 → 瞬間移動補滿 20 → 魔力吸收 約 11 → 毒霧 30 → 精神強化 20 → 魔力吸收補滿 20 → 緩速 1',
        priorities: [
          step('瞬間移動', '→ 1', '第1步・保命'),
          step('火焰箭', '→ 30（點滿）', '第2步・二轉前期主力'),
          step('瞬間移動', '→ 20（補滿）', '第3步・機動'),
          step('魔力吸收', '→ 約 11', '第4步・先點一截即可（毒不觸發吸收）'),
          step('毒霧', '→ 30（點滿）', '第5步・靈魂技能，盡快滿'),
          step('精神強化', '→ 20（點滿）', '第6步・魔攻'),
          step('魔力吸收', '→ 20（補滿）', '第7步・收尾'),
          step('緩速術', '→ 1', '第8步'),
        ],
      },
      {
        title: '三轉・火毒魔導士・加點順序',
        summary: '火毒主力群攻／毒系進階 → 魔力激發 → 極速詠唱 → 補被動',
        priorities: [
          step('火毒系群攻／毒霧進階', '→ 優先點滿', '第1步・依版本技能名'),
          step('魔力激發', '→ 點滿', '第2步'),
          step('極速詠唱', '→ 實用級～滿', '第3步'),
          step('火毒合擊／終極魔法', '→ 點滿', '第4步'),
          step('魔法封印／屬抗', '→ 補滿', '第5步'),
        ],
      },
      {
        title: '四轉・火毒大魔導士（≤Lv.100）・加點順序',
        summary: '有書先點核心火／毒輸出與魔力無限，再補組隊增益',
        priorities: [
          step('四轉主力火／毒輸出', '→ 能點先滿', '第1步・需技能書'),
          step('魔力無限', '→ 優先', '第2步'),
          step('楓葉祝福等', '→ 組隊優先', '第3步'),
          step('其餘', '→ 剩餘', '第4步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 魔法森林 → 螞蟻洞衝 30 → 火焰箭過渡小幽靈／月妙 → 毒霧成型後野圖 → 車隊至 100',
    leveling: [
      ...MAGE_EARLY,
      route(
        '30–40',
        '愛奧斯塔小幽靈、廢棄都市組隊；野圖過渡黑肥肥領土',
        '火焰箭過渡期。毒霧未滿前以弱火怪為主。',
        '人少：愛奧斯塔較空樓層、黑肥肥領土2。',
        '弱火',
      ),
      route(
        '40–50',
        '弓箭手村月妙組隊／周邊；火焰之地（土龍／青龍等，打寶向）',
        '月妙掉寶佳。毒霧點高後改「放毒走位」節奏。',
        '人少：火焰之地支線、非尖峰頻道的月妙排隊外野圖。',
      ),
      route(
        '50–70',
        '時間之路／遺失的時間（進化妖魔）、女神之塔組隊；毒霧友善密怪圖',
        'DoT 清圖省操作；注意回城補藍。準備三轉。',
        '人少：遺失的時間2；尖峰改女神之塔。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '毒霧是節奏核心：點滿前先用火焰箭過渡。',
      'DoT 不吃魔力吸收，吸收可刻意晚點。',
      '放毒走位，別硬站怪堆。',
    ],
    disclaimer: DISCLAIMER,
  },

  僧侶: {
    job: '僧侶',
    path: '法師 → 僧侶 → 祭司 → 主教',
    role: '組隊核心輔助；奶＋祝福＋後期復活',
    statBuilds: [
      {
        name: '全智法（開荒推薦）',
        summary: '智力全點，換裝靠低門檻／卷軸。',
        details: ['固定車優先全智', '高幸門檻裝可晚補'],
      },
      {
        name: '常規／裝備向',
        summary: '主智力，預留幸運穿裝。',
        details: ['副屬剛好穿上即可', '剩餘回智力'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '法袍／手套常看智力或幸運。' },
      { label: '裝備方向', text: '魔攻、智力、MP；盾／傘依門檻。' },
      { label: '藥水', text: '藍藥仍要；狂奶時吸收不一定夠。' },
    ],
    stages: [
      MAGE_1ST,
      {
        title: '二轉・僧侶（Lv.30～70）・加點順序',
        summary:
          '瞬間移動 1 → 群體治癒 30 → 魔力吸收 20 → 瞬間移動補滿 20 → 神聖之光 20 → 祝福（天使祝福）20 → 剩餘自由',
        priorities: [
          step('瞬間移動', '→ 1', '第1步・保命位移'),
          step('群體治癒', '→ 30（點滿）', '第2步・奶＋不死系輸出，必滿'),
          step('魔力吸收', '→ 20（點滿）', '第3步・續航'),
          step('瞬間移動', '→ 20（補滿）', '第4步・支援機動'),
          step('神聖之光', '→ 20（點滿）', '第5步・減傷／無敵類輔助'),
          step('祝福', '→ 20（點滿）', '第6步・全隊屬性'),
          step('神聖之箭', '→ 剩餘 SP', '第7步・約十餘點可補輸出'),
        ],
      },
      {
        title: '三轉・祭司・加點順序',
        summary: '進階治癒／聖光 → 淨化／防禦增益 → 輸出向聖技',
        priorities: [
          step('進階群體治癒／聖光類', '→ 優先點滿', '第1步・組隊核心'),
          step('淨化／解除異常', '→ 次之', '第2步'),
          step('防禦／屬抗增益', '→ 優先', '第3步'),
          step('輸出向聖技', '→ 視單刷需求', '第4步'),
        ],
      },
      {
        title: '四轉・主教（≤Lv.100）・加點順序',
        summary: '復活 → 進階祝福／神聖增益 → 其餘輔助／輸出',
        priorities: [
          step('復活', '→ 能點先點', '第1步・副本剛需（技能書）'),
          step('進階祝福／神聖系增益', '→ 優先', '第2步・全隊強度'),
          step('其餘輔助／輸出', '→ 補滿', '第3步・依車隊'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 魔法森林 → 螞蟻洞衝 30 → 不死系＋組隊／女神之塔為主 → 固定車至 100（單刷非強項）',
    leveling: [
      ...MAGE_EARLY,
      route(
        '30–37',
        '廢棄都市組隊任務、愛奧斯塔；野圖過渡小幽靈',
        '群體治癒未滿前以組隊經驗為主，單刷會較慢。',
        '人少野圖：愛奧斯塔較空樓層；經驗仍以組隊為主最穩。',
      ),
      route(
        '37–50',
        '小幽靈、進化妖魔（時間之路）、月妙組隊；不死系地圖讓群體治癒同時輸出',
        '治癒打不死系＝奶＋傷害。組隊搶車位優先於硬單刷。',
        '人少：遺失的時間2、時間之路較空層。',
      ),
      route(
        '50–70',
        '大幽靈相關樓層、女神之塔組隊、第1～3軍團（遺跡）；進化妖魔續刷',
        '祭司前盡量綁固定隊。單刷效率通常不如輸出職。',
        '人少：遺跡之墓／軍團外圍圖；優先綁車而非搶石人寺院1。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '單刷慢正常；價值在組隊與不死系地圖。',
      '群體治癒必最先滿，再補瞬移與祝福。',
      '四轉復活一有書就優先。',
    ],
    disclaimer: DISCLAIMER,
  },

  槍騎兵: {
    job: '槍騎兵',
    path: '劍士 → 槍騎兵 → 龍騎士 → 黑騎士',
    role: '近戰群攻＋神聖之火；組隊血量增益',
    statBuilds: [
      {
        name: '常規戰士（推薦）',
        summary: '主力量，敏捷只點到能穿裝。',
        details: [
          '換裝前核對敏捷門檻',
          '不要無腦全力量導致卡裝',
        ],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '長槍／矛、盔甲常看力量＋敏捷。' },
      { label: '裝備方向', text: '物攻、力量；防具顧 HP。' },
      { label: '藥水', text: '近戰紅藥備足。' },
    ],
    stages: [
      WARRIOR_1ST,
      {
        title: '二轉・槍騎兵（Lv.30～70）・加點順序',
        summary:
          '精準之槍優先 → 快速之槍點滿 → 神聖之火點滿 → 禦魔陣 → 槍連擊／穿刺群攻點滿',
        priorities: [
          step('精準之槍', '→ 先點高／點滿', '第1步・命中與精通'),
          step('快速之槍', '→ 盡快點滿', '第2步・攻速，手感差很多'),
          step('神聖之火', '→ 點滿', '第3步・全隊 MaxHP，組隊必滿'),
          step('禦魔陣', '→ 次之／點滿', '第4步・減傷'),
          step('槍連擊', '→ 主力點滿', '第5步・單／小群'),
          step('穿刺／橫掃群攻', '→ 點滿', '第6步・刷怪（依版本名）'),
          step('終極之槍等', '→ 剩餘', '第7步'),
        ],
      },
      {
        title: '三轉・龍騎士・加點順序',
        summary: '龍系群攻優先 → 精通延伸點滿 → 維持神聖之火',
        priorities: [
          step('龍之獻祭／龍咆哮類', '→ 優先點滿', '第1步・依版本技能名'),
          step('槍／矛精通延伸', '→ 點滿', '第2步'),
          step('神聖之火（二轉）', '→ 維持滿級', '第3步・組隊價值'),
          step('其餘被動／突進', '→ 剩餘', '第4步'),
        ],
      },
      {
        title: '四轉・黑騎士（≤Lv.100）・加點順序',
        summary: '能學的主力群攻 → 嘲諷／生存 → 補被動',
        priorities: [
          step('黑暗穿刺／主力群攻', '→ 能點先滿', '第1步・技能書＋等級'),
          step('嘲諷／生存輔助', '→ 次之', '第2步・坦職'),
          step('被動', '→ 剩餘', '第3步・冷門技最後'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 勇士之村 → 西部岩山／豬的海岸／螞蟻洞衝 30 → 拉怪圖＋組隊 → 石人寺院／龍巢 → 天空之城車隊至 100',
    leveling: [
      ...WARRIOR_EARLY,
      ...MID_PARTY,
      route(
        '35–50',
        '火焰之地、廢棄都市地鐵周邊可拉怪圖；群攻＋神聖之火成型後換密怪圖',
        '拉怪再群攻。組隊維持神聖之火，車隊更歡迎。',
        '人少：火焰之地1～3、地鐵較空車廂。',
      ),
      ...MID_50_70,
      ...LATE_GAME,
    ],
    tips: [
      '組隊：神聖之火優先於個人輸出技。',
      '單刷：攻速＋群攻順序更重要。',
      '換裝先看力量／敏捷。',
    ],
    disclaimer: DISCLAIMER,
  },

  狂戰士: {
    job: '狂戰士',
    path: '劍士 → 狂戰士 → 十字軍 → 英雄',
    role: '近戰高輸出；劍／斧系 DPS',
    statBuilds: [
      {
        name: '常規戰士',
        summary: '主力量，敏捷達裝備門檻。',
        details: ['換裝前核對敏捷', '剩餘全力量'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '劍／斧與防具看力量＋敏捷。' },
      { label: '裝備方向', text: '物攻、力量、攻速。' },
      { label: '藥水', text: '紅藥備足。' },
    ],
    stages: [
      WARRIOR_1ST,
      {
        title: '二轉・狂戰士・加點順序',
        summary:
          '武器精通（精準）→ 快速之劍／斧點滿 → 憤怒之擊／強化 → 主力連擊／群攻 → 氣功盾／防禦類',
        priorities: [
          step('精準之劍／精準之斧', '→ 先點高／滿', '第1步・擇一武器系'),
          step('快速之劍／快速之斧', '→ 點滿', '第2步・攻速'),
          step('憤怒之擊／力量強化類', '→ 優先', '第3步・傷害 Buff'),
          step('連擊／崩擊類主力', '→ 點滿', '第4步・輸出'),
          step('氣功盾／威力盾', '→ 次之', '第5步・減傷'),
          step('終極攻擊等', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・十字軍・加點順序',
        summary: '進階群攻／勇氣類 → 精通延伸 → 補生存',
        priorities: [
          step('十字軍主力群攻', '→ 優先點滿', '第1步'),
          step('勇氣／傷害增益', '→ 優先', '第2步'),
          step('精通延伸', '→ 點滿', '第3步'),
          step('生存被動', '→ 剩餘', '第4步'),
        ],
      },
      {
        title: '四轉・英雄（≤Lv.100）・加點順序',
        summary: '進階勇氣／主力斬擊 → 補被動；有書先點核心',
        priorities: [
          step('進階勇氣／主力輸出', '→ 能點先滿', '第1步'),
          step('群攻／收尾技', '→ 次之', '第2步'),
          step('被動', '→ 剩餘', '第3步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 勇士之村 → 西部岩山／豬的海岸／螞蟻洞衝 30 → 攻速成型後拉怪圖 → 石人寺院／龍巢 → 車隊至 100',
    leveling: [
      ...WARRIOR_EARLY,
      ...MID_PARTY,
      route(
        '35–50',
        '火焰之地、廢棄都市地鐵、玩具城外圍可拉怪圖',
        '快速之劍／斧點滿後手感與耗水明顯改善。',
        '人少：火焰之地支線、玩具城外圍非熱門圖。',
      ),
      ...MID_50_70,
      ...LATE_GAME,
    ],
    tips: [
      '先定武器系（劍或斧），精通與快速不要混點浪費。',
      '攻速滿了手感與耗水都會好一截。',
    ],
    disclaimer: DISCLAIMER,
  },

  見習騎士: {
    job: '見習騎士',
    path: '劍士 → 見習騎士 → 騎士 → 聖騎士',
    role: '屬性抗性／防禦坦；組隊前排',
    statBuilds: [
      {
        name: '常規戰士',
        summary: '主力量，敏捷達門檻。',
        details: ['坦職仍需輸出門檻達標', '剩餘力量'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '劍／鈍器＋盾常見力量敏捷需求。' },
      { label: '裝備方向', text: '防禦、HP、物攻兼顧。' },
      { label: '藥水', text: '紅藥；副本更看生存。' },
    ],
    stages: [
      WARRIOR_1ST,
      {
        title: '二轉・見習騎士・加點順序',
        summary:
          '精準之劍／鈍器 → 快速點滿 → 屬性抗性／魔力防禦 → 盾防禦 → 衝鋒／輸出技',
        priorities: [
          step('精準之劍／精準之鈍器', '→ 先點高／滿', '第1步'),
          step('快速之劍／快速之鈍器', '→ 點滿', '第2步'),
          step('魔力防禦／屬性抗性', '→ 優先點滿', '第3步・坦職核心'),
          step('盾防禦／防具精通', '→ 優先', '第4步'),
          step('衝鋒／騎士輸出技', '→ 點滿', '第5步・練功與拉怪'),
          step('其餘被動', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・騎士・加點順序',
        summary: '屬性抗性進階 → 防禦增益 → 輸出技',
        priorities: [
          step('進階屬抗／防禦', '→ 優先點滿', '第1步'),
          step('隊伍防護類', '→ 次之', '第2步'),
          step('輸出／衝鋒延伸', '→ 補滿', '第3步'),
        ],
      },
      {
        title: '四轉・聖騎士（≤Lv.100）・加點順序',
        summary: '聖系防護／屬抗 → 嘲諷／生存 → 輸出',
        priorities: [
          step('聖騎士核心防護', '→ 能點先滿', '第1步'),
          step('嘲諷／生存', '→ 次之', '第2步'),
          step('輸出技', '→ 剩餘', '第3步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 勇士之村 → 訓練衝 30 → 組隊圖發揮屬抗 → 女神之塔／副本車 → 車隊至 100',
    leveling: [
      ...WARRIOR_EARLY,
      ...MID_PARTY,
      route(
        '35–55',
        '廢棄都市組隊、愛奧斯塔組隊；屬性相關野圖單刷選好拉怪圖',
        '坦職野圖單刷偏慢；經驗以組隊為主。',
        '人少：屬性野圖支線、地鐵較空層。',
      ),
      route(
        '55–70',
        '女神之塔、石人寺院陪打、迷霧森林／龍族巢穴組隊',
        '發揮屬抗與防護。準備騎士／聖騎士。',
        '人少：石人寺院3～4陪打、迷霧森林支線。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '坦職加點：抗性與防禦優先於極限輸出。',
      '單刷仍需把快速與主力攻擊點起來。',
    ],
    disclaimer: DISCLAIMER,
  },

  獵人: {
    job: '獵人',
    path: '弓箭手 → 獵人 → 遊俠 → 箭神',
    role: '弓系遠程；爆發與風系後期',
    statBuilds: [
      {
        name: '主敏捷',
        summary: '敏捷全加，力量只點到穿裝。',
        details: ['力量＝裝備需求', '剩餘全敏捷'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '弓與防具看敏捷／力量。' },
      { label: '裝備方向', text: '物攻、敏捷、命中。' },
      { label: '消耗', text: '箭矢要夠；無形之箭可減負擔。' },
    ],
    stages: [
      ARCHER_1ST,
      {
        title: '二轉・獵人・加點順序',
        summary:
          '弓術精通 → 快速之弓點滿 → 無形之箭／穿透 → 炸彈箭／主力群攻 → 銀鷹等',
        priorities: [
          step('弓術精通（精準之弓）', '→ 先點高／滿', '第1步'),
          step('快速之弓', '→ 點滿', '第2步・攻速'),
          step('無形之箭', '→ 點滿', '第3步・省箭'),
          step('穿透之箭／箭雨類', '→ 優先', '第4步・清怪'),
          step('炸彈箭', '→ 點滿', '第5步・群攻'),
          step('銀鷹召喚等', '→ 剩餘', '第6步・依版本'),
        ],
      },
      {
        title: '三轉・遊俠・加點順序',
        summary: '進階群攻／暴風 → 精通延伸 → 召喚／輔助',
        priorities: [
          step('遊俠主力群攻', '→ 優先點滿', '第1步'),
          step('暴風／穿透進階', '→ 次之', '第2步'),
          step('精通／暴擊類', '→ 點滿', '第3步'),
          step('召喚／輔助', '→ 剩餘', '第4步'),
        ],
      },
      {
        title: '四轉・箭神（≤Lv.100）・加點順序',
        summary: '風系爆發／進階箭雨 → 補被動；有書先點核心',
        priorities: [
          step('箭神主力爆發', '→ 能點先滿', '第1步'),
          step('群攻收尾', '→ 次之', '第2步'),
          step('被動', '→ 剩餘', '第3步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 弓箭手訓練場 → 豬的海岸／螞蟻洞衝 30 → 螃蟹海灘／石人寺院 → 天空之城車隊至 100',
    leveling: [
      ...ARCHER_EARLY,
      ...MID_PARTY,
      ...CRAB_ROUTE,
      route(
        '40–55',
        '紅／青螃蟹海灘風箏、猴子森林；石人寺院1～4（弓熱門長蹲點）',
        '保持距離。石人寺院掉卷／武器多，可練功兼打寶。',
        '人少：猴子森林2、海龜沙灘、石人寺院3～4。',
      ),
      route(
        '55–70',
        '石人寺院續刷、迷霧森林／龍族巢穴、女神之塔',
        '穿透／炸彈箭成型後清圖更快。準備遊俠。',
        '人少：迷霧森林支線、石人寺院4；尖峰改女神之塔。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '攻速與精通優先，群攻次之。',
      '站位風箏，避免貼臉。',
    ],
    disclaimer: DISCLAIMER,
  },

  弩弓手: {
    job: '弩弓手',
    path: '弓箭手 → 弩弓手 → 狙擊手 → 神射手',
    role: '弩系遠程；貫穿與狙擊穩定輸出',
    statBuilds: [
      {
        name: '主敏捷',
        summary: '敏捷為主，力量達門檻。',
        details: ['力量剛好穿裝', '剩餘全敏捷'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '弩與防具看敏捷／力量。' },
      { label: '裝備方向', text: '物攻、敏捷、命中。' },
      { label: '消耗', text: '弩矢備足。' },
    ],
    stages: [
      ARCHER_1ST,
      {
        title: '二轉・弩弓手・加點順序',
        summary:
          '弩術精通 → 快速之弩點滿 → 穿透之箭優先 → 狙擊／鐵叉類 → 補無形與被動',
        priorities: [
          step('弩術精通（精準之弩）', '→ 先點高／滿', '第1步'),
          step('快速之弩', '→ 點滿', '第2步'),
          step('穿透之箭', '→ 優先點滿', '第3步・路線清怪關鍵'),
          step('狙擊／鐵叉類', '→ 點滿', '第4步・單體'),
          step('無形之箭', '→ 點滿', '第5步'),
          step('其餘被動', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・狙擊手・加點順序',
        summary: '貫穿進階 → 狙擊強化 → 精通／暴擊',
        priorities: [
          step('貫穿／群攻進階', '→ 優先點滿', '第1步'),
          step('狙擊強化', '→ 次之', '第2步'),
          step('精通／暴擊', '→ 點滿', '第3步'),
        ],
      },
      {
        title: '四轉・神射手（≤Lv.100）・加點順序',
        summary: '神射主力貫穿／爆發 → 補被動',
        priorities: [
          step('神射主力', '→ 能點先滿', '第1步'),
          step('輔助／被動', '→ 剩餘', '第2步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 弓箭手村 → 訓練場／螞蟻洞衝 30 → 直線穿透圖＋螃蟹海灘／石人寺院 → 車隊至 100',
    leveling: [
      ...ARCHER_EARLY,
      ...MID_PARTY,
      ...CRAB_ROUTE,
      route(
        '40–55',
        '直線怪多的圖發揮穿透；紅／青螃蟹海灘、石人寺院',
        '站位對齊穿透路線比硬剛重要。',
        '人少：青螃蟹海灘2、猴子迷宮、石人寺院3～4。',
      ),
      route(
        '55–70',
        '石人寺院、迷霧森林／龍族巢穴、女神之塔',
        '狙擊補刀＋穿透清線。準備狙擊手。',
        '人少：迷霧森林支線、石人寺院4。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '穿透路線比硬剛重要。',
      '精通＋攻速先滿再堆群攻。',
    ],
    disclaimer: DISCLAIMER,
  },

  刺客: {
    job: '刺客',
    path: '盜賊 → 刺客 → 暗殺者 → 夜使者',
    role: '飛鏢遠程；標記爆發',
    statBuilds: [
      {
        name: '主幸運',
        summary: '幸運全加，敏捷達命中／穿裝。',
        details: ['敏捷不夠先補命中裝', '剩餘全幸運'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '暗器與防具看幸運／敏捷。' },
      { label: '裝備方向', text: '物攻、幸運、命中。' },
      { label: '消耗', text: '飛鏢耗量大，錢要夠。' },
    ],
    stages: [
      THIEF_1ST,
      {
        title: '二轉・刺客・加點順序',
        summary:
          '精準暗器 → 極速暗殺點滿 → 強力投擲／飛鏢主力 → 吸血 → 幸運術／隱身補滿',
        priorities: [
          step('精準暗器', '→ 先點高／滿', '第1步・命中精通'),
          step('極速暗殺（攻速）', '→ 點滿', '第2步'),
          step('強力投擲／飛鏢連擊', '→ 點滿', '第3步・主力輸出'),
          step('吸血', '→ 優先', '第4步・續航'),
          step('幸運術', '→ 點滿', '第5步・暴擊／幸運向'),
          step('隱身／輕功補滿', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・暗殺者・加點順序',
        summary: '暗影穿透／標記類 → 攻速延伸 → 吸血進階',
        priorities: [
          step('暗殺者主力（影殺／穿透）', '→ 優先點滿', '第1步'),
          step('攻速／精通延伸', '→ 點滿', '第2步'),
          step('吸血／生存', '→ 次之', '第3步'),
        ],
      },
      {
        title: '四轉・夜使者（≤Lv.100）・加點順序',
        summary: '四轉標記／飛鏢爆發 → 補被動',
        priorities: [
          step('夜使者主力爆發', '→ 能點先滿', '第1步'),
          step('影分身／輔助', '→ 次之', '第2步'),
          step('被動', '→ 剩餘', '第3步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 廢棄都市場訓 → 北方工地／豬的海岸／螞蟻洞衝 30 → 遠程鏢圖＋組隊 → 車隊至 100（注意鏢耗）',
    leveling: [
      ...THIEF_EARLY,
      ...MID_PARTY,
      route(
        '35–50',
        '遠程安全圖風箏、紅／青螃蟹海灘外圍、玩具城外圍；穿插組隊',
        '飛鏢成本高，選好殺再換圖。命中不足先補眼鏡／武器。',
        '人少：紅螃蟹海灘2、青螃蟹海灘2、玩具城外圍支線。',
      ),
      route(
        '50–70',
        '石人寺院（土飛鏢掉落友善）、進化妖魔、女神之塔',
        '標記／投擲成型後效率上升。準備暗殺者。',
        '人少：石人寺院3～4、遺失的時間2。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '攻速與精通先滿，再堆投擲傷害。',
      '鏢錢是隱形成本。',
    ],
    disclaimer: DISCLAIMER,
  },

  俠盜: {
    job: '俠盜',
    path: '盜賊 → 俠盜 → 神偷 → 暗影神偷',
    role: '近戰短刀；迴旋斬群攻',
    statBuilds: [
      {
        name: '主幸運',
        summary: '幸運為主，敏捷／力量達門檻。',
        details: ['先滿足穿裝', '剩餘全幸運'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '短刀與防具看幸運／敏捷。' },
      { label: '裝備方向', text: '物攻、幸運、攻速。' },
      { label: '藥水', text: '近戰紅藥備足。' },
    ],
    stages: [
      THIEF_1ST,
      {
        title: '二轉・俠盜・加點順序',
        summary:
          '精準之刀 → 極速盜賊點滿 → 迴旋斬盡快滿 → 妙手術／竊取 → 補隱身與被動',
        priorities: [
          step('精準之刀', '→ 先點高／滿', '第1步'),
          step('極速盜賊（攻速）', '→ 點滿', '第2步'),
          step('迴旋斬', '→ 盡快點滿', '第3步・群攻靈魂技'),
          step('妙手術／竊取類', '→ 次之', '第4步・依玩法'),
          step('隱身／輕功補滿', '→ 優先生存', '第5步'),
          step('其餘被動', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・神偷・加點順序',
        summary: '迴旋進階／落地斬 → 攻速精通 → 輔助',
        priorities: [
          step('神偷主力群攻', '→ 優先點滿', '第1步'),
          step('攻速／精通延伸', '→ 點滿', '第2步'),
          step('輔助／生存', '→ 剩餘', '第3步'),
        ],
      },
      {
        title: '四轉・暗影神偷（≤Lv.100）・加點順序',
        summary: '四轉迴旋／影襲 → 補被動',
        priorities: [
          step('暗影神偷主力', '→ 能點先滿', '第1步'),
          step('影分身／輔助', '→ 次之', '第2步'),
          step('被動', '→ 剩餘', '第3步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 廢棄都市 → 北方工地／螞蟻洞衝 30 → 迴旋轉型後拉怪圖 → 石人寺院／龍巢 → 車隊至 100',
    leveling: [
      ...THIEF_EARLY,
      ...MID_PARTY,
      route(
        '35–50',
        '火焰之地、廢棄都市地鐵周邊可拉怪圖',
        '迴旋斬點滿前後練功差巨大；滿前先過渡，滿後大拉。',
        '人少：火焰之地1～3、地鐵較空車廂。',
      ),
      ...MID_50_70,
      ...LATE_GAME,
    ],
    tips: [
      '迴旋斬點滿前後練功差巨大。',
      '先攻速再堆迴旋，手感最好。',
    ],
    disclaimer: DISCLAIMER,
  },

  打手: {
    job: '打手',
    path: '海盜 → 打手 → 格鬥家 → 拳霸',
    role: '近戰拳套；能量與近身群攻',
    statBuilds: [
      {
        name: '主力量',
        summary: '力量為主，敏捷達門檻。',
        details: ['敏捷穿裝', '剩餘力量'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '拳套／防具看力量敏捷。' },
      { label: '裝備方向', text: '物攻、力量、攻速。' },
      { label: '藥水', text: '紅藥；注意能量管理。' },
    ],
    stages: [
      PIRATE_1ST,
      {
        title: '二轉・打手・加點順序',
        summary:
          '精準拳套 → 快速點滿 → 能量爆發／衝擊拳 → 升級恢復 → 補防禦被動',
        priorities: [
          step('精準之拳／拳套精通', '→ 先點高／滿', '第1步'),
          step('快速拳擊（攻速）', '→ 點滿', '第2步'),
          step('能量衝擊／衝擊拳類', '→ 點滿', '第3步・主力'),
          step('能量恢復／忍耐', '→ 優先', '第4步・續航'),
          step('防禦／閃避被動', '→ 次之', '第5步'),
          step('其餘', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・格鬥家・加點順序',
        summary: '能量進階群攻 → 攻速精通 → 生存',
        priorities: [
          step('格鬥家主力群攻', '→ 優先點滿', '第1步'),
          step('能量／攻速延伸', '→ 點滿', '第2步'),
          step('生存被動', '→ 剩餘', '第3步'),
        ],
      },
      {
        title: '四轉・拳霸（≤Lv.100）・加點順序',
        summary: '拳霸核心能量技 → 補被動',
        priorities: [
          step('拳霸主力', '→ 能點先滿', '第1步'),
          step('輔助／被動', '→ 剩餘', '第2步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 諾特勒斯碼頭 → 豬的海岸／螞蟻洞衝 30 → 近戰拉怪圖 → 石人寺院／龍巢 → 車隊至 100',
    leveling: [
      ...PIRATE_EARLY,
      ...MID_PARTY,
      route(
        '35–50',
        '火焰之地、廢棄都市地鐵周邊可拉怪圖',
        '能量循環穩了再換密怪圖；紅藥備足。',
        '人少：火焰之地1～3、非熱門拉怪圖。',
      ),
      ...MID_50_70,
      ...LATE_GAME,
    ],
    tips: [
      '能量斷了輸出會空轉，恢復類別忽略。',
      '攻速優先於盲目堆傷害技。',
    ],
    disclaimer: DISCLAIMER,
  },

  槍手: {
    job: '槍手',
    path: '海盜 → 槍手 → 神槍手 → 槍神',
    role: '遠程槍械；彈幕與屬性彈',
    statBuilds: [
      {
        name: '主敏捷',
        summary: '敏捷為主，力量達門檻。',
        details: ['力量穿裝', '剩餘敏捷'],
      },
    ],
    gearNotes: [
      { label: '能力門檻', text: '槍與防具看敏捷／力量。' },
      { label: '裝備方向', text: '物攻、敏捷、命中。' },
      { label: '消耗', text: '子彈／藍耗留意。' },
    ],
    stages: [
      PIRATE_1ST,
      {
        title: '二轉・槍手・加點順序',
        summary:
          '槍械精通 → 快速射擊點滿 → 雙彈／散射主力 → 屬性彈 → 補迴避與被動',
        priorities: [
          step('精準之槍／槍械精通', '→ 先點高／滿', '第1步'),
          step('快速射擊', '→ 點滿', '第2步・攻速'),
          step('雙彈射擊／散射', '→ 點滿', '第3步・主力清怪'),
          step('屬性彈／火焰彈類', '→ 優先', '第4步・依地圖弱屬'),
          step('迴避／防禦被動', '→ 次之', '第5步'),
          step('其餘', '→ 剩餘', '第6步'),
        ],
      },
      {
        title: '三轉・神槍手・加點順序',
        summary: '彈幕進階 → 屬性彈強化 → 精通攻速',
        priorities: [
          step('神槍主力彈幕', '→ 優先點滿', '第1步'),
          step('屬性彈進階', '→ 次之', '第2步'),
          step('精通／攻速', '→ 點滿', '第3步'),
        ],
      },
      {
        title: '四轉・槍神（≤Lv.100）・加點順序',
        summary: '槍神核心彈幕 → 補被動',
        priorities: [
          step('槍神主力', '→ 能點先滿', '第1步'),
          step('輔助／被動', '→ 剩餘', '第2步'),
        ],
      },
    ],
    levelingIntro:
      '楓之島 → 諾特勒斯碼頭 → 豬的海岸／螞蟻洞衝 30 → 螃蟹海灘風箏 → 石人寺院 → 車隊至 100',
    leveling: [
      ...PIRATE_EARLY,
      ...MID_PARTY,
      ...CRAB_ROUTE,
      route(
        '40–55',
        '紅螃蟹海灘1～2、青螃蟹海灘、海龜沙灘風箏；子彈與藥水同步補給',
        '站位優先；子彈斷＝停擺。',
        '人少：紅螃蟹海灘2、海龜沙灘、青螃蟹海灘2。',
      ),
      route(
        '55–70',
        '石人寺院、迷霧森林／龍族巢穴外圍、女神之塔',
        '屬性彈對弱屬圖更香。準備神槍手。',
        '人少：石人寺院3～4、迷霧森林支線；尖峰改女神之塔。',
      ),
      ...LATE_GAME,
    ],
    tips: [
      '保持距離；子彈斷＝停擺。',
      '精通＋攻速先滿再堆屬性彈。',
    ],
    disclaimer: DISCLAIMER,
  },
}

export function getSkillGuide(job: Job): SkillGuide {
  return SKILL_GUIDES[job]
}

export type LevelBracketStatus = 'past' | 'current' | 'future' | 'unknown'

/** Parse "22–30", "1–8／10", "35–43（電閃成型後）", "70–85" → min/max. */
export function parseLevelRange(range: string): { min: number; max: number } | null {
  const nums = [...range.matchAll(/\d+/g)].map((m) => Number(m[0]))
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) return null
  if (nums.length === 1) {
    const n = nums[0]!
    return { min: n, max: n }
  }
  return { min: Math.min(...nums), max: Math.max(...nums) }
}

export function bracketStatus(
  range: string,
  level: number | null,
): LevelBracketStatus {
  if (level === null) return 'unknown'
  const parsed = parseLevelRange(range)
  if (!parsed) return 'unknown'
  if (level > parsed.max) return 'past'
  if (level < parsed.min) return 'future'
  return 'current'
}

/** Infer stage level window from title text. */
export function stageBracketStatus(
  title: string,
  level: number | null,
): LevelBracketStatus {
  if (level === null) return 'unknown'
  const lvRange = title.match(/Lv\.?\s*(\d+)\s*[～~\-–—]\s*(\d+)/i)
  if (lvRange) {
    const min = Number(lvRange[1])
    const max = Number(lvRange[2])
    if (level > max) return 'past'
    if (level < min) return 'future'
    return 'current'
  }
  if (title.includes('一轉')) {
    if (level > 30) return 'past'
    if (level < 8) return 'future'
    return 'current'
  }
  if (title.includes('二轉')) {
    if (level > 70) return 'past'
    if (level < 30) return 'future'
    return 'current'
  }
  if (title.includes('三轉')) {
    if (level > 100) return 'past'
    if (level < 70) return 'future'
    return 'current'
  }
  if (title.includes('四轉')) {
    if (level < 70) return 'future'
    return 'current'
  }
  return 'unknown'
}

export function findCurrentLevelingIndex(
  leveling: LevelRoute[],
  level: number | null,
): number {
  if (level === null) return -1
  let current = -1
  for (let i = 0; i < leveling.length; i++) {
    if (bracketStatus(leveling[i]!.range, level) === 'current') current = i
  }
  if (current >= 0) return current
  // If between gaps, pick the next future route.
  for (let i = 0; i < leveling.length; i++) {
    if (bracketStatus(leveling[i]!.range, level) === 'future') return i
  }
  return leveling.length > 0 ? leveling.length - 1 : -1
}

export function clampPlayerLevel(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n)) return null
  const rounded = Math.round(n)
  if (rounded < 1 || rounded > 100) return null
  return rounded
}

export function formatSkillGuideText(
  guide: SkillGuide,
  currentLevel?: number | null,
): string {
  const lines: string[] = [
    `【${guide.job}】經典版攻略（100級／四轉）`,
    `轉職路線：${guide.path}`,
    `定位：${guide.role}`,
  ]
  if (currentLevel) {
    lines.push(`當前等級：Lv.${currentLevel}`)
  }
  lines.push(
    '',
    '■ 伺服器規則',
    ...SERVER_RULES.items.map((i) => `- ${i}`),
    '',
    '■ 能力值配點',
  )

  for (const build of guide.statBuilds) {
    lines.push(`【${build.name}】${build.summary}`)
    for (const d of build.details) lines.push(`  - ${d}`)
  }

  lines.push('', '■ 裝備與門檻')
  for (const g of guide.gearNotes) {
    lines.push(`- ${g.label}：${g.text}`)
  }

  lines.push('', '■ 技能加點順序（請依序）')
  for (const stage of guide.stages) {
    const st = stageBracketStatus(stage.title, currentLevel ?? null)
    const mark =
      st === 'current' ? '【目前】' : st === 'past' ? '【已過】' : ''
    lines.push(`【${stage.title}】${mark}`)
    lines.push(`配方：${stage.summary}`)
    stage.priorities.forEach((p, i) => {
      const note = p.note ? `（${p.note}）` : ''
      lines.push(`  ${i + 1}. ${p.skill} ${p.points}${note}`)
    })
  }

  lines.push('', '■ 詳細練功路線')
  lines.push(`總覽：${guide.levelingIntro}`)
  const focus = findCurrentLevelingIndex(guide.leveling, currentLevel ?? null)
  guide.leveling.forEach((routeItem, index) => {
    const st = bracketStatus(routeItem.range, currentLevel ?? null)
    const mark =
      index === focus || st === 'current'
        ? ' ← 目前建議'
        : st === 'past'
          ? '（已過）'
          : ''
    const note = routeItem.note ? `\n    ※ ${routeItem.note}` : ''
    const quiet = routeItem.quiet ? `\n    ○ 人少：${routeItem.quiet}` : ''
    const weak = routeItem.weak ? `\n    ◆ 弱屬：${routeItem.weak}` : ''
    lines.push(
      `- ${routeItem.range}：${routeItem.spots}${mark}${note}${quiet}${weak}`,
    )
  })

  lines.push('', '■ 小提示')
  for (const tip of guide.tips) lines.push(`- ${tip}`)
  lines.push('', guide.disclaimer)
  return lines.join('\n')
}
