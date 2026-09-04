/** 需求2-13：各服务子页 FAQ（附录相关问答提炼，避免走 vue-i18n tm 编译函数） */
export type ServiceFaqItem = { q: string; a: string }

export const serviceFaqsZh: Record<string, ServiceFaqItem[]> = {
  moxibustion: [
    {
      q: "艾草真的是三年陈艾吗？怎么证明？",
      a: "是。艾草来自裕和堂在湖北蕲春的自有100亩基地（2017年建），收割后自然陈放满三年再制条。店内艾条附溯源码，仓库按收割年份标签管理，并有全程纪录片可看。"
    },
    {
      q: "手工艾灸和普通艾灸有什么不同？",
      a: "裕和堂只做手工悬灸：调理师手持艾条、按体质配穴施灸，控制距离与火力，热力温和渗透——区别于机器灸或随手灸的「烤一烤」。"
    },
    {
      q: "三伏灸 / 三九灸是什么？什么时候做？",
      a: "是中医「顺时而养」的节气艾灸——在全年最热 / 最冷的时段施灸，使用同样的三年陈艾与手工悬灸标准。具体时间每年更新。"
    },
    {
      q: "艾灸烟味大吗？做完要注意什么？",
      a: "三年陈艾燃烧温和、烟气较新艾柔和；理疗房配有排烟系统。灸后2小时内不摄入凉水、冷饮、辛辣等刺激性食物，注意保暖、适量饮温水；晚8点后做完艾灸，当晚不建议洗澡。"
    }
  ],
  tuina: [
    {
      q: "推拿会很疼吗？力度能调整吗？",
      a: "力度全程可沟通调整——「该重则重、该轻则轻」，不靠蛮力。若对当前调理师不满意，可在服务开始10分钟内要求更换。"
    },
    {
      q: "第一次做什么合适？",
      a: "首次建议60分钟中医推拿或「推拿 + 艾灸」组合。到店后调理师会先了解你的身体状况，再给出建议。"
    },
    {
      q: "做完后要注意什么？",
      a: "推拿后避免立刻剧烈运动。个别人推拿后有轻微酸胀，属正常现象，通常一天内缓解。任何不适，随时告诉调理师。"
    },
    {
      q: "可以指定调理师性别吗？",
      a: "可以。预约时说明即可安排；每位调理师均为平台实名认证，可先看好评率再指定。"
    }
  ],
  spa: [
    {
      q: "草本精油 SPA 适合什么人？",
      a: "以门店专属调配的草本精油为介质，沿经络推抚疏通，香气温润不冲鼻。适合长期紧绷、睡眠浅、想要更沉浸放松体验的人；另有90分钟加长版。"
    },
    {
      q: "到店流程 / 需要准备什么？",
      a: "到店 → 前台确认预约 → 进入独立理疗房更衣，奉上养生茶点 → 调理师沟通后开始。无需特别准备，建议提前5–10分钟到店。"
    },
    {
      q: "会不会推销办卡？",
      a: "不会。全程无推销是裕和堂的服务底线，你可以安静地享受整个过程。"
    }
  ],
  foot: [
    {
      q: "香薰足疗和老姜足道有什么区别？",
      a: "都以热汤泡足开场，再以宫廷手法理疗足底到小腿。香薰足疗侧重舒缓助眠；老姜足道（80分钟加长）更侧重温通驱寒，适合手脚偏凉、差旅奔波后想快速恢复的人。"
    },
    {
      q: "有停车位 / 可以洗澡吗？",
      a: "多数门店可报销停车费（以各门店规则为准）、配淋浴房，全店提供免费养生茶点。"
    },
    {
      q: "几点开门 / 关门？",
      a: "全店营业至23:00，无午休。部分门店9:00开门，部分9:30开门，详见门店页。"
    }
  ],
  traditional: [
    {
      q: "小儿推拿在哪里做？",
      a: "小儿推拿及中医坐诊由梅花路店（中医诊所）提供，坐诊医师评估后进行，家长可同室陪同。"
    },
    {
      q: "拔罐、刮痧一般怎么安排？",
      a: "刮痧净排、穴位拔罐是祛湿排寒的经典组合，常作为推拿、艾灸的加项；具体是否适合以到店调理师评估为准。"
    },
    {
      q: "能用商保 / 医保吗？",
      a: "商保仅梅花路店（中医诊所）支持；医保暂不支持。"
    },
    {
      q: "特殊身体状况能做吗？",
      a: "请提前告知，调理师会评估并安排合适项目；孕期与特殊状况以稳妥为先，必要时遵医嘱。"
    }
  ]
}

