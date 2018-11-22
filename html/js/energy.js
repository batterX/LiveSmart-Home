// Get All Needed Strings

var lang = {
	"battery_out":        "Battery",
	"battery_in":         "Battery (Charging)",
	"grid_out":           "Grid Consumption",
	"grid_in":            "Grid (Injection)",
	"direct_consumption": "Direct Consumption",
	"total_production":   "Total Production",
	"total_consumption":  "Total Consumption",
	"apply":              "Apply",
	"cancel":             "Cancel",
	"from":               "From",
	"to":                 "To",
	"custom":             "Custom",
	"mo":                 "Mo",
	"tu":                 "Tu",
	"we":                 "We",
	"th":                 "Th",
	"fr":                 "Fr",
	"sa":                 "Sa",
	"su":                 "Su",
	"january":            "January",
	"february":           "February",
	"march":              "March",
	"april":              "April",
	"may":                "May",
	"june":               "June",
	"july":               "July",
	"august":             "August",
	"september":          "September",
	"october":            "October",
	"november":           "November",
	"december":           "December",
	"today":              "Today",
	"yesterday":          "Yesterday",
	"last_7_days":        "Last 7 Days",
	"last_30_days":       "Last 30 Days",
	"this_month":         "This Month",
	"last_month":         "Last Month",
	"this_year":          "This Year",
	"last_12_months":     "Last 12 Months"
}





// Get Token

var token = "";










