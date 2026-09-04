-- 移除梅花路店「中医诊所 / 坐诊 / 商保 / 小儿推拿仅该店」特例，文案与设施与其他直营店对齐
-- 可重复执行
SET NAMES utf8mb4;

UPDATE `fa_ygame_store`
SET
  `tagline` = '世纪公园旁——浦东家庭与会展客的养生据点。',
  `tagline_en` = 'Beside Century Park—wellness for Pudong families and expo visitors.',
  `tagline_jp` = '世紀公園そば—浦東ファミリーと会展客の養生拠点。',
  `intro` = '2025年开业，位于浦东梅花路，邻近世纪公园与上海新国际博览中心。独立理疗隔间、免费养生茶点，服务标准与其他直营店一致：扶阳艾灸、中医推拿、草本精油SPA、香薰足疗及传统调理，服务周边家庭与会展访客。',
  `intro_en` = 'Opened 2025 on Meihua Road, Pudong—near Century Park and SNIEC. Private rooms, herbal tea, and the same direct-store standards: moxibustion, tuina, herbal SPA, foot care and traditional therapies for families and expo guests.',
  `intro_jp` = '2025年開業、浦東梅花路。世紀公園・新国博近く。個室・養生茶点、他店と同じ直営基準：艾灸・推拿・SPA・足療・伝統調理。周辺ファミリーと会展客に。',
  `directions` = '地铁7号线花木路站4口出站步行约200米至梅花路1019号。近世纪公园与新国际博览中心，建议高峰时段提前预约。',
  `directions_en` = 'Metro Line 7 Huamu Rd, Exit 4, ~200 m to 1019 Meihua Rd. Near Century Park and SNIEC—book ahead at peak times.',
  `directions_jp` = '地下鉄7号線花木路駅4出口約200m、梅花路1019号。ピーク時は予約推奨。',
  `facilities` = 'privateRoom,tea,hygienic',
  `services` = 'moxibustion,tuina,spa,foot,traditional'
WHERE `slug` = 'meihua';

UPDATE `fa_ygame_article`
SET
  `article_title` = '梅花路店开业',
  `content` = '<p>2025年，裕和堂梅花路店正式开业。店面临近世纪公园与上海新国际博览中心，提供与其他直营店一致的扶阳艾灸、中医推拿、草本精油SPA、香薰足疗及传统调理，服务周边家庭与会展访客。</p>'
WHERE `id` = 1002
   OR `article_title` LIKE '%梅花路%诊所%'
   OR `article_title` = '梅花路中医诊所开业';

UPDATE `fa_ygame_feedback`
SET `content` = '周末带家人来梅花路店体验推拿，环境干净安静，前台会提前确认预约，调理师沟通耐心，整体体验专业又温和。'
WHERE `store_name` = '梅花路店'
  AND `name` = '橙子妈'
  AND `content` LIKE '%小儿推拿%';
