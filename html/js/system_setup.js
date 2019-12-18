$progress.trigger('step', 5);










function isLiFePO() { return $('#bx_battery_type_0').is(':checked'); }
function isCarbon() { return $('#bx_battery_type_1').is(':checked'); }
function isNone()   { return $('#bx_battery_type_2').is(':checked'); }

var systemApikey   = "";
var systemModel    = "";
var deviceModel    = "";
var deviceDatetime = "";
var newParameters  = {};
var oldParameters  = {};

var isSettingParameters = false;










// Battery Type Change

$('input[name=bx_battery_type').on('change', function() {

	// SET Carbon
	if(this.value == '1') {
		$('#battery_section_0').hide();
		$('#battery_section_1').show();
		$('#system_type').hide();
		$('#bx_system').val($('#bx_device').val());
		$('#bx_system_type_w').prop('checked', true);
	}
	// SET LiFePO
	else {
		$('#battery_section_0').show();
		$('#battery_section_1').hide();
		$('#system_type').show();
	}

});










// Activate Submit Button

setInterval(() => {
	if( ( $("#bx_system"               ).val() != "" ) &&
		( $("#bx_device"               ).val() != "" ) &&
		( $("#bx_box"                  ).val() != "" ) &&
		( $("#solar_wattPeak"          ).val() != "" ) &&
		( $("#solar_feedInLimitation"  ).val() != "" ) &&
		( !isLiFePO() || $("#battery_1").val() != "" ) &&
		( $("#installation_date"       ).val() != "" )
	)
		$("#btn_next").attr("disabled", isSettingParameters);
	else
		$("#btn_next").attr("disabled", true);
}, 1000);










step1();










// Get LiveX Apikey

