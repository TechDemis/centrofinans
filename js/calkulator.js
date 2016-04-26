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
		// % начислени, может быть меньше ставки
		procent,

		// сумма переплаты
		diffValue,

		// параметры calcul-1
		weekForNothing,
		weekForNothingStars,
		dateNullProcentStart,
		dateNullProcentFinish,
		dateNullProcentMaxSumm,

		// параметры calcul-2
		paymentPeriod,
		paymentPeriodQuantity,
		AnnuityCoefficient,

		// параметры calcul-3
		skidkaStavka,
		skidkaStartSumm,
		skidkaStartDate,
		skidkaStartSumm2,
		skidkaStartDate2,

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

		// обнуляем ставку
		procent = stavka;

		// скрываем сообщение о скидке
		dateNullProcent.add(calkulatorInfo).hide();

		// скидки
		switch(typeCalcul){
			case 'calcul-1' :

				// обнуляем скидку
				weekForNothing = 0;
				// если дата больше 21 и сумма меньше 10.000 то с 15-21 не начисляем
				if (dateValue >= weekForNothingStars && dateNullProcentMaxSumm >= summValue) {
					dateNullProcent.add(calkulatorInfo).show();
					weekForNothing = dateNullProcentFinish - dateNullProcentStart + 1;
				}

				// расчет переплаты
				diffValue = procent * summValue * (dateValue - weekForNothing) / 100;

			break;
			case 'calcul-2' :

				calkulatorInfo.show();
				// формула аннуитета = i / ( (1+i)^n - 1 ) + i
				// Количество периодов
				paymentPeriodQuantity = dateValue / paymentPeriod;
				// Процентная ставка за период
				procent = procent * paymentPeriod / 100;
				// Коэффициент аннуитета
				AnnuityCoefficient = procent/(Math.pow((1+procent),paymentPeriodQuantity)-1) + procent;
				// Регулярный платеж = AnnuityCoefficient * summValue
				// Общая сумма платежей = Регулярный платеж * paymentPeriodQuantity
				// Сумма процентов = Общая сумма платежей - Сумма займа 
				// расчет переплаты
				diffValue = AnnuityCoefficient * summValue * paymentPeriodQuantity - summValue;

			break;

			case 'calcul-3' :

				// если в диапозоне дат и сумм (до 14 и от 15.000)
				if (summValue >= skidkaStartSumm2 && dateValue <= skidkaStartDate2) {
					dateNullProcent.add(calkulatorInfo).show();
					procent = stavkaSkidka;
					calkulatorInfo.text(calkulatorInfo.data('text2'));
				}
				// если в диапозоне дат и сумм (от 14 и от 5.000)
				else if (summValue >= skidkaStartSumm && dateValue >= skidkaStartDate) {
					dateNullProcent.add(calkulatorInfo).show();
					procent = stavkaSkidka;
					calkulatorInfo.text(calkulatorInfo.data('text'));
				}

				// расчет переплаты
				diffValue = procent * summValue * dateValue / 100;

			break;
		}

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

				weekForNothingStars = parseInt(btnActive.attr('data-null-spec-start'))
				dateNullProcentStart = parseInt(btnActive.attr('data-null-procent-start'));
				dateNullProcentFinish = parseInt(btnActive.attr('data-null-procent-finish'));
				dateNullProcentMaxSumm = parseInt(btnActive.attr('data-null-procent-maxsumm'));
				specProcent(summMin,dateNullProcentMaxSumm,dateNullProcentStart,dateNullProcentFinish);
				calkulatorInfo.text(btnActive.attr('data-text-spec'));

			break;
			case 'calcul-2' :

				paymentPeriod = parseInt(btnActive.attr('data-payment-period'));
				calkulatorInfo.text(btnActive.attr('data-text-spec'));

			break;
			case 'calcul-3' :

				stavkaSkidka = parseFloat(btnActive.attr('data-skidka-stavka'));
				skidkaStartSumm = parseInt(btnActive.attr('data-skidka-start-summ'));
				skidkaStartDate = parseInt(btnActive.attr('data-skidka-start-date'));
				specProcent(skidkaStartSumm,summMax,skidkaStartDate,dateMax);
				calkulatorInfo.text(btnActive.attr('data-text-spec'));
				skidkaStartSumm2 = parseInt(btnActive.attr('data-skidka-start-summ2'));
				skidkaStartDate2 = parseInt(btnActive.attr('data-skidka-start-date2'));
				calkulatorInfo.data('text',btnActive.attr('data-text-spec'));
				calkulatorInfo.data('text2',btnActive.attr('data-text-spec2'));

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
/*				var arithmetic = (v - summMin) % summStep;
				if (arithmetic > 0){
					v = parseInt((v - summMin) / summStep) * summStep + summMin;
					if (arithmetic * 2 > summStep){
						v += summStep;
					}
				}
*/				summValue = v;
				summ.slider('value',v);
			}
			else {
				if(v>dateMax)
					v = dateMax;
				if(v<dateMin)
					v = dateMin;
				var arithmetic = (v - dateMin) % dateStep;
				if (arithmetic > 0){
					v = parseInt((v - dateMin) / dateStep) * dateStep + dateMin;
					if (arithmetic * 2 > dateStep){
						v += dateStep;
					}
				}
				dateValue = v;
				date.slider('value',v);
			}
			result();
		}
	});

})(jQuery);