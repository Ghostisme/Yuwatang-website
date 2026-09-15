define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            Table.api.init({
                extend: {
                    index_url: 'ygame/feedback/index',
                    add_url: '',
                    edit_url: 'ygame/feedback/edit',
                    del_url: 'ygame/feedback/del',
                    multi_url: 'ygame/feedback/multi',
                    dragsort_url: 'ajax/weigh',
                    table: 'ygame_feedback',
                }
            });

            var table = $("#table");

            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'is_top',
                sortOrder: 'desc',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id'), operate: false},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'phone', title: __('Phone'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: 'LIKE'},
                        {field: 'store_name', title: __('Store_name'), operate: 'LIKE'},
                        {
                            field: 'content',
                            title: __('Content'),
                            operate: 'LIKE',
                            formatter: function (value) {
                                value = value == null ? '' : String(value);
                                var safe = $('<div/>').text(value).html();
                                return '<div class="yh-ellipsis" title="' + safe.replace(/"/g, '&quot;') + '">' + safe + '</div>';
                            }
                        },
                        {field: 'ip', title: __('Ip'), operate: false},
                        {field: 'createtime', title: __('Createtime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime},
                        {
                            field: 'is_top',
                            title: __('Is_top'),
                            searchList: {"1": __('Yes'), "0": __('No')},
                            formatter: Table.api.formatter.toggle
                        },
                        {
                            field: 'status',
                            title: __('Status'),
                            searchList: {"0": __('进行中'), "1": __('通过'), "2": __('拒绝')},
                            custom: {0: 'info', 1: 'success', 2: 'danger'},
                            formatter: Table.api.formatter.status
                        },
                        {field: 'weigh', title: __('Weigh'), operate: false},
                        {
                            field: 'operate',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            Table.api.bindevent(table);
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
