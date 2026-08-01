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
    '目前最高開放至四轉',
    '配點可走純血統（如全智法）或常規配點',
    '仍需注意力量／敏捷／智力／幸運的裝備門檻',
  ],
}

/**
 * Fan-made guides for classic: lv.100 cap, up to 4th job.
 * Skill / map names may differ by patch — treat as reference.
 */
export const SKILL_GUIDES: Record<Job, SkillGuide> = {
  槍騎兵: {
    job: '槍騎兵',
    path: '劍士 → 槍騎兵 → 龍騎士 → 黑騎士',
    role: '近戰群攻／隊伍血量增益；四轉黑騎士為坦輸出與組隊核心',
    statBuilds: [
      {
        name: '常規戰士（推薦）',
        summary: '主力量，敏捷只點到能穿當前階段裝備。',
        details: [
          '一～二轉：力量為主，敏捷依武器／防具需求補點',
          '三～四轉：持續堆力量；換高階裝前先核對敏捷門檻',
          '不要無腦全力量——卡裝等於輸出與防禦雙掛',
        ],
      },
      {
        name: '純血統提醒',
        summary: '戰士較少走「純某屬」；重點仍是力量＋達標敏捷。',
        details: [
          '高敏門檻長槍／盔甲：預留 AP 或用卷軸／裝備補敏',
          '若有 HP 洗點活動，優先於亂點副屬',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '長槍／矛、盔甲常看力量＋敏捷。每次換裝前打開需求再點 AP。',
      },
      {
        label: '裝備方向',
        text: '優先物攻、力量；防具顧 HP／防禦。神聖之火讓你組隊搶手，武器傷害仍重要。',
      },
      {
        label: '藥水',
        text: '近戰吃傷多，紅藥備足；後期拉怪注意節奏。',
      },
    ],
    stages: [
      {
        title: '一轉・劍士（約 Lv.10）',
        summary: '生存與基本輸出打底，衝 30 轉槍騎兵。',
        priorities: [
          { skill: '自身強化', points: '優先', note: '減傷' },
          { skill: '生命恢復', points: '適量', note: '省紅藥' },
          { skill: '劍氣縱橫', points: '主力', note: '一轉清怪' },
          { skill: '武器精通', points: '點滿', note: '命中與傷害' },
        ],
      },
      {
        title: '二轉・槍騎兵（約 Lv.30）',
        summary: '精通、攻速、神聖之火與群攻成型。',
        priorities: [
          { skill: '精準之槍', points: '先點', note: '命中／傷害' },
          { skill: '快速之槍', points: '盡快點滿', note: '攻速' },
          { skill: '神聖之火', points: '必點', note: '全隊 HP' },
          { skill: '禦魔陣', points: '次之', note: '減傷' },
          { skill: '槍連擊／穿刺群攻', points: '主力', note: '刷怪' },
        ],
      },
      {
        title: '三轉・龍騎士（約 Lv.70）',
        summary: '強化槍系群攻與龍騎士核心輸出。',
        priorities: [
          { skill: '龍之奉獻／槍系進階群攻', points: '優先', note: '依版本技能名' },
          { skill: '關鍵被動／精通延伸', points: '點滿', note: '穩定傷害' },
          { skill: '神聖之火（二轉）', points: '維持', note: '組隊價值不變' },
        ],
      },
      {
        title: '四轉・黑騎士（約 Lv.120 門檻視版本；本服等級上限 100）',
        summary: '在 100 級上限下，以能點到的四轉技能優先序為準。',
        priorities: [
          { skill: '黑騎士主力輸出／群攻', points: '能點先點', note: '依技能書與等級' },
          { skill: '生存／嘲諷類輔助', points: '次之', note: '組隊坦職' },
          { skill: '剩餘點數', points: '補被動', note: '不要浪費在冷門技' },
        ],
      },
    ],
    leveling: [
      {
        range: '1–10',
        spots: '楓之島 → 勇士之村一轉',
        note: '盡快走完引導',
      },
      {
        range: '10–30',
        spots: '岩石山、遺跡發掘地、螞蟻洞',
        note: '衝槍騎兵二轉',
      },
      {
        range: '30–50',
        spots: '地鐵／玩具城周邊、火野豬、可拉怪平臺圖',
        note: '群攻成型後換圖',
      },
      {
        range: '50–70',
        spots: '石巨人、魔龍領土、林中之城高經驗圖',
        note: '準備三轉龍騎士',
      },
      {
        range: '70–100',
        spots: '天空之城高經驗圖、組隊任務、車隊練等點',
        note: '100 封頂；四轉技能依開放進度點',
      },
    ],
    tips: [
      '刷怪拉怪再群攻；組隊維持神聖之火。',
      '換裝先看力量／敏捷，避免卡裝。',
      '四轉技能書與等級門檻依版本，能點的核心先點滿。',
    ],
    disclaimer:
      '依「100 級／最高四轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },

  僧侶: {
    job: '僧侶',
    path: '法師 → 僧侶 → 祭司 → 主教',
    role: '隊伍核心輔助；四轉主教為治療／復活／增益全能',
    statBuilds: [
      {
        name: '全智法（純血統・推薦開荒）',
        summary: '智力全點，換裝靠任務裝／低門檻裝或卷軸。',
        details: [
          '優點：魔攻／MP 成長直觀',
          '缺點：高幸運門檻裝可能暫時穿不上',
          '適合：固定車、先衝等再補裝',
        ],
      },
      {
        name: '常規／裝備向',
        summary: '主智力，預留少量幸運以滿足防具或版本治癒係數。',
        details: [
          '換裝前核對智力／幸運需求',
          '副屬以「剛好穿上」為原則，剩餘回智力',
          '不要四維平均亂點',
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
        text: '優先魔法力、智力、MP；盾／傘依掉落與門檻挑選。',
      },
      {
        label: '藥水',
        text: '藍藥仍要帶；狂奶時魔力吸收也不一定夠。',
      },
    ],
    stages: [
      {
        title: '一轉・法師（約 Lv.8）',
        summary: '魔力爪過渡到 30 轉僧侶。',
        priorities: [
          { skill: '魔力爪', points: '主力點滿', note: '一轉輸出' },
          { skill: '魔力擴展／MP', points: '適量', note: '藍量' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍' },
        ],
      },
      {
        title: '二轉・僧侶（約 Lv.30）',
        summary: '治療、祝福、瞬移、吸收優先。',
        priorities: [
          { skill: '瞬間移動', points: '先 1', note: '保命' },
          { skill: '群體治癒', points: '盡快點滿', note: '奶＋不死系' },
          { skill: '魔力吸收', points: '點滿', note: '續航' },
          { skill: '瞬間移動', points: '補滿', note: '機動' },
          { skill: '神聖之光／祝福', points: '優先', note: '隊伍增益' },
          { skill: '神聖之箭等', points: '剩餘', note: '補輸出' },
        ],
      },
      {
        title: '三轉・祭司（約 Lv.70）',
        summary: '強化群體輔助與聖光體系。',
        priorities: [
          { skill: '進階治癒／聖光類', points: '優先', note: '組隊核心' },
          { skill: '淨化／防禦增益', points: '次之', note: '解狀態' },
          { skill: '輸出向聖技', points: '視練等需求', note: '單刷補刀' },
        ],
      },
      {
        title: '四轉・主教（本服等級上限 100）',
        summary: '復活與頂級輔助優先；依技能書與可點等級分配。',
        priorities: [
          { skill: '復活相關', points: '能點先點', note: '副本剛需' },
          { skill: '進階祝福／神聖系增益', points: '優先', note: '全隊強度' },
          { skill: '其餘輔助／輸出', points: '補滿', note: '依車隊需求' },
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
        range: '8–30',
        spots: '訓練場、岩石路、螞蟻洞',
        note: '衝僧侶二轉',
      },
      {
        range: '30–50',
        spots: '小幽靈、進化妖魔、天使猴、101 組隊',
        note: '不死系＋組隊效率',
      },
      {
        range: '50–70',
        spots: '大幽靈、女神組隊、妖魔系',
        note: '準備三轉祭司',
      },
      {
        range: '70–100',
        spots: '天空之城高經驗圖、固定車隊練等點',
        note: '100 封頂；四轉主教技能依開放點',
      },
    ],
    tips: [
      '單刷慢正常；價值在組隊。',
      '不死系地圖讓群體治癒同時輸出。',
      '四轉復活／頂級 buff 一有就優先點。',
    ],
    disclaimer:
      '依「100 級／最高四轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },

  冰雷巫師: {
    job: '冰雷巫師',
    path: '法師 → 冰雷巫師 → 冰雷魔導士 → 冰雷大魔導士',
    role: '遠程雷電群攻＋冰控；四轉大魔導士為清怪與控場核心',
    statBuilds: [
      {
        name: '全智法（純血統・強烈推薦）',
        summary: '智力全點，開荒最省心。',
        details: [
          '二轉前後幾乎都建議全智',
          '高幸運門檻裝等有裝再考慮',
          '命中不足先換武器／眼鏡，勿亂點幸運',
        ],
      },
      {
        name: '常規裝備向',
        summary: '主智力，僅在關鍵裝備缺副屬時補點。',
        details: [
          '每次升等確認下一階袍／手套／鞋需求',
          '副屬剛好穿上即可，剩餘回智力',
          '四維平均通常最虧',
        ],
      },
    ],
    gearNotes: [
      {
        label: '能力門檻',
        text: '多看智力；部分高階裝要幸運。點 AP 前對照裝備表。',
      },
      {
        label: '裝備方向',
        text: '魔法攻擊、智力、MP；杖／傘依地圖弱屬調整。',
      },
      {
        label: '藥水',
        text: '藍藥必備；群攻清圖非常耗藍。',
      },
    ],
    stages: [
      {
        title: '一轉・法師（約 Lv.8）',
        summary: '魔力爪練到 30 轉冰雷。',
        priorities: [
          { skill: '魔力爪', points: '點滿', note: '一轉主力' },
          { skill: '魔力擴展／MP', points: '適量', note: '減斷藍' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍' },
        ],
      },
      {
        title: '二轉・冰雷巫師（約 Lv.30）',
        summary: '電閃雷鳴優先，再補瞬移、吸收、精神強化、冰錐。',
        priorities: [
          { skill: '瞬間移動', points: '先 1', note: '保命' },
          { skill: '電閃雷鳴', points: '點滿', note: '清怪核心' },
          { skill: '瞬間移動', points: '補滿', note: '機動' },
          { skill: '魔力吸收', points: '點滿', note: '回藍' },
          { skill: '精神強化', points: '點滿', note: '魔攻' },
          { skill: '冰錐術', points: '點滿', note: '控場' },
          { skill: '緩速術', points: '1 點', note: '夠用' },
        ],
      },
      {
        title: '三轉・冰雷魔導士（約 Lv.70）',
        summary: '冰風暴、魔力激發、終極魔法等群控輸出。',
        priorities: [
          { skill: '冰風暴', points: '優先', note: '清怪控場' },
          { skill: '魔力激發／極速詠唱', points: '優先', note: '輸出節奏' },
          { skill: '終極魔法（冰雷）', points: '點滿', note: '傷害' },
          { skill: '魔法封印／瞬移精通等', points: '次之', note: '依版本' },
        ],
      },
      {
        title: '四轉・冰雷大魔導士（本服等級上限 100）',
        summary: '閃電連擊、暴風雪等；能點的主力先滿。',
        priorities: [
          { skill: '閃電連擊', points: '能點先點', note: '主力輸出' },
          { skill: '暴風雪／大範圍冰系', points: '優先', note: '清場' },
          { skill: '魔力無限等增益', points: '次之', note: '續航' },
          { skill: '楓葉祝福等', points: '依版本', note: '組隊增益' },
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
        range: '8–30',
        spots: '訓練場、發掘地、螞蟻洞',
        note: '衝冰雷二轉',
      },
      {
        range: '30–43',
        spots: '火肥肥過渡 → 紅螃蟹（弱雷）',
        note: '電閃成型後換圖',
      },
      {
        range: '35–55',
        spots: '101 組隊、青螃蟹、海龜沙灘',
        note: '電閃＋冰錐節奏',
      },
      {
        range: '55–70',
        spots: '混種石巨人、魔龍、女神組隊',
        note: '準備三轉',
      },
      {
        range: '70–100',
        spots: '天空之城高經驗圖、車隊練等點',
        note: '100 封頂；四轉技能依開放點',
      },
    ],
    tips: [
      '保持距離，冰控防貼臉。',
      '藍藥斷貨＝停擺。',
      '三、四轉有技能書與等級門檻，能點的群攻／增益優先。',
    ],
    disclaimer:
      '依「100 級／最高四轉」經典版整理的粉絲向參考，實際技能名、地圖與門檻以你的伺服器為準。',
  },
}

export function getSkillGuide(job: Job): SkillGuide {
  return SKILL_GUIDES[job]
}

export function formatSkillGuideText(guide: SkillGuide): string {
  const lines: string[] = [
    `【${guide.job}】經典版攻略（100級／四轉）`,
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
