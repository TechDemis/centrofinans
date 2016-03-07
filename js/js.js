/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

var showAlertUp;

(function($){

	var windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		$window = $(window);

	$window.on({
		resize: function(){
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(function(){
				pageResize();
			}, 100);
		},
		scroll: function(){
			windowScrollTop = $window.scrollTop();
		}
	});

	function pageResize(){
		windowWidth = $window.width();
		windowHeight = $window.height();
		$('.main').css('min-height', windowHeight - $('.header').outerHeight() - $('.footer').outerHeight());
	}
	pageResize();

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

	// examination
	$('.rules-examination__form input').on('change',function(){
		$(this).closest('.rules-examination__answer').addClass('rules-examination__answer--checked');
	}).filter(':checked').trigger('change');

	// form submit
	$('.rules-examination__form').on('submit',function(){
		var notAnswer = $(this).find('.rules-examination__answer').not('.rules-examination__answer--checked');
		if(notAnswer.length>0){
			scrollTo(notAnswer.first().offset().top)
			return false;
		}
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

		showAlertUp = function (selector) {
			var a_up = $('.alert_up__window--'+selector);
			var h_up = a_up.outerHeight();
			var r_up = windowHeight - h_up;
			var top = windowHeight > h_up + 100 ? r_up / 2 : 50;

			a_up.css({
				'top'  : windowScrollTop + top,
				'left' : (windowWidth-a_up.outerWidth())/2
			});

			windows.not(a_up).css('top',-9999);
			a_up.parent().removeClass('alert_up--hide');
			a_up.focus();
		}

		return this.each(function(){
			var t = $(this);
			t.on('click',function(){
				showAlertUp(t.attr('data-alert-up'));
			});
		});

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

// checkbox
	$('.checkbox').addClass('notsel').append('<i></i>');

// tabs
	$('.tabs').tabs();

// alert
	$('.btn-alert_up').alertUp();

// scrollTop
	function scrollTo(t){
		$('body, html').animate({scrollTop : t}, 1000);
	}

})(jQuery);