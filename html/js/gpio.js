// Get All Needed Strings
var lang = {
	"auto":           "Auto",
	"man":            "Man",
	"off":            "Off",
	"on":             "On",
	"error":          "An error has occured",
	"confirm_toggle": "Press 'OK' to toggle the Switch"
}





// Check if should hide Overlay
var loadedLabels = false;
var loadedCurrentState = false;

// Get Token
var token = "";





// Load Labels
$.ajax({
	type: "POST",
	url: "db-interaction/service.php",
	data: { "action": "getLabels" },
	success: function (response) {
		// Format Response To JSON
		var json = JSON.parse(response);
		// Set Labels
		if(json.hasOwnProperty('Switch')) {
			$('#switch1 .name').html( json['Switch'].hasOwnProperty('1') && json['Switch']['1'] ? json['Switch']['1'] : "Switch 1" );
			$('#switch2 .name').html( json['Switch'].hasOwnProperty('2') && json['Switch']['2'] ? json['Switch']['2'] : "Switch 2" );
			$('#switch3 .name').html( json['Switch'].hasOwnProperty('3') && json['Switch']['3'] ? json['Switch']['3'] : "Switch 3" );
			$('#switch4 .name').html( json['Switch'].hasOwnProperty('4') && json['Switch']['4'] ? json['Switch']['4'] : "Switch 4" );
		}
		if(json.hasOwnProperty('BxOutPin')) {
			$('#out1 .name').html( json['BxOutPin'].hasOwnProperty('1') && json['BxOutPin']['1'] ? json['BxOutPin']['1'] : "Output 1" );
			$('#out2 .name').html( json['BxOutPin'].hasOwnProperty('2') && json['BxOutPin']['2'] ? json['BxOutPin']['2'] : "Output 2" );
			$('#out3 .name').html( json['BxOutPin'].hasOwnProperty('3') && json['BxOutPin']['3'] ? json['BxOutPin']['3'] : "Output 3" );
			$('#out4 .name').html( json['BxOutPin'].hasOwnProperty('4') && json['BxOutPin']['4'] ? json['BxOutPin']['4'] : "Output 4" );
		}
		if(json.hasOwnProperty('BxInPin')) {
			$('#in1 .name').html( json['BxInPin'].hasOwnProperty('1') && json['BxInPin']['1'] ? json['BxInPin']['1'] : "Input 1" );
			$('#in2 .name').html( json['BxInPin'].hasOwnProperty('2') && json['BxInPin']['2'] ? json['BxInPin']['2'] : "Input 2" );
			$('#in3 .name').html( json['BxInPin'].hasOwnProperty('3') && json['BxInPin']['3'] ? json['BxInPin']['3'] : "Input 3" );
			$('#in4 .name').html( json['BxInPin'].hasOwnProperty('4') && json['BxInPin']['4'] ? json['BxInPin']['4'] : "Input 4" );
		}
		// Hide Overlay ?
		if(loadedCurrentState) $('.overlay').fadeOut();
		else loadedLabels = true;
	}
});