function step1()
{
	$.get({
		url: 'cmd/apikey.php',
		error: () => { alert("E001. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(!response || response.length != 40)
				return alert("E002. Please refresh the page!");
			systemApikey = response.toString().trim();
			step2();
		}
	});

}










// Retrieve Installation Info

function step2()
{
	$.post({
		url: "https://api.batterx.io/v2/commissioning.php",
		data: {
			action: "retrieve_installation_info",
			apikey: systemApikey
		},
		error: () => { alert("E003. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(json)
			{
				// Set System Info
				if(json.hasOwnProperty('system')) {
					if(json.system.hasOwnProperty('serialnumber'))
						$("#bx_system").val(json.system.serialnumber).attr("disabled", true);
					if(json.system.hasOwnProperty('model')) {
						if(json.system.model.includes('W'))
							$("#bx_system_type_w").click();
						else
							$("#bx_system_type_r").click();
						$("#bx_system_type_w").attr("disabled", true);
						$("#bx_system_type_r").attr("disabled", true);
					}
				}
				// Set Device Info
				if(json.hasOwnProperty('device')) {
					if(json.device.hasOwnProperty('solar_watt_peak'))
						$('#solar_wattPeak').val(json.device.solar_watt_peak);
					if(json.device.hasOwnProperty('grid_feedin_limitation'))
						$('#solar_feedInLimitation').val(json.device.grid_feedin_limitation);
				}
				// Set Installation Date
				if(json.hasOwnProperty('installation_date')) {
					$('#installation_date').val(json.installation_date);
				}
				// Set Solar Info
				if(json.hasOwnProperty('solar_info')) {
					$('#solar_info').val(json.solar_info);
				}
				// Set Inverter Memo
				if(json.hasOwnProperty('note')) {
					$('#installer_memo').val(json.note);
				}
				// Set Batteries Info
				if(json.hasOwnProperty('batteries')) {
					if(json.batteries.length > 1) {
						if(json.batteries.length > 0 && json.batteries[0].hasOwnProperty('serialnumber')) $('#battery_1').val(json.batteries[0].serialnumber);
						if(json.batteries.length > 1 && json.batteries[1].hasOwnProperty('serialnumber')) $('#battery_2').val(json.batteries[1].serialnumber);
						if(json.batteries.length > 2 && json.batteries[2].hasOwnProperty('serialnumber')) $('#battery_3').val(json.batteries[2].serialnumber);
						if(json.batteries.length > 3 && json.batteries[3].hasOwnProperty('serialnumber')) $('#battery_4').val(json.batteries[3].serialnumber);
					} else if(json.batteries.length == 1) {
						if(json.batteries[0].hasOwnProperty('serialnumber') && json.batteries[0].hasOwnProperty('type')) {
							var batterySerialnumber = json.batteries[0].serialnumber;
							var batteryType         = json.batteries[0].type;
							if(batteryType == 0)
								$('#battery_1').val(batterySerialnumber);
							else
								$('#bx_battery_type_1').prop('checked', true).trigger('change');
								$('#bx_system_type_w ').prop('checked', true).trigger('change');
						}
					}
				}
			}

			step3();

		}
	});
}










// Set LiveX Serial-Number

function step3()
{
	$.post({
		url: "https://api.batterx.io/v2/commissioning.php",
		data: {
			action: "retrieve_box_serial",
			apikey: systemApikey
		},
		error: () => { alert("E004. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			var box_serial = response;
			// Save Serial-Number to Session
			$.post({
				url: "cmd/session.php",
				data: { box_serial: box_serial },
				error: () => { alert("E005. Please refresh the page!"); },
				success: (response) => {
					console.log(response);
					if(response !== '1')
						return alert("E006. Please refresh the page!");
					$('#bx_box').val(box_serial);
					step4();
				}
			});
		}
	});
}










// Set Inverter Serial-Number

function step4()
{
	$.get({
		url: 'api.php?get=deviceinfo',
		error: () => { alert("E007. Please refresh the page!"); },
		success: (response) => {

			console.log(response);

			if(!response || typeof response != 'object' || !response.hasOwnProperty('device_serial_number') || !response.hasOwnProperty('device_model'))
				return alert("E008. Please refresh the page!");

			var device_serial_number = response['device_serial_number'];
			var device_model = response['device_model'].toLowerCase();
			device_model = (device_model == 'batterx h3') ? 'h3' : (device_model == 'batterx h5') ? 'h5' : (device_model == 'batterx h5-eco') ? 'h5e' : (device_model == 'batterx h10') ? 'h10' : '';
			deviceModel = device_model;

			// Save Serial-Number & Model to Session
			$.post({
				url: "cmd/session.php",
				data: {
					device_serial: device_serial_number,
					device_model: device_model
				},
				error: () => { alert("E009. Please refresh the page!"); },
				success: (response) => {
					console.log(response);
					if(response !== '1')
						return alert("E010. Please refresh the page!");
					$('#bx_device').val(device_serial_number);
					step5();
				}
			});

		}
	});
}










// Show / Hide Energy Meter Phase Selection

function step5()
{
	if(deviceModel == "h3" || deviceModel == "h5" || deviceModel == "h5e") {
		$('#box_emeter_phase').removeClass('d-none');
		$.get({
			url: 'api.php?get=settings',
			error: () => { alert("E101. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(!response || typeof response != "object")
					return alert("E102. Please refresh the page!");
				if(response.hasOwnProperty('InjectionMode')) {
					response = response['InjectionMode'];
					if(response['0']['v6'] !== 0) $('#bx_emeter_phase').val(response['0']['v6']);
				}
			}
		});
	}
}






























// Main Form On-Submit

$('#mainForm').on('submit', (e) => {

	e.preventDefault();

	// Check if all fields are filled
	if( ( $("#bx_system"              ).val() == "" ) ||
		( $("#bx_device"              ).val() == "" ) ||
		( $("#bx_box"                 ).val() == "" ) ||
		( $("#solar_wattPeak"         ).val() == "" ) ||
		( $("#solar_feedInLimitation" ).val() == "" ) ||
		( isLiFePO() && $("#battery_1").val() == "" ) ||
		( $("#installation_date"      ).val() == "" )
	) { return; }

	// Disable all inputs
	$(` #bx_system,
		#bx_device,
		#bx_box,
		#solar_wattPeak,
		#solar_feedInLimitation,
		#bx_battery_type_0,
		#bx_battery_type_1,
		#bx_battery_type_2,
		#battery_1,
		#battery_2,
		#battery_3,
		#battery_4,
		#bx_system_type_r,
		#bx_system_type_w,
		#solar_info,
		#installer_memo,
		#btnInstallerMemo
	`).attr('disabled', true);

	// SHOW LOADING SCREEN
	isSettingParameters = true;
	$('#btn_next').attr('disabled', true);
	$('.setting-progress').removeClass('d-none');

	// SCROLL TO BOTTOM
	$('html, body').scrollTop($(document).height());

	setup1();

});










// Verify All Serial-Numbers

function setup1()
{
	var system_serial   = $('#bx_system').val();
	var device_serial   = $('#bx_device').val();
	var battery1_serial = isLiFePO() ? $('#battery_1').val() : $('#bx_device').val();
	var battery2_serial = isLiFePO() ? $('#battery_2').val() : "";
	var battery3_serial = isLiFePO() ? $('#battery_3').val() : "";
	var battery4_serial = isLiFePO() ? $('#battery_4').val() : "";

	var canContinue = true;

	// Check Inverter SerialNumber
	if(canContinue) {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning.php",
			async: false,
			data: {
				action:       "verify_device",
				serialnumber: device_serial,
				system:       system_serial
			},
			error: () => { alert("E011. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['inverter_registered_with_other_system']);
			}
		});
	}

	// Check Battery 1 SerialNumber
	if(canContinue && battery1_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning.php",
			async: false,
			data: {
				action:       "verify_battery",
				serialnumber: battery1_serial,
				system:       system_serial
			},
			error: () => { alert("E012. Please refresh the page!"); },
			success: function(response) {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['battery_not_exist_or_registered_with_other_system']);
			}
		});
	}

	// Check Battery 2 SerialNumber
	if(canContinue && battery2_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning.php",
			async: false,
			data: {
				action:       "verify_battery",
				serialnumber: battery2_serial,
				system:       system_serial
			},
			error: () => { alert("E013. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['battery_not_exist_or_registered_with_other_system']);
			}
		});
	}

	// Check Battery 3 SerialNumber
	if(canContinue && battery3_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning.php",
			async: false,
			data: {
				action:       "verify_battery",
				serialnumber: battery3_serial,
				system:       system_serial
			},
			error: () => { alert("E014. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['battery_not_exist_or_registered_with_other_system']);
			}
		});
	}

	// Check Battery 4 SerialNumber
	if(canContinue && battery4_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning.php",
			async: false,
			data: {
				action:       "verify_battery",
				serialnumber: battery4_serial,
				system:       system_serial
			},
			error: () => { alert("E015. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['battery_not_exist_or_registered_with_other_system']);
			}
		});
	}

	// Continue with Setup-Step-2
	if(canContinue) setup2();
}