export const serviceFaqsEn: Record<string, ServiceFaqItem[]> = {
  moxibustion: [
    {
      q: "Is the mugwort really three-year aged?",
      a: "Yes. It comes from Yuhetang's own 100-mu base in Qichun (built 2017), naturally aged three years before rolling. Sticks carry traceability codes; warehouses tag harvest years; a documentary is available."
    },
    {
      q: "How is hand-held moxibustion different?",
      a: "Yuhetang only does hand-held suspended moxibustion—therapists select points by constitution and control distance/heat for gentle penetration, unlike machine or casual grilling."
    },
    {
      q: "What are Sanfu / Sanjiu moxibustion?",
      a: "Seasonal moxibustion in the hottest / coldest periods of the year, using the same three-year mugwort and hand-held standard. Dates update yearly."
    },
    {
      q: "Is the smoke strong? Aftercare?",
      a: "Three-year mugwort burns milder than fresh; rooms have smoke extraction. Avoid cold drinks and spicy food for 2 hours; keep warm. If finished after 8pm, avoid bathing that night."
    }
  ],
  tuina: [
    {
      q: "Will tuina hurt? Can pressure be adjusted?",
      a: "Pressure is adjustable throughout—firm when needed, gentle when needed. You may request a therapist change within the first 10 minutes."
    },
    {
      q: "What should I try first?",
      a: "For a first visit we suggest 60-minute tuina or a tuina + moxibustion combo. Therapists advise after reviewing your condition."
    },
    {
      q: "What should I do after the session?",
      a: "Avoid intense exercise right after. Mild soreness is normal for some and usually eases within a day."
    },
    {
      q: "Can I request a therapist's gender?",
      a: "Yes—tell us when booking. All therapists are real-name verified."
    }
  ],
  spa: [
    {
      q: "Who is herbal oil SPA for?",
      a: "House-blended herbal oils with meridian strokes; aroma is gentle. Ideal for high stress and light sleepers; a 90-minute extended option is available."
    },
    {
      q: "What's the visit flow?",
      a: "Arrive → confirm booking → change in a private room with tea → therapist consult then start. Arrive 5–10 minutes early."
    },
    {
      q: "Will you push membership cards?",
      a: "No. Zero hard-selling is our baseline."
    }
  ],
  foot: [
    {
      q: "Aromatherapy foot care vs ginger foot path?",
      a: "Both start with a warm soak then court-style technique to the calves. Aromatherapy leans toward relaxation/sleep; ginger (80-min) emphasizes warmth for cold extremities and travel fatigue."
    },
    {
      q: "Parking / showers?",
      a: "Most stores reimburse parking (per store rules) and have showers; free herbal tea & snacks at all stores."
    },
    {
      q: "Opening hours?",
      a: "All stores open until 23:00 with no midday break. Some open at 9:00, others at 9:30—see store pages."
    }
  ],
  traditional: [
    {
      q: "Where is pediatric tuina offered?",
      a: "Only at Meihua Road (TCM clinic), after doctor assessment; parents may stay in the room."
    },
    {
      q: "How are cupping / scraping arranged?",
      a: "Often as add-ons to tuina or moxibustion for dampness and cold; therapists assess suitability on site."
    },
    {
      q: "Commercial / public insurance?",
      a: "Commercial insurance only at Meihua Road clinic; public medical insurance is not supported."
    },
    {
      q: "Special physical conditions?",
      a: "Please tell us in advance. We prioritize safety; follow medical advice when needed."
    }
  ]
}

