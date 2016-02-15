/// <reference path="../js/jquery-1.11.1.js" />
; (function ($) {
    /* 闭包前的分号是规避引用的js没有";"结束导致的错误*/
    var Carousel = function (posters) {
        var self = this;
        // 保存单个旋转木马对象
        this.poster = posters;
        this.posterItemMain = posters.find("ul.poster-list");
        this.nextBtn = posters.find('div.poster-prev-btn');
        this.prevBtn = posters.find('div.poster-next-btn');
        this.posterItems = posters.find('li.poster-item');
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;

        // 默认配置参数
        this.settings = {
            width: 1000,        // 幻灯片的宽度
            height: 270,        // 幻灯片的高度
            posterWidth: 640,   // 幻灯片的第一帧的宽度
            posterHeight: 270,  // 幻灯片的第一帧的高度
            scale: 0.9,         // 记录显示比例
            speed: 600,
            verticalAlign: "middle"
        };
        $.extend(this.settings, this.getSetting() || {});

        // 设置配置参数
        this.setSettingValue();
        this.setPosterPosition();

        // 点击按钮
        this.nextBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("left");
            }

        });
        this.prevBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("right");
            }
        });

    };
    Carousel.prototype = {
        // 旋转
        carouseRotate: function (dir) {
            var _this = this;
            var zIndexArray = [];

            if (dir === 'left') {

                this.posterItems.each(function () {
                    var self = $(this),
                        prev = self.prev().get(0) ? self.prev() : _this.posterLastItem,
                        width = prev.width(),
                        height = prev.width(),
                        zIndex = prev.css("zIndex"),
                        opacity = prev.css("opacity"),
                        left = prev.css('left'),
                        top = prev.css('top');

                    zIndexArray.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, function () { _this.rotateFlag = true;});
                });
            } else if (dir === 'right') {
                this.posterItems.each(function () {
                    var self = $(this),
                        next = self.next().get(0) ? self.next() : _this.posterFirstItem,
                        width = next.width(),
                        height = next.width(),
                        zIndex = next.css("zIndex"),
                        opacity = next.css("opacity"),
                        left = next.css('left'),
                        top = next.css('top');
                    zIndexArray.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, function () { _this.rotateFlag = true;});

                });
            }


            _this.posterItems.each(function (i) {
                $(this).css("zIndex", zIndexArray[i]);
            });
        },

        // 设置top
        setVertialAlign: function (height) {
            var verticalType = this.settings.verticalAlign;
            var top = 0;
            if (verticalType === 'middle') {
                top = (this.settings.height - height) / 2;
                console.log(top);
            } else if (verticalType === 'top') {
                top = 0;
            } else if (verticalType === 'bottom') {
                top = this.settings.height - height;
            } else {
                top = (this.settings.height - height) / 2;
            }
            return top;
        },


        // 设置剩余的帧的未知关系
        setPosterPosition: function () {
            var self = this;
            var sliceItems = self.posterItems.slice(1),
                sliceSize = sliceItems.size() / 2,
                rightSlice = sliceItems.slice(0, sliceSize),
                leftSlice = sliceItems.slice(sliceSize),
                level = Math.floor(self.posterItems.size() / 2);
            //  设置右边帧的宽高\top等
            var rw = self.settings.posterWidth,
                rh = self.settings.posterHeight,
                gap = ((self.settings.width - self.settings.posterWidth) / 2) / level;  // 
            var firstLeft = (self.settings.width - self.settings.posterWidth) / 2;      // 第一帧相对左侧距离
            var fixOffsetLeft = firstLeft + rw; // 可见区到左侧的距离
            rightSlice.each(function (i) {
                var j = i;
                level--;
                rw = rw * self.settings.scale;
                rh = rh * self.settings.scale;


                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / (++j),
                    left: fixOffsetLeft + (++i) * gap - rw,
                    top: self.setVertialAlign(rh)
                })
            });

            //设置左边的位置关系
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height(),
                oloop = Math.floor(self.posterItems.size() / 2);

            leftSlice.each(function (i) {
                $(this).css({
                    zIndex: i,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    left: i * gap,
                    top: self.setVertialAlign(lh)
                })
                lw = lw / self.settings.scale;
                lh = lh / self.settings.scale;
                oloop--;
            });

        },

        // 设置配置参数值去控制基本的宽高
        setSettingValue: function () {
            var self = this;
            self.poster.css({
                width: self.settings.width,
                height: self.settings.height
            });
            self.posterItemMain.css({
                width: self.settings.width,
                height: self.settings.height
            });

            // 计算按钮的宽度 幻灯片区域-第一帧的宽度/2
            var w = (self.settings.width - self.settings.posterWidth) / 2;
            self.nextBtn.css({
                width: w,
                height: self.settings.height,
                zIndex: Math.ceil(self.posterItems.size() / 2)
            });
            self.prevBtn.css({
                width: w,
                height: self.settings.height,
                zIndex: Math.ceil(self.posterItems.size() / 2)
            });
            self.posterFirstItem.css({
                width: self.settings.posterWidth,
                height: self.settings.posterWidth,
                left: w,
                zIndex: Math.ceil(self.posterItems.size() / 2)
            });



        },
        // 获取人工配置的参数
        getSetting: function () {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != '')
                return $.parseJSON(setting);
            return setting;
        }
    };
    Carousel.init = function (posters) {
        var _this = this;
        posters.each(function () {
            new _this($(this));
        });
    };
    window["Carousel"] = Carousel;
})(jQuery);