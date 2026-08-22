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
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-comments' WHERE `id` = 135;  -- 反馈管理
UPDATE `fa_auth_rule` SET `icon` = 'fa fa-newspaper-o' WHERE `id` = 141; -- 文章管理
