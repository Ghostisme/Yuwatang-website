-- 用户反馈表（若已存在可跳过）
CREATE TABLE IF NOT EXISTS `fa_ygame_feedback` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '姓名',
  `phone` varchar(20) NOT NULL DEFAULT '' COMMENT '电话',
  `store_name` varchar(100) NOT NULL DEFAULT '' COMMENT '所属门店',
  `content` text COMMENT '反馈内容',
  `ip` varchar(50) DEFAULT '' COMMENT 'IP地址',
  `createtime` bigint(16) DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(1) DEFAULT 0 COMMENT '处理状态 0未处理 1已处理',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
