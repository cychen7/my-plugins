/*!
 * 悬浮小工具
 */
! function($) {
  var Widget = function(options) {
    this.opts = $.extend({}, Widget.DEFAULTS, options);
    this.$items = null;
    this.$backTop = null;
    this._init();
  }

  /**
   * 初始化
   */
  Widget.prototype._init = function() {
    var $items = this.$items = $(this.opts.itemsSelector),
      opts = this.opts;

    $(opts.activeSelector + "," + opts.showBox).hide();
    // 绑定事件
    $items.on('mouseenter', $.proxy(this._enter, this));
    $items.on('mouseleave', $.proxy(this._leave, this));
    // 最后一个是否是“返回顶部”
    if (opts.lastIsBackTop) {
      this.$backTop = $items.last();
      this.$backTop.hide();
      $(window).on('scroll', $.proxy(this._checkPosition, this));
      this.$backTop.on('click', $.proxy(this._move, this));
    }
  };

  Widget.DEFAULTS = {
    itemsSelector: '.widget-box', // item的容器选择器
    iconSelector: '.widget-icon', // 图标选择器
    activeClass: 'widget-active', // 激活时样式
    activeSelector: '.widget-title', // 当前项文字样式
    showBox: '.widget-layer', // 鼠标划过显示的图层
    lastIsBackTop: false // 最后一个是否为返回顶部
  };

  /**
   * 鼠标进入元素
   * @param  {object} e 鼠标对象
   */
  Widget.prototype._enter = function(e) {
    var $el = $(e.currentTarget),
      opts = this.opts,
      $showLayer = $el.find(opts.showBox);

    $el.find(opts.iconSelector).hide();
    $el.addClass(opts.activeClass);
    $el.find(opts.activeSelector).show();

    if ($showLayer) {
      $showLayer.show();
    }
  };

  /**
   * 鼠标离开元素
   */
  Widget.prototype._leave = function(e) {
    var $el = $(e.currentTarget),
      opts = this.opts,
      $showLayer = $el.find(opts.showBox);

    $el.find(opts.iconSelector).show();
    $el.removeClass(opts.activeClass);
    $el.find(opts.activeSelector).hide();
    if ($showLayer) {
      $showLayer.hide();
    }
  };

  /**
   * 检查滚动条位置，显示返回顶部按钮
   */
  Widget.prototype._checkPosition = function() {
    var $el = this.$backTop;
    if ($el) {
      $(window).scrollTop() > 100 ? $el.fadeIn() : $el.fadeOut()
    }
  };

  /**
   * 返回顶部
   */
  Widget.prototype._move = function() {
    if ($(window).scrollTop() != 0) {
      var $el = $("body,html");
      if (!$el.is(':animated')) {
        $el.animate({
          scrollTop: 0
        }, 500);
      }
    };
  };

  var old = $.fn.Widget;
  // 注册成插件
  $.fn.Widget = Plugin;
  // 重置Widget的构造器
  $.fn.Widget.Constructor = Widget;

  // =================
  // 避免命名空间导致的冲突
  // =================
  $.fn.Widget.noConflict = function() {
    $.fn.Widget = old;
    return this;
  }

  function Plugin(options) {
    return this.each(function() {
      new Widget(options);
    });
  }
}(jQuery);
