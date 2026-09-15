-- 用户反馈表（若已存在可跳过）
CREATE TABLE IF NOT EXISTS `fa_ygame_feedback` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '姓名',
  `phone` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号（可空，与邮箱二选一）',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱（可空，与手机号二选一）',
  `store_name` varchar(100) NOT NULL DEFAULT '' COMMENT '所属门店',
  `content` text COMMENT '反馈内容',
  `ip` varchar(50) DEFAULT '' COMMENT 'IP地址',
  `createtime` bigint(16) DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0进行中 1通过 2拒绝',
  `is_top` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否置顶 0否 1是',
  `weigh` int(10) NOT NULL DEFAULT 0 COMMENT '排序权重，越大越靠前',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
