/**
 *
 * 弹框组件
 */

;(function ($, window, document, undefined) {
    // 定义showAlert的构造函数
    var showAlert = function (el, options) {
        this.defaults = {
            // 主题设置
            title: '弹框标题', // 标题
            cancelBtnText: '取消', // 取消按钮文字
            okBtnText: '确定', // 确认按钮文字
            content:'弹框内容'   // 内容
        };
        this.options = $.extend({},this.defaults, options);
        console.log(this.options);
        this.html = `<div class="alert-box">
        <p class="alert-title">${this.options.title}</p>
        <div class="alert-content">${this.options.content}</div>
        <div class="alert-button">
            <button class="cancel" data-type="cancel-btn">${this.options.cancelBtnText}</button>
            <button class="ensure" data-type="ensure-btn">${this.options.okBtnText}</button>
        </div>
      </div>`;
    }

// 定义showAlert的方法
    showAlert.prototype = {
        /**
         * 黑色半透明遮罩层
         * */
        showShade: function () {
            var html = `<div class="shadow-black"></div>`;
            $('body').css('overflow', 'hidden').append(html);
            setTimeout(function () {
                $('.shadow-black').addClass('shadow');
            }, 10)
        },
        /**
         * 清除黑色半透明遮罩层
         * */
        removeShade: function () {
            $('.shadow-black').removeClass('shadow');
            $('body').css('overflow', 'auto');
            setTimeout(function () {
                $('.shadow-black').remove();
            }, 200)
        },
        /**
         * 初始化弹框插件
         * 先将元素插入，再添加出现动画
         * */
        init: function () {
            var that = this;
            that.showShade();
            $('body').append(this.html);
            //当内容字数大于20时，修改样式
            if(that.options.content.length>20){
                $('.alert-content').addClass('align-left');
            }
            setTimeout(function () {
                // $('.alert-box').fadeIn("slow","swing");
                $('.alert-box').addClass('shadow');
                that.bindEvent();
            }, 10);
        },


        /**
         * 摧毁插件
         * 当消失动画结束后，从dom树中删除
         * */
        destroy: function () {
            $('.alert-box').removeClass('shadow');
            this.unbindEvent();
            this.removeShade();
            setTimeout(function () {
                $('body').find(".alert-box").remove();
                this.html = null;
            }, 300);
        },
        /**
         * 从dom中移除元素前，解除之前的绑定时间
         * 删除的只是DOM结构，内存中依旧保存着数据。所以要手动将DOM占用的内存清空。
         * */
        unbindEvent: function () {
            $('.alert-box').unbind('click');
        },
        /**
         * 绑定函数
         * */
        bindEvent: function () {
            var that = this;
            that.$element = $('.alert-box');

            // 根据data-type 绑定对应的事件
            that.$element.on('click', function (event) {
                switch (event.target.getAttribute("data-type")) {
                    case 'cancel-btn':
                        that.destroy();
                        break;
                    case 'ensure-btn':
                        that.confirm('ok');
                        break;
                    default:
                        break;
                }
            });
        },

        /**
         * 点击确认按钮后的回调函数
         * */
        confirmBtn: function(callback){
            if(typeof callback === 'function') {
                this.confirm = callback;
            }
            return this;
        }

    }

    $.fn.jQueryAlert = function (options) {
        var myPlugin = new showAlert(this, options);
        myPlugin.init();
        return myPlugin;
    }

})(jQuery, window, document);