export const serviceFaqsJp: Record<string, ServiceFaqItem[]> = {
  moxibustion: [
    {
      q: "本当に三年陳艾ですか？",
      a: "はい。2017年開設の湖北蘄春自社基地の艾草を三年自然熟成。トレーサビリティコードと収穫年ラベル、ドキュメンタリーもあります。"
    },
    {
      q: "手持艾灸と普通の艾灸の違いは？",
      a: "裕和堂は手持懸灸のみ。体質に合わせ配穴し、距離と火力を調整して穏やかに浸透させます。"
    },
    {
      q: "三伏灸／三九灸とは？",
      a: "最も暑い／寒い時期に行う節気艾灸で、同じ三年陳艾と手持基準を使います。日程は毎年更新。"
    },
    {
      q: "煙は強い？施術後の注意は？",
      a: "三年陳艾は新艾より穏やかで排煙設備あり。艾灸後2時間は冷飲・刺激物を避け保温。夜8時以降終了なら当日入浴は控えて。"
    }
  ],
  tuina: [
    {
      q: "推拿は痛い？強さ調整は？",
      a: "強さは随時調整可能。開始10分以内ならセラピスト変更も可。"
    },
    {
      q: "初めては何がおすすめ？",
      a: "初回は60分推拿、または「推拿＋艾灸」。来店後に体調を伺い提案します。"
    },
    {
      q: "施術後の注意は？",
      a: "推拿後はすぐの激しい運動を避けて。軽い酸痛は正常な場合があり、通常1日で落ち着きます。"
    },
    {
      q: "性別指定はできますか？",
      a: "可能です。予約時にお伝えください。全員実名認証済みです。"
    }
  ],
  spa: [
    {
      q: "草本精油SPAはどんな人向け？",
      a: "店舗調合の草本精油で経絡を疏通。香りは穏やか。緊張・浅い眠り・没入感を求める方に。90分延長もあり。"
    },
    {
      q: "来店の流れは？",
      a: "来店→予約確認→個室更衣と養生茶→カウンセリング後スタート。5–10分前到着推奨。"
    },
    {
      q: "カード勧誘はありますか？",
      a: "ありません。強引な勧誘なしが方針です。"
    }
  ],
  foot: [
    {
      q: "香薰足療と老姜足道の違いは？",
      a: "どちらも温かい湯から始まり宮廷手法でふくらはぎまで。香薰はリラックス寄り、老姜（80分）は冷えや旅疲れの温通寄り。"
    },
    {
      q: "駐車／シャワーは？",
      a: "多くの店舗で駐車費精算可・シャワーあり。全店で養生茶菓子無料。"
    },
    {
      q: "営業時間は？",
      a: "全店23:00まで休憩なし。開店は9:00または9:30—店舗ページを参照。"
    }
  ],
  traditional: [
    {
      q: "小児推拿はどこで？",
      a: "梅花路店（中医クリニック）のみ。医師評価後に実施、保護者同席可。"
    },
    {
      q: "抜罐・刮痧の受け方は？",
      a: "推拿や艾灸の追加として多いです。適合は来店時に判断します。"
    },
    {
      q: "保険は使えますか？",
      a: "民間保険は梅花路店のみ。公的医保は非対応。"
    },
    {
      q: "特別な体調でも大丈夫？",
      a: "事前にお知らせください。安全優先で、必要時は医師の指示に従います。"
    }
  ]
}

export function getServiceFaqs(slug: string, locale: string): ServiceFaqItem[] {
  const pack = locale === "en" ? serviceFaqsEn : locale === "jp" ? serviceFaqsJp : serviceFaqsZh
  return pack[slug] || []
}
