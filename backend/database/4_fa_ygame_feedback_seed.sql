-- 反馈管理默认演示数据（10 条）
-- 依赖：先执行 3_fa_ygame_feedback.sql
-- 库：weilai_daseen_ne / 表：fa_ygame_feedback
-- status: 0=待审核 1=已通过（前台反馈墙展示）
-- 可重复执行：按昵称+内容去重，已存在则跳过

INSERT INTO `fa_ygame_feedback` (`name`, `phone`, `store_name`, `content`, `ip`, `createtime`, `status`)
SELECT * FROM (
  SELECT '阿棠' AS name, '138****2618' AS phone, '余姚路店' AS store_name,
         '第一次来就选了推拿+艾灸组合，环境很安静，调理师会先问身体状态再下手，力度也能随时说。做完肩颈轻松很多，茶点也好喝。' AS content,
         '127.0.0.1' AS ip, UNIX_TIMESTAMP('2026-08-12 10:20:00') AS createtime, 1 AS status
  UNION ALL SELECT 'Mika', '139****8802', '百乐门店',
         '带国外朋友来体验手工艾灸，全程几乎没有推销，私密隔间很舒服。朋友说艾香温和不呛，下次还想再来。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-08-15 14:05:00'), 1
  UNION ALL SELECT '小林', '186****4410', '华山路店',
         '周末预约了特级推拿，手法很稳，重点按了久坐的腰背。结束后还有养生茶，整体节奏不赶，体验很细。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-08-18 19:40:00'), 1
  UNION ALL SELECT 'Jason', '150****7731', '太古汇店',
         '午休过来做足疗，地铁口近，29 层视野不错。服务流程清楚，一客一换很放心，适合临时放松一下。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-08-21 12:35:00'), 1
  UNION ALL SELECT '小鱼', '177****9056', '吴江路店',
         '上班族友好！下班路过就能约到，调理师沟通很耐心。香薰足疗味道清爽，做完走路都轻快些。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-08-25 21:10:00'), 1
  UNION ALL SELECT '陆先生', '136****2289', '上海中心店',
         '在上海中心店做了扶阳艾灸，三年陈艾的说明很清晰，还能看到溯源信息。空间干净，服务标准统一。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-08-28 16:50:00'), 1
  UNION ALL SELECT '橙子妈', '158****6612', '梅花路店',
         '带孩子来梅花路店做小儿推拿，有医生坐诊更安心。前台会提前确认预约，整体体验专业又温和。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-09-01 11:25:00'), 1
  UNION ALL SELECT 'Nora', '188****3307', '四川北路店',
         '新店环境很新，独立理疗房隔音不错。预约邮件回复及时，到店后流程顺畅，推荐给附近的朋友。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-09-03 18:15:00'), 1
  UNION ALL SELECT '老周', '135****1190', '常德路店',
         '常德路店布置偏安静，适合想放空的人。草本精油 SPA 气味不冲，调理师会按需求调整力度。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-09-05 20:05:00'), 0
  UNION ALL SELECT 'Amy', '-', '余姚路店',
         '会员日来的，九店通用很方便。全程无推销是加分项，会继续把裕和堂当固定放松去处。',
         '127.0.0.1', UNIX_TIMESTAMP('2026-09-08 15:30:00'), 0
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM `fa_ygame_feedback` f
  WHERE f.name = seed.name AND f.content = seed.content
);
