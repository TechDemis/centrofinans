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

	// img-cover
	$('.img-cover').each(function(){
		var src = $(this).children('img').attr('src');
		if(src!==undefined)
			$(this).css('background-image','url('+src+')');
	});

	$.fn.mySelect = function(){

		var select = function(){

			var select = $(this);
			select.wrap('<div class="select notsel"></div>');
			var select_box = select.parent();
			var c = '<span class="select__value"><span class="select__text"></span></span><div class="select__box"><div class="select__scroll"><ul>';
			select.children('option').each(function() {
				if($(this).val()!='none')
					c += '<li class="select__li" data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
			});
			c += '</ul></div></div>';
			select.before(c);

			var box_ul = select.siblings('.select__box');
			var visible = select.siblings('.select__value').children();

			select_box.on('click', function() {
				select_box.hasClass('select--focus') ? box_ul.hide() : scrollPaneSet(box_ul.show().children());
				select_box.toggleClass('select--focus');
			});

			box_ul.on('click','.select__li', function() {
				select.val($(this).attr('data-value')).trigger('change');
			});
			select.on('change',function(){
				var o = select.children(':selected');
				visible.text(o.text());
				select.val()=='none' ? select_box.addClass('select--default') : select_box.removeClass('select--default');
			}).trigger('change');

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

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
			var dt = t.find('.tabs__dt');
			var dd = t.find('.tabs__dd');
			var tab_head = $('<div class="tabs__nav clr">');
			var tab_body = $('<div class="tabs__body">');
			dt
				.addClass('notsel')
				.on('click',function(){
					var t = $(this);
					t.addClass('tabs__dt--active').siblings('.tabs__dt--active').removeClass('tabs__dt--active');
					dd.removeClass('tabs__dd--active').eq(dt.index(t)).addClass('tabs__dd--active');
				})
				.filter('.tabs__dt--active').length > 0 ? dt.filter('.tabs__dt--active').triggerHandler('click') : dt.first().triggerHandler('click');
			dd.addClass('clr');
			tab_head.append(dt);
			tab_body.append(dd);
			t.prepend(tab_head).append(tab_body);
		}

		return this.each(tab);

	};

// checkbox
	$('.checkbox').addClass('notsel').append('<i></i>');

// btn radio
	$('.btn--radio').addClass('notsel').children('input').on('change',function(){
		if($(this).prop('checked'))
			$(this).parent().addClass('btn--checked').siblings().removeClass('btn--checked');
	}).trigger('change');

// tabs
	$('.tabs').tabs();

// select
	$('select').mySelect();

// alert
	$('.btn-alert_up').alertUp();

// scrollTop
	function scrollTo(t){
		$('body, html').animate({scrollTop : t}, 1000);
	}

// scroll Pane
	function scrollPaneSet(selector) {
		var elm = selector.jScrollPane({
			verticalGutter : 0,
		});
	}

// ahtung
	$('.ahtung').addClass('ahtung--show');
	$('.ahtung__close').on('click',function(){
		$(this).closest('.ahtung').removeClass('ahtung--show');
	});

// feedback
	(function(feedback){
		var navLeft = $('<a class="feedback__nav-left">');
		var navRight = $('<a class="feedback__nav-right">');
		var item = feedback.children('.feedback__item');
		feedback.append(navLeft,navRight);
		navLeft.on('click',function(){
			if(navLeft.hasClass('disabled')) return;
			navLeft.addClass('disabled');
			var f = item.filter('.feedback__first');
			var l = item.filter('.feedback__left');
			var r = item.filter('.feedback__right');
			var e = item.filter('.feedback__right').next('.feedback__item');
			if(e.length==0)
				e = item.first();

			f.addClass('feedback__left').removeClass('feedback__first');
			l.addClass('feedback__start').removeClass('feedback__left');
			r.addClass('feedback__first').removeClass('feedback__right');
			e.addClass('feedback__right');
			f.afterTransition(function() {
				item.filter('.feedback__start').removeClass('feedback__start');
				item.filter('.feedback__end').removeClass('feedback__end');
				navLeft.removeClass('disabled');
			});
		});
		navRight.on('click',function(){
			if(navRight.hasClass('disabled')) return;
			navRight.addClass('disabled');
			var f = item.filter('.feedback__first');
			var l = item.filter('.feedback__left');
			var r = item.filter('.feedback__right');
			var s = item.filter('.feedback__left').prev('.feedback__item');
			if(s.length==0)
				s = item.last();
			f.addClass('feedback__right').removeClass('feedback__first');
			l.addClass('feedback__first').removeClass('feedback__left');
			r.addClass('feedback__end').removeClass('feedback__right');
			s.addClass('feedback__left');
			f.afterTransition(function() {
				item.filter('.feedback__start').removeClass('feedback__start');
				item.filter('.feedback__end').removeClass('feedback__end');
				navRight.removeClass('disabled');
			});
		});

	}($('.feedback')));

// menu
	(function(menuBox){
		var li = menuBox.find('.menu-top__submenu');
		var subMenu = menuBox.find('.menu-top-submenu');
		li.on('mouseenter',function(){
			subMenu.addClass('menu-top-submenu--show');
		});
		menuBox.on('mouseleave',function(){
			subMenu.removeClass('menu-top-submenu--show');
		});
	}($('.header__menu-box')));


})(jQuery);


/*
 * Copyright 2012 Andrey тA.I.т Sitnik <andrey@sitnik.ru>,
 * sponsored by Evil Martians.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function(d){"use strict";d.Transitions={_names:{'transition':'transitionend','OTransition':'oTransitionEnd','WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend'},_parseTimes:function(b){var c,a=b.split(/,\s*/);for(var e=0;e<a.length;e++){c=a[e];a[e]=parseFloat(c);if(c.match(/\ds/)){a[e]=a[e]*1000}}return a},getEvent:function(){var b=false;for(var c in this._names){if(typeof(document.body.style[c])!='undefined'){b=this._names[c];break}}this.getEvent=function(){return b};return b},animFrame:function(c){var a=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame;if(a){this.animFrame=function(b){return a.call(window,b)}}else{this.animFrame=function(b){return setTimeout(b,10)}}return this.animFrame(c)},isSupported:function(){return this.getEvent()!==false}};d.extend(d.fn,{afterTransition:function(h,i){if(typeof(i)=='undefined'){i=h;h=1}if(!d.Transitions.isSupported()){for(var f=0;f<this.length;f++){i.call(this[f],{type:'aftertransition',elapsedTime:0,propertyName:'',currentTarget:this[f]})}return this}for(var f=0;f<this.length;f++){var j=d(this[f]);var n=j.css('transition-property').split(/,\s*/);var k=j.css('transition-duration');var l=j.css('transition-delay');k=d.Transitions._parseTimes(k);l=d.Transitions._parseTimes(l);var o,m,p,q,r;for(var g=0;g<n.length;g++){o=n[g];m=k[k.length==1?0:g];p=l[l.length==1?0:g];q=p+(m*h);r=m*h/1000;(function(b,c,a,e){setTimeout(function(){d.Transitions.animFrame(function(){i.call(b[0],{type:'aftertransition',elapsedTime:e,propertyName:c,currentTarget:b[0]})})},a)})(j,o,q,r)}}return this},transitionEnd:function(c){for(var a=0;a<this.length;a++){this[a].addEventListener(d.Transitions.getEvent(),function(b){c.call(this,b)})}return this}})}).call(this,jQuery);