// Verify LiFePO Communication

var tempDatetime = "";

function setup2()
{
	// Show Loading
	$('#notif').removeClass('loading error success').addClass('loading');
	$('#message').html(lang.setting_parameters).css('color', '');
	isSettingParameters = true;

	// Set Grid InjectionPhase
	if(deviceModel == "h3" || deviceModel == "h5" || deviceModel == "h5e") {
		var selectedPhase = $('#bx_emeter_phase').val();
		if(selectedPhase == "1" || selectedPhase == "2" || selectedPhase == "3") {
			$.get({
				url: `api.php?set=command&type=20736&entity=6&text2=${selectedPhase}`,
				error: () => { alert("E103. Please refresh the page!"); },
				success: (response) => {}
			});
		}
	}

	// Set Parameters if not LiFePO
	if(!isLiFePO()) finishSetup();

	// Verify LiFePO Communication
	// Set Battery Charging Voltage to 5320,5300
	$.get({
		url: `api.php?set=command&type=24114&entity=0&text2=5320,5300`,
		error: () => { alert("E016. Please refresh the page!"); },
		success: (response) => {
			if(response != '1') return alert("E017. Please refresh the page!");
			tempDatetime = "";
			checkParamSetup2();
		}
	});
}

function checkParamSetup2() {
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E018. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E019. Please refresh the page!");
			response = response['InverterParameters'];
			if(tempDatetime == "") { tempDatetime = response["0"]["s1"]; setTimeout(checkParamSetup2, 5000); return; }
			if(response["0"]["s1"] == tempDatetime) { setTimeout(checkParamSetup2, 5000); return; }
			// Verify Battery Discharging Current (13A)
			var chargingVoltage = response["32"]["s1"];
			console.log(chargingVoltage);
			if(chargingVoltage == "5320,5300") {
				$('#notif').removeClass('loading error success').addClass('error');
				$('#message').html(lang.lifepo_communication_problem).css('color', 'red');
				$('#btn_next').unbind().removeAttr('form').removeAttr('type').on('click', () => { setup2(); });
				isSettingParameters = false;
			} else {
				finishSetup();
			}
		}
	});
}




















// Finish Setup Function, called when all Serial-Numbers are correct

