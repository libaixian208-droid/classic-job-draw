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

export interface SkillGuide {
  job: Job
  path: string
  role: string
  stat: string
  stages: SkillStage[]
  tips: string[]
  disclaimer: string
}

/** Fan-made classic-style build hints — not official patch notes. */
export const SKILL_GUIDES: Record<Job, SkillGuide> = {
  槍騎兵: {
    job: '槍騎兵',
    path: '劍士 → 槍騎兵 → 龍騎士 → 黑騎士',
    role: '近戰群攻／隊伍血量增益，副本組隊熱門',
    stat: '主力量；敏捷只點到夠穿裝備即可',
    stages: [
      {
        title: '一轉・劍士',
        summary: '先把生存與基本輸出打底，再轉槍騎兵。',
        priorities: [
          { skill: '自身強化（Iron Body）', points: '優先', note: '減傷續航' },
          { skill: '生命恢復', points: '適量', note: '省藥水' },
          { skill: '劍氣縱橫', points: '主力輸出', note: '前期清怪' },
          { skill: '武器精通', points: '點滿', note: '提升命中與傷害' },
        ],
      },
      {
        title: '二轉・槍騎兵',
        summary: '武器選長槍／矛路線，先把精通、加速與隊伍血量增益點起來。',
        priorities: [
          { skill: '精準之槍', points: '先點', note: '命中與傷害基礎' },
          { skill: '快速之槍', points: '盡快點滿', note: '攻速核心' },
          { skill: '神聖之火', points: '必點', note: '全隊 HP 上限，組隊剛需' },
          { skill: '禦魔陣', points: '次之', note: '減傷' },
          { skill: '槍連擊／穿刺類群攻', points: '主力', note: '刷怪輸出' },
        ],
      },
      {
        title: '三轉後方向',
        summary: '往龍騎士／黑騎士發展，強化群攻與續航。',
        priorities: [
          { skill: '龍之奉獻／黑騎士核心群攻', points: '優先', note: '依版本技能名為準' },
          { skill: '槍騎兵時期的神聖之火', points: '維持', note: '組隊價值不變' },
        ],
      },
    ],
    tips: [
      '刷怪盡量拉怪聚怪，用穿刺／群攻一次清場。',
      '組隊時保持神聖之火常駐，你是隊伍血量保險。',
      '裝備優先力量與物攻；藥水帶足，前期練等較悶屬正常。',
    ],
    disclaimer: '僅供經典服參考，實際技能名稱與點數上限依伺服器版本為準。',
  },
  僧侶: {
    job: '僧侶',
    path: '法師 → 僧侶 → 祭司 → 主教',
    role: '隊伍核心輔助：治療、祝福、淨化；不死系也能輸出',
    stat: '主智力；必要時補少量幸運以穿裝（依版本）',
    stages: [
      {
        title: '一轉・法師',
        summary: '先站穩魔力基礎，魔力爪過渡到二轉。',
        priorities: [
          { skill: '魔力爪', points: '主力', note: '一轉輸出' },
          { skill: '魔力增幅／MP 相關', points: '適量', note: '提高藍量' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍高，緊急再開' },
        ],
      },
      {
        title: '二轉・僧侶',
        summary: '治療與祝福優先，再補瞬移與輔助被動。',
        priorities: [
          { skill: '群體治癒', points: '核心先點', note: '治療＋打不死系' },
          { skill: '祝福', points: '優先', note: '隊伍增益' },
          { skill: '神聖之箭', points: '輸出', note: '補傷害' },
          { skill: '瞬間移動', points: '盡快可用', note: '走位保命' },
          { skill: '神聖防禦／淨化', points: '次之', note: '減傷與解狀態' },
          { skill: '魔力吸收、精神強化', points: '補強', note: '藍量與魔攻' },
        ],
      },
      {
        title: '三轉後方向',
        summary: '祭司／主教強化群體輔助與復活體系。',
        priorities: [
          { skill: '進階治癒／聖光類', points: '優先', note: '組隊價值更高' },
          { skill: '復活相關技能', points: '必備', note: '副本剛需' },
        ],
      },
    ],
    tips: [
      '前期找不死系地圖，群體治癒可邊奶邊打。',
      '組隊時眼睛盯隊友血量，淨化／祝福別斷。',
      '單刷偏慢屬正常；僧侶的價值在隊伍，不是 solo DPS。',
    ],
    disclaimer: '僅供經典服參考，實際技能名稱與點數上限依伺服器版本為準。',
  },
  冰雷巫師: {
    job: '冰雷巫師',
    path: '法師 → 冰雷巫師 → 冰雷魔導士 → 冰雷大魔導士',
    role: '遠程群攻清怪王，冰控＋雷電；單刷友好、耗藍較高',
    stat: '主智力；幸運視裝備需求補點',
    stages: [
      {
        title: '一轉・法師',
        summary: '魔力爪過渡，藍量與防禦技能酌量。',
        priorities: [
          { skill: '魔力爪', points: '先滿主力', note: '銜接二轉前輸出' },
          { skill: 'MP 增加／魔力基礎', points: '適量', note: '減少斷藍' },
          { skill: '魔心防禦', points: '視情況', note: '耗藍，別一直開' },
        ],
      },
      {
        title: '二轉・冰雷巫師',
        summary: '電閃雷鳴優先成型，再補瞬移、吸收與精神強化。',
        priorities: [
          { skill: '瞬間移動', points: '先點 1', note: '保命走位' },
          { skill: '電閃雷鳴', points: '盡快點高', note: '二轉清怪核心' },
          { skill: '魔力吸收', points: '補強', note: '回藍' },
          { skill: '精神強化', points: '點滿', note: '魔攻 buff' },
          { skill: '瞬間移動', points: '再補滿', note: '機動' },
          { skill: '冰錐術／緩速術', points: '後補', note: '控場與補輸出' },
        ],
      },
      {
        title: '三～四轉方向',
        summary: '冰風暴、魔力激發、閃電連擊等依版本展開。',
        priorities: [
          { skill: '冰風暴／群控冰系', points: '優先', note: '清怪控場' },
          { skill: '魔力激發／詠唱加速', points: '優先', note: '輸出節奏' },
          { skill: '閃電連擊等四轉主力', points: '成型後點滿', note: '依版本為準' },
        ],
      },
    ],
    tips: [
      '保持距離輸出，用冰控避免怪貼臉。',
      '藍藥一定要備足；斷藍等於停擺。',
      '二轉電閃雷鳴能用後練等會明顯變爽，再考慮換圖。',
    ],
    disclaimer: '僅供經典服參考，實際技能名稱與點數上限依伺服器版本為準。',
  },
}

export function getSkillGuide(job: Job): SkillGuide {
  return SKILL_GUIDES[job]
}

export function formatSkillGuideText(guide: SkillGuide): string {
  const lines: string[] = [
    `【${guide.job}】技能加點推薦`,
    `轉職路線：${guide.path}`,
    `定位：${guide.role}`,
    `能力值：${guide.stat}`,
    '',
  ]

  for (const stage of guide.stages) {
    lines.push(`■ ${stage.title}`)
    lines.push(stage.summary)
    for (const p of stage.priorities) {
      const note = p.note ? `（${p.note}）` : ''
      lines.push(`- ${p.skill}：${p.points}${note}`)
    }
    lines.push('')
  }

  lines.push('小提示：')
  for (const tip of guide.tips) {
    lines.push(`- ${tip}`)
  }
  lines.push('')
  lines.push(guide.disclaimer)
  return lines.join('\n')
}