/*
	BOTH CLOUD AND LOCAL ARE SAME ABOVE THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










// Set Switches On-Click Listeners

$('#switch1 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "switch1": $('#switch1 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#switch2 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "switch2": $('#switch2 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#switch3 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "switch3": $('#switch3 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#switch4 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "switch4": $('#switch4 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});





// Set Outputs On-Click Listeners

$('#out1 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output1": $('#out1 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out2 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output2": $('#out2 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out3 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output3": $('#out3 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out4 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output4": $('#out4 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});

$('#out1 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output1": $('#out1 .btn-mode').val() == '1' ? '2' : ( $('#out1 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out2 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output2": $('#out2 .btn-mode').val() == '1' ? '2' : ( $('#out2 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out3 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output3": $('#out3 .btn-mode').val() == '1' ? '2' : ( $('#out3 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#out4 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "output4": $('#out4 .btn-mode').val() == '1' ? '2' : ( $('#out4 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});





// Set Commands On-Click Listeners

$('#cmd1 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command1": $('#cmd1 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd2 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command2": $('#cmd2 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd3 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command3": $('#cmd3 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd4 .btn-toggle').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command4": $('#cmd4 .btn-toggle').val() == '1' ? '0' : '1' },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});

$('#cmd1 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command1": $('#cmd1 .btn-mode').val() == '1' ? '2' : ( $('#cmd1 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd2 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command2": $('#cmd2 .btn-mode').val() == '1' ? '2' : ( $('#cmd2 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd3 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command3": $('#cmd3 .btn-mode').val() == '1' ? '2' : ( $('#cmd3 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});
$('#cmd4 .btn-mode').on('click', function() {
	if(!confirm(lang['confirm_toggle'])) return;
	$.ajax({
		type: "POST",
		url: "db-interaction/gpio.php",
		data: { "token": token, "command4": $('#cmd4 .btn-mode').val() == '1' ? '2' : ( $('#cmd4 .btn-toggle').val() == '1' ? '1' : '0' ) },
		success: function(response) { if(!response) alert(lang['error']); },
		error: function() { alert(lang['error']); }
	});
});










// Start Main Loop Function
// Handles Updating the Fields within the Page
// Loop - Long Polling - Every 2.5 seconds
mainLoop();
function mainLoop() {
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: { "token": token, "action": "getCurrentState" },
		complete: function (data) {
			// Long Polling Every 2.5 Seconds
			setTimeout(function() { mainLoop(); }, 2500);
			// Fade Out the Overlay (Visible only on first run)
			if(loadedLabels) $('.overlay').fadeOut();
			else loadedCurrentState = true; // Overlay (when updating page)
		},
		success: function (response) {

			// Format Response To JSON
			var json = JSON.parse(response);
			
			// Update Last Timestamp in Index.php
			window.parent.updateLastTimestamp(json["logtime"]);
			
			// Show|Hide Connection Loss Card
			if(moment.duration(moment().diff(moment.utc(json["logtime"]))).asMinutes() > 2) {
				$('#connectionLoss').show();
				$('.btn-toggle, .btn-mode').off();
			}
			
			// Switches
			if(json.hasOwnProperty('2325')) {
				for(var x = 1; x < 5; x++) {
					var y = x.toString();
					if(json['2325'].hasOwnProperty(y)) {
						$("#switch"+y+" .btn-toggle").val( json['2325'][y] == 1 ? '1' : '0' );
						if(json['2325'][y] == 1) $("#switch"+y+" .btn-toggle").addClass("active");
						else $("#switch"+y+" .btn-toggle").removeClass("active");
					}
				}
			}
			
			// Outputs
			if(json.hasOwnProperty('2337')) {
				for(var x = 1; x < 5; x++) {
					var y = x.toString();
					if(json['2337'].hasOwnProperty(y)) {
						if(json['2337'][y] == 1) {
							$("#out"+y+" .btn-toggle").addClass('active');
							$("#out"+y+" .btn-toggle").html(lang['on'].toUpperCase());
							$("#out"+y+" .btn-toggle").val('1');
							$("#out"+y+" .btn-mode").removeClass('active');
							$("#out"+y+" .btn-mode").html(lang['auto'].toUpperCase());
							$("#out"+y+" .btn-mode").val('0');
						} else if(json['2337'][y] == 11) {
							$("#out"+y+" .btn-toggle").addClass('active');
							$("#out"+y+" .btn-toggle").html(lang['on'].toUpperCase());
							$("#out"+y+" .btn-toggle").val('1');
							$("#out"+y+" .btn-mode").addClass('active');
							$("#out"+y+" .btn-mode").html(lang['man'].toUpperCase());
							$("#out"+y+" .btn-mode").val('1');
						} else if(json['2337'][y] == 0) {
							$("#out"+y+" .btn-toggle").removeClass('active');
							$("#out"+y+" .btn-toggle").html(lang['off'].toUpperCase());
							$("#out"+y+" .btn-toggle").val('0');
							$("#out"+y+" .btn-mode").removeClass('active');
							$("#out"+y+" .btn-mode").html(lang['auto'].toUpperCase());
							$("#out"+y+" .btn-mode").val('0');
						} else if(json['2337'][y] == 10) {
							$("#out"+y+" .btn-toggle").removeClass('active');
							$("#out"+y+" .btn-toggle").html(lang['off'].toUpperCase());
							$("#out"+y+" .btn-toggle").val('0');
							$("#out"+y+" .btn-mode").addClass('active');
							$("#out"+y+" .btn-mode").html(lang['man'].toUpperCase());
							$("#out"+y+" .btn-mode").val('1');
						}
					}
				}
			}
			
			// Commands
			if(json.hasOwnProperty('2465')) {
				for(var x = 1; x < 5; x++) {
					var y = x.toString();
					if(json['2465'].hasOwnProperty(y)) {
						if(json['2465'][y] == 1) {
							$("#cmd"+y+" .btn-toggle").addClass('active');
							$("#cmd"+y+" .btn-toggle").html(lang['on'].toUpperCase());
							$("#cmd"+y+" .btn-toggle").val('1');
							$("#cmd"+y+" .btn-mode").removeClass('active');
							$("#cmd"+y+" .btn-mode").html(lang['auto'].toUpperCase());
							$("#cmd"+y+" .btn-mode").val('0');
						} else if(json['2465'][y] == 11) {
							$("#cmd"+y+" .btn-toggle").addClass('active');
							$("#cmd"+y+" .btn-toggle").html(lang['on'].toUpperCase());
							$("#cmd"+y+" .btn-toggle").val('1');
							$("#cmd"+y+" .btn-mode").addClass('active');
							$("#cmd"+y+" .btn-mode").html(lang['man'].toUpperCase());
							$("#cmd"+y+" .btn-mode").val('1');
						} else if(json['2465'][y] == 0) {
							$("#cmd"+y+" .btn-toggle").removeClass('active');
							$("#cmd"+y+" .btn-toggle").html(lang['off'].toUpperCase());
							$("#cmd"+y+" .btn-toggle").val('0');
							$("#cmd"+y+" .btn-mode").removeClass('active');
							$("#cmd"+y+" .btn-mode").html(lang['auto'].toUpperCase());
							$("#cmd"+y+" .btn-mode").val('0');
						} else if(json['2465'][y] == 10) {
							$("#cmd"+y+" .btn-toggle").removeClass('active');
							$("#cmd"+y+" .btn-toggle").html(lang['off'].toUpperCase());
							$("#cmd"+y+" .btn-toggle").val('0');
							$("#cmd"+y+" .btn-mode").addClass('active');
							$("#cmd"+y+" .btn-mode").html(lang['man'].toUpperCase());
							$("#cmd"+y+" .btn-mode").val('1');
						}
					}
				}
			}
			
			// Inputs
			if(json.hasOwnProperty('2321')) {
				for(var x = 1; x < 5; x++) {
					var y = x.toString();
					if(json['2321'].hasOwnProperty(y)) {
						if(json['2321'][y] == 1) {
							$("#in"+y+" .status").removeClass('red').addClass('green');
							$("#in"+y+" .status").html(lang['on'].toUpperCase());
						} else {
							$("#in"+y+" .status").removeClass('green').addClass('red');
							$("#in"+y+" .status").html(lang['off'].toUpperCase());
						}
					}
				}
			}
		
		}
	});
}
