/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var summ = $('#slider-summ'),
		summMin = parseInt(summ.attr('data-min')),
		summMax = parseInt(summ.attr('data-max')),
		summStep = parseInt(summ.attr('data-step')),
		summValue = parseInt(summ.attr('data-value')),
		summSet = $("#summ-set"),

		date = $('#slider-date'),
		dateMin = parseInt(date.attr('data-min')),
		dateMax = parseInt(date.attr('data-max')),
		dateStep = parseInt(date.attr('data-step')),
		dateValue = parseInt(date.attr('data-value')),
		dateSet = $("#date-set"),
		dateSuf = $('#date-suf'),
		dateStartNullProcent = parseInt(date.attr('data-start-null-procent')),
		dateFinishNullProcent = parseInt(date.attr('data-finish-null-procent')),
		dateNullProcent = $('#null-procent'),
		dateNullProcentText = $('#null-procent-text'),

		returnSumm = $('#return-summ'),
		returnDiff = $('#return-diff'),

		circleBg = $('#circle-bg'),
		circleSumm = $('#circle-summ'),
		circleDiff = $('#circle-diff');

	summ.slider({
		range: 'min',
		min: summMin,
		max: summMax,
		step: summStep,
		value: summValue,
		create: function(){
			result(summValue,1000);
		},
		slide: function(event,ui) {
			summSet.text(sepNumber(ui.value));
			result(ui.value,1000);
		}
	});

	date.slider({
		range: 'min',
		min: dateMin,
		max: dateMax,
		step: dateStep,
		value: dateValue,
		create: function(){
			dateNullProcent.css({
				'left' : widthStep() * (dateStartNullProcent - dateMin),
				'width' : widthStep() * (dateFinishNullProcent - dateStartNullProcent)
			});
			date.children('.ui-slider-handle').html(dateNullProcentText);
			dateNullProcentTextToggle(dateValue);
		},
		slide: function(event,ui) {
			dateSet.text(ui.value);
			dateSuf.text(declension(ui.value,['день','дня','дней']));
			dateNullProcentTextToggle(ui.value);
		}
	});

	function widthStep(){
		return date.width() / dateStep / (dateMax - dateMin);
	}

	function dateNullProcentTextToggle(v){
		v > dateFinishNullProcent || v < dateStartNullProcent ?
			dateNullProcentText.hide():
			dateNullProcentText.show().css('margin-left',-dateNullProcentText.outerWidth()/2);
	}

	function result(s,d){
		drawCircle(s,d);
		returnDiff.text(sepNumber(d));
		returnSumm.text(sepNumber(s+d));
	};

	function drawCircle(s,d) {
		var pi2r = parseInt(circleBg.attr('r')) * 2 * Math.PI;
		var diff = pi2r * d / summMax;
		var summ = pi2r * (s - d) / summMax;
		circleDiff.attr('stroke-dasharray', diff + ' ' + pi2r);
		circleSumm.attr('stroke-dasharray', summ + ' ' + pi2r);
		circleSumm.attr('stroke-dashoffset', -diff);
		circleBg.attr('stroke-dashoffset', -(diff+summ));
	}

	function declension(num, expressions) {
		var result;
		var count = num % 100;
		if (count > 4 && count < 21)
			result = expressions['2'];
		else {
			count = count % 10;
			if (count == 1)
				result = expressions['0'];
			else if (count > 1 && count < 5)
				result = expressions['1'];
			else
				result = expressions['2'];
		}
		return result;
	}
	function sepNumber(str){
		str = str.toString();
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}

	$('.calkulator__toggle-step').on('click',function(){
		$('.calkulator__step-next').toggleClass('hide');
	});

	$('.calkulator__input-box').children('.input').on('keyup blur',function(e){
		var t = $(this);
		setTimeout(function(){
			t.parent().toggleClass('calkulator__input-box--placeholder',Boolean(t.val()));
		});
	}).trigger('blur');

	$('.mask-tel').mask("+7 (999) 999-99-99");
	$('.mask-date').mask("99 / 99 / 9999",{placeholder:"дд / мм / гггг"});

})(jQuery);