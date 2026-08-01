import type { Job } from '../types'

export interface SkillPriority {
  skill: string
  points: string
  note?: string
}

export interface SkillStage {
  title: string
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
  spots: string
  note?: string
}

export interface SkillGuide {
  job: Job
  path: string
  role: string
  /** Primary recommended AP approach */
  statBuilds: StatBuild[]
  gearNotes: GearNote[]
  stages: SkillStage[]
  leveling: LevelRoute[]
  tips: string[]
  disclaimer: string
}

/** Shared classic-server framing for this draw tool. */
export const SERVER_RULES = {
  title: '經典版核心規則（本站預設）',
  items: [
    '等級上限暫定 100 級',
    '目前最高開放至二轉（共 12 種二轉分支）',
    '配點可走純血統（如全智法）或常規配點',
    '仍需注意力量／敏捷／智力／幸運的裝備門檻',
  ],
}

/**
 * Fan-made guides tailored to lv.100 / 2nd-job classic.
 * Skill names & map names may differ slightly by patch — treat as reference.
 */
export const SKILL_GUIDES: Record<Job, SkillGuide> = {
  槍騎兵: {
    job: '槍騎兵',
    path: '初心者 → 劍士（一轉）→ 槍騎兵（二轉）',
    role: '近戰群攻／隊伍血量增益；100 級封頂下以刷怪＋組隊增益為主',
    statBuilds: [
      {
        name: '常規戰士（推薦）',
        summary: '主力量，敏捷只點到能穿當前階段裝備。',
        details: [
          '一轉前：力量為主，敏捷依武器／防具需求補點',
          '二轉後：持續堆力量；換裝前先核對敏捷門檻再補',
          '不要無腦全力量——卡裝等於輸出與防禦雙掛',
        ],
      },
      {
        name: '純血統提醒',
        summary: '戰士較少走「純某屬」；重點仍是力量＋達標敏捷。',
        details: [
          '若版本有高敏門檻長槍／盔甲，預留 AP 或用卷軸／裝備補敏',
          'HP 洗點（若開放）優先於亂點副屬',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '長槍／矛、盔甲常看力量＋敏捷。換裝前打開需求再點 AP。',
      },
      {
        label: '裝備方向',
        text: '優先物攻、力量；防具顧 HP／防禦。組隊價值靠神聖之火，武器傷害仍重要。',
      },
      {
        label: '藥水',
        text: '近戰吃傷多，紅藥備足；後期地圖注意拉怪節奏。',
      },
    ],
    stages: [
      {
        title: '一轉・劍士（約 Lv.10）',
        summary: '先把生存與基本輸出打底，衝到 30 轉槍騎兵。',
        priorities: [
          { skill: '自身強化', points: '優先', note: '減傷續航' },
          { skill: '生命恢復', points: '適量', note: '省紅藥' },
          { skill: '劍氣縱橫', points: '主力', note: '一轉清怪' },
          { skill: '武器精通', points: '點滿', note: '命中與傷害' },
        ],
      },
      {
        title: '二轉・槍騎兵（約 Lv.30，本版本終點）',
        summary: '100 級內以精通、攻速、神聖之火與群攻成型為目標。',
        priorities: [
          { skill: '精準之槍', points: '先點', note: '命中／傷害基礎' },
          { skill: '快速之槍', points: '盡快點滿', note: '攻速核心' },
          { skill: '神聖之火', points: '必點', note: '全隊 HP，組隊剛需' },
          { skill: '禦魔陣', points: '次之', note: '減傷' },
          { skill: '槍連擊／穿刺群攻', points: '主力', note: '刷怪輸出' },
        ],
      },
    ],
    leveling: [
      {
        range: '1–10',
        spots: '楓之島教學怪 → 各新手村外圍',
        note: '盡快走完新手引導，盡快一轉',
      },
      {
        range: '10–21',
        spots: '勇士之村西側岩石山／訓練場木妖',
        note: '劍士主城附近練，少跑圖',
      },
      {
        range: '21–30',
        spots: '勇士之村岩石路、遺跡發掘地；或螞蟻洞刺菇／殭屍菇',
        note: '衝 30 二轉；可組隊加速',
      },
      {
        range: '30–40',
        spots: '地鐵／玩具城附近、火野豬等戰士友善圖',
        note: '二轉技能起來後再換群怪圖',
      },
      {
        range: '40–55',
        spots: '火焰之地周邊、石巨人系、適合拉怪的平臺圖',
        note: '用穿刺／群攻聚怪清場',
      },
      {
        range: '55–70',
        spots: '魔龍領土、混種石巨人、林中之城高經驗圖',
        note: '注意命中；不夠就補精通／裝備',
      },
      {
        range: '70–100',
        spots: '天空之城周邊、高經驗精英圖、組隊任務混等',
        note: '100 封頂，轉為刷裝／組隊效率',
      },
    ],
    tips: [
      '刷怪盡量拉怪再群攻；神聖之火組隊時維持常駐。',
      '換裝前先看力量／敏捷需求，避免 AP 點錯卡裝。',
      '本版本無三轉，技能點集中在槍騎兵核心即可。',
    ],
    disclaimer:
      '依「100 級／最高二轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },

  僧侶: {
    job: '僧侶',
    path: '初心者 → 法師（一轉）→ 僧侶（二轉）',
    role: '隊伍核心輔助（治療／祝福／淨化）；不死系可兼輸出；100 級內組隊價值極高',
    statBuilds: [
      {
        name: '全智法（純血統・推薦開荒）',
        summary: '智力全點，換裝靠任務裝／低門檻裝或卷軸。',
        details: [
          '優點：魔攻／MP 成長直觀，懶人友善',
          '缺點：部分高幸運門檻袍／手套可能暫時穿不上',
          '適合：固定車、先衝等再慢慢補裝',
        ],
      },
      {
        name: '常規／裝備向',
        summary: '主智力，預留少量幸運以滿足治癒相關或防具門檻（視版本）。',
        details: [
          '換裝前核對智力／幸運需求',
          '若版本治癒吃幸運係數，可小幅補幸，但仍以智力為主',
          '不要為了「看起來像裝備法」亂點到四維平均',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '法袍／手套／鞋常見智力或幸運需求。點 AP 前先看下一階裝備。',
      },
      {
        label: '裝備方向',
        text: '優先魔法力、智力、MP；盾／傘類依掉落與門檻挑選。',
      },
      {
        label: '藥水',
        text: '藍藥仍要帶；有魔力吸收後可省，但組隊狂奶時仍可能缺藍。',
      },
    ],
    stages: [
      {
        title: '一轉・法師（約 Lv.8）',
        summary: '魔力爪過渡到 30 等二轉。',
        priorities: [
          { skill: '魔力爪', points: '主力點滿', note: '一轉輸出' },
          { skill: '魔力擴展／MP 相關', points: '適量', note: '藍量' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍，別一直開' },
        ],
      },
      {
        title: '二轉・僧侶（約 Lv.30，本版本終點）',
        summary: '治療與祝福優先，再補瞬移、吸收與輔助光環。',
        priorities: [
          { skill: '瞬間移動', points: '先點 1', note: '保命' },
          { skill: '群體治癒', points: '盡快點滿', note: '奶＋打不死系' },
          { skill: '魔力吸收', points: '點滿', note: '續航' },
          { skill: '瞬間移動', points: '補滿', note: '機動' },
          { skill: '神聖之光／祝福', points: '優先', note: '隊伍增益' },
          { skill: '神聖之箭等', points: '剩餘點', note: '補輸出' },
        ],
      },
    ],
    leveling: [
      {
        range: '1–8',
        spots: '楓之島 → 魔法森林轉職',
        note: '盡快走完引導一轉',
      },
      {
        range: '8–21',
        spots: '魔法森林南部訓練場、弓箭手村外圍菇菇',
        note: '魔力爪兩下內可殺再換圖',
      },
      {
        range: '21–30',
        spots: '勇士之村岩石路／發掘地；螞蟻洞刺菇、殭屍菇',
        note: '衝 30 轉僧侶；螞蟻洞適合組隊',
      },
      {
        range: '30–37',
        spots: '黑肥肥、遺跡發掘地、岩石路（技能未成型前可續用魔力爪）',
        note: '群體治癒點起來後找不死系',
      },
      {
        range: '37–50',
        spots: '小幽靈、進化妖魔、天使猴、猴子沼澤',
        note: '僧侶熱門續航圖；可邊奶邊打',
      },
      {
        range: '35–50',
        spots: '玩具城 101 組隊任務',
        note: '經驗＋眼鏡等獎勵，三職都適合',
      },
      {
        range: '50–70',
        spots: '大幽靈、妖魔隊長、女神組隊任務',
        note: '組隊效率通常優於硬單刷',
      },
      {
        range: '70–100',
        spots: '高經驗組隊圖、天空之城周邊、車隊固定練等點',
        note: '100 封頂後轉輔助定位刷裝／帶隊',
      },
    ],
    tips: [
      '單刷慢是正常的；僧侶強在組隊與省藥。',
      '不死系地圖讓群體治癒同時輸出。',
      '換裝先看智力／幸運門檻，全智玩家可用任務裝過渡。',
    ],
    disclaimer:
      '依「100 級／最高二轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },

  冰雷巫師: {
    job: '冰雷巫師',
    path: '初心者 → 法師（一轉）→ 冰雷巫師（二轉）',
    role: '遠程雷電群攻＋冰控；100 級內單刷清怪首選之一，耗藍偏高',
    statBuilds: [
      {
        name: '全智法（純血統・強烈推薦）',
        summary: '智力全點，開荒最省心，魔攻與 MP 同步成長。',
        details: [
          '二轉前／成型期幾乎都建議全智',
          '高幸運門檻裝等有裝再考慮，不必提早散點',
          '命中不足時優先換武器／眼鏡／精通類，而不是亂點幸運',
        ],
      },
      {
        name: '常規裝備向',
        summary: '主智力，僅在確定下一件關鍵裝備缺幸運／其他屬時再補。',
        details: [
          '每次升等先確認下一階袍／手套／鞋需求',
          '補副屬以「剛好穿上」為原則，剩餘回智力',
          '經典版公式下，亂點四維通常最虧',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '法師裝多看智力；部分高級裝要幸運。點 AP 前對照裝備需求表。',
      },
      {
        label: '裝備方向',
        text: '魔法攻擊力、智力、MP；雨傘／杖依掉落與弱屬地圖調整。',
      },
      {
        label: '藥水',
        text: '藍藥必備；魔力吸收可減耗，但電閃雷鳴清圖仍很喝藍。',
      },
    ],
    stages: [
      {
        title: '一轉・法師（約 Lv.8）',
        summary: '魔力爪練到 30，再轉冰雷。',
        priorities: [
          { skill: '魔力爪', points: '點滿', note: '銜接二轉前主力' },
          { skill: '魔力擴展／MP', points: '適量', note: '減少斷藍' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍，緊急再用' },
        ],
      },
      {
        title: '二轉・冰雷巫師（約 Lv.30，本版本終點）',
        summary: '電閃雷鳴優先成型，再補瞬移、吸收、精神強化與冰錐。',
        priorities: [
          { skill: '瞬間移動', points: '先 1', note: '保命趕路' },
          { skill: '電閃雷鳴', points: '點滿 30', note: '清怪核心' },
          { skill: '瞬間移動', points: '補滿 20', note: '機動' },
          { skill: '魔力吸收', points: '點滿 20', note: '回藍' },
          { skill: '精神強化', points: '點滿 20', note: '魔攻 buff' },
          { skill: '冰錐術', points: '點滿', note: '控場＋補傷害' },
          { skill: '緩速術', points: '1 點即可', note: '夠用就好' },
        ],
      },
    ],
    leveling: [
      {
        range: '1–8',
        spots: '楓之島 → 魔法森林一轉',
        note: '盡快轉職',
      },
      {
        range: '8–21',
        spots: '魔法森林訓練場、弓箭手村菇菇寶貝',
        note: '魔力爪穩定兩下殺再換',
      },
      {
        range: '21–30',
        spots: '遺跡發掘地、岩石路；螞蟻洞衝二等',
        note: '30 立刻轉冰雷巫師',
      },
      {
        range: '30–35',
        spots: '火肥肥等過渡圖（技能未起前可續爪）',
        note: '電閃雷鳴點出來再換群攻圖',
      },
      {
        range: '35–43',
        spots: '紅螃蟹海灘（弱雷）',
        note: '冰雷友善圖',
      },
      {
        range: '35–50',
        spots: '玩具城 101 組隊任務',
        note: '穩定經驗＋獎勵',
      },
      {
        range: '43–55',
        spots: '青螃蟹海灘、海龜沙灘',
        note: '電閃＋冰錐節奏清場',
      },
      {
        range: '55–70',
        spots: '混種石巨人、魔龍領土、女神組隊',
        note: '注意藍耗與走位',
      },
      {
        range: '70–100',
        spots: '天空之城高經驗圖、星光精靈周邊、車隊練等點',
        note: '100 封頂後轉效率刷裝／帶刷',
      },
    ],
    tips: [
      '保持距離，冰控防止怪貼臉。',
      '藍藥斷貨＝停擺，出圖前點好數量。',
      '本版本無三／四轉，二轉技能點滿核心即可，不必留點給後續轉職。',
    ],
    disclaimer:
      '依「100 級／最高二轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },
}

export function getSkillGuide(job: Job): SkillGuide {
  return SKILL_GUIDES[job]
}

export function formatSkillGuideText(guide: SkillGuide): string {
  const lines: string[] = [
    `【${guide.job}】經典版攻略（100級／二轉）`,
    `轉職路線：${guide.path}`,
    `定位：${guide.role}`,
    '',
    '■ 伺服器規則',
    ...SERVER_RULES.items.map((i) => `- ${i}`),
    '',
    '■ 能力值配點',
  ]

  for (const build of guide.statBuilds) {
    lines.push(`【${build.name}】${build.summary}`)
    for (const d of build.details) lines.push(`  - ${d}`)
  }

  lines.push('', '■ 裝備與門檻')
  for (const g of guide.gearNotes) {
    lines.push(`- ${g.label}：${g.text}`)
  }

  lines.push('', '■ 技能加點')
  for (const stage of guide.stages) {
    lines.push(`【${stage.title}】`)
    lines.push(stage.summary)
    for (const p of stage.priorities) {
      const note = p.note ? `（${p.note}）` : ''
      lines.push(`- ${p.skill}：${p.points}${note}`)
    }
  }

  lines.push('', '■ 練功路線')
  for (const route of guide.leveling) {
    const note = route.note ? `｜${route.note}` : ''
    lines.push(`- ${route.range}：${route.spots}${note}`)
  }

  lines.push('', '■ 小提示')
  for (const tip of guide.tips) lines.push(`- ${tip}`)
  lines.push('', guide.disclaimer)
  return lines.join('\n')
}
