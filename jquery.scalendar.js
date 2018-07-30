(function( $ ) { 
    $.fn.sCalendar = function(options) {		
		var thisCalObj = $(this);

		// Default settings object
		var defaults = {
			defaultDate: moment(),
			firstDayOfWeek: 1,
			minDate: null,//moment("2017-11-17"),
			maxDate: null,//moment("2017-12-17")
			dateFormat: "DD-MM-YYYY"
		};
		var settings = $.extend( {}, defaults, options );	

		var isMouseDown = false;
		var startRowIndex = null;
		var startCellIndex = null;
		var scalBody;
		var daysArr = [];

		// Local Methods
		var initScal = function(){
			var defaultDate = settings.defaultDate;
			settings.defaultDate = moment(settings.defaultDate).startOf('month');

			var header = getScalHeader();
			var dayHeader = getScalDayHeader();
			var body = getScalBody();

			var finalCal = '<div class="scalWrapperStyle" style="display: none;">'+
								'<table class="scalStyle">'+
									'<tbody>'+
										'<tr><td class="scalHeaderStyle" colspan="7">'+ header +'</td></tr>'+
										'<tr><td colspan="7" style="padding: 0;border-top: 1px solid #c5c5c5;border-bottom: 1px solid #c5c5c5;">'+ dayHeader +'</td></tr>'+
										'<tr><td colspan="7" style="padding: 0;">'+ body +'</td></tr>'+
									'</tbody>'+
							   '</table>'+
							'</div>';
			thisCalObj.after(finalCal);

			handleScalNextPrevBtns();
			registerScalHeaderEvents();
			registerScalBodyEvents();
			displayScal();
			$("[cell-date="+ moment(defaultDate).format(settings.dateFormat) +"]").addClass("scalSelectedDayStyle");
		}
		var getScalHeader = function(){
			var head = settings.defaultDate.format("MMM YYYY");
			return '<table class="scalHeaderStyle" style="width: 100%;">'+
					'<tbody>'+
						'<tr><td align="center">'+
							'<span class="scalPrevStyle">&#8249;</span><span id="scalHeader">'+ head +'</span><span class="scalNextStyle">&#8250;</span>'+
						'</td></tr>'+
					'</tbody>'+
				   '</table>';
		}
		var getScalDayHeader = function(){
			var FirstDayOfWeek = settings.firstDayOfWeek;
			var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			var appendString = '<tr>';
			for (var i = 0; i < days.length; i++) {
				if (FirstDayOfWeek > 6) {
					FirstDayOfWeek = 0;
				}
				appendString += '<td align="center" class="scalDayHeaderStyle" style="width: 14%;padding: 5px;">' + days[FirstDayOfWeek] + '</td>';
				daysArr.push(FirstDayOfWeek);
				FirstDayOfWeek++;
			}
			appendString += '</tr>';
			return '<table style="width: 100%;">'+
					'<tbody style="border: 1px solid #c5c5c5;">'+ appendString + '</tbody>'+
				   '</table>';
		}
		var getScalBody = function(){			
			return '<table  style="width: 100%;" border="0">'+
					'<tbody id="scalBody" style="border: 1px solid #c5c5c5;">'+ getScalBodyCells() + '</tbody>'+
				   '</table>';
		}
		var getScalBodyCells = function(){
			var appendString = '';
			var cellStyle, cellText, cellAttr;
			var date, month, year;
			var monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var totalCalWeeks = 0//12;
			var firstVisibleDate = moment(settings.defaultDate);
			var weekDay = firstVisibleDate.day();
			var blankDay = false;
			var dayOfMonth = 0;	
			var minDate = settings.minDate;
			var maxDate = settings.maxDate;
			var selectable;
			if(totalCalWeeks){
				for (var week = 0; week < totalCalWeeks; week++) {
					appendString += '<tr>';
					for (var day = 0; day < 7; day++) {
						if(dayOfMonth == 0){
							if(daysArr[day] != weekDay)
								blankDay = true;
							else{
								blankDay = false;
								dayOfMonth++;
							}
						}
						if(blankDay){
							appendString += '<td class="unselectable" style="width: 14%;padding: 5px;" nowrap></td>';
						}
						else{
							if(!(dayOfMonth == 1))
								firstVisibleDate.add(1, 'day');

							date = firstVisibleDate.date();
							month = firstVisibleDate.month() + 1;
							year = firstVisibleDate.year();

							if (month % 2 == 0)
								cellStyle = "scalEvenMonthStyle";
							else
								cellStyle = "scalOddMonthStyle";

							cellAttr = moment(firstVisibleDate).format(settings.dateFormat);
							cellText = monthsArr[month - 1] + " " + date;

							if(minDate != null && maxDate != null){
								if(firstVisibleDate.isSameOrAfter(minDate) && firstVisibleDate.isSameOrBefore(maxDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else if(minDate != null){
								if(firstVisibleDate.isSameOrAfter(minDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else if(maxDate != null){
								if(firstVisibleDate.isSameOrBefore(maxDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else
								selectable = true;
							if(selectable)
								cellStyle += " selectable";
							else
								cellStyle += " unselectable";

							appendString += '<td align="center" cell-date="' + cellAttr + '" class="' + cellStyle + '" style="width: 14%;padding: 5px;" nowrap>' + date + '</td>';
							dayOfMonth++;
						}
					}
					appendString += '</tr>';
				}
			}
			else{
				var totalDaysInMonth = firstVisibleDate.daysInMonth();							
				while(dayOfMonth <= totalDaysInMonth){
					appendString += '<tr>';
					for (var day = 0; day < 7; day++) {						
						if(totalDaysInMonth < dayOfMonth)
							blankDay = true;
						if(dayOfMonth == 0){
							if(daysArr[day] != weekDay)
								blankDay = true;
							else{
								blankDay = false;
								dayOfMonth++;
							}
						}
						if(blankDay){
							appendString += '<td class="unselectable" style="width: 14%;padding: 5px;" nowrap></td>';
						}
						else{
							if(!(dayOfMonth == 1))
								firstVisibleDate.add(1, 'day');
							date = firstVisibleDate.date();
							month = firstVisibleDate.month() + 1;
							year = firstVisibleDate.year();
															
							cellStyle = "scalOddMonthStyle";

							cellAttr = moment(firstVisibleDate).format(settings.dateFormat);
							cellText = monthsArr[month - 1] + " " + date;

							if(minDate != null && maxDate != null){
								if(firstVisibleDate.isSameOrAfter(minDate) && firstVisibleDate.isSameOrBefore(maxDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else if(minDate != null){
								if(firstVisibleDate.isSameOrAfter(minDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else if(maxDate != null){
								if(firstVisibleDate.isSameOrBefore(maxDate)){
									selectable = true;
								}
								else
									selectable = false;
							}
							else
								selectable = true;
							if(selectable)
								cellStyle += " selectable";
							else
								cellStyle += " unselectable";

							appendString += '<td align="center" cell-date="' + cellAttr + '" class="' + cellStyle + '" style="width: 14%;padding: 5px;" nowrap>' + date + '</td>';
							dayOfMonth++;
						}
					}
					appendString += '</tr>';
				}					
			}
			return appendString;
		}
		var registerScalBodyEvents = function(){
			scalBody = $("#scalBody");
			scalBody.find("td").mousedown(function (e) {
				e.stopPropagation();
				isMouseDown = true;
				var cell = $(this);
				if(cell.hasClass("unselectable"))
					return false;
				if (e.shiftKey) {
					scalBody.find(".scalSelectedDayStyle").removeClass("scalSelectedDayStyle"); // deselect everything
					scalSelectTo(cell);
				}
				else if (e.ctrlKey) {
					cell.addClass(cell.className == "scalSelectedDayStyle" ? "" : "scalSelectedDayStyle");
				}
				else {
					scalBody.find(".scalSelectedDayStyle").removeClass("scalSelectedDayStyle"); // deselect everything
					cell.addClass("scalSelectedDayStyle");
					startCellIndex = cell.index();
					startRowIndex = cell.parent().index();
				}
				return false;
			}).mouseover(function () {
				if (!isMouseDown) return;
				scalBody.find(".scalSelectedDayStyle").removeClass("scalSelectedDayStyle"); // deselect everything
				scalSelectTo($(this));
			}).bind("selectstart", function () {
				return false;
			}).mouseup(function (e) {
				if(!e.ctrlKey && thisCalObj.is('input') && $(".scalSelectedDayStyle").length){
					var dates = [];
					$(".scalSelectedDayStyle").each(function () {
						dates.push($(this).attr("cell-date"));
					});
					thisCalObj.val(dates.join(","));
					$(".scalWrapperStyle").hide();
				}
			});

			$(document).mouseup(function () {
				isMouseDown = false;
			});
		}
		var registerScalHeaderEvents = function(){
			var scalHeader = $("#scalHeader");
			$(".scalPrevStyle").click(function() {
				event.stopPropagation();
				if($(".scalPrevStyle").hasClass('unclickable'))
					return false;
				settings.defaultDate = settings.defaultDate.subtract(1, 'months').startOf('month');
				scalBody.empty();
				scalBody.append(getScalBodyCells());
				scalHeader.empty();
				scalHeader.append(settings.defaultDate.format("MMM YYYY"));
				handleScalNextPrevBtns();
				registerScalBodyEvents();
			});
			$(".scalNextStyle").click(function() {
				event.stopPropagation();
				if($(".scalNextStyle").hasClass('unclickable'))
					return false;
				settings.defaultDate = settings.defaultDate.add(1, 'months').startOf('month');
				scalBody.empty();
				scalBody.append(getScalBodyCells());
				scalHeader.empty();
				scalHeader.append(settings.defaultDate.format("MMM YYYY"));
				handleScalNextPrevBtns();
				registerScalBodyEvents();				
			});
		}
		var handleScalNextPrevBtns = function(){
			var scalPrevStyle = $(".scalPrevStyle");
			var scalNextStyle = $(".scalNextStyle");
			var clickable;
			if(settings.minDate != null){
				if(settings.defaultDate.year() != settings.minDate.year())
					clickable = true;
				else if(settings.defaultDate.month() > settings.minDate.month())
					clickable = true;
				else
					clickable = false;					
			}
			else
				clickable = true;
			if(clickable){
				if(scalPrevStyle.hasClass('unclickable'))
					scalPrevStyle.removeClass('unclickable');
				scalPrevStyle.addClass('clickable');
			}
			else{
				if(scalPrevStyle.hasClass('clickable'))
					scalPrevStyle.removeClass('clickable');
				scalPrevStyle.addClass('unclickable');
			}

			if(settings.maxDate != null){
				if(settings.defaultDate.year() != settings.maxDate.year())
					clickable = true;
				else if(settings.defaultDate.month() < settings.maxDate.month())
					clickable = true;
				else
					clickable = false;					
			}
			else
				clickable = true;
			if(clickable){
				if(scalNextStyle.hasClass('unclickable'))
					scalNextStyle.removeClass('unclickable');
				scalNextStyle.addClass('clickable');
			}
			else{
				if(scalNextStyle.hasClass('clickable'))
					scalNextStyle.removeClass('clickable');
				scalNextStyle.addClass('unclickable');
			}
		}
		var scalSelectTo = function(cell) {
			var row = cell.parent();
			var cellIndex = cell.index();
			var rowIndex = row.index();
			var rowStart, rowEnd, cellStart, cellEnd;

			if (rowIndex < startRowIndex) {
				rowStart = rowIndex;
				rowEnd = startRowIndex;
			} else {
				rowStart = startRowIndex;
				rowEnd = rowIndex;
			}

			if (cellIndex < startCellIndex) {
				cellStart = cellIndex;
				cellEnd = startCellIndex;
			} else {
				cellStart = startCellIndex;
				cellEnd = cellIndex;
			}

			for (var i = rowStart; i <= rowEnd; i++) {
				var rowCells = scalBody.find("tr").eq(i).find("td");
				for (var j = cellStart; j <= cellEnd; j++) {
					if(rowCells.eq(j).hasClass("selectable"))
						rowCells.eq(j).addClass("scalSelectedDayStyle");
				}
			}
		}
		var displayScal = function(){
			var scalWrapperStyle = $(".scalWrapperStyle");
			if(thisCalObj.is('input')){
				thisCalObj.click(function(event) {	
					event.stopPropagation();				
					scalWrapperStyle.show();
					scalWrapperStyle.css({
						"top": $( this ).offset().top + 22,
						"left": $( this ).offset().left
					});
				});
				$(document).click(function (event) {
					scalWrapperStyle.hide();
				});
				scalWrapperStyle.click(function (event) {
					event.stopPropagation();
				});
			}
			else{
				scalWrapperStyle.show();
				scalWrapperStyle.css({
					"top": thisCalObj.offset().top,
					"left": thisCalObj.offset().left
				});
			}
		}
		
		// Global Methods
		var methods = {
			getScalDates: function(){
				var dates = [];
				$(".scalSelectedDayStyle").each(function () {
					dates.push($(this).attr("cell-date"));
				});
				return dates;
			},
			setScalDates: function(dates){
				if($.isArray(dates)){
					for (var j = 0; j < dates.length; j++) {
						$("[cell-date="+ moment(dates[j]).format(settings.dateFormat) +"]").addClass("scalSelectedDayStyle");
					}
				}
				else
					$("[cell-date="+ moment(dates).format(settings.dateFormat) +"]").addClass("scalSelectedDayStyle");
			},
			destroyScal: function(){
				$(".scalWrapperStyle").remove();
			},
			hideScal: function(){
				$(".scalWrapperStyle").hide();
			},
			showScal: function(){
				$(".scalWrapperStyle").show();
			}
		};

		initScal();

		return methods;
    }; 
}( jQuery ));