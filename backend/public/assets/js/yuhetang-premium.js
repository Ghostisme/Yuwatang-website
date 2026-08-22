/**
 * 裕和堂后台微交互
 */
(function () {
  "use strict";

  var reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (window.jQuery) {
      window.jQuery(fn);
      return;
    }
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (window.jQuery) {
        clearInterval(t);
        window.jQuery(fn);
      } else if (n > 80) {
        clearInterval(t);
        fn();
      }
    }, 50);
  }

  function enhanceRows($) {
    if (reduced || !$) return;
    var $rows = $(".bootstrap-table .table tbody tr, .table tbody tr").filter(":visible");
    $rows.each(function (i) {
      var el = this;
      if (el.getAttribute("data-yh-row") === "1") return;
      el.setAttribute("data-yh-row", "1");
      el.style.animationDelay = Math.min(i, 12) * 28 + "ms";
      el.classList.add("yh-row-in");
    });
  }

  function bindTable($) {
    if (!$ || !$().on) return;
    $(document).on("post-body.bs.table", function () {
      enhanceRows($);
    });
    enhanceRows($);
  }

  function softFocus($) {
    if (!$) return;
    $(document).on("focus", ".form-control", function () {
      $(this).closest(".form-group, .input-group").addClass("yh-focus");
    });
    $(document).on("blur", ".form-control", function () {
      $(this).closest(".form-group, .input-group").removeClass("yh-focus");
    });
  }

  /** 折叠按钮两态：标题 / aria */
  function syncSidebarToggle($) {
    var $btn = $(".sidebar-toggle");
    if (!$btn.length) return;
    var collapsed = $("body").hasClass("sidebar-collapse");
    $btn.attr({
      title: collapsed ? "展开菜单" : "收起菜单",
      "aria-label": collapsed ? "展开菜单" : "收起菜单",
      "aria-expanded": collapsed ? "false" : "true"
    });
  }

  /** 折叠/展开期间标记，让 CSS 整壳过渡、禁止子项乱跳 */
  function bindSidebarMotion($) {
    if (!$ || reduced) return;
    var timer = null;
    var mark = function () {
      $("body").addClass("yh-sidebar-animating");
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        $("body").removeClass("yh-sidebar-animating");
        syncSidebarToggle($);
      }, 340);
      // 类切换几乎同步，立刻刷新文案态
      setTimeout(function () {
        syncSidebarToggle($);
      }, 0);
    };
    syncSidebarToggle($);
    $(document).on("click", ".sidebar-toggle, [data-layout='sidebar-collapse']", mark);
    $(document).on("expanded.pushMenu collapsed.pushMenu", function () {
      mark();
      syncSidebarToggle($);
    });
  }

  /** Layer 弹层：按钮全局右对齐 */
  function bindLayerAlign() {
    var apply = function () {
      if (!window.Layer || typeof window.Layer.config !== "function") return false;
      try {
        window.Layer.config({
          btnAlign: "r",
          focusBtn: false /* 禁止自动聚焦，避免出现焦点方框 */
        });
      } catch (e) {}
      return true;
    };
    if (apply()) return;
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (apply() || n > 80) clearInterval(t);
    }, 50);
  }

  ready(function () {
    var $ = window.jQuery;
    try {
      document.documentElement.classList.add("yh-premium");
      if (document.body) document.body.classList.add("yh-premium-body");
    } catch (e) {}

    bindLayerAlign();

    if ($) {
      bindTable($);
      softFocus($);
      bindSidebarMotion($);
    } else {
      enhanceRows(null);
    }
  });
})();
