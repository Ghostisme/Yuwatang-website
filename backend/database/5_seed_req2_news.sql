-- 需求2-18：预设历史新闻（附录里程碑稿，中英日）
-- 使用前请确认已执行 10_alter_ygame_article_i18n.sql
-- 执行：mysql -u用户 -p 数据库名 < backend/database/5_seed_req2_news.sql
-- 默认封面：/uploads/20260902/article-default-cover.jpg（本地文件，已 gitignore）

INSERT INTO `fa_ygame_article` (
  `id`, `project_id`,
  `article_title`, `article_title_en`, `article_title_jp`,
  `datetime`,
  `content`, `content_en`, `content_jp`,
  `author`, `image`, `createtime`
) VALUES
(
  1001, -1,
  '裕和堂入驻上海中心大厦',
  'Yu Health Opens in Shanghai Tower',
  '裕和堂が上海中心大厦に出店',
  '2022-06-01',
  '<p>2022年，裕和堂入驻上海中心大厦——在中国第一高楼开设门店，将传统中医调理带入陆家嘴金融核心区。门店延续裕和堂「弘扬中医文化 · 传承裕和之道」的理念，为周边白领与访客提供推拿、艾灸、足疗等调理服务。</p>',
  '<p>In 2022, Yu Health opened in Shanghai Tower—bringing TCM wellness into the Lujiazui financial core at China''s tallest building. The branch continues Yu Health''s ethos of promoting TCM culture, offering moxibustion, TCM massage, foot care and more for nearby professionals and visitors.</p>',
  '<p>2022年、裕和堂は上海中心大厦に出店。中国一の高層ビルで、陸家嘴の金融コアに伝統中医の調理を届けます。艾灸・推拿・足療など、周辺のオフィスワーカーと来訪者にサービスを提供しています。</p>',
  '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2022-06-01')
),
(
  1002, -1,
  '梅花路店开业',
  'Meihua Road Branch Opens',
  '梅花路店がオープン',
  '2025-03-01',
  '<p>2025年，裕和堂梅花路店正式开业。店面临近世纪公园与上海新国际博览中心，提供与其他直营店一致的扶阳艾灸、中医推拿、草本精油SPA、香薰足疗及传统调理，服务周边家庭与会展访客。</p>',
  '<p>In 2025, Yu Health''s Meihua Road branch opened near Century Park and the Shanghai New International Expo Centre. It offers the same directly-run standards—moxibustion, TCM massage, herbal SPA, aromatherapy foot care and traditional care—for local families and expo visitors.</p>',
  '<p>2025年、裕和堂梅花路店が正式オープン。世紀公園と上海新国際博覧センターに近く、他直営店と同じ基準で扶陽艾灸・中医推拿・草本精油SPA・香薰足療・伝統調理を提供し、近隣のご家庭と来場者に対応します。</p>',
  '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2025-03-01')
),
(
  1003, -1,
  '裕和堂迎来17周年，9店直营布局完成',
  'Yu Health Marks 17 Years with 9 Directly-Run Branches',
  '裕和堂創業17周年、直営9店舗体制が完成',
  '2026-01-01',
  '<p>2026年，裕和堂迎来创立17周年。四川北路店、常德路店相继开业，上海中心店扩店升级，吴江路店、百乐门店焕新，华山路店完成迁址。至此，裕和堂在上海形成9家直营门店布局，全店营业至23:00，覆盖静安、浦东、虹口等主要商圈。</p>',
  '<p>In 2026, Yu Health marked its 17th anniversary. North Sichuan Road and Changde Road branches opened; Shanghai Tower expanded; Wujiang Road and Paramount refreshed; Huashan Road relocated. Yu Health now operates 9 directly-run branches in Shanghai, open until 23:00 across Jing''an, Pudong, Hongkou and more.</p>',
  '<p>2026年、裕和堂は創業17周年を迎えました。四川北路店・常德路店が開業し、上海中心店は拡充、呉江路店・百楽門店は刷新、華山路店は移転を完了。上海に直営9店舗体制が整い、全店23:00まで営業、静安・浦東・虹口などの主要商圏をカバーしています。</p>',
  '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2026-01-01')
)
ON DUPLICATE KEY UPDATE
  `article_title` = VALUES(`article_title`),
  `article_title_en` = VALUES(`article_title_en`),
  `article_title_jp` = VALUES(`article_title_jp`),
  `datetime` = VALUES(`datetime`),
  `content` = VALUES(`content`),
  `content_en` = VALUES(`content_en`),
  `content_jp` = VALUES(`content_jp`),
  `author` = VALUES(`author`),
  `image` = VALUES(`image`);
