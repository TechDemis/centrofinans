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
		dateNullProcent = $('.null-procent'),
		calkulatorInfo = $('.calkulator__info-text').children(),

		returnSumm = $('#return-summ'),
		returnDiff = $('#return-diff'),

		diffValue  = 980;

	summ.slider({
		range: 'min',
		min: summMin,
		max: summMax,
		step: summStep,
		value: summValue,
		create: function(){
			result();
		},
		slide: function(event,ui) {
			summValue = ui.value;
			result();
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
				'width' : widthStep() * (dateFinishNullProcent - dateStartNullProcent + 1)
			});
			result();
		},
		slide: function(event,ui) {
			dateValue = ui.value;
			result();
		}
	});

	summSet.add(dateSet).on('change keydown blur', function(event) {
		if (event.keyCode == 13) {
			$(this).trigger('blur');
		}
		if (event.type == 'blur') {
			var v = this.value;
			if (v.match(/[^0-9]/g))
				v = v.replace(/[^0-9]/g, '');
			if($(this).is('#summ-set')){
				if(v>summMax)
					v = summMax;
				if(v<summMin)
					v = summMin;
				summValue = v;
				summ.slider('value',v);
			}
			else {
				if(v>dateMax)
					v = dateMax;
				if(v<dateMin)
					v = dateMin;
				dateValue = v;
				date.slider('value',v);
			}
			result();
		}
	});

	function widthStep(){
		return date.width() / dateStep / (dateMax - dateMin);
	}

	function dateNullProcentTextToggle(v){
		v > dateFinishNullProcent || v < dateStartNullProcent ?
			dateNullProcent.add(calkulatorInfo).hide():
			dateNullProcent.add(calkulatorInfo).show();
	}

	function result(){

		summValue = parseInt(summValue);
		dateValue = parseInt(dateValue);

		diffValue = summValue * dateValue / 100;

		summSet.val(summValue);
		returnDiff.text(sepNumber(diffValue));
		returnSumm.text(sepNumber(summValue+diffValue));

		dateSet.val(dateValue);
		dateSuf.text(declension(dateValue,['день','дня','дней']));
		dateNullProcentTextToggle(dateValue);

	}

	function declension(num, expressions) {
		var r;
		var count = num % 100;
		if (count > 4 && count < 21)
			r = expressions['2'];
		else {
			count = count % 10;
			if (count == 1)
				r = expressions['0'];
			else if (count > 1 && count < 5)
				r = expressions['1'];
			else
				r = expressions['2'];
		}
		return r;
	}
	function sepNumber(str){
		str = parseInt(str).toString();
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}
	function strToNumber(n){
		return parseInt(n.replace(/\s+/g,''));
	}

	$('.calkulator__toggle-step').on('click',function(){
		$('.calkulator__step-next').toggleClass('calkulator__step-next--active');
	});

	$('.calkulator__input-box').children('.input').on('keyup blur',function(e){
		var t = $(this);
		setTimeout(function(){
			t.parent().toggleClass('calkulator__input-box--placeholder',Boolean(t.val()));
		});
	}).trigger('blur');

	$('.calkulator__radio-btn').find('input').on('change',function(){
		result();
		var btn = $(this).closest('.btn');
		var ul = $('.calkulator__foot-ul').eq(btn.index());
		ul.addClass('calkulator__foot-ul--active');
		ul.siblings().removeClass('calkulator__foot-ul--active');
	});

	$('.calkulator__box').on('submit',function(){
		$(this).find('.input').each(function(){
			if($(this).val()=='')
				$(this).addClass('input--error').one('focus',function(){
					$(this).removeClass('input--error');
				});
		});
		if($(this).find('.input--error').length>0)
			return false;
	});

})(jQuery);