$progress.trigger('step', 4);





step1();




// Get Initial CurrentState & Verify if isWorking
function step1()
{
	$.get({
		url: 'api.php?get=currentState',
		error: function() { setTimeout(step1, 5000); },
		success: function(json) {
			console.log(json);
			if(!json || typeof json != 'object' || !json.hasOwnProperty('logtime')) {
				setTimeout(step1, 5000);
				return;
			}
			var curtime   = moment.utc().subtract(1, 'minute').format("YYYY-MM-DD hh:mm:ss");
			var isWorking = moment(json['logtime']).isAfter(moment(curtime));
			if(!isWorking) {
				setTimeout(step1, 5000);
				return;
			}
			// Continue Next Step
			step2(json);
		}
	});
}





// Get Inverter Serial-Number
function step2(json)
{
	$.get({
		url: 'api.php?get=deviceinfo',
		error: function() { alert("E001. Please refresh the page!"); },
		success: function(json) {
			console.log(json);
			if(!json || typeof json != 'object' || !json.hasOwnProperty('device_model') || !json.hasOwnProperty('device_serial_number')) {
				alert("E002. Please refresh the page!");
				return;
			}
			var device_model         = json['device_model'];
			var device_serial_number = json['device_serial_number'];
			$('.serialnumber b').html(device_serial_number);
			if(device_model.toLowerCase() == "batterx h3") {
				$('#inverterDetected h1 b').html('h3');
				$('#inverterDetected img').attr('src', 'img/device_h3.png');
			} else if(device_model.toLowerCase() == "batterx h5") {
				$('#inverterDetected h1 b').html('h5');
				$('#inverterDetected img').attr('src', 'img/device_h5.png');
			} else if(device_model.toLowerCase() == "batterx h5-eco") {
				$('#inverterDetected h1 b').html('h5-eco');
				$('#inverterDetected img').attr('src', 'img/device_h5e.png');
			} else if(device_model.toLowerCase() == "batterx h10") {
				$('#inverterDetected h1 b').html('h10');
				$('#inverterDetected img').attr('src', 'img/device_h10.png');
			} else {
				$('#inverterDetected h1 b').html('');
				$('#inverterDetected img').attr('src', '');
			}
			// Continue Next Step
			step3(json);
		}
	});
}





// Check if Inverter registered in Cloud & Show Working Status
function step3(json)
{
	var device_serial_number = json['device_serial_number'];

	$.post({
		url: 'https://api.batterx.io/v2/installation.php',
		data: {
			action: "verify_device",
			serialnumber: device_serial_number
		},
		success: function(response) {
			// Show Not Registered
			if(response != '1' && device_serial_number != "00000000000000") {
				$('.loading').hide();
				$('.error').show();
				$('.message').html(lang['inverter_not_registered']).css('color', 'red');
				return;
			}
			// Show Working
			$('#inverterUnknown').hide();
			$('#inverterDetected').show();
			// Continue Next Step
			step4(response);
		}
	});
}





// Show VDE4105 Status & Disable Buzzer
function step4(response)
{
	$.get({
		url: 'api.php?get=settings',
		error: function() { alert("E003. Please refresh the page!"); },
		success: function(response) {
			console.log(response);
			if(!response || typeof response != 'object' || !response.hasOwnProperty('InverterParameters') || !response['InverterParameters'].hasOwnProperty('35')) {
				alert("E004. Please refresh the page!");
				return;
			}
			var deviceStandard = response['InverterParameters']['35']['S1'];
			var isVde4105 = '0';
			if(deviceStandard != '058') {
				$('.standard').css('color', 'red');
				$('.loading').hide();
				$('.error').show();
				$('#btnApplyVDE4105').removeClass('invisible');
			} else {
				$('.standard').css('color', '#25ae88');
				$('.loading').hide();
				$('.success').show();
				isVde4105 = '1';
			}
			// Store VDE Variable
			$.post({
				url: "cmd/session.php",
				data: { vde4105: isVde4105 },
				error: function() { alert("E006. Please refresh the page!") },
				success: function(response) {
					console.log(response);
					if(response === '1')
						$('#btnSubmit').removeClass('d-none');
					else
						alert("E007. Please refresh the page!");
				}
			});

		}
	});
}





// Button Submit onClick
$('#btnSubmit').on('click', function() {
	// Disable Buzzer
	$.get({
		url: 'api.php?set=command&type=24065&entity=0&text2=A,1',
		error: function() { alert("E005. Please refresh the page!"); },
		success: function() {
			window.location.href = "system_setup.php";
		}
	});
});





// Button VDE4105 onClick
$('#btnApplyVDE4105').on('click', function() {
	// Switch to VDE4105
	$.get({
		url: 'api.php?set=command&type=24117&entity=0&text2=058',
		error: function() { alert("E008. Please refresh the page!"); },
		success: function() {
			$('#btnApplyVDE4105').hide();
			$('#btnSubmit').hide();
			$('.vde-loading').css('display', 'inline-block');
			checkParameters();
		}
	});
});





var deviceDatetime = "";
function checkParameters()
{
	$.get({
		url: "api.php?get=settings",
		error: function() { alert("E009. Please refresh the page!") },
		success: function(response) {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E010. Please refresh the page!");
			response = response['InverterParameters'];
			if(deviceDatetime == "") { deviceDatetime = response["0"]["S1"]; setTimeout(checkParameters, 5000); return; }
			if(response["0"]["S1"] == deviceDatetime) { setTimeout(checkParameters, 5000); return; }
			location.reload();
		}
	});
}