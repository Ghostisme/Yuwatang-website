-- 文章表增加英/日文标题与正文（与门店多语言一致）
-- 执行：mysql -u用户 -p 数据库名 < backend/database/10_alter_ygame_article_i18n.sql

ALTER TABLE `fa_ygame_article`
  ADD COLUMN `article_title_en` varchar(255) NOT NULL DEFAULT '' COMMENT '标题(英)' AFTER `article_title`,
  ADD COLUMN `article_title_jp` varchar(255) NOT NULL DEFAULT '' COMMENT '标题(日)' AFTER `article_title_en`,
  ADD COLUMN `content_en` longtext NULL COMMENT '内容(英)' AFTER `content`,
  ADD COLUMN `content_jp` longtext NULL COMMENT '内容(日)' AFTER `content_en`;
