/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		showAlertUp,
		$window = $(window);

	$window.on({
		resize: function(){
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(function(){
				windowWidth = $window.width();
				windowHeight = $window.height();

				$('.main').css('min-height', windowHeight - $('.header').outerHeight() - $('.footer').outerHeight());

			}, 100);
		},
		scroll: function(){
			windowScrollTop = $window.scrollTop();
		}
	});

	$window.trigger('resize').trigger('scroll');

	// svg circle
	$('.circle__result').each(function(){
		var p = $(this);
		var c = p.closest('.circle').find('.circle__stroke');
		var max = parseInt(p.attr('data-end'));
		if(max == 0) {
			return;
		}
		var pi2r = parseInt(c.attr('r')) * 2 * Math.PI;
		var ok = parseInt(p.attr('data-ok'));
		var count = 0;
		var idTimer = setInterval(function(){
			if(count == max) {
				clearInterval(idTimer);
			}
			p.text(count++);
			c.attr('stroke-dasharray', pi2r / 100 * count + ' ' + pi2r);
			if(count > ok) {
				c.attr('stroke',p.attr('data-color'));
			}
		},2000/max);
	});

	// account
	$('.account-settings-show').on('click',function(){
		$('.account-settings').slideDown();
	});
	$('.account-settings-hide').on('click',function(){
		$('.account-settings').slideUp();
	});

// img-cover
	$('.img-cover').each(function(){
		$(this).css('background-image','url('+$(this).children('img').attr('src')+')');
	});

	$.fn.alertUp = function(){

		var box = $('.alert_up');
		var windows = box.children();

		box.on('click',function(event){
			var t = $(event.target);
			if(t.is('.alert_up') || t.is('.alert_up__close')){
				box.addClass('alert_up--hide');
				windows.css('top',-9999);
			}
		});

		showAlertUp = function (selector, X, Y) {
			var a_up = $('.alert_up__window--'+selector);
			var h_up = a_up.outerHeight();
			var r_up = windowHeight - h_up;
			var top = windowHeight > h_up + 100 ? r_up / 2 : 50;

			if(a_up.hasClass('alert_up__window--viewport')) {
				if(Y > windowScrollTop + r_up)
					Y = windowScrollTop + r_up;
				X += 30;
			}
			else {
				Y = windowScrollTop + top;
				X = (windowWidth-a_up.outerWidth())/2;
			}

			a_up.css({
				'top'  : Y,
				'left' : X
			});

			if(a_up.hasClass('alert_up__window--right')) {
				a_up.css('top',0);
			}

			windows.not(a_up).css('top',-9999);
			a_up.parent().removeClass('alert_up--hide');
			a_up.focus();
		}

		return this.each(function(){
			var windowUp = $(this).attr('data-alert-up');
			$(this).on('click',function(event){
				showAlertUp(windowUp, event.pageX, event.pageY);
			});
		});

	};


	$.fn.mySelect = function(){

		var select = function(){

			var select = $(this);
			select.wrap('<div class="select notsel"></div>');
			var select_box = select.parent();
			var c = '<span class="select__value"><span class="select__text"></span></span><div class="select__box"><ul>';
			select.children('option').each(function() {
				if($(this).val()!='default')
					c += '<li class="select__li" data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
			});
			c += '</ul></div>';
			select.before(c);

			var box_ul = select.siblings('.select__box');
			var visible = select.siblings('.select__value').children();

			select_box.on('click', function() {
				select_box.hasClass('select--focus') ? box_ul.hide() : box_ul.show();
				select_box.toggleClass('select--focus');
			});

			box_ul.on('click','.select__li', function() {
				select.val($(this).attr('data-value')).trigger('change');
			});
			select.on('change',function(){
				var o = select.children(':selected');
				visible.text(o.text());
				o.attr('value') == 'default' ? visible.addClass('select__value--default') : visible.removeClass('select__value--default');
			}).trigger('change');

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

	$.fn.tabs = function(){

		var tab = function(){
			var t = $(this);
			var dt = t.children('.tabs__dt');
			var dd = t.children('.tabs__dd');
			t.append(dd);
			dt.wrapAll('<div class="tabs__nav center notsel"></div>');
			dt.on('click',function(){
				var t = $(this);
				t.addClass('tabs__dt--active').siblings('.tabs__dt--active').removeClass('tabs__dt--active');
				dd.removeClass('tabs__dd--active').eq(dt.index(t)).addClass('tabs__dd--active');
			});
			dt.filter('.tabs__dt--active').length > 0 ? dt.filter('.tabs__dt--active').triggerHandler('click') : dt.first().triggerHandler('click');
		}

		return this.each(tab);

	};

// select
	$('select').mySelect();

// checkbox
	$('.checkbox').addClass('notsel').append('<i></i>');

// tabs
	$('.tabs').tabs();

// alert
	$('.btn-alert_up').alertUp();

})(jQuery);