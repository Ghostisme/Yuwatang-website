-- 后台侧栏菜单图标语义化调整（去重复、对齐功能含义）
-- 执行库：weilai_daseen_ne / 表：fa_auth_rule

UPDATE `fa_auth_rule` SET `icon` = 'fa fa-dashboard' WHERE `id` = 1;   -- 数据统计
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-shield' WHERE `id` = 5;      -- 权限管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-user' WHERE `id` = 9;        -- 管理员管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-history' WHERE `id` = 10;    -- 管理员日志
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-users' WHERE `id` = 11;      -- 角色组管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-list-ul' WHERE `id` = 12;    -- 菜单规则
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-home' WHERE `id` = 92;       -- 首页管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-map-marker' WHERE `id` = 129; -- 门店管理

-- ========== 增量：反馈管理 / 文章管理菜单（若不存在则插入）==========
-- 超级管理员 rules=*，无需改 fa_auth_group

INSERT INTO `fa_auth_rule`
(`id`,`type`,`pid`,`name`,`title`,`icon`,`url`,`condition`,`remark`,`ismenu`,`menutype`,`extend`,`py`,`pinyin`,`createtime`,`updatetime`,`weigh`,`status`)
VALUES
(135,'file',0,'ygame/feedback','反馈管理','fa fa-comments','','','',1,'addtabs','','fkgl','fankuiguanli',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(136,'file',135,'ygame/feedback/index','查看','fa fa-circle-o','','','',0,'addtabs','','zk','zhakan',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(137,'file',135,'ygame/feedback/edit','编辑','fa fa-circle-o','','','',0,'addtabs','','bj','bianji',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(138,'file',135,'ygame/feedback/del','删除','fa fa-circle-o','','','',0,'addtabs','','sc','shanchu',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(139,'file',135,'ygame/feedback/multi','批量更新','fa fa-circle-o','','','',0,'addtabs','','plgx','pilianggengxin',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(141,'file',0,'ygame/article','文章管理','fa fa-newspaper-o','','','',1,'addtabs','','wzgl','wenzhangguanli',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(142,'file',141,'ygame/article/index','查看','fa fa-circle-o','','','',0,'addtabs','','zk','zhakan',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(143,'file',141,'ygame/article/add','添加','fa fa-circle-o','','','',0,'addtabs','','tj','tianjia',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(144,'file',141,'ygame/article/edit','编辑','fa fa-circle-o','','','',0,'addtabs','','bj','bianji',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(145,'file',141,'ygame/article/del','删除','fa fa-circle-o','','','',0,'addtabs','','sc','shanchu',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal'),
(146,'file',141,'ygame/article/multi','批量更新','fa fa-circle-o','','','',0,'addtabs','','plgx','pilianggengxin',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,'normal')
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `icon`=VALUES(`icon`),
  `pid`=VALUES(`pid`),
  `ismenu`=VALUES(`ismenu`),
  `menutype`=VALUES(`menutype`),
  `status`=VALUES(`status`),
  `updatetime`=UNIX_TIMESTAMP();

-- 兼容旧脚本：确保菜单图标正确
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-comments' WHERE `id` = 135;      -- 反馈管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-newspaper-o' WHERE `id` = 141;  -- 文章管理
