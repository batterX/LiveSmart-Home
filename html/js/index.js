// Get All Needed Strings

var lang = {
	"devices":            "Devices",
	"users":              "Users",
	"settings":           "Settings",
	"live":               "Live",
	"energy":             "Energy",
	"system":             "System",
	"gpio":               "GPIO",
	"active_warnings":    "Active Warnings",
	"no_active_warnings": "There are no warnings",
	"last_timestamp":     "Last Timestamp"
}





// Set Warnings Begin Variables State

var lastWarningTime = new Date("2000-01-01T01:01:01");
var lastWarningList = [];





// Get All Needed SESSION Variables

var token = "";
var accountType = "";





// String to use for EntityValue

var entityValue = "entityvalue";





// Set Device Name

$("#device-name").html("");





// Set OnClick Listeners

// Switch to Live View
$('#live').on('click', function() {
	$('#frame').attr("src", "live.html");
	$('#title').html(lang['live'].toUpperCase());
	toggleActive("live");
});

// Switch to Energy View
$('#energy').on('click', function() {
	$('#frame').attr("src", "energy.html");
	$('#title').html(lang['energy'].toUpperCase());
	toggleActive("energy");
});

// Switch to Device/System View
$('#device').on('click', function() {
	$('#frame').attr("src", "device.html");
	$('#title').html(lang['system'].toUpperCase());
	toggleActive("device");
});

// Switch to GPIO View
$('#gpio').on('click', function() {
	if(model != 'batterx bs') {
		$('#frame').attr("src", "gpio.html");
		$('#title').html(lang['gpio'].toUpperCase());
		toggleActive("gpio");
	}
});

// Get Device Model

var model = "";
$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: { "action": "getDeviceModel", "token": token },
	success: function(response) {
		if(response) {
			model = response.toLowerCase();
			if(model == 'batterx bs')
				$(".gpio").hide();
			else
				$(".gpio").show();
		}
		$('.overlay').fadeOut(); // Hide Overlay
	}
});















































































































/*
	BOTH CLOUD AND LOCAL ARE SAME ABOVE THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










/*
	Set OnClick Listeners
*/

// Notifications Button
$('#btnNotification').on('click', function() {
	$('#slider-right').offcanvas({
		placement: 'right',
		autohide: 'true'
	});
	$('#slider-right').offcanvas('show');
});

// Pin Right-Side Drawer to View
$('#btnPinToView').on('click', function() {
	if($('#middle').hasClass('full-view')) {
		$('#middle').removeClass('full-view');
		$('#slider-right').addClass('offcanvas');
		$('#btnPinToView').attr('src', 'img/ic_tack_save.png');
		Cookies.set('bx_index_drawer_pintoview', '0'); // Set Cookie FALSE
	} else {
		$('#middle').addClass('full-view');
		$('#slider-right').removeClass('offcanvas');
		$('#slider-right').removeClass('in');
		$('#slider-right').removeClass('canvas-sliding');
		$('#slider-right').removeClass('canvas-slid');
		$('#btnPinToView').attr('src', 'img/ic_tack_save_active.png');
		Cookies.set('bx_index_drawer_pintoview', '1'); // Set Cookie TRUE
	}
});

// Hide Left-Side Drawer onClick
$('#slider-left').on('click', function() {
	if(window.innerHeight > window.innerWidth)
		setTimeout(function() { $("#slider-left").offcanvas('hide'); }, 200);
});

// Hide Right-Side Drawe onClick
$('#slider-right').on('click', function() {
	if(!$('#middle').hasClass('full-view'))
		setTimeout(function() { $("#slider-right").offcanvas('hide'); }, 200);
});

// Toggle Active Button (Color)
function toggleActive(id) {
	$('#live, #energy, #device, #gpio').find('h4').removeClass("active");
	$('#'+id).find('h4').addClass('active');
}










/*
	Initialize Notifications
	Load the 10 Latest Warnings for the Current Device
*/

