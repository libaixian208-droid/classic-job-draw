/**
 * 必解任務對齊《新楓之谷：經典版》V001（維多利亞島／最高二轉）。
 * 資料來源摘要：開服公告、NOWnews 開服攻略、楓葉雨任務頁、台服經典常見裝備任務整理。
 * 實際等級／獎勵／道具名以遊戲內為準。
 */

export type QuestPriority = 'critical' | 'high' | 'normal'

export interface MustQuest {
  id: string
  title: string
  /** Level window shown in UI, e.g. "11–21" or "25" */
  level: string
  minLevel: number
  maxLevel: number
  priority: QuestPriority
  category: 'party' | 'patience' | 'gear' | 'event'
  npc: string
  where: string
  reward: string
  steps: string[]
  tips?: string[]
  /** Why this is "must do" */
  why: string
}

export const MUST_QUEST_INTRO = {
  title: '經典版必解任務（V001）',
  summary:
    '對齊開服設定：楓之島＋維多利亞島、100 級、最高二轉。優先組隊衝等與忍耐解鎖，再補裝備任務。',
  sources:
    '參考：遊戲橘子開服資訊、NOWnews 開服攻略、楓葉雨任務資料；粉絲整理僅供參考。',
}

export const MUST_QUESTS: MustQuest[] = [
  {
    id: 'henesys-moon-pq',
    title: '月妙的年糕（月妙組隊）',
    level: '11–21',
    minLevel: 11,
    maxLevel: 21,
    priority: 'critical',
    category: 'party',
    npc: '達爾利（弓箭手村・邱比特公園）',
    where: '弓箭手村・邱比特公園',
    reward: '每場約 1600 經驗（開服實測約 5 分鐘）；可換「頭頂上的一個年糕」（+50 HP，不可交易）',
    why: '一轉後最強前期衝等／省水錢途徑；開服攻略幾乎都列為必刷。',
    steps: [
      '完成一轉轉職後，任務欄通常會跳出「月妙的年糕」。',
      '到弓箭手村邱比特公園找達爾利，組滿 3 人以上進場。',
      '打下方草叢掉出彩色種子，依顏色種到六個平台（左上藍、左中黃、左下黃褐；右上綠、右中紫、右下淺紫）。',
      '六朵月見花長出後保護中央月妙搗年糕，湊滿 10 個年糕。',
      '隊員把年糕交給隊長，右下找興兒回報。',
      '累積約 20 個「月妙的年糕」可向達爾利兌換年糕帽（建議約 20 等時換）。',
    ],
    tips: [
      '衝等時：拿經驗後直接再刷下一場；前期不必進隱藏肥肥刷怪關。',
      '高等隊友可帶隱藏肥肥圖打寶（盾等賣店很補），新手優先純刷經驗。',
    ],
  },
  {
    id: 'kerning-slime-pq',
    title: '綠水靈組隊任務（墮落城市下水道）',
    level: '21–30+',
    minLevel: 21,
    maxLevel: 35,
    priority: 'critical',
    category: 'party',
    npc: '墮落城市下水道相關組隊 NPC（依遊戲內標示）',
    where: '墮落城市・下水道',
    reward: '經驗效率高；通關可拿耳環等，可賣店換第一桶楓幣',
    why: '月妙之後的主衝等點；開服玩家實測省水錢、練等快，還能補水錢。',
    steps: [
      '約 21 等後從月妙改刷綠水靈組隊。',
      '組隊進場，依關卡清怪／解謎完成通關。',
      '耳環等獎勵可賣商店，累積前期楓幣。',
    ],
    tips: [
      '無課也可靠組隊刷到二轉前後；野外單刷前期成本常入不敷出。',
    ],
  },
  {
    id: 'john-pink-flowers',
    title: '約翰的粉紅花籃（忍耐之森）',
    level: '15+',
    minLevel: 15,
    maxLevel: 40,
    priority: 'critical',
    category: 'patience',
    npc: '約翰（維多利亞港）→ 奇怪的石像（奇幻村）',
    where: '維多利亞港 → 奇幻村倉庫一帶・奇怪的石像',
    reward: '首次完成給經驗與藥水等；之後可重複換礦石母礦；解鎖／暢通忍耐之森進出',
    why: '官方開服特別點名的經典忍耐任務；解完後進出更方便，也是螺絲釘等材料來源之一。',
    steps: [
      '維多利亞港找約翰接「約翰的粉紅花籃」，需粉紅花束 ×10。',
      '到奇幻村找「奇怪的石像」進忍耐之森，爬到最頂端採花（每次數量隨機）。',
      '身上有花時無法再傳進忍耐之森：先送回約翰再繼續採。',
      '交齊後完成；之後可重複接，獎勵改為礦石母礦（不含黃金）。',
    ],
    tips: [
      '這是開服文宣點名的回憶任務，建議早解。',
      '螺絲釘也可在墮落城市後街吉姆用材料合成。',
    ],
  },
  {
    id: 'shaman-diet-pill',
    title: '薩比特拉瑪的減肥藥（忍耐之林）',
    level: '25',
    minLevel: 25,
    maxLevel: 49,
    priority: 'critical',
    category: 'patience',
    npc: '薩比特拉瑪（奇幻村）→ 賽恩（魔法森林）',
    where: '奇幻村旅館一帶 → 魔法森林・賽恩 → 忍耐之林',
    reward: '成功：經驗、名聲、防禦捲等；之後可重複換寶礦石母礦',
    why: '官方開服點名任務。第一次務必選對花色成功；失敗會影響後續星石／月石相關任務。',
    steps: [
      '奇幻村找薩比特拉瑪接任務，他會指定一種花色（可在任務欄回看）。',
      '到魔法森林找賽恩，付費（約等級×100 楓幣）傳入忍耐之林。',
      '任務進行中可免費重進，直到失敗為止。',
      '到忍耐之林 2 最上層點花叢，選「指定顏色」的花交回薩比特拉瑪。',
      '選錯＝任務失敗且無法重來成功結局，後續星石／月石線會變差。',
    ],
    tips: [
      '平台間隔與猴子香蕉皮、長槍陷阱很煩，慢慢走、記路線。',
      '約 50 等還有「返老還童藥」線可拿星石／月石，建立在這次成功之上。',
    ],
  },
  {
    id: 'nara-gloves',
    title: '內拉和墮落城市居民的委託（手套）',
    level: '15',
    minLevel: 15,
    maxLevel: 24,
    priority: 'high',
    category: 'gear',
    npc: '內拉（墮落城市）',
    where: '墮落城市',
    reward: '依職業給 Lv.20 手套（初心者為工地手套）',
    why: '經典前期手套必解，省一筆買裝錢。',
    steps: [
      '與內拉對話（常需先付約 1000 楓幣）接委託。',
      '階段一：藍水靈珠 ×50、綠菇菇傘 ×50。',
      '階段二：木材 ×5、螺絲釘 ×5（木材：樹枝／木柴合成；螺絲釘：合成或相關任務）。',
      '階段三：章魚腳 ×100、礦泉水 ×1（奇幻村商店／桑拿相關商店可買）。',
    ],
    tips: [
      '章魚腳：北方工地三眼章魚一帶。',
      '藍水靈珠：墮落城市地鐵較低層等。',
    ],
  },
  {
    id: 'maya-hat',
    title: '瑪亞和奇怪的藥（褐色斗笠）',
    level: '15',
    minLevel: 15,
    maxLevel: 30,
    priority: 'high',
    category: 'gear',
    npc: '瑪亞（弓箭手村）',
    where: '弓箭手村',
    reward: '褐色斗笠（全職可用，常見幸運加成）',
    why: '便宜好用的頭部裝，全職業都能戴。',
    steps: [
      '弓箭手村找瑪亞接任務。',
      '繳交：道符 ×40、葉子 ×50、綠液球 ×50、章魚腳 ×20（數量依版本略有差異，以任務欄為準）。',
    ],
  },
  {
    id: 'mrs-mingming',
    title: '明明夫人的煩惱（緞帶肥肥髮圈）',
    level: '20–21',
    minLevel: 20,
    maxLevel: 30,
    priority: 'high',
    category: 'gear',
    npc: '明明夫人（弓箭手村）／艾斯達（魔法森林南郊）',
    where: '弓箭手村 → 魔法森林南郊',
    reward: '緞帶肥肥髮圈',
    why: '前期頭飾／飾品高 CP，經典必解之一。',
    steps: [
      '第一個煩惱（約 20 等）：蝴蝶結 ×100、綠水靈珠 ×20、藍水靈珠 ×50。',
      '第二個煩惱（約 21 等）：章魚腳 ×60、肥肥頭 ×15、艾斯達特製調味料 ×1。',
      '調味料：魔法森林南郊找艾斯達，用石柳石（母礦提煉）製作。',
    ],
    tips: ['肥肥頭：東部草叢／肥肥海岸等肥肥圖。'],
  },
  {
    id: 'nara-shoes',
    title: '內拉委託第二彈（鞋子）',
    level: '25',
    minLevel: 25,
    maxLevel: 35,
    priority: 'high',
    category: 'gear',
    npc: '內拉（墮落城市）',
    where: '墮落城市',
    reward: '依職業給約 Lv.30 鞋子',
    why: '接在手套線之後，補齊腳部裝。',
    steps: [
      '需已完成內拉 15 等委託線。',
      '常見材料：蛇皮、刺菇菇傘、動物皮、硬羽毛、火獨眼獸尾巴等（以任務欄為準）。',
      '分階段繳交後領取職業鞋子。',
    ],
  },
  {
    id: 'sauna-book',
    title: '泰素夫的秘密之書（桑拿服）',
    level: '30',
    minLevel: 30,
    maxLevel: 50,
    priority: 'normal',
    category: 'gear',
    npc: '泰素夫（奇幻村・高級桑拿）',
    where: '奇幻村高級桑拿',
    reward: '桑拿服（經典實用套服）',
    why: '二轉前後好穿的任務裝，材料稍貴但值得。',
    steps: [
      '奇幻村高級桑拿找泰素夫。',
      '常見需求：鑽石 ×1、香蕉 ×50、肥肥頭 ×5、風獨眼獸尾巴 ×50（以任務欄為準）。',
      '鑽石可在各村打鐵舖合成／購買相關服務（勇士之村辛德、墮落城市克利思等）。',
    ],
  },
  {
    id: 'login-rabbit',
    title: '開服登入禮（白色兔子等）',
    level: '1+',
    minLevel: 1,
    maxLevel: 100,
    priority: 'high',
    category: 'event',
    npc: '遊戲內信箱／活動領取',
    where: '登入活動（約至 2026/09/22）',
    reward: '白色兔子寵物（拾取／自動藥水／BUFF 類）、欄位擴充與藥水等',
    why: '官方開服送，大幅降低前期養成門檻；活動有期限。',
    steps: [
      '開服活動期間登入領取（以官方公告為準）。',
      '確認信箱／活動介面是否已領白色兔子與欄位擴充券。',
    ],
    tips: ['活動結束時間以遊戲橘子公告為準，過期無法補領。'],
  },
]