function finishSetup()
{
	let countBat = 0;
	if($('#battery_1').val() != "") countBat++;
	if($('#battery_2').val() != "") countBat++;
	if($('#battery_3').val() != "") countBat++;
	if($('#battery_4').val() != "") countBat++;
	countBat = (countBat > 3) ? "14" : (countBat > 2) ? "10,5" : (countBat > 1) ? "7" : "3,5";

	var systemModel = "batterX " + deviceModel + ($('#bx_system_type_w').is(':checked') ? "W" : "R") + "-" + countBat;

	// Save All Needed Data (System+Solar+Batteries)
	var tempData = {
		system_serial:          $('#bx_system'             ).val(),
		device_serial:          $('#bx_device'             ).val(),
		solar_wattPeak:         $('#solar_wattPeak'        ).val(),
		solar_feedInLimitation: $('#solar_feedInLimitation').val(),
		solar_info:             $('#solar_info'            ).val(),
		note:                   $('#installer_memo'        ).val(),
		installation_date:      $('#installation_date'     ).val(),
		battery_type:           isCarbon() ? 'carbon' : isNone() ? 'none' : 'lifepo'
	};
	if(isLiFePO()) tempData["system_model"] = systemModel;

	var battery1_serial = isLiFePO() ? $('#battery_1').val() : $('#bx_device').val();
	var battery2_serial = isLiFePO() ? $('#battery_2').val() : "";
	var battery3_serial = isLiFePO() ? $('#battery_3').val() : "";
	var battery4_serial = isLiFePO() ? $('#battery_4').val() : "";
	if(battery1_serial != "") tempData["battery1_serial"] = battery1_serial;
	if(battery2_serial != "") tempData["battery2_serial"] = battery2_serial;
	if(battery3_serial != "") tempData["battery3_serial"] = battery3_serial;
	if(battery4_serial != "") tempData["battery4_serial"] = battery4_serial;

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {

			console.log(response);

			if(response != '1') return alert("E021. Please refresh the page!");

			// Apply Parameters to Inverter
			let numberOfModules = 0;
			if($('#battery_1').val() != "") numberOfModules += 1;
			if($('#battery_2').val() != "") numberOfModules += 1;
			if($('#battery_3').val() != "") numberOfModules += 1;
			if($('#battery_4').val() != "") numberOfModules += 1;

			let maxChargingCurrent = 2500; // x0.01A
			let maxGridFeedInPower = 3000; // x1.00W
				 if(deviceModel == "h3" ) { maxChargingCurrent =  2500; maxDischargingCurrent = 150; maxGridFeedInPower =  3000; }
			else if(deviceModel == "h5" ) { maxChargingCurrent =  6000; maxDischargingCurrent = 150; maxGridFeedInPower =  5000; }
			else if(deviceModel == "h5e") { maxChargingCurrent = 10000; maxDischargingCurrent = 150; maxGridFeedInPower =  5500; }
			else if(deviceModel == "h10") { maxChargingCurrent = 20000; maxDischargingCurrent = 300; maxGridFeedInPower = 10000; }

			if(!isCarbon() && !isNone()) newParameters['maxChargingCurrentAC'    ] = Math.min(numberOfModules * 3700, maxChargingCurrent).toString();
			if(!isCarbon() && !isNone()) newParameters['cutoffVoltageHybrid'     ] = '4700';
			if(!isCarbon() && !isNone()) newParameters['redischargeVoltageHybrid'] = '5000';
			if(!isCarbon() && !isNone()) newParameters['cutoffVoltage'           ] = '4700';
			if(!isCarbon() && !isNone()) newParameters['redischargeVoltage'      ] = '5000';
			if(!isCarbon() && !isNone()) newParameters['batteryType'             ] = '1';
			if(!isNone()) newParameters['solarEnergyPriority'          ] = '1';
			if(!isNone()) newParameters['allowBatteryCharging'         ] = '1';
			if(!isNone()) newParameters['allowBatteryChargingAC'       ] = '0';
			if(!isNone()) newParameters['allowBatteryDischargeSolarOK' ] = '1';
			if(!isNone()) newParameters['allowBatteryDischargeSolarNOK'] = '1';
			newParameters['allowGridFeedIn'   ] = '1';
			newParameters['maxGridFeedInPower'] = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower));
			
			// Get Old Parameters
			$.get({
				url: "api.php?get=settings",
				async: false,
				error: function() { alert("E020. Please refresh the page!") },
				success: function(response) {
					if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
						return alert("E021. Please refresh the page!");
					response = response['InverterParameters'];
					deviceDatetime = response['0']['s1'];
					if(!isCarbon() && !isNone()) oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
					if(!isCarbon() && !isNone()) oldParameters['cutoffVoltageHybrid'     ] = response['33']['s1'].split(",")[0];
					if(!isCarbon() && !isNone()) oldParameters['redischargeVoltageHybrid'] = response['33']['s1'].split(",")[1];
					if(!isCarbon() && !isNone()) oldParameters['cutoffVoltage'           ] = response['33']['s1'].split(",")[2];
					if(!isCarbon() && !isNone()) oldParameters['redischargeVoltage'      ] = response['33']['s1'].split(",")[3];
					if(!isCarbon() && !isNone()) oldParameters['batteryType'             ] = response[ '5']['s1'];
					if(!isNone()) oldParameters['solarEnergyPriority'          ] = response[ '6']['s1'];
					if(!isNone()) oldParameters['allowBatteryCharging'         ] = response[ '2']['s1'].split(",")[0];
					if(!isNone()) oldParameters['allowBatteryChargingAC'       ] = response[ '2']['s1'].split(",")[1];
					if(!isNone()) oldParameters['allowBatteryDischargeSolarOK' ] = response[ '2']['s1'].split(",")[3];
					if(!isNone()) oldParameters['allowBatteryDischargeSolarNOK'] = response[ '2']['s1'].split(",")[4];
					oldParameters['allowGridFeedIn'   ] = response[ '2']['s1'].split(",")[2];
					oldParameters['maxGridFeedInPower'] = response['15']['s1'];
				}
			});

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);

			let retry = false;

			// Resend Not Set Commands
			if(!isCarbon() && !isNone()) {
				if(newParameters['maxChargingCurrentAC'] != oldParameters['maxChargingCurrentAC'])
					{ retry = true; sendCommand(24113, 0, "", newParameters['maxChargingCurrentAC']); }
				if(newParameters['cutoffVoltageHybrid'] != oldParameters['cutoffVoltageHybrid'] || newParameters['redischargeVoltageHybrid'] != oldParameters['redischargeVoltageHybrid'] || newParameters['redischargeVoltage'] != oldParameters['redischargeVoltage'])
					{ retry = true; sendCommand(24115, 0, "", newParameters['cutoffVoltageHybrid'] + "," + newParameters['redischargeVoltageHybrid'] + "," + newParameters['cutoffVoltage'] + "," + newParameters['redischargeVoltage']); }
				if(newParameters['batteryType'] != oldParameters['batteryType'])
					{ retry = true; sendCommand(24069, 0, "", newParameters['batteryType']); }
			}
			if(!isNone()) {
				if(newParameters['solarEnergyPriority'] != oldParameters['solarEnergyPriority'])
					{ retry = true; sendCommand(24070, 0, "", newParameters['solarEnergyPriority']); }
				if(newParameters['allowBatteryCharging'] != oldParameters['allowBatteryCharging'])
					{ retry = true; sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging']); }
				if(newParameters['allowBatteryChargingAC'] != oldParameters['allowBatteryChargingAC'])
					{ retry = true; sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC']); }
				if(newParameters['allowBatteryDischargeSolarOK'] != oldParameters['allowBatteryDischargeSolarOK'])
					{ retry = true; sendCommand(24066, 0, "", "D," + newParameters['allowBatteryDischargeSolarOK']); }
				if(newParameters['allowBatteryDischargeSolarNOK'] != oldParameters['allowBatteryDischargeSolarNOK'])
					{ retry = true; sendCommand(24066, 0, "", "E," + newParameters['allowBatteryDischargeSolarNOK']); }
			}
			if(newParameters['allowGridFeedIn'] != oldParameters['allowGridFeedIn'])
				{ retry = true; sendCommand(24066, 0, "", "C," + newParameters['allowGridFeedIn']); }
			if(newParameters['maxGridFeedInPower'] != oldParameters['maxGridFeedInPower'])
				{ retry = true; sendCommand(24085, 0, "", newParameters['maxGridFeedInPower']); }

			// Show Setting Success
			if(!retry) {
				$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
				$('#notif').removeClass("loading error success").addClass("success");
				// Move to next step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else console.log("SETTING PARAMETERS");

		}
	});
}