$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: {
		"action": "getWarningsData",
		"count": "10",
		"token": token
	},
	success: function(response) {
		// Parse Result to JSON
		var json = JSON.parse(response);
		// Display Latest Warnings in the Right-Side-Drawer
		for(var x = 0; x < json.length; x++) {
			if(lastWarningTime <= formatDate(json[x]['logtime'])) {
				if(json[x][entityValue] != "") {
					var tempList = json[x][entityValue].split(" ");
					for(var y = 0; y < tempList.length; y++) {
						if(!lastWarningList.includes(tempList[y])) {
							addWarning(
								warningsList[tempList[y]][2] == 1 ? 'red' : 'orange',
								convertDate(json[x]['logtime']),
								warningsList[tempList[y]][0],
								warningsList[tempList[y]][1]
							);
						}
					}
					lastWarningList = json[x][entityValue].split(" ");
				} else lastWarningList = [];
			}
		}
		// Update Active Notificaitons
		updateActiveNotifications();
		// Update Last Warning Time
		lastWarningTime = formatDate(json[json.length-1]['logtime']);
	}
});





// Update Notifications Drawer Every 5 Seconds

setTimeout(function() {	updateNotifications(); }, 5000);
function updateNotifications() {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: {
			"action": "getWarningsData",
			"count": "1",
			"token": token
		},
		complete: function (data) {
			setTimeout(function() { updateNotifications(); }, 5000);
		},
		success: function (response) {
			// Parse Response to JSON
			var json = JSON.parse(response);
			// Display New Warnings in the Right-Side-Drawer
			for(var x = 0; x < json.length; x++) {
				if(lastWarningTime <= formatDate(json[x]['logtime'])) {
					if(json[x][entityValue] != "") {
						var tempList = json[x][entityValue].split(" ");
						for(var y = 0; y < tempList.length; y++) {
							if(!lastWarningList.includes(tempList[y])) {
								addWarning(
									warningsList[tempList[y]][2] == 1 ? 'red' : 'orange',
									convertDate(json[x]['logtime']),
									warningsList[tempList[y]][0],
									warningsList[tempList[y]][1]
								);
							}
						}
						lastWarningList = json[x][entityValue].split(" ");
					} else lastWarningList = [];
				}
			}
			// Update Active Notificaitons
			updateActiveNotifications();
			// Update Last Warning Time
			lastWarningTime = formatDate(json[json.length-1]['logtime']);
		}
	});
}





// Update Active Notifications List

var blinkInterval = null;

function updateActiveNotifications() {
	
	// Fault Status
	var hasFault = false;
	var faultRow = ["", "", 1];
	
	// LastTimestamp Status
	var timestampFault = $('#notif-lastupdate').hasClass('fault');
	
	// Set ActiveWarnings Title
	$("#notif-active .warnings").html(`
		<div class='row notif-head-active'>
			<h4 style='color:white; letter-spacing:0.75vh'>
				<b>${lang['active_warnings'].toUpperCase()}</b>
			</h4>
		</div>
	`);
	// Set ActiveWarnings Warnings
	for(var y = 0; y < lastWarningList.length; y++) {
		if(warningsList[lastWarningList[y]][2] == 1) {
			// FAULT
			hasFault = true;
			faultRow = warningsList[lastWarningList[y]];
			$("#notif-active .warnings").append(`<div class='row notif-head-active'><h4 style="color: red">${warningsList[lastWarningList[y]][0]}</h4></div>`);
		} else {
			// WARNING
			$("#notif-active .warnings").append(`<div class='row notif-head-active'><h4>${warningsList[lastWarningList[y]][0]}</h4></div>`);
		}
	}
	// Set ActiveWarnings Style
	if(hasFault) {
		$("#notif-active").css("border", "0.3vh solid red");
		$("#notif-active").css("background", "black");
	} else {
		$("#notif-active").css("border", "");
		$("#notif-active").css("background", "");
	}
	if(lastWarningList.length == 0)
		$("#notif-active .warnings").append(`<div class='row notif-head-active'><h4>${lang['no_active_warnings'].toUpperCase()}</h4></div>`);
	
	
	// Set ButtonBadge Style
	$(".button-badge").css("display", lastWarningList.length != 0 ? "block" : "none"); // Show|Hide
	$(".button-badge").css("color", hasFault || timestampFault ? "red" : "orange");
	$(".button-badge").css("border-color", hasFault || timestampFault ? "red" : "orange");
	// Set ButtonBadge Number
	$(".button-badge").text((lastWarningList.length).toString());
	
	
	// Set NotificationBell Image
	$(".notification").attr("src", "img/notification-" + (hasFault || timestampFault ? "red" : "white") + ".png");
	
	
	// Set Bottom Notification Bar
	$(".notifbar").css("display", hasFault ? "block" : "none");
	$("#notifbar-text").html(faultRow[0]);
	// Start|Stop Blinking
	if(hasFault && blinkInterval == null) {
		// Start Blinking the Bottom-Notifbar
		blinkInterval = setInterval(function() {
			$("#notifbar-parent").css('visibility', $("#notifbar-parent").css('visibility') === 'hidden' ? '' : 'hidden');
		}, 1000);
	} else if(!hasFault && blinkInterval != null) {
		// Stop Blinking the Bottom-Notifbar
		clearInterval(blinkInterval);
		blinkInterval = null;
		$("#notifbar-parent").css('visibility', 'visible');
	}
	
}





