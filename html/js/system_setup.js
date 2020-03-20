$progress.trigger('step', 5);










// Define Variables

function isLiFePO() { return $('#bx_battery_type_0').is(':checked'); }
function isCarbon() { return $('#bx_battery_type_1').is(':checked'); }
function isOther()  { return $('#bx_battery_type_9').is(':checked'); }

var systemApikey   = "";
var systemModel    = "";
var systemSerial   = "";
var systemType     = "";
var deviceModel    = "";
var deviceDatetime = "";

var newParameters  = {};
var oldParameters  = {};

var tempDatetime   = "";

var isSettingParameters = false;
var checkParametersInterval;










// Battery Type Change

$('input[name=bx_battery_type').on('change', function() {

	// SET Other
	if(this.value == '9') {
		$('#battery_section_0').hide();
		$('#battery_section_1').hide();
		$('#battery_section_9').show();
		$('#system_type').hide();
		$('#bx_system').val($('#bx_device').val());
		$('#bx_system_type_w').prop('checked', true);
		// Load Inverter Parameters
		$.get({
			url: "api.php?get=settings",
			error: () => { alert("E024. Please refresh the page!") },
			success: (response) => {
				if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
					return alert("E021. Please refresh the page!");
				response = response['InverterParameters'];
				// Show Inverter Parameters
				if(response.hasOwnProperty('30'))
					$('#other_battery_maxChargingCurrent      ').val(parseInt(response['30']['s1']) / 100);
				if(response.hasOwnProperty('34'))
					$('#other_battery_maxDischargingCurrent   ').val(parseInt(response['34']['s1']));
				if(response.hasOwnProperty('32')) {
					$('#other_battery_bulkChargingVoltage     ').val(parseInt(response['32']['s1'].split(',')[0]) / 100);
					$('#other_battery_floatChargingVoltage    ').val(parseInt(response['32']['s1'].split(',')[1]) / 100);
				}
				if(response.hasOwnProperty('33')) {
					$('#other_battery_cutoffVoltageHybrid     ').val(parseInt(response['33']['s1'].split(',')[0]) / 100);
					$('#other_battery_redischargeVoltageHybrid').val(parseInt(response['33']['s1'].split(',')[1]) / 100);
					$('#other_battery_cutoffVoltage           ').val(parseInt(response['33']['s1'].split(',')[2]) / 100);
					$('#other_battery_redischargeVoltage      ').val(parseInt(response['33']['s1'].split(',')[3]) / 100);
				}
			}
		});
	}
	// SET Carbon
	else if(this.value == '1') {
		$('#battery_section_0').hide();
		$('#battery_section_1').show();
		$('#battery_section_9').hide();
		$('#system_type').hide();
		$('#bx_system').val($('#bx_device').val());
		$('#bx_system_type_w').prop('checked', true);
	}
	// SET LiFePO
	else {
		$('#battery_section_0').show();
		$('#battery_section_1').hide();
		$('#battery_section_9').hide();
		$('#system_type').show();
		$('#bx_system').val(systemSerial);
		if(systemType == "wall")
			$('#bx_system_type_w').prop('checked', true);
		else
			$('#bx_system_type_r').prop('checked', true);
	}

});










// Carbon Batteries OnChange Listener

$('#carbon_battery_model, #carbon_battery_strings').on('change', function() {

	var batteryModel    = $('#carbon_battery_model  ').val();
	var batteryStrings  = $('#carbon_battery_strings').val();
	var batteryCapacity = 0;

	if(batteryModel == "LC+700")
		batteryCapacity = 4 * 700 * parseInt(batteryStrings);
	else if(batteryModel == "LC+1300")
		batteryCapacity = 4 * 1300 * parseInt(batteryStrings);
	else if(batteryModel == "LC+2V500")
		batteryCapacity = 24 * 2 * 500 * parseInt(batteryStrings);

	$('#carbon_battery_capacity').val(`${batteryCapacity} Wh`);

});










// Show More Battery Modules (16)

$('#btnShowAllModules').on('click', function() {
	$('#listAllModules').removeClass('d-none');
	$(this).addClass('d-none');
})










// Activate Submit Button