var checkParametersInterval;

function sendCommand(type, entity, text1, text2)
{
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: function() { alert("E022. Please refresh the page!") },
		success: function(response) {
			if(response != '1') return alert("E023. Please refresh the page!");
			if(checkParametersInterval == undefined)
				checkParametersInterval = setInterval(checkParameters, 5000);
		}
	});
}










function checkParameters()
{
	$.get({
		url: "api.php?get=settings",
		error: function() { alert("E024. Please refresh the page!") },
		success: function(response) {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E025. Please refresh the page!");

			response = response['InverterParameters'];
			if(response["0"]["s1"] == deviceDatetime) return false;

			deviceDatetime = response["0"]["s1"];

			// Check if All Commands Are Correct
			if(!isCarbon() && !isNone()) oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			if(!isCarbon() && !isNone()) oldParameters['cutoffVoltageHybrid'     ] = response['33']['s1'].split(",")[0];
			if(!isCarbon() && !isNone()) oldParameters['redischargeVoltageHybrid'] = response['33']['s1'].split(",")[1];
			if(!isCarbon() && !isNone()) oldParameters['cutoffVoltage'           ] = response['33']['s1'].split(",")[2];
			if(!isCarbon() && !isNone()) oldParameters['redischargeVoltage'      ] = response['33']['s1'].split(",")[3];
			if(!isCarbon() && !isNone()) oldParameters['batteryType'             ] = response[ '5']['s1'];
			if(!isNone()) oldParameters['solarEnergyPriority'          ] = response[ '6']['s1'];
			if(!isNone()) oldParameters['allowBatteryCharging'         ] = response[ '2']['s1'].split(",")[0];
			if(!isNone()) oldParameters['allowBatteryChargingAC'       ] = response[ '2']['s1'].split(",")[1];
			if(!isNone()) oldParameters['allowBatteryDischargeSolarOK' ] = response[ '2']['s1'].split(",")[3];
			if(!isNone()) oldParameters['allowBatteryDischargeSolarNOK'] = response[ '2']['s1'].split(",")[4];
			oldParameters['allowGridFeedIn'   ] = response[ '2']['s1'].split(",")[2];
			oldParameters['maxGridFeedInPower'] = response['15']['s1'];
			
			let retry = false;

			// Resend Not Set Commands
			if(!isCarbon() && !isNone()) {
				if(newParameters['maxChargingCurrentAC'] != oldParameters['maxChargingCurrentAC'])
					{               sendCommand(24113, 0, "", newParameters['maxChargingCurrentAC']); }
				if(newParameters['cutoffVoltageHybrid'] != oldParameters['cutoffVoltageHybrid'] || newParameters['redischargeVoltageHybrid'] != oldParameters['redischargeVoltageHybrid'] || newParameters['redischargeVoltage'] != oldParameters['redischargeVoltage'])
					{ retry = true; sendCommand(24115, 0, "", newParameters['cutoffVoltageHybrid'] + "," + newParameters['redischargeVoltageHybrid'] + "," + newParameters['cutoffVoltage'] + "," + newParameters['redischargeVoltage']); }
				if(newParameters['batteryType'] != oldParameters['batteryType'])
					{ retry = true; sendCommand(24069, 0, "", newParameters['batteryType']); }
			}
			if(!isNone()) {
				if(newParameters['solarEnergyPriority'] != oldParameters['solarEnergyPriority'])
					{ retry = true; sendCommand(24070, 0, "", newParameters['solarEnergyPriority']); }
				if(newParameters['allowBatteryCharging'] != oldParameters['allowBatteryCharging'])
					{ retry = true; sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging']); }
				if(newParameters['allowBatteryChargingAC'] != oldParameters['allowBatteryChargingAC'])
					{ retry = true; sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC']); }
				if(newParameters['allowBatteryDischargeSolarOK'] != oldParameters['allowBatteryDischargeSolarOK'])
					{ retry = true; sendCommand(24066, 0, "", "D," + newParameters['allowBatteryDischargeSolarOK']); }
				if(newParameters['allowBatteryDischargeSolarNOK'] != oldParameters['allowBatteryDischargeSolarNOK'])
					{ retry = true; sendCommand(24066, 0, "", "E," + newParameters['allowBatteryDischargeSolarNOK']); }
			}
			if(newParameters['allowGridFeedIn'] != oldParameters['allowGridFeedIn'])
				{ retry = true; sendCommand(24066, 0, "", "C," + newParameters['allowGridFeedIn']); }
			if(newParameters['maxGridFeedInPower'] != oldParameters['maxGridFeedInPower'])
				{ retry = true; sendCommand(24085, 0, "", newParameters['maxGridFeedInPower']); }
			
			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);

			// Show Setting Success
			if(!retry) {
				$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
				$('#notif').removeClass("loading error success").addClass("success");
				// Move to next step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else console.log("RETRYING, PLEASE WAIT !!!");

		}
	});
}