export function questBracketStatus(
  quest: MustQuest,
  level: number | null,
): 'past' | 'current' | 'future' | 'unknown' {
  if (level === null) return 'unknown'
  if (level > quest.maxLevel) return 'past'
  if (level < quest.minLevel) return 'future'
  return 'current'
}

export function findCurrentQuestIds(
  quests: MustQuest[],
  level: number | null,
): string[] {
  if (level === null) return []
  return quests
    .filter((q) => questBracketStatus(q, level) === 'current')
    .map((q) => q.id)
}

export function formatMustQuestsText(level?: number | null): string {
  const lines: string[] = [
    `【${MUST_QUEST_INTRO.title}】`,
    MUST_QUEST_INTRO.summary,
    '',
  ]
  if (level) lines.push(`當前等級：Lv.${level}`, '')

  const byCat: Record<MustQuest['category'], string> = {
    party: '組隊衝等',
    patience: '忍耐解鎖',
    gear: '裝備必解',
    event: '活動領取',
  }

  for (const cat of ['party', 'patience', 'gear', 'event'] as const) {
    const list = MUST_QUESTS.filter((q) => q.category === cat)
    if (list.length === 0) continue
    lines.push(`■ ${byCat[cat]}`)
    for (const q of list) {
      const st = questBracketStatus(q, level ?? null)
      const mark =
        st === 'current' ? ' ← 目前' : st === 'past' ? '（已過）' : ''
      lines.push(`【${q.title}】Lv.${q.level}${mark}`)
      lines.push(`為何必解：${q.why}`)
      lines.push(`NPC／地點：${q.npc}｜${q.where}`)
      lines.push(`獎勵：${q.reward}`)
      q.steps.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`))
      if (q.tips) q.tips.forEach((t) => lines.push(`  ※ ${t}`))
      lines.push('')
    }
  }
  lines.push(MUST_QUEST_INTRO.sources)
  return lines.join('\n')
}
