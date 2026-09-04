define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            Table.api.init({
                extend: {
                    index_url: 'ygame/store/index',
                    add_url: 'ygame/store/add',
                    edit_url: 'ygame/store/edit',
                    del_url: 'ygame/store/del',
                    multi_url: 'ygame/store/multi',
                    table: 'ygame_store',
                }
            });

            var table = $("#table");

            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                sortOrder: 'asc',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'), operate: false},
                        {field: 'slug', title: 'Slug', operate: 'LIKE'},
                        {field: 'title', title: __('标题'), operate: 'LIKE'},
                        {field: 'phone', title: '电话', operate: 'LIKE'},
                        {field: 'address', title: '地址', operate: 'LIKE', class: 'yh-col-content', formatter: function (value) {
                            value = value == null ? '' : String(value);
                            var safe = $('<div/>').text(value).html();
                            return '<div class="yh-ellipsis" title="' + safe.replace(/"/g, '&quot;') + '">' + safe + '</div>';
                        }},
                        {field: 'image', title: '封面', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'status', title: '状态', searchList: {"1": "显示", "0": "隐藏"}, formatter: Table.api.formatter.status, custom: {1: 'success', 0: 'gray'}},
                        {field: 'weigh', title: __('排序'), operate: false},
                        {field: 'createtime', title: __('添加时间'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