// Update LastTimestamp From Iframe

function updateLastTimestamp(str) {
	if(str) {
		// Set Last Timestamp
		$("#notif-lastupdate").html(`
			<div class='row notif-head-active'>
				<h4 style='color:white; letter-spacing: 0.75vh;'>
					<b>${lang['last_timestamp'].toUpperCase()}</b>
				</h4>
			</div>
			<div class='row notif-head-active'>
				<h4 class='last-timestamp'>
					${convertDate(str)}
				</h4>
			</div>
		`);
		// Add/Remove .fault Class
		if(moment.duration(moment().diff(moment.utc(str))).asMinutes() > 2)
			$("#notif-lastupdate").addClass('fault');
		else
			$("#notif-lastupdate").removeClass('fault');
	} else {
		// Set Last Timestamp
		$("#notif-lastupdate").html(`
			<div class='row notif-head-active'>
				<h4 style='color:white; letter-spacing: 0.75vh;'>
					<b>${lang['last_timestamp'].toUpperCase()}</b>
				</h4>
			</div>
			<div class='row notif-head-active'>
				<h4 class='last-timestamp'>
					-
				</h4>
			</div>
		`);
		// Add .fault Class
		$("#notif-lastupdate").addClass('fault');
	}
}





// Add Warning + Sort Warnings by Logtime (Timestamp)

function addWarning(circle, logtime, title, description) {
	// Add Warnings
	var article = `
		<article data-val='${logtime.replace(/[^0-9]/g, '')}'>
			<div class='notif-head'>
				<img class='notif-circle' src='img/notif-${circle}.png'>
				<h4>${title}</h4>
			</div>
			<div class='row'>
				<div class='notif-bar'></div>
				<div class='notif-desc'>
					<img class='img-under' src='img/under.png'>
					<p class='time'>${logtime}</p>
					<p>${description}</p>
				</div>
			</div>
		</article>
	`;
	$("#notif-container").html(article + $("#notif-container").html());
	// Sort Warnings
	var items = $('#notif-container').children('article').sort(function(a, b) {
		var vA = $(a).attr('data-val');
		var vB = $(b).attr('data-val');
		return (vA < vB) ? 1 : (vA > vB) ? -1 : 0;
	});
	$('#notif-container').append(items);
}





// Convert Date from Database to Local Time
function convertDate(dateStr) {
	var utc = moment.utc(dateStr).toDate();
	return moment(utc).local().format("YYYY-MM-DD HH:mm:ss");
}

// Format Date
function formatDate(dateStr) {
	return new Date(dateStr.replace(" ", "T"));
}










/*
	Read Cookies and do changes
*/

if(Cookies.get('bx_index_drawer_pintoview') == '1')
	$('#btnPinToView').click();