/*
	BOTH CLOUD AND LOCAL ARE SAME BELOW THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










// Hide Overlay - Variables

var overlay_batteryOut = false;
var overlay_batteryIn = false;
var overlay_gridOut = false;
var overlay_gridIn = false;
var overlay_directConsumption = false;

// Hide Overlay - Function

function hideOverlay(varName) {
	// Set Variable to True
	if(varName == "overlay_batteryOut")        overlay_batteryOut        = true;
	if(varName == "overlay_batteryIn")         overlay_batteryIn         = true;
	if(varName == "overlay_gridOut")           overlay_gridOut           = true;
	if(varName == "overlay_gridIn")            overlay_gridIn            = true;
	if(varName == "overlay_directConsumption") overlay_directConsumption = true;
	// Hide Overlay if all Variables == True
	if(overlay_batteryOut && overlay_batteryIn && overlay_gridOut && overlay_gridIn && overlay_directConsumption)
		$('.overlay').fadeOut();
}

// Show Overlay

function showOverlay() {
	$('.overlay').show();
	overlay_batteryOut = overlay_batteryIn = overlay_gridOut = overlay_gridIn = overlay_directConsumption = false;
}





// Set OnClick Listeners for all Buttons

$('#btn-production').on('click', function() {
	$('#btn-production').addClass('btn-selected');
	$('#btn-consumption').removeClass('btn-selected');
	btnSelected = 1;
	chart.config.data.datasets = [
		dataset_directConsumption,
		dataset_batteryIn,
		dataset_gridIn
	];
	chart.update();
});

$('#btn-consumption').on('click', function() {
	$('#btn-production').removeClass('btn-selected');
	$('#btn-consumption').addClass('btn-selected');
	btnSelected = 2;
	chart.config.data.datasets = [
		dataset_directConsumption,
		dataset_batteryOut,
		dataset_gridOut
	];
	chart.update();
});

$("#btnZoom").on('click', function() {
	zoomActive = !zoomActive;
	getEnergy(false);
});

$('#btnPrev').on('click', function() {
	date_from = moment(date_from).subtract(1, "days").format("YYYYMMDD");
	date_to   = moment(date_to  ).subtract(1, "days").format("YYYYMMDD");
	$('#btn-calendar').data('daterangepicker').setStartDate(moment(date_from).format("MM/DD/YYYY"));
	$('#btn-calendar').data('daterangepicker').setEndDate(  moment(date_to  ).format("MM/DD/YYYY"));
	setSelectedDateRange();
	getEnergy();
	$('#btnNext').find('h4').html('&gt;');
});

$('#btnNext').on('click', function() {
	if(moment().diff(moment(date_to), 'days') != 0) {
		date_from = moment(date_from).add(1, "days").format("YYYYMMDD");
		date_to   = moment(date_to  ).add(1, "days").format("YYYYMMDD");
		$('#btn-calendar').data('daterangepicker').setStartDate(moment(date_from).format("MM/DD/YYYY"));
		$('#btn-calendar').data('daterangepicker').setEndDate(  moment(date_to  ).format("MM/DD/YYYY"));
		setSelectedDateRange();
		getEnergy();
		if(moment().diff(moment(date_to), 'days') == 0) $('#btnNext').find('h4').html('&#10227;');
	} else {
		setSelectedDateRange();
		getEnergy();
	}
});





// Initialize Variables

var btnSelected = 1; // 1=Production 2=Consumption
var zoomActive = true; // If True -> Show hours 05:00 to 21:00 else show 00:00 to 24:00

var data_batteryOut = [];
var data_batteryIn = [];
var data_gridOut = [];
var data_gridIn = [];
var data_directConsumption = [];

var labels = [];

var dataset_batteryOut = {
	label: lang['battery_out'],
	borderColor: "green",
	backgroundColor: "rgba(0, 128, 0, 1)",
	fill: true,
	data: data_batteryOut
};
var dataset_batteryIn = {
	label: lang['battery_in'],
	borderColor: "green",
	backgroundColor: "rgba(0, 128, 0, 1)",
	fill: true,
	data: data_batteryIn
};
var dataset_gridOut = {
	label: lang['grid_out'],
	borderColor: "rgb(0, 191, 255)",
	backgroundColor: "rgba(0, 191, 255, 1)",
	fill: true,
	data: data_gridOut
};
var dataset_gridIn = {
	label: lang['grid_in'],
	borderColor: "rgb(0, 191, 255)",
	backgroundColor: "rgba(0, 191, 255, 1)",
	fill: true,
	data: data_gridIn
};
var dataset_directConsumption = {
	label: lang['direct_consumption'],
	borderColor: "rgb(255, 165, 0)",
	backgroundColor: "rgba(255, 165, 0, 1)",
	fill: true,
	data: data_directConsumption
};

var date_from = moment().format("YYYYMMDD");
var date_to = moment().format("YYYYMMDD");
setSelectedDateRange();





// Create and Initialize the Chart

var customTooltips = function(tooltip) {
	
	// Tooltip Element
	var tooltipEl = document.getElementById('chartjs-tooltip');
	
	// Create Tooltip Element if not Exists
	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.id = 'chartjs-tooltip';
		tooltipEl.innerHTML = "<table></table>"
		this._chart.canvas.parentNode.appendChild(tooltipEl);
	}
	
	// Hide if no tooltip
	if (tooltip.opacity === 0) { tooltipEl.style.opacity = 0; return; }

	// Set Caret Position
	tooltipEl.classList.remove('above', 'below', 'no-transform');
	if(tooltip.yAlign) tooltipEl.classList.add(tooltip.yAlign);
	else tooltipEl.classList.add('no-transform');	

	// Pop-up Box onChartHover
	function getBody(bodyItem) { return bodyItem.lines; }

	// Set Text
	if(tooltip.body) {
		// Get Content Lines
		var titleLines = tooltip.title || [];
		var bodyLines = tooltip.body.map(getBody);
		// If Energy is displayed -> Add 'Wh' instead of 'W'
		var extraChar = "";
		if(date_from != date_to) extraChar = "h";
		// Build Box
		var innerHtml = '<thead>';
		titleLines.forEach(function(title) { innerHtml += '<tr><th colspan="2">' + title + '</th></tr>'; });
		innerHtml += '</thead><tbody>';
		var total = 0;
		bodyLines.forEach(function(body, i) {
			// Create Little Colored Box for the Body Line
			var colors = tooltip.labelColors[i];
			var style = 'background:' + colors.backgroundColor + '; border-color:' + colors.borderColor + '; border-width: 2px';
			var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
			var name = body.toString().split(': ')[0];
			var value = body.toString().split(': ')[1];
			total += parseInt(value);
			// Show value (W or KW)
			if(value < 1000) value = Math.round(value * 10) / 10 + " W" + extraChar;
			else value = Math.round(value / 100) / 10 + " KW" + extraChar;
			// Write Line
			innerHtml += '<tr><td>' + span + name + ' : </td><td class="value">' + value + '</td></tr>';
		});
		innerHtml += '</tbody><tfoot>';
		// Add Total Production/Consumption
		if(btnSelected == 1) innerHtml += '<tr><td>' + lang['total_production'];
		else innerHtml += '<tr><td>' + lang['total_consumption'];
		// Show Value (W or KW)
		if(total < 1000) total = Math.round(total * 10) / 10 + " W" + extraChar;
		else total = Math.round(total / 100) / 10 + " KW" + extraChar;
		// Write Line
		innerHtml += ': </td><td class="value">' + total + '</td></tr>';
		innerHtml += '</tfoot>';
		// Show Box to User
		var tableRoot = tooltipEl.querySelector('table');
		tableRoot.innerHTML = innerHtml;
	}
	
	// Display Style
	tooltipEl.style.opacity = 1;
	tooltipEl.style.top = this._chart.canvas.getBoundingClientRect().top + "px";
	
	// Set Position so it stays within View
	var xPosition = this._chart.canvas.offsetLeft + tooltip.caretX;
	var width = tooltipEl.getBoundingClientRect().right - tooltipEl.getBoundingClientRect().left;
	if(xPosition - width / 2 < 10) 
		xPosition = 10 + width / 2;
	else if(xPosition + width / 2 > window.innerWidth)
		xPosition = window.innerWidth - width / 2 - 10;
	tooltipEl.style.left = xPosition + "px";
	
	// Font Style
	tooltipEl.style.fontFamily = tooltip._fontFamily;
	tooltipEl.style.fontSize = tooltip.fontSize;
	tooltipEl.style.fontStyle = tooltip._fontStyle;
	tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';

};

var tooltips_obj = {
	position: 'nearest',
	mode: 'index',
	intersect: false,
	titleMarginBottom: 10,
	titleFontFamily: 'Raleway',
	titleFontSize: 16,
	bodyFontFamily: 'Raleway',
	bodyFontSize: 14,
	bodySpacing: 10,
	xPadding: 10,
	yPadding: 10,
	cornerRadius: 0,
	caretSize: 10,
	enabled: false,
	custom: customTooltips
}
var data_obj = {
	labels: labels,
	datasets: [
		dataset_directConsumption,
		dataset_batteryIn,
		dataset_gridIn
	]
}
var xAxes_obj = {
	stacked: true,
	display: true,
	ticks: {
		beginAtZero: true,
		fontColor: 'white',
		fontFamily: 'Raleway'
	},
	gridLines: {
		display: true,
		color: '#212121'
	}
}
var legend_obj = {
	display: 'true',
	position: 'bottom',
	labels: {
		fontSize: 14,
		fontColor: 'white',
		fontFamily: 'Raleway',
		padding: 20,
		usePointStyle: true
	}
}
var gridLines_obj = {
	display: true,
	color: '#212121',
	drawTicks: true
}

var config_line = {
	type: 'line',
	data: data_obj, 
	options: {
		responsive: true,
		maintainAspectRatio: false,
		legend: legend_obj,
		elements: {
			line: {
				borderWidth: 0, 
				fill: false,
				tension: 0.4
			},
			point: {
				radius: 0,
				hitRadius: 15,
				hoverRadius: 5
			}
		},
		tooltips: tooltips_obj,
		hover: {
			mode: 'index',
			intersect: false
		},
		scales: {
			xAxes: [xAxes_obj],
			yAxes: [{
				display: true,
				stacked: true,
				ticks: {
					callback: function(value, index, values) {
						if(value < 1000) return Math.round(value * 10) / 10 + " W";
						else return Math.round(value / 100) / 10 + " KW";
					},
					beginAtZero: true,
					min: 0,
					mirror: false,
					maxTicksLimit: 20,
					fontColor: 'white',
					fontFamily: 'Raleway'
				},
				gridLines: gridLines_obj
			}]
		}
	}
}
var config_bar = {
	type: 'bar',
	data: data_obj, 
	options: {
		responsive: true,
		maintainAspectRatio: false,
		legend: legend_obj,
		elements: {
			line: {
				borderWidth: 3, 
				fill: false,
				tension: 0.1
			},
			point: {
				radius: 3,
				hitRadius: 15,
				hoverRadius: 5
			}
		},
		tooltips: tooltips_obj,
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [xAxes_obj],
			yAxes: [{
				display: true,
				stacked: true,
				ticks: {
					callback: function(value, index, values) {
						if(value < 1000) return Math.round(value * 10) / 10 + " Wh";
						else return Math.round(value / 100) / 10 + " KWh";
					},
					beginAtZero: true,
					min: 0,
					mirror: false,
					maxTicksLimit: 20,
					fontColor: 'white',
					fontFamily: 'Raleway'
				},
				gridLines: gridLines_obj
			}]
		}
	}
}

var ctx = document.getElementById("chart").getContext("2d");

var chart = new Chart(ctx, config_line);





// Initialize the Date-Range-Picker

var tempRanges = {};
tempRanges[lang['today']] = [moment(), moment()];
tempRanges[lang['yesterday']] = [moment().subtract(1, "days"), moment().subtract(1, "days")];
tempRanges[lang['last_7_days']] = [moment().subtract(6, "days"), moment()];
tempRanges[lang['last_30_days']] = [moment().subtract(29, "days")];
tempRanges[lang['this_month']] = [moment().startOf("month"), moment()];
tempRanges[lang['last_month']] = [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")];
tempRanges[lang['this_year']] = [moment().startOf("year"), moment()];
tempRanges[lang['last_12_months']] = [moment().subtract(11, "month").startOf("month"), moment()];
$('#btn-calendar').daterangepicker({
	"ranges": tempRanges,
	"showDropdowns": true,
	"showWeekNumbers": true,
	"locale": {
		"firstDay": 1,
        "applyLabel": lang['apply'],
        "cancelLabel": lang['cancel'],
        "fromLabel": lang['from'],
        "toLabel": lang['to'],
        "customRangeLabel": lang['custom'],
        "daysOfWeek": [
            lang['su'],
            lang['mo'],
            lang['tu'],
            lang['we'],
            lang['th'],
            lang['fr'],
            lang['sa']
        ],
        "monthNames": [
            lang['january'],
            lang['february'],
            lang['march'],
            lang['april'],
            lang['may'],
            lang['june'],
            lang['july'],
            lang['august'],
            lang['september'],
            lang['october'],
            lang['november'],
            lang['december']
        ]
	},
	"autoApply": true,
	"startDate": moment().format("MM/DD/YYYY"),
	"endDate": moment().format("MM/DD/YYYY"),
	"maxDate": moment().format("MM/DD/YYYY"),
	"opens": "center"
}, function(start, end, label) {
	date_from = start.format("YYYYMMDD");
	date_to = end.format("YYYYMMDD");
	setSelectedDateRange();
	getEnergy();
});





// Get Energy For Today (First Time Init)
getEnergy();





// Get Energy Data
function getEnergy(updateChartType) {
	
	// Rebuild Chart If Needed
	if(updateChartType === undefined || updateChartType == true) {
		// Show Overlay
		showOverlay();
		// Display Correct Chart Type + Show/Hide Control Buttons
		$('#btnNext').find('h4').html('&gt;');
		chart.destroy();
		if(moment(date_to).diff(moment(date_from), 'days') < 1) {
			chart = new Chart(ctx, config_line);
			$("#btnZoom").css("display", "block");
			// 1 Day - Show Buttons
			$('.main-toggler').removeClass('col-5').addClass('col-4');
			$('.main-control').show();
			if(moment().diff(moment(date_to), 'days') == 0)
				$('#btnNext').find('h4').html('&#10227;');
		} else {
			chart = new Chart(ctx, config_bar);
			$("#btnZoom").css("display", "none");
			// 1+ Days - Hide Buttons
			$('.main-toggler').removeClass('col-4').addClass('col-5');
			$('.main-control').hide();
		}
	}
	
	// Prepare Chart Update
	dataset_batteryOut.data = [];
	dataset_batteryIn.data = [];
	dataset_gridOut.data = [];
	dataset_gridIn.data = [];
	dataset_directConsumption.data = [];

	// if(btnSelected == 1)
	// -> chart.config.data.datasets = [ dataset_directConsumption, dataset_batteryIn, dataset_gridIn ]
	// else
	// -> chart.config.data.datasets = [ dataset_directConsumption, dataset_batteryOut, dataset_gridOut ]
	
	// Show Data for Single Day
	if(moment(date_to).diff(moment(date_from), 'days') < 1) {
		// Make Labels (05-21 or 00-24)
		var quarterHours = ["00", "15", "30", "45"];
		var labels = [];
		var startHour = 0, endHour = 24; // 00:00 - 24:00
		if(zoomActive) { startHour = 5; endHour = 21; } // 05:00 - 21:00
		for(var i = startHour; i < endHour; i++) {
			for(var j = 0; j < 4; j++) {
				var time = i + ":" + quarterHours[j];
				if(i < 10) time = "0" + time;
				labels.push(time);
			}
		}
		// Load Data
		getPower_day(date_from);
	}
	// Show Daily Data (up to 2 months)
	else if(moment(date_to).diff(moment(date_from), 'months') < 2) {
		// Define Variables
		var startDate = moment(date_from);
		var endDate = moment(date_to);
		var days = [];
		var day = startDate;
		labels = [];
		// Make Labels & Days Array
		while(day <= endDate) {
			days.push(day.format("YYYYMMDD"));
			labels.push(day.format("DD. MMM YY"));
			day = day.clone().add(1, 'd');
		}
		// Load Data
		getEnergy_daily(days);
	}
	// Show Montly Data (up to 2 years)
	else if(moment(date_to).diff(moment(date_from), 'years') < 2) {
		// Define Variables
		var startDate = moment(date_from).startOf("month");
		var endDate = moment(date_to).endOf("month");
		var days = [];
		var day = startDate;
		// Make Days Array
		while(day <= endDate) {
			days.push(day.format("YYYYMMDD"));
			day = day.clone().add(1, 'd');
		}
		// Define Variables
		var startMonth = moment(date_from).startOf("month");
		var endMonth = moment(date_to).endOf("month");
		var month = startMonth;
		labels = [];
		// Make Labels Array
		while(month <= endMonth) {
			labels.push(month.format("MMM YYYY"));
			month = month.clone().add(1, 'M');
		}
		// Load Data
		getEnergy_monthly(days);
	}
	// Show Yearly Data (more than 2 years)
	else {
		// Define Variables
		var startDate = moment(date_from).startOf("year");
		var endDate = moment(date_to).endOf("year");
		var days = [];
		var day = startDate;
		// Make Days Array
		while(day <= endDate) {
			days.push(day.format("YYYYMMDD"));
			day = day.clone().add(1, 'd');
		}
		// Define Variables
		var startYear = moment(date_from).startOf("year");
		var endYear = moment(date_to).endOf("year");
		var year = startYear;
		labels = [];
		// Load Data
		while(year <= endYear) {
			labels.push(year.format("YYYY"));
			year = year.clone().add(1, 'Y');
		}
		// Load Data
		getEnergy_yearly(days);
	}
	
	// Update Chart
	chart.config.data.labels = labels;
	chart.update();
}





// Get Single-Day Power (24 hours, 15 minutes data)

function getPower_day(day) {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getPowerAjaxDataObj(day, 40),
		success: function(result) {
			// Parse Result
			if(result == "0") data_batteryOut = [0];
			else data_batteryOut = convertStringsToIntegers(result.split(" "));
			// Edit Data For Zoom
			if(zoomActive) data_batteryOut = sliceForZoom(data_batteryOut);
			// Update Data
			dataset_batteryOut.data = data_batteryOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_batteryOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getPowerAjaxDataObj(day, 41),
		success: function(result) {
			// Parse Result
			if(result == "0") data_batteryIn = [0];
			else data_batteryIn = convertStringsToIntegers(result.split(" "));
			// Edit Data For Zoom
			if(zoomActive) data_batteryIn = sliceForZoom(data_batteryIn);
			// Update Data
			dataset_batteryIn.data = data_batteryIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_batteryIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getPowerAjaxDataObj(day, 10),
		success: function(result) {
			// Parse Result
			if(result == "0") data_gridOut = [0];
			else data_gridOut = convertStringsToIntegers(result.split(" "));
			// Edit Data For Zoom
			if(zoomActive) data_gridOut = sliceForZoom(data_gridOut);
			// Update Data
			dataset_gridOut.data = data_gridOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_gridOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getPowerAjaxDataObj(day, 11),
		success: function(result) {
			// Parse Result
			if(result == "0") data_gridIn = [0];
			else data_gridIn = convertStringsToIntegers(result.split(" "));
			// Edit Data For Zoom
			if(zoomActive) data_gridIn = sliceForZoom(data_gridIn);
			// Update Data
			dataset_gridIn.data = data_gridIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_gridIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getPowerAjaxDataObj(day, 61),
		success: function(result) {
			// Parse Result
			if(result == "0") data_directConsumption = [0];
			else data_directConsumption = convertStringsToIntegers(result.split(" "));
			// Edit Data For Zoom
			if(zoomActive) data_directConsumption = sliceForZoom(data_directConsumption);
			// Update Data
			dataset_directConsumption.data = data_directConsumption;
			// Update Chart
			chart.config.data.datasets.push = dataset_directConsumption;
			chart.update();
			// Try to hide Overlay
			hideOverlay("overlay_directConsumption");
		}
	});
}





// Get Daily Energy (up to 2 months)

function getEnergy_daily(days) {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 40),
		success: function(result) {
			// Update Data
			data_batteryOut = convertStringsToIntegers(result.split(","));
			dataset_batteryOut.data = data_batteryOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_batteryOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 41),
		success: function(result) {
			// Update Data
			data_batteryIn = convertStringsToIntegers(result.split(","));
			dataset_batteryIn.data = data_batteryIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_batteryIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 10),
		success: function(result) {
			// Update Data
			data_gridOut = convertStringsToIntegers(result.split(","));
			dataset_gridOut.data = data_gridOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_gridOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 11),
		success: function(result) {
			// Update Data
			data_gridIn = convertStringsToIntegers(result.split(","));
			dataset_gridIn.data = data_gridIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_gridIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 61),
		success: function(result) {
			// Update Data
			data_directConsumption = convertStringsToIntegers(result.split(","));
			dataset_directConsumption.data = data_directConsumption;
			// Update Chart
			chart.config.data.datasets.push = dataset_directConsumption;
			chart.update();
			// Try to hide Overlay
			hideOverlay("overlay_directConsumption");
		}
	});
}





// Get Monthly Energy (up to 2 years)

function getEnergy_monthly(days) {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 40),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_batteryOut = calculateMonthlyEnergy(resultArray);
			dataset_batteryOut.data = data_batteryOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_batteryOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 41),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_batteryIn = calculateMonthlyEnergy(resultArray);
			dataset_batteryIn.data = data_batteryIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_batteryIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 10),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_gridOut = calculateMonthlyEnergy(resultArray);
			dataset_gridOut.data = data_gridOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_gridOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 11),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_gridIn = calculateMonthlyEnergy(resultArray);
			dataset_gridIn.data = data_gridIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_gridIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 61),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_directConsumption = calculateMonthlyEnergy(resultArray);
			dataset_directConsumption.data = data_directConsumption;
			// Update Chart
			chart.config.data.datasets.push = dataset_directConsumption;
			chart.update();
			// Try to hide Overlay
			hideOverlay("overlay_directConsumption");
		}
	});
}





// Get Yearly Energy (no limit)

function getEnergy_yearly(days) {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 40),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_batteryOut = calculateYearlyEnergy(resultArray);
			dataset_batteryOut.data = data_batteryOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_batteryOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 41),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_batteryIn = calculateYearlyEnergy(resultArray);
			dataset_batteryIn.data = data_batteryIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_batteryIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_batteryIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 10),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_gridOut = calculateYearlyEnergy(resultArray);
			dataset_gridOut.data = data_gridOut;
			// Update Chart
			if(btnSelected == 2) {
				chart.config.data.datasets.push = dataset_gridOut;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridOut");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 11),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_gridIn = calculateYearlyEnergy(resultArray);
			dataset_gridIn.data = data_gridIn;
			// Update Chart
			if(btnSelected == 1) {
				chart.config.data.datasets.push = dataset_gridIn;
				chart.update();
			}
			// Try to hide Overlay
			hideOverlay("overlay_gridIn");
		}
	});
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: getEnergyAjaxDataObj(days, 61),
		success: function(result) {
			// Update Data
			resultArray = convertStringsToIntegers(result.split(","));
			data_directConsumption = calculateYearlyEnergy(resultArray);
			dataset_directConsumption.data = data_directConsumption;
			// Update Chart
			chart.config.data.datasets.push = dataset_directConsumption;
			chart.update();
			// Try to hide Overlay
			hideOverlay("overlay_directConsumption");
		}
	});
}





// Returns Object for PowerData, formatted for use when making AJAX requests
function getPowerAjaxDataObj(day, entity) {
	return {
		"action": "getPowerData",
		"type": day,
		"entity": entity.toString(),
		"token": token
	};
}

// Returns Object for EnergyData, formatted for use when making AJAX requests
function getEnergyAjaxDataObj(days, entity) {
	return {
		"action": "getEnergyData",
		"type": days.join(),
		"entity": entity.toString(),
		"token": token
	};
}





// Calculate Monthly Energy from Array with Daily Energy
function calculateMonthlyEnergy(arr) {
	// Define Variables
	var dataArray = [];
	var month = moment(date_from).startOf("month");
	var endMonth = moment(date_to).endOf("month");
	// Populate dataArray
	var indexNum = 0;
	while(month <= endMonth) {
		var monthTotal = 0;
		daysInMonth = moment(month).daysInMonth();
		for(var x = 0; x < daysInMonth; x++) {
			monthTotal += arr[indexNum];
			indexNum++;
		}
		dataArray.push(monthTotal);
		month = month.clone().add(1, 'M');
	}
	// Return Result
	return dataArray;
}

// Calculate Yearly Energy From Array with Daily Energy
function calculateYearlyEnergy(arr) {
	// Define Variables
	var dataArray = [];
	var year = moment(date_from).startOf("year");
	var endYear = moment(date_to).endOf("year");
	// Populate dataArray
	var indexNum = 0;
	while(year <= endYear) {
		var yearTotal = 0;
		var start = moment(year).startOf("year");
		var end = moment(year).endOf("year");
		daysInYear = end.diff(start, "days") + 1;
		for(var x = 0; x < daysInYear; x++) {
			yearTotal += arr[indexNum];
			indexNum++;
		}
		dataArray.push(yearTotal);
		year = year.clone().add(1, 'Y');
	}
	// Return Result
	return dataArray;
}





// Convert Array with Numbers as Strings to Array with Integers
function convertStringsToIntegers(arr) {
	for(var i = 0; i < arr.length; i++)
		arr[i] = parseInt(arr[i], 10);
	return arr;
}

// Slice Array (used when zoomActive)
function sliceForZoom(arr) {
	if(arr.length > 84)
		arr = arr.slice(20, 84);
	else if(arr.length > 20)
		arr = arr.slice(20);
	else
		arr = [0];
	return arr;
}





// Set Selected Date-Range
function setSelectedDateRange() {
	if(date_from == date_to)
		$('.date-range').text(moment(date_from).format('YYYY-MM-DD'));
	else
		$('.date-range').text(moment(date_from).format('YYYY-MM-DD') + ' - ' + moment(date_to).format('YYYY-MM-DD'));
}
