/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var btn = $('.calkulator__radio-btn').find('input'), // кнопки переключения калькулятора
		btnActive, // активная кнопка
		typeCalcul, // тип калькулятора calcul-1, calcul-2, calcul-3

		// слайдер суммы
		summ = $('#slider-summ'),
		summMin,
		summMax,
		summStep,
		summValue,

		// сумма займа
		summSet = $("#summ-set"),

		// слайдер срока
		date = $('#slider-date'),
		dateMin,
		dateMax,
		dateStep,
		dateValue,

		// срок займа
		dateSet = $("#date-set"),
		// суффикс срока день, дня, дней
		dateSuf = $('#date-suf'),

		// % ставка 1%
		stavka,
		// % начислени, может быть меньше 0.65%
		procent,

		// сумма переплаты
		diffValue,

		// параметры calcul-1
		dateSkidka,
		dateNullProcentStart,
		dateNullProcentFinish,
		dateNullProcentMaxSumm,

		// параметры calcul-3
		skidkaStavka,
		skidkaStartSumm,
		skidkaStartDate,

		// желтая шкала скидки
		dateNullProcent = $('.null-procent'),

		// сообщение о скидке
		calkulatorInfo = $('.calkulator__info-text').children(),

		// сумма возврата вывод
		returnSumm = $('#return-summ'),
		// сумма переплаты вывод
		returnDiff = $('#return-diff'),

		// отступ у слайдера
		margin  = (summ.outerWidth(true) - summ.width()) / 2;


	function result(){

		// забиваем значения
		summValue = parseInt(summValue);
		dateValue = parseInt(dateValue);

		summSet.val(summValue);
		dateSet.val(dateValue);
		dateSuf.text(declension(dateValue,['день','дня','дней']));

		// обнеляем скидку
		dateSkidka = 0;
		procent = stavka;

		// скрываем сообщение о скидке
		dateNullProcent.add(calkulatorInfo).hide();

		// скидки
		switch(typeCalcul){
			case 'calcul-1' :

				// если в диапозоне дат и сумм (21-31 и до 10.000)
				if (dateValue <= dateNullProcentFinish && dateValue >= dateNullProcentStart && dateNullProcentMaxSumm >= summValue) {
					dateNullProcent.add(calkulatorInfo).show();
					dateSkidka = dateValue - dateNullProcentStart + dateStep;
				}

			break;
			case 'calcul-2' :

			break;

			case 'calcul-3' :

				// если в диапозоне дат и сумм (от 14 и от 5.000)
				if (summValue >= skidkaStartSumm && dateValue >= skidkaStartDate) {
					dateNullProcent.add(calkulatorInfo).show();
					procent = stavkaSkidka;
				}

			break;
		}

		// расчет переплаты
		diffValue = procent * summValue * (dateValue - dateSkidka) / 100;

		// вывели расчеты
		returnDiff.text(sepNumber(diffValue));
		returnSumm.text(sepNumber(summValue+diffValue));

	}

	// склонение
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
	// отделяем тысячи
	function sepNumber(str){
		str = parseInt(str).toString();
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}
	// склеиваем тысячи
	function strToNumber(n){
		return parseInt(n.replace(/\s+/g,''));
	}

	// переворачевание
	$('.calkulator__toggle-step').on('click',function(){
		$('.calkulator__step-next').toggleClass('calkulator__step-next--active');
	});

	// ввод данных на втором шаге
	$('.calkulator__input-box').children('.input').on('keyup blur',function(){
		var t = $(this);
		setTimeout(function(){
			t.parent().toggleClass('calkulator__input-box--placeholder',Boolean(t.val()));
		});
	}).trigger('blur');

	// выбор типа калькулятора
	btn.on('change',function(){
		btnActive = $(this),
		setSlider();
		var btn = $(this).closest('.btn');
		var index = btn.index();
		var ul = $('.calkulator__foot-ul').eq(index).add($('.calkulator__foot-ul--step-next').eq(index));
		ul.show().addClass('calkulator__foot-ul--active');
		ul.siblings().removeClass('calkulator__foot-ul--active');
	}).filter(':checked').trigger('change');

	function setSlider(){

		// тип калькулятора
		typeCalcul = btnActive.val();

		// парсим данные
		summMin = parseInt(btnActive.attr('data-summ-min'));
		summMax = parseInt(btnActive.attr('data-summ-max'));
		summStep = parseInt(btnActive.attr('data-summ-step'));
		summValue = parseInt(btnActive.attr('data-summ-value'));

		dateMin = parseInt(btnActive.attr('data-date-min'));
		dateMax = parseInt(btnActive.attr('data-date-max'));
		dateStep = parseInt(btnActive.attr('data-date-step'));
		dateValue = parseInt(btnActive.attr('data-date-value'));

		stavka = parseFloat(btnActive.attr('data-stavka'));

		// скидки
		switch(typeCalcul){
			case 'calcul-1' :

				dateNullProcentStart = parseInt(btnActive.attr('data-null-procent-start'));
				dateNullProcentFinish = parseInt(btnActive.attr('data-null-procent-finish'));
				dateNullProcentMaxSumm = parseInt(btnActive.attr('data-null-procent-maxsumm'));
				specProcent(summMin,dateNullProcentMaxSumm,dateNullProcentStart,dateNullProcentFinish);

				calkulatorInfo.text(btnActive.attr('data-null-procent-text'));

/*			dateNullProcent.filter('.null-procent--summ').css({
				'left'  : -margin,
				'width' : widthStepSumm() * (dateNullProcentMaxSumm - summMin) / summStep + margin
			});
			dateNullProcent.filter('.null-procent--date').css({
				'left'  : widthStepDate() * (dateNullProcentStart - dateMin) / dateStep,
				'width' : widthStepDate() * (dateNullProcentFinish - dateNullProcentStart) / dateStep + margin
			});
*/

			break;
			case 'calcul-2' :

			break;
			case 'calcul-3' :

				stavkaSkidka = parseFloat(btnActive.attr('data-skidka-stavka'));
				skidkaStartSumm = parseInt(btnActive.attr('data-skidka-start-summ'));
				skidkaStartDate = parseInt(btnActive.attr('data-skidka-start-date'));
				specProcent(skidkaStartSumm,summMax,skidkaStartDate,dateMax);

				calkulatorInfo.text(btnActive.attr('data-skidka-text'));

/*
			dateNullProcent.filter('.null-procent--summ').css({
				'left'  : widthStepSumm() * (skidkaStartSumm - summMin) / summStep,
				'width' : widthStepSumm() * (summMax - skidkaStartSumm) / summStep + margin
			});
			dateNullProcent.filter('.null-procent--date').css({
				'left'  : widthStepDate() * (skidkaStartDate - dateMin) / dateStep,
				'width' : widthStepDate() * (dateMax - skidkaStartDate) / dateStep + margin
			});
*/

			break;
		}

		// желтая шкала скидки
		function specProcent(startSummProcent,finishSummProcent,startDateProcent,finishDateProcent){

			var left,
				width,
				widthStepSumm = summ.width() * summStep / (summMax - summMin),
				widthStepDate = date.width() * dateStep / (dateMax - dateMin);

			left = startSummProcent==summMin ? -margin :
				widthStepSumm * (startSummProcent - summMin) / summStep;
			width = widthStepSumm * (finishSummProcent - startSummProcent) / summStep + margin;

			dateNullProcent.filter('.null-procent--summ').css({'left':left,'width':width});

			left = startDateProcent==dateMin ? -margin :
				widthStepDate * (startDateProcent - dateMin) / dateStep;
			width = widthStepDate * (finishDateProcent - startDateProcent) / dateStep + margin;

			dateNullProcent.filter('.null-procent--date').css({'left':left,'width':width});

		}

		// нижнии крайние значения
		$('.calkulator__summ-min').text(summMin);
		$('.calkulator__summ-max').text(summMax);
		$('.calkulator__date-min').text(dateMin);
		$('.calkulator__date-max').text(dateMax);

		// инициализация слайдеров
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

	// ввод суммы и даты в инпуте
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