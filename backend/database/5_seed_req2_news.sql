-- 需求2-18：预设历史新闻（附录里程碑稿）
-- 使用前请确认 project_id=-1 与线上文章表一致；若 ID 冲突请调整起始 ID
-- 执行：mysql -u用户 -p 数据库名 < backend/database/5_seed_req2_news.sql
-- 默认封面：/uploads/20260902/article-default-cover.jpg（本地文件，已 gitignore）

INSERT INTO `fa_ygame_article` (`id`, `project_id`, `article_title`, `datetime`, `content`, `author`, `image`, `createtime`) VALUES
(1001, -1, '裕和堂入驻上海中心大厦', '2022-06-01', '<p>2022年，裕和堂入驻上海中心大厦——在中国第一高楼开设门店，将传统中医调理带入陆家嘴金融核心区。门店延续裕和堂「弘扬中医文化 · 传承裕和之道」的理念，为周边白领与访客提供推拿、艾灸、足疗等调理服务。</p>', '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2022-06-01')),
(1002, -1, '梅花路中医诊所开业', '2025-03-01', '<p>2025年，裕和堂梅花路店（中医诊所）正式开业。作为裕和堂旗下持证中医诊所，梅花路店提供坐诊医师评估、专业小儿推拿，并支持商业保险（9店中唯一）。店面临近世纪公园与上海新国际博览中心，服务周边家庭与会展访客。</p>', '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2025-03-01')),
(1003, -1, '裕和堂迎来17周年，9店直营布局完成', '2026-01-01', '<p>2026年，裕和堂迎来创立17周年。四川北路店、常德路店相继开业，上海中心店扩店升级，吴江路店、百乐门店焕新，华山路店完成迁址。至此，裕和堂在上海形成9家直营门店布局，全店营业至23:00，覆盖静安、浦东、虹口等主要商圈。</p>', '裕和堂', '/uploads/20260902/article-default-cover.jpg', UNIX_TIMESTAMP('2026-01-01'))
ON DUPLICATE KEY UPDATE
  `article_title` = VALUES(`article_title`),
  `datetime` = VALUES(`datetime`),
  `content` = VALUES(`content`),
  `author` = VALUES(`author`),
  `image` = VALUES(`image`);
