-- 反馈管理演示数据（5 条已通过，可含置顶）
-- 依赖：先执行 3_fa_ygame_feedback.sql / 8_alter / 9_alter
-- status: 0=进行中 1=通过 2=拒绝
-- 可重复执行：先清空再插入

SET NAMES utf8mb4;
DELETE FROM `fa_ygame_feedback`;
ALTER TABLE `fa_ygame_feedback` AUTO_INCREMENT=1;

INSERT INTO `fa_ygame_feedback`
  (`name`, `phone`, `email`, `store_name`, `content`, `ip`, `createtime`, `status`, `is_top`, `weigh`)
VALUES
(
  'River', '138****6721', '', '余姚路店',
  '午后过来做了艾灸，调理师会先问最近作息和肩颈情况，热度拿捏得很稳。房间安静，茶点清淡，做完整个人松下来。',
  '127.0.0.1', UNIX_TIMESTAMP('2026-09-02 14:20:00'), 1, 1, 100
),
(
  'Sora', '', 'sora.visit@example.com', '太古汇店',
  '地铁上来很方便，预约邮件回复也快。足疗力度可以随时说，全程没有推销会员卡，适合出差间隙放松。',
  '127.0.0.1', UNIX_TIMESTAMP('2026-09-04 12:05:00'), 1, 0, 80
),
(
  '阿梨', '186****9034', '', '华山路店',
  '周末约了推拿，手法稳、节奏不赶。前台会提前确认预约，独立理疗房隔音不错，结束后还有养生茶。',
  '127.0.0.1', UNIX_TIMESTAMP('2026-09-06 16:40:00'), 1, 0, 60
),
(
  'Ken', '150****4488', 'ken.yh@example.com', '上海中心店',
  '第一次体验手工悬灸，艾香温和不呛。店员把溯源和三年陈艾讲得很清楚，空间干净，流程清楚。',
  '127.0.0.1', UNIX_TIMESTAMP('2026-09-08 19:15:00'), 1, 0, 40
),
(
  '小暖', '', 'xiaonuan@example.com', '吴江路店',
  '下班路过就能约到，香薰足疗味道清爽。调理师沟通耐心，做完腿脚轻松不少，会当成固定放松去处。',
  '127.0.0.1', UNIX_TIMESTAMP('2026-09-10 21:05:00'), 1, 0, 20
);
