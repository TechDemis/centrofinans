/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

var circleSet;

(function($){

	// skin
	$('#toggleskin').on('change',function(){
		$(this).prop('checked') ? $('body').removeClass('skin-night') : $('body').addClass('skin-night');
	});

	// circle
	circleSet = function(c){

		var value = parseInt(c.find('.circle__value').text()),
			color = c.find('.circle__value').attr('data-color'),
			circleBg = c.find('.circle__bg'),
			circleOk = c.find('.circle__ok'),

			pi2r = parseInt(circleBg.attr('r')) * 2 * Math.PI,
			valueOk = pi2r * value / 100,
			valueBg = pi2r - valueOk;

		circleOk.attr('stroke-dasharray', valueOk + ' ' + pi2r);
		circleOk.attr('stroke-dashoffset', 0);
		circleBg.attr('stroke-dasharray', valueBg + ' ' + pi2r);
		circleBg.attr('stroke-dashoffset', -valueOk);

	}

	$('.circle').each(function(){
		circleSet($(this));
	});

	// loan
	$('.loan-history__box').on('click',function(){
		$(this).next().slideToggle();
	});
	$('#toggle-loan-history').on('change',function(){
		$('.loan-history').toggleClass('hide');
	});

	$('.lk-card').on('click',function(){
		$(this).toggleClass('lk-card--active').next('.lk-card-detals').toggleClass('hide');
	});

})(jQuery);