/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var btn = $('.calkulator__radio-btn').find('input'),
		btnActive,

		summ = $('#slider-summ'),
		summMin,
		summMax,
		summStep,
		summValue,

		summSet = $("#summ-set"),

		date = $('#slider-date'),
		dateMin,
		dateMax,
		dateStep,
		dateValue,

		dateSet = $("#date-set"),
		dateSuf = $('#date-suf'),

		dateStartNullProcent,
		dateFinishNullProcent,
		dateNullProcent = $('.null-procent'),

		calkulatorInfo = $('.calkulator__info-text').children(),

		returnSumm = $('#return-summ'),
		returnDiff = $('#return-diff'),

		diffValue  = 980;

	function widthStep(){
		return date.width() / dateStep / (dateMax - dateMin);
	}

	function dateNullProcentTextToggle(v){
		if(dateStartNullProcent == dateFinishNullProcent){
			dateNullProcent.add(calkulatorInfo).hide();
		}
		else {
			v > dateFinishNullProcent || v < dateStartNullProcent ?
				dateNullProcent.add(calkulatorInfo).hide():
				dateNullProcent.add(calkulatorInfo).show();
		}
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

	btn.on('change',function(){
		btnActive = $(this),
		setSlider();
		var btn = $(this).closest('.btn');
		var index = btn.index();
		var ul = $('.calkulator__foot-ul').eq(index).add($('.calkulator__foot-ul--step-next').eq(index));
		ul.show().addClass('calkulator__foot-ul--active');
		ul.siblings().removeClass('calkulator__foot-ul--active');
	}).filter(':checked').trigger('change');

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

	function setSlider(){

		summMin = parseInt(btnActive.attr('data-summ-min')),
		summMax = parseInt(btnActive.attr('data-summ-max')),
		summStep = parseInt(btnActive.attr('data-summ-step')),
		summValue = parseInt(btnActive.attr('data-summ-value')),

		dateMin = parseInt(btnActive.attr('data-date-min')),
		dateMax = parseInt(btnActive.attr('data-date-max')),
		dateStep = parseInt(btnActive.attr('data-date-step')),
		dateValue = parseInt(btnActive.attr('data-date-value')),

		dateStartNullProcent = parseInt(btnActive.attr('data-start-null-procent')),
		dateFinishNullProcent = parseInt(btnActive.attr('data-finish-null-procent'));

		dateNullProcent.css({
			'left' : widthStep() * (dateStartNullProcent - dateMin),
			'width' : widthStep() * (dateFinishNullProcent - dateStartNullProcent + 1)
		});

		$('.calkulator__summ-min').text(summMin);
		$('.calkulator__summ-max').text(summMax);
		$('.calkulator__date-min').text(dateMin);
		$('.calkulator__date-max').text(dateMax);

		summ.slider({
			range: 'min',
			min: summMin,
			max: summMax,
			step: summStep,
			value: summValue,
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
			slide: function(event,ui) {
				dateValue = ui.value;
				result();
			}
		});

		result();

	}

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

})(jQuery);