setInterval(() => {

	if(isLiFePO())
	{
		if( $("#installation_date     ").val() != "" &&
			$("#bx_system             ").val() != "" &&
			$("#bx_device             ").val() != "" &&
			$("#bx_box                ").val() != "" &&
			$("#solar_wattPeak        ").val() != "" &&
			$("#solar_feedInLimitation").val() != "" &&
			$("#lifepo_battery_1      ").val() != ""
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	}
	else if(isCarbon())
	{
		if( $("#installation_date      ").val() != "" &&
			$("#bx_system              ").val() != "" &&
			$("#bx_device              ").val() != "" &&
			$("#bx_box                 ").val() != "" &&
			$("#solar_wattPeak         ").val() != "" &&
			$("#solar_feedInLimitation ").val() != "" &&
			$("#carbon_battery_model   ").val() != "" &&
			$("#carbon_battery_strings ").val() != "" &&
			$("#carbon_battery_capacity").val() != ""
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	}
	else // isOther()
	{
		if( $("#installation_date                     ").val() != "" &&
			$("#bx_system                             ").val() != "" &&
			$("#bx_device                             ").val() != "" &&
			$("#bx_box                                ").val() != "" &&
			$("#solar_wattPeak                        ").val() != "" &&
			$("#solar_feedInLimitation                ").val() != "" &&
			$("#other_battery_capacity                ").val() != "" &&
			$("#other_battery_maxChargingCurrent      ").val() != "" &&
			$("#other_battery_maxDischargingCurrent   ").val() != "" &&
			$("#other_battery_bulkChargingVoltage     ").val() != "" &&
			$("#other_battery_floatChargingVoltage    ").val() != "" &&
			$("#other_battery_cutoffVoltage           ").val() != "" &&
			$("#other_battery_redischargeVoltage      ").val() != "" &&
			$("#other_battery_cutoffVoltageHybrid     ").val() != "" &&
			$("#other_battery_redischargeVoltageHybrid").val() != ""
		) {
			$("#btn_next").attr("disabled", isSettingParameters);
		} else {
			$("#btn_next").attr("disabled", true);
		}
	}

}, 1000);






























// Begin Process

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
		url: "https://api.batterx.io/v2/commissioning_v2.php",
		data: {
			action: "retrieve_installation_info",
			apikey: systemApikey
		},
		error: () => { alert("E003. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(json) {

				// Set System Info
				if(json.hasOwnProperty('system')) {
					if(json.system.hasOwnProperty('serialnumber')) {
						$("#bx_system").val(json.system.serialnumber).attr("disabled", true);
						systemSerial = json.system.serialnumber;
					}
					if(json.system.hasOwnProperty('model')) {
						if(json.system.model.includes('W'))
							$("#bx_system_type_w").click();
						else
							$("#bx_system_type_r").click();
						$("#bx_system_type_w").attr("disabled", true);
						$("#bx_system_type_r").attr("disabled", true);
						systemType = json.system.model.includes("W") ? "wall" : "rack";
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
				if(json.hasOwnProperty('batteries'))
				{
					// LiFePO Batteries
					if(json.batteries.length > 1)
					{
						if(json.batteries.length >  0 && json.batteries[ 0].hasOwnProperty('serialnumber')) $('#lifepo_battery_1 ').val(json.batteries[ 0].serialnumber);
						if(json.batteries.length >  1 && json.batteries[ 1].hasOwnProperty('serialnumber')) $('#lifepo_battery_2 ').val(json.batteries[ 1].serialnumber);
						if(json.batteries.length >  2 && json.batteries[ 2].hasOwnProperty('serialnumber')) $('#lifepo_battery_3 ').val(json.batteries[ 2].serialnumber);
						if(json.batteries.length >  3 && json.batteries[ 3].hasOwnProperty('serialnumber')) $('#lifepo_battery_4 ').val(json.batteries[ 3].serialnumber);
						if(json.batteries.length >  4 && json.batteries[ 4].hasOwnProperty('serialnumber')) $('#lifepo_battery_5 ').val(json.batteries[ 4].serialnumber);
						if(json.batteries.length >  5 && json.batteries[ 5].hasOwnProperty('serialnumber')) $('#lifepo_battery_6 ').val(json.batteries[ 5].serialnumber);
						if(json.batteries.length >  6 && json.batteries[ 6].hasOwnProperty('serialnumber')) $('#lifepo_battery_7 ').val(json.batteries[ 6].serialnumber);
						if(json.batteries.length >  7 && json.batteries[ 7].hasOwnProperty('serialnumber')) $('#lifepo_battery_8 ').val(json.batteries[ 7].serialnumber);
						if(json.batteries.length >  8 && json.batteries[ 8].hasOwnProperty('serialnumber')) $('#lifepo_battery_9 ').val(json.batteries[ 8].serialnumber);
						if(json.batteries.length >  9 && json.batteries[ 9].hasOwnProperty('serialnumber')) $('#lifepo_battery_10').val(json.batteries[ 9].serialnumber);
						if(json.batteries.length > 10 && json.batteries[10].hasOwnProperty('serialnumber')) $('#lifepo_battery_11').val(json.batteries[10].serialnumber);
						if(json.batteries.length > 11 && json.batteries[11].hasOwnProperty('serialnumber')) $('#lifepo_battery_12').val(json.batteries[11].serialnumber);
						if(json.batteries.length > 12 && json.batteries[12].hasOwnProperty('serialnumber')) $('#lifepo_battery_13').val(json.batteries[12].serialnumber);
						if(json.batteries.length > 13 && json.batteries[13].hasOwnProperty('serialnumber')) $('#lifepo_battery_14').val(json.batteries[13].serialnumber);
						if(json.batteries.length > 14 && json.batteries[14].hasOwnProperty('serialnumber')) $('#lifepo_battery_15').val(json.batteries[14].serialnumber);
						if(json.batteries.length > 15 && json.batteries[15].hasOwnProperty('serialnumber')) $('#lifepo_battery_16').val(json.batteries[15].serialnumber);
						
						if(json.batteries.length >  4) $('#btnShowAllModules').click();
					}
					// Carbon | Other Batteries
					else if(json.batteries.length == 1 && json.batteries[0].hasOwnProperty('serialnumber') && json.batteries[0].hasOwnProperty('type'))
					{
						var battery = json.batteries[0];

						// LiFePO
						if(battery.type == 0)
						{
							$('#lifepo_battery_1').val(battery.serialnumber);
						}
						// Carbon
						else if(battery.type == 1)
						{
							$('#bx_battery_type_1').prop('checked', true).trigger('change');
							$('#bx_system_type_w ').prop('checked', true).trigger('change');
							if(battery.hasOwnProperty('capacity')) $('#carbon_battery_capacity').val(battery.capacity + " Wh");
							if(battery.hasOwnProperty('strings' )) $('#carbon_battery_strings ').val(battery.strings).trigger('change');
							if(battery.hasOwnProperty('model'   )) $('#carbon_battery_model   ').val(battery.model).trigger('change');
						}
						// Other
						else if(battery.type == 9)
						{
							$('#bx_battery_type_9').prop('checked', true).trigger('change');
							$('#bx_system_type_w ').prop('checked', true).trigger('change');
							if(battery.hasOwnProperty('capacity')) $('#other_battery_capacity').val(battery.capacity);
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
		url: "https://api.batterx.io/v2/commissioning_v2.php",
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
					if(isCarbon() || isOther()) $('#bx_system').val(device_serial_number);
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
			url: "api.php?get=settings",
			error: () => { alert("E101. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(!response || typeof response != "object")
					return alert("E102. Please refresh the page!");
				if(response.hasOwnProperty('InjectionMode')) {
					response = response['InjectionMode'];
					if(response['0']['v6'] !== 0) $('#bx_emeter_phase').val(response['0']['v6'])
				}
			}
		});
	}
}






























// Main Form On-Submit

$('#mainForm').on('submit', (e) => {

	e.preventDefault();

	if(isLiFePO())
	{
		if( $("#installation_date     ").val() == "" ||
			$("#bx_system             ").val() == "" ||
			$("#bx_device             ").val() == "" ||
			$("#bx_box                ").val() == "" ||
			$("#solar_wattPeak        ").val() == "" ||
			$("#solar_feedInLimitation").val() == "" ||
			$("#lifepo_battery_1      ").val() == ""
		) return;
	}
	else if(isCarbon())
	{
		if( $("#installation_date      ").val() == "" ||
			$("#bx_system              ").val() == "" ||
			$("#bx_device              ").val() == "" ||
			$("#bx_box                 ").val() == "" ||
			$("#solar_wattPeak         ").val() == "" ||
			$("#solar_feedInLimitation ").val() == "" ||
			$("#carbon_battery_model   ").val() == "" ||
			$("#carbon_battery_strings ").val() == "" ||
			$("#carbon_battery_capacity").val() == ""
		) return;
	}
	else // isOther()
	{
		if( $("#installation_date                     ").val() == "" ||
			$("#bx_system                             ").val() == "" ||
			$("#bx_device                             ").val() == "" ||
			$("#bx_box                                ").val() == "" ||
			$("#solar_wattPeak                        ").val() == "" ||
			$("#solar_feedInLimitation                ").val() == "" ||
			$("#other_battery_capacity                ").val() == "" ||
			$("#other_battery_maxChargingCurrent      ").val() == "" ||
			$("#other_battery_maxDischargingCurrent   ").val() == "" ||
			$("#other_battery_bulkChargingVoltage     ").val() == "" ||
			$("#other_battery_floatChargingVoltage    ").val() == "" ||
			$("#other_battery_cutoffVoltage           ").val() == "" ||
			$("#other_battery_redischargeVoltage      ").val() == "" ||
			$("#other_battery_cutoffVoltageHybrid     ").val() == "" ||
			$("#other_battery_redischargeVoltageHybrid").val() == ""
		) return;
	}

	// DISABLE ALL FIELDS
	$(` #bx_system,
		#bx_system_type_r,
		#bx_system_type_w,
		#bx_device,
		#bx_box,
		#btnInstallerMemo
		#installer_memo,
		
		#solar_wattPeak,
		#solar_feedInLimitation,
		#solar_info,
		#bx_emeter_phase,

		#bx_battery_type_0,
		#lifepo_battery_1,
		#lifepo_battery_2,
		#lifepo_battery_3,
		#lifepo_battery_4,
		#lifepo_battery_5,
		#lifepo_battery_6,
		#lifepo_battery_7,
		#lifepo_battery_8,
		#lifepo_battery_9,
		#lifepo_battery_10,
		#lifepo_battery_11,
		#lifepo_battery_12,
		#lifepo_battery_13,
		#lifepo_battery_14,
		#lifepo_battery_15,
		#lifepo_battery_16,
		#btnShowAllModules,

		#bx_battery_type_1,
		#carbon_battery_model,
		#carbon_battery_strings,
		#carbon_battery_capacity,
		
		#bx_battery_type_9,
		#other_battery_capacity,
		#other_battery_maxChargingCurrent,
		#other_battery_maxDischargingCurrent,
		#other_battery_bulkChargingVoltage,
		#other_battery_floatChargingVoltage,
		#other_battery_cutoffVoltageHybrid,
		#other_battery_redischargeVoltageHybrid,
		#other_battery_cutoffVoltage,
		#other_battery_redischargeVoltage

	`).attr('disabled', true);

	// SHOW LOADING SCREEN
	isSettingParameters = true;
	$('#btn_next').attr('disabled', true);
	$('.setting-progress').removeClass('d-none');

	// SCROLL TO BOTTOM
	$('html, body').scrollTop($(document).height());

	// START SETUP
	if(isLiFePO())
		setupLiFePO();
	else if(isCarbon())
		setupCarbon();
	else
		setupOther();

});






























// Setup for LiFePO Batteries

function setupLiFePO()
{
	var system_serial    = $('#bx_system        ').val();
	var device_serial    = $('#bx_device        ').val();
	var battery1_serial  = $('#lifepo_battery_1 ').val();
	var battery2_serial  = $('#lifepo_battery_2 ').val();
	var battery3_serial  = $('#lifepo_battery_3 ').val();
	var battery4_serial  = $('#lifepo_battery_4 ').val();
	var battery5_serial  = $('#lifepo_battery_5 ').val();
	var battery6_serial  = $('#lifepo_battery_6 ').val();
	var battery7_serial  = $('#lifepo_battery_7 ').val();
	var battery8_serial  = $('#lifepo_battery_8 ').val();
	var battery9_serial  = $('#lifepo_battery_9 ').val();
	var battery10_serial = $('#lifepo_battery_10').val();
	var battery11_serial = $('#lifepo_battery_11').val();
	var battery12_serial = $('#lifepo_battery_12').val();
	var battery13_serial = $('#lifepo_battery_13').val();
	var battery14_serial = $('#lifepo_battery_14').val();
	var battery15_serial = $('#lifepo_battery_15').val();
	var battery16_serial = $('#lifepo_battery_16').val();

	var canContinue = true;

	// Check Inverter S/N
	if(canContinue) {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			async: false,
			data: {
				action       : "verify_device",
				serialnumber : device_serial,
				system       : system_serial
			},
			error: () => { alert("E011. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['inverter_registered_with_other_system']);
			}
		});
	}

	// Check Battery 1 S/N
	if(canContinue && battery1_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery1_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery1_serial})`); }
		});
	}
	// Check Battery 2 S/N
	if(canContinue && battery2_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery2_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery2_serial})`); }
		});
	}
	// Check Battery 3 S/N
	if(canContinue && battery3_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery3_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery3_serial})`); }
		});
	}
	// Check Battery 4 S/N
	if(canContinue && battery4_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery4_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery4_serial})`); }
		});
	}
	// Check Battery 5 S/N
	if(canContinue && battery5_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery5_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery5_serial})`); }
		});
	}
	// Check Battery 6 S/N
	if(canContinue && battery6_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery6_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery6_serial})`); }
		});
	}
	// Check Battery 7 S/N
	if(canContinue && battery7_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery7_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery7_serial})`); }
		});
	}
	// Check Battery 8 S/N
	if(canContinue && battery8_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery8_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery8_serial})`); }
		});
	}
	// Check Battery 9 S/N
	if(canContinue && battery9_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery9_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery9_serial})`); }
		});
	}
	// Check Battery 10 S/N
	if(canContinue && battery10_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery10_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery10_serial})`); }
		});
	}
	// Check Battery 11 S/N
	if(canContinue && battery11_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery11_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery11_serial})`); }
		});
	}
	// Check Battery 12 S/N
	if(canContinue && battery12_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery12_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery12_serial})`); }
		});
	}
	// Check Battery 13 S/N
	if(canContinue && battery13_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery13_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery13_serial})`); }
		});
	}
	// Check Battery 14 S/N
	if(canContinue && battery14_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery14_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery14_serial})`); }
		});
	}
	// Check Battery 15 S/N
	if(canContinue && battery15_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery15_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery15_serial})`); }
		});
	}
	// Check Battery 16 S/N
	if(canContinue && battery16_serial != "") {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php", async: false,
			data: { action: "verify_battery", system: system_serial, serialnumber: battery16_serial },
			error: () => { alert("E012. Please refresh the page!"); },
			success: (response) => { if(response === "1") canContinue = true; else alert(`${lang['battery_not_exist_or_registered_with_other_system']} (S/N: ${battery16_serial})`); }
		});
	}

	// CONTINUE WITH STEP2
	if(canContinue) setupLiFePO_2();

}





function setupLiFePO_2()
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
				success: () => {}
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = 3000; // x1.00W
		 if(deviceModel == "h3" ) { maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxGridFeedInPower = 10000; }
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: `api.php?set=command&type=20736&entity=1&text2=${maxGridFeedInPower}`,
		error: () => { alert("E104. Please refresh the page!"); },
		success: (response) => { if(response != '1') return alert("E104. Please refresh the page!"); }
	});

	// Verify LiFePO Communication
	$.get({
		url: "api.php?set=command&type=24114&entity=0&text2=5320,5300",
		error: () => { alert("E016. Please refresh the page!"); },
		success: (response) => {
			if(response != '1') return alert("E017. Please refresh the page!");
			tempDatetime = "";
			setupLiFePO_2_check();
		}
	});
}





function setupLiFePO_2_check()
{
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E018. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E019. Please refresh the page!");
			response = response['InverterParameters'];
			if(tempDatetime == "") { tempDatetime = response["0"]["s1"]; setTimeout(setupLiFePO_2_check, 5000); return; }
			if(response["0"]["s1"] == tempDatetime) { setTimeout(setupLiFePO_2_check, 5000); return; }
			// Verify Battery Charging Voltage
			var chargingVoltage = response["32"]["s1"];
			console.log(chargingVoltage);
			if(chargingVoltage == "5320,5300") {
				$('#notif').removeClass('loading error success').addClass('error');
				$('#message').html(lang.lifepo_communication_problem).css('color', 'red');
				$('#btn_next').unbind().removeAttr('form').removeAttr('type').on('click', () => { setupLiFePO_2(); });
				isSettingParameters = false;
			} else {
				setupLiFePO_3();
			}
		}
	});
}





function setupLiFePO_3()
{
	let countBat = 0;
	if($('#lifepo_battery_1 ').val() != "") countBat++;
	if($('#lifepo_battery_2 ').val() != "") countBat++;
	if($('#lifepo_battery_3 ').val() != "") countBat++;
	if($('#lifepo_battery_4 ').val() != "") countBat++;
	if($('#lifepo_battery_5 ').val() != "") countBat++;
	if($('#lifepo_battery_6 ').val() != "") countBat++;
	if($('#lifepo_battery_7 ').val() != "") countBat++;
	if($('#lifepo_battery_8 ').val() != "") countBat++;
	if($('#lifepo_battery_9 ').val() != "") countBat++;
	if($('#lifepo_battery_10').val() != "") countBat++;
	if($('#lifepo_battery_11').val() != "") countBat++;
	if($('#lifepo_battery_12').val() != "") countBat++;
	if($('#lifepo_battery_13').val() != "") countBat++;
	if($('#lifepo_battery_14').val() != "") countBat++;
	if($('#lifepo_battery_15').val() != "") countBat++;
	if($('#lifepo_battery_16').val() != "") countBat++;
	systemModel = "batterX " + deviceModel + ($('#bx_system_type_w').is(':checked') ? "W" : "R") + "-" + (countBat * 3.5).toString().replace(".", ",");

	var tempData = {
		system_serial          : $('#bx_system             ').val(),
		device_serial          : $('#bx_device             ').val(),
		solar_wattPeak         : $('#solar_wattPeak        ').val(),
		solar_feedInLimitation : $('#solar_feedInLimitation').val(),
		solar_info             : $('#solar_info            ').val(),
		note                   : $('#installer_memo        ').val(),
		installation_date      : $('#installation_date     ').val(),
		battery_type           : 'lifepo',
		system_model           : systemModel
	};
	if($('#lifepo_battery_1 ').val() != "") tempData['battery1_serial' ] = $('#lifepo_battery_1' ).val();
	if($('#lifepo_battery_2 ').val() != "") tempData['battery2_serial' ] = $('#lifepo_battery_2' ).val();
	if($('#lifepo_battery_3 ').val() != "") tempData['battery3_serial' ] = $('#lifepo_battery_3' ).val();
	if($('#lifepo_battery_4 ').val() != "") tempData['battery4_serial' ] = $('#lifepo_battery_4' ).val();
	if($('#lifepo_battery_5 ').val() != "") tempData['battery5_serial' ] = $('#lifepo_battery_5' ).val();
	if($('#lifepo_battery_6 ').val() != "") tempData['battery6_serial' ] = $('#lifepo_battery_6' ).val();
	if($('#lifepo_battery_7 ').val() != "") tempData['battery7_serial' ] = $('#lifepo_battery_7' ).val();
	if($('#lifepo_battery_8 ').val() != "") tempData['battery8_serial' ] = $('#lifepo_battery_8' ).val();
	if($('#lifepo_battery_9 ').val() != "") tempData['battery9_serial' ] = $('#lifepo_battery_9' ).val();
	if($('#lifepo_battery_10').val() != "") tempData['battery10_serial'] = $('#lifepo_battery_10').val();
	if($('#lifepo_battery_11').val() != "") tempData['battery11_serial'] = $('#lifepo_battery_11').val();
	if($('#lifepo_battery_12').val() != "") tempData['battery12_serial'] = $('#lifepo_battery_12').val();
	if($('#lifepo_battery_13').val() != "") tempData['battery13_serial'] = $('#lifepo_battery_13').val();
	if($('#lifepo_battery_14').val() != "") tempData['battery14_serial'] = $('#lifepo_battery_14').val();
	if($('#lifepo_battery_15').val() != "") tempData['battery15_serial'] = $('#lifepo_battery_15').val();
	if($('#lifepo_battery_16').val() != "") tempData['battery16_serial'] = $('#lifepo_battery_16').val();

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != '1') return alert("E021. Please refresh the page!");
			setupLiFePO_4();
		}
	});
}





function setupLiFePO_4()
{
	var numberOfModules = 0;
	if($('#lifepo_battery_1 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_2 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_3 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_4 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_5 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_6 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_7 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_8 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_9 ').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_10').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_11').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_12').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_13').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_14').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_15').val() != "") numberOfModules += 1;
	if($('#lifepo_battery_16').val() != "") numberOfModules += 1;

	var maxChargingCurrent    = 2500; // x0.01A
	var maxGridFeedInPower    = 3000; // x1.00W
	var maxDischargingCurrent =  150; // x1.00A
		 if(deviceModel == "h3" ) { maxChargingCurrent =  2500; maxDischargingCurrent = 150; maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxChargingCurrent =  6000; maxDischargingCurrent = 150; maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxChargingCurrent = 10000; maxDischargingCurrent = 150; maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxChargingCurrent = 20000; maxDischargingCurrent = 300; maxGridFeedInPower = 10000; }

	newParameters['maxChargingCurrentAC'    ] = Math.min(numberOfModules * 37 * 100, maxChargingCurrent).toString();
	newParameters['chargingVoltage'         ] = '5320,5320';
	newParameters['dischargingVoltage'      ] = '4600,5000,4600,5000';
	newParameters['maxDischargingCurrent'   ] = Math.min(numberOfModules * 37, maxDischargingCurrent).toString();
	newParameters['batteryType'             ] = '1';
	newParameters['solarEnergyPriority'     ] = '1';
	newParameters['allowBatteryCharging'    ] = '1';
	newParameters['allowBatteryChargingAC'  ] = '0';
	newParameters['allowGridInjection'      ] = '1';
	newParameters['allowDischargingSolarOK' ] = '1';
	newParameters['allowDischargingSolarNOK'] = '1';
	newParameters['maxGridFeedInPower'      ] = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E021. Please refresh the page!");
			
			response = response['InverterParameters'];
			deviceDatetime = response['0']['s1'];
			
			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

			if(oldParameters['dischargingVoltage'].split(',')[2] == '4700') newParameters['dischargingVoltage'] = '4700,5000,4700,5000';

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	let retry = false;

	if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupLiFePO_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
	if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupLiFePO_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
	if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupLiFePO_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
	if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupLiFePO_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
	if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupLiFePO_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
	if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupLiFePO_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
	if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
	if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
	if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
	if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
	if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
	//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupLiFePO_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

	if(!retry) {
		$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
		$('#notif').removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");
}





function setupLiFePO_sendCommand(type, entity, text1, text2)
{
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: function() { alert("E022. Please refresh the page!") },
		success: function(response) {
			if(response != '1') return alert("E023. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupLiFePO_checkParameters, 5000);
		}
	});
}





function setupLiFePO_checkParameters()
{
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E024. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E025. Please refresh the page!");

			response = response['InverterParameters'];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			let retry = false;

			if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupLiFePO_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
			if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupLiFePO_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
			if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupLiFePO_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
			if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupLiFePO_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
			if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupLiFePO_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
			if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupLiFePO_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
			if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
			if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
			if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
			if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
			if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
			//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupLiFePO_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

			if(!retry) {
				$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
				$('#notif').removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else console.log("RETRYING, PLEASE WAIT !!!");

		}
	});
}






























// Setup for Carbon Batteries

function setupCarbon()
{
	var system_serial = $('#bx_system').val();
	var device_serial = $('#bx_device').val();

	var canContinue = true;

	// Check Inverter S/N
	if(canContinue) {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			async: false,
			data: {
				action       : "verify_device",
				serialnumber : device_serial,
				system       : system_serial
			},
			error: () => { alert("E011. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['inverter_registered_with_other_system']);
			}
		});
	}

	if(canContinue) setupCarbon_2();
}





function setupCarbon_2()
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
				success: () => {}
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = 3000; // x1.00W
		 if(deviceModel == "h3" ) { maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxGridFeedInPower = 10000; }
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: `api.php?set=command&type=20736&entity=1&text2=${maxGridFeedInPower}`,
		error: () => { alert("E104. Please refresh the page!"); },
		success: (response) => { if(response != '1') return alert("E104. Please refresh the page!"); }
	});

	setupCarbon_3();
}





function setupCarbon_3()
{
	var tempData = {
		system_serial          : $('#bx_device              ').val(),
		device_serial          : $('#bx_device              ').val(),
		solar_wattPeak         : $('#solar_wattPeak         ').val(),
		solar_feedInLimitation : $('#solar_feedInLimitation ').val(),
		solar_info             : $('#solar_info             ').val(),
		note                   : $('#installer_memo         ').val(),
		installation_date      : $('#installation_date      ').val(),
		battery_type           : 'carbon',
		battery_model          : $('#carbon_battery_model   ').val(),
		battery_strings        : $('#carbon_battery_strings ').val(),
		battery_capacity       : $('#carbon_battery_capacity').val().split(' ')[0]
	};

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != '1') return alert("E021. Please refresh the page!");
			setupCarbon_4();
		}
	});
}





function setupCarbon_4()
{
	var batteryCapacity = parseInt($('#carbon_battery_capacity').val().split(' ')[0]);

	var maxChargingCurrent    = 2500; // x0.01A
	var maxGridFeedInPower    = 3000; // x1.00W
	var maxDischargingCurrent =  150; // x1.00A
		 if(deviceModel == "h3" ) { maxChargingCurrent =  2500; maxDischargingCurrent = 150; maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxChargingCurrent =  6000; maxDischargingCurrent = 150; maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxChargingCurrent = 10000; maxDischargingCurrent = 150; maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxChargingCurrent = 20000; maxDischargingCurrent = 300; maxGridFeedInPower = 10000; }

	newParameters['maxChargingCurrent'      ] = Math.min(Math.round(batteryCapacity * 0.15 / 48) * 100, maxChargingCurrent).toString();
	newParameters['maxChargingCurrentAC'    ] = Math.min(Math.round(batteryCapacity * 0.15 / 48) * 100, maxChargingCurrent).toString();
	newParameters['chargingVoltage'         ] = '5600,5400';
	newParameters['dischargingVoltage'      ] = '4680,5200,4300,4800';
	newParameters['maxDischargingCurrent'   ] = Math.min(Math.round(batteryCapacity * 0.20 / 48), maxDischargingCurrent).toString();
	newParameters['batteryType'             ] = '0';
	newParameters['solarEnergyPriority'     ] = '1';
	newParameters['allowBatteryCharging'    ] = '1';
	newParameters['allowBatteryChargingAC'  ] = '0';
	newParameters['allowGridInjection'      ] = '1';
	newParameters['allowDischargingSolarOK' ] = '1';
	newParameters['allowDischargingSolarNOK'] = '1';
	newParameters['maxGridFeedInPower'      ] = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E021. Please refresh the page!");
			
			response = response['InverterParameters'];
			deviceDatetime = response['0']['s1'];
			
			oldParameters['maxChargingCurrent'      ] = response['30']['s1'];
			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	let retry = false;

	if(newParameters['maxChargingCurrent'      ] != oldParameters['maxChargingCurrent'      ]) { retry = true; setupCarbon_sendCommand(24112, 0, "",        newParameters['maxChargingCurrent'      ]); }
	if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupCarbon_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
	if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupCarbon_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
	if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupCarbon_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
	if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupCarbon_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
	if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupCarbon_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
	if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupCarbon_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
	if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
	if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
	if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
	if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
	if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupCarbon_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
	//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupCarbon_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

	if(!retry) {
		$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
		$('#notif').removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");
}





function setupCarbon_sendCommand(type, entity, text1, text2)
{
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: function() { alert("E022. Please refresh the page!") },
		success: function(response) {
			if(response != '1') return alert("E023. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupCarbon_checkParameters, 5000);
		}
	});
}





function setupCarbon_checkParameters()
{
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E024. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E025. Please refresh the page!");

			response = response['InverterParameters'];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters['maxChargingCurrent'      ] = response['30']['s1'];
			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			let retry = false;

			if(newParameters['maxChargingCurrent'      ] != oldParameters['maxChargingCurrent'      ]) { retry = true; setupCarbon_sendCommand(24112, 0, "",        newParameters['maxChargingCurrent'      ]); }
			if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupCarbon_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
			if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupCarbon_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
			if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupCarbon_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
			if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupCarbon_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
			if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupCarbon_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
			if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupCarbon_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
			if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
			if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
			if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
			if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
			if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupCarbon_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
			//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupCarbon_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

			if(!retry) {
				$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
				$('#notif').removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else console.log("RETRYING, PLEASE WAIT !!!");

		}
	});
}






























// Setup for Other Batteries

function setupOther()
{
	var system_serial = $('#bx_system').val();
	var device_serial = $('#bx_device').val();

	var canContinue = true;

	// Check Inverter S/N
	if(canContinue) {
		canContinue = false;
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			async: false,
			data: {
				action       : "verify_device",
				serialnumber : device_serial,
				system       : system_serial
			},
			error: () => { alert("E011. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response === "1") canContinue = true;
				else alert(lang['inverter_registered_with_other_system']);
			}
		});
	}

	if(canContinue) setupOther_2();
}





function setupOther_2()
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
				success: () => {}
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = 3000; // x1.00W
		 if(deviceModel == "h3" ) { maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxGridFeedInPower = 10000; }
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: `api.php?set=command&type=20736&entity=1&text2=${maxGridFeedInPower}`,
		error: () => { alert("E104. Please refresh the page!"); },
		success: (response) => { if(response != '1') return alert("E104. Please refresh the page!"); }
	});

	setupOther_3();
}





function setupOther_3()
{
	var tempData = {
		system_serial          : $('#bx_device              ').val(),
		device_serial          : $('#bx_device              ').val(),
		solar_wattPeak         : $('#solar_wattPeak         ').val(),
		solar_feedInLimitation : $('#solar_feedInLimitation ').val(),
		solar_info             : $('#solar_info             ').val(),
		note                   : $('#installer_memo         ').val(),
		installation_date      : $('#installation_date      ').val(),
		battery_type           : 'other',
		battery_capacity       : $('#other_battery_capacity').val()
	};

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != '1') return alert("E021. Please refresh the page!");
			setupOther_4();
		}
	});
}






function setupOther_4()
{
	var custom_maxChargingCurrent       =                Math.round(parseFloat($('#other_battery_maxChargingCurrent      ').val()) *  1) * 100 ;
	var custom_maxDischargingCurrent    =                Math.round(parseFloat($('#other_battery_maxDischargingCurrent   ').val()) *  1) *   1 ;
	var custom_bulkChargingVoltage      = Math.min(6000, Math.round(parseFloat($('#other_battery_bulkChargingVoltage     ').val()) * 10) *  10);
	var custom_floatChargingVoltage     = Math.min(6000, Math.round(parseFloat($('#other_battery_floatChargingVoltage    ').val()) * 10) *  10);
	var custom_cutoffVoltage            = Math.min(6000, Math.round(parseFloat($('#other_battery_cutoffVoltage           ').val()) * 10) *  10);
	var custom_redischargeVoltage       = Math.min(6000, Math.round(parseFloat($('#other_battery_redischargeVoltage      ').val()) * 10) *  10);
	var custom_cutoffVoltageHybrid      = Math.min(6000, Math.round(parseFloat($('#other_battery_cutoffVoltageHybrid     ').val()) * 10) *  10);
	var custom_redischargeVoltageHybrid = Math.min(6000, Math.round(parseFloat($('#other_battery_redischargeVoltageHybrid').val()) * 10) *  10);

	var maxChargingCurrent    = 2500; // x0.01A
	var maxGridFeedInPower    = 3000; // x1.00W
	var maxDischargingCurrent =  150; // x1.00A
		 if(deviceModel == "h3" ) { maxChargingCurrent =  2500; maxDischargingCurrent = 150; maxGridFeedInPower =  3000; }
	else if(deviceModel == "h5" ) { maxChargingCurrent =  6000; maxDischargingCurrent = 150; maxGridFeedInPower =  5000; }
	else if(deviceModel == "h5e") { maxChargingCurrent = 10000; maxDischargingCurrent = 150; maxGridFeedInPower =  5500; }
	else if(deviceModel == "h10") { maxChargingCurrent = 20000; maxDischargingCurrent = 300; maxGridFeedInPower = 10000; }

	newParameters['maxChargingCurrent'      ] = Math.min(custom_maxChargingCurrent, maxChargingCurrent).toString();
	newParameters['maxChargingCurrentAC'    ] = Math.min(custom_maxChargingCurrent, maxChargingCurrent).toString();
	newParameters['chargingVoltage'         ] = `${custom_bulkChargingVoltage},${custom_floatChargingVoltage}`;
	newParameters['dischargingVoltage'      ] = `${custom_cutoffVoltageHybrid},${custom_redischargeVoltageHybrid},${custom_cutoffVoltage},${custom_redischargeVoltage}`;
	newParameters['maxDischargingCurrent'   ] = Math.min(custom_maxDischargingCurrent, maxDischargingCurrent).toString();
	newParameters['batteryType'             ] = '0';
	newParameters['solarEnergyPriority'     ] = '1';
	newParameters['allowBatteryCharging'    ] = '1';
	newParameters['allowBatteryChargingAC'  ] = '0';
	newParameters['allowGridInjection'      ] = '1';
	newParameters['allowDischargingSolarOK' ] = '1';
	newParameters['allowDischargingSolarNOK'] = '1';
	newParameters['maxGridFeedInPower'      ] = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower)).toString();

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E021. Please refresh the page!");
			
			response = response['InverterParameters'];
			deviceDatetime = response['0']['s1'];
			
			oldParameters['maxChargingCurrent'      ] = response['30']['s1'];
			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	let retry = false;

	if(newParameters['maxChargingCurrent'      ] != oldParameters['maxChargingCurrent'      ]) { retry = true; setupOther_sendCommand(24112, 0, "",        newParameters['maxChargingCurrent'      ]); }
	if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupOther_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
	if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupOther_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
	if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupOther_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
	if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupOther_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
	if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupOther_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
	if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupOther_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
	if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupOther_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
	if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupOther_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
	if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupOther_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
	if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupOther_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
	if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupOther_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
	//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupOther_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

	if(!retry) {
		$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
		$('#notif').removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");
}





function setupOther_sendCommand(type, entity, text1, text2)
{
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: function() { alert("E022. Please refresh the page!") },
		success: function(response) {
			if(response != '1') return alert("E023. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupOther_checkParameters, 5000);
		}
	});
}





function setupOther_checkParameters()
{
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E024. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
				return alert("E025. Please refresh the page!");

			response = response['InverterParameters'];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters['maxChargingCurrent'      ] = response['30']['s1'];
			oldParameters['maxChargingCurrentAC'    ] = response['31']['s1'];
			oldParameters['chargingVoltage'         ] = response['32']['s1'];
			oldParameters['dischargingVoltage'      ] = response['33']['s1'];
			oldParameters['maxDischargingCurrent'   ] = response['34']['s1'];
			oldParameters['batteryType'             ] = response[ '5']['s1'];
			oldParameters['solarEnergyPriority'     ] = response[ '6']['s1'];
			oldParameters['allowBatteryCharging'    ] = response[ '2']['s1'].split(',')[0];
			oldParameters['allowBatteryChargingAC'  ] = response[ '2']['s1'].split(',')[1];
			oldParameters['allowGridInjection'      ] = response[ '2']['s1'].split(',')[2];
			oldParameters['allowDischargingSolarOK' ] = response[ '2']['s1'].split(',')[3];
			oldParameters['allowDischargingSolarNOK'] = response[ '2']['s1'].split(',')[4];
			oldParameters['maxGridFeedInPower'      ] = response['15']['s1'];

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			let retry = false;

			if(newParameters['maxChargingCurrent'      ] != oldParameters['maxChargingCurrent'      ]) { retry = true; setupOther_sendCommand(24112, 0, "",        newParameters['maxChargingCurrent'      ]); }
			if(newParameters['maxChargingCurrentAC'    ] != oldParameters['maxChargingCurrentAC'    ]) { retry = true; setupOther_sendCommand(24113, 0, "",        newParameters['maxChargingCurrentAC'    ]); }
			if(newParameters['chargingVoltage'         ] != oldParameters['chargingVoltage'         ]) { retry = true; setupOther_sendCommand(24114, 0, "",        newParameters['chargingVoltage'         ]); }
			if(newParameters['dischargingVoltage'      ] != oldParameters['dischargingVoltage'      ]) { retry = true; setupOther_sendCommand(24115, 0, "",        newParameters['dischargingVoltage'      ]); }
			if(newParameters['maxDischargingCurrent'   ] != oldParameters['maxDischargingCurrent'   ]) { retry = true; setupOther_sendCommand(24116, 0, "",        newParameters['maxDischargingCurrent'   ]); }
			if(newParameters['batteryType'             ] != oldParameters['batteryType'             ]) { retry = true; setupOther_sendCommand(24069, 0, "",        newParameters['batteryType'             ]); }
			if(newParameters['solarEnergyPriority'     ] != oldParameters['solarEnergyPriority'     ]) { retry = true; setupOther_sendCommand(24070, 0, "",        newParameters['solarEnergyPriority'     ]); }
			if(newParameters['allowBatteryCharging'    ] != oldParameters['allowBatteryCharging'    ]) { retry = true; setupOther_sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging'    ]); }
			if(newParameters['allowBatteryChargingAC'  ] != oldParameters['allowBatteryChargingAC'  ]) { retry = true; setupOther_sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC'  ]); }
			if(newParameters['allowGridInjection'      ] != oldParameters['allowGridInjection'      ]) { retry = true; setupOther_sendCommand(24066, 0, "", "C," + newParameters['allowGridInjection'      ]); }
			if(newParameters['allowDischargingSolarOK' ] != oldParameters['allowDischargingSolarOK' ]) { retry = true; setupOther_sendCommand(24066, 0, "", "D," + newParameters['allowDischargingSolarOK' ]); }
			if(newParameters['allowDischargingSolarNOK'] != oldParameters['allowDischargingSolarNOK']) { retry = true; setupOther_sendCommand(24066, 0, "", "E," + newParameters['allowDischargingSolarNOK']); }
			//if(newParameters['maxGridFeedInPower'      ] != oldParameters['maxGridFeedInPower'      ]) { retry = true; setupOther_sendCommand(24085, 0, "",        newParameters['maxGridFeedInPower'      ]); }

			if(!retry) {
				$('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
				$('#notif').removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else console.log("RETRYING, PLEASE WAIT !!!");

		}
	});
}
