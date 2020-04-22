$progress.trigger('step', 6);










var energyMeter_firstRun = true;
var skipEnergyMeteryTest = false;

var batteryCharging_firstRun = true;
var batteryCharging_count = 0; // run 5 times (5sec delay), then finish
var batteryCharging_datetime = "";
var batteryMinLevel = 20;
var batteryMaxLevel = 95;

var battery_waitCounter = 0;

var upsMode_firstRun = true;
var upsMode_count = 0; // run 5 times (5sec delay), then finish




















function scrollToBottom() { $('#log').scrollTop($('#log').prop("scrollHeight")); }




















function showLoading_energyMeter() {
	$('#testEnergyMeter .notif').removeClass('loading error success').addClass('loading');
	if(energyMeter_firstRun) $('#log').append(`<p class="head"><b>${lang['energy_meter']}</b></p>`);
	$('#log').append(`<p>${lang['performing_test']}</p>`);
	scrollToBottom();
}

function showLoading_batteryCharging() {
	$('#testBatteryCharging .notif').removeClass('loading error success').addClass('loading');
	if(batteryCharging_firstRun) $('#log').append(`<p class="head"><b>${lang['battery_charging']}</b></p>`);
	$('#log').append(`<p>${lang['verifying_battery_soc']}</p>`);
	scrollToBottom();
}

function showLoading_upsMode() {
	$('#testUpsMode .notif').removeClass('loading error success').addClass('loading');
	if(upsMode_firstRun) $('#log').append(`<p class="head"><b>${lang['ups_mode']}</b></p>`);
	$('#log').append(`<p>${lang['check_output_active']}</p>`);
	scrollToBottom();
}




















function checkWarnings() {
	$.get({
		url: "api.php?get=warnings",
		error: () => { alert("E051. Please refresh the page!"); },
		success: (response) => {
			if(!response || !Array.isArray(response)) return alert("E052. Please refresh the page!");
			var warnings = response[0][1];
			// Warning - AC Phase Dislocation
			if(warnings.includes(16642)) {
				$('.container').hide();
				$('#warningsModal').modal({ backdrop: 'static', show: true }).find('.modal-body p').text(lang['warning_16642']);
			}
			// No Warnings - Start Testing
			else {
				testEnergyMeter();
			}
		}
	});
}




















function testEnergyMeter()
{
	showLoading_energyMeter();

	// Perform Test
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E001. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response != "object") return alert("E002. Please refresh the page!");
			setTimeout(() => {
				$('#testEnergyMeter .notif').removeClass('loading error success');
				if(response.hasOwnProperty('2913') && response['2913'].hasOwnProperty('0')) {
					$('#testEnergyMeter .notif').addClass('success');
					$('#log p:last-child').html(`✓ ${lang['performing_test']}`);
					setTimeout(testBatteryCharging, 2500);
				} else {
					$('#testEnergyMeter .notif').addClass('error');
					$('#log p:last-child').html(`✗ ${lang['performing_test']}`);
					if(skipEnergyMeteryTest) {
						if(confirm("Continue without Energy Meter?")) {
							setTimeout(testBatteryCharging, 2500);
						} else {
							skipEnergyMeteryTest = false;
							setTimeout(testEnergyMeter, 5000);
						}
					} else {
						setTimeout(testEnergyMeter, 5000);
					}
				}
			}, 2500);
			energyMeter_firstRun = false;
		}
	});
}




















function testBatteryCharging()
{
	if(noBattery) return finishStep(); // IF battery_type == other AND battery_capacity == 0

	showLoading_batteryCharging();
	batteryCharging_firstRun = false;

	// Check Battery Level
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E101. Please refresh the page!"); },
		success: (response) => {
			
			if(!response || typeof response != "object")
				return alert("E102. Please refresh the page!");
			
			if(!response.hasOwnProperty('1074') || !response['1074'].hasOwnProperty('1'))
				return alert("E103. Please refresh the page!");
			
			var batteryLevel = parseInt(response['1074']['1']);
			
			if(batteryLevel < batteryMinLevel)
			{
				// Charge Battery
				$('#log p:last-child').html(`✗ ${lang['verifying_battery_soc']}`);
				$('#log').append(`<p>${lang['charging_battery_to']} ${batteryMinLevel}%</p>`);
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=3&text2=1",
					error: () => { alert("E104. Please refresh the page!"); },
					success: (response) => {
						if(response != '1') return alert("E105. Please refresh the page!");
						batteryCharging_count = 0;
						battery_waitCounter = 25;
						setTimeout(testBatteryCharging_waitUntilCharged, 15000);
					}
				});
			}
			else if(batteryLevel > batteryMaxLevel)
			{
				// Discharge Battery
				$('#log p:last-child').html(`✗ ${lang['verifying_battery_soc']}`);
				$('#log').append(`<p>${lang['discharging_battery_to']} ${batteryMaxLevel}%</p>`);
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=5&text2=1",
					error: () => { alert("E106. Please refresh the page!"); },
					success: (response) => {
						if(response != '1') return alert("E107. Please refresh the page!");
						batteryCharging_count = 0;
						battery_waitCounter = 25;
						setTimeout(testBatteryCharging_waitUntilDischarged, 15000);
					}
				});
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=3&text2=0",
					error: () => { alert("E108. Please refresh the page!"); },
					success: (response) => { if(response != '1') alert("E109. Please refresh the page!"); }
				});
			}
			else
			{
				// Continue Testing
				$('#log p:last-child').html(`✓ ${lang['verifying_battery_soc']}`);
				$('#log').append(`<p>${lang['enable_ac_charging']}</p>`);
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=3&text2=1",
					error: () => { alert("E110. Please refresh the page!"); },
					success: (response) => {
						if(response != '1') return alert("E111. Please refresh the page!");
						batteryCharging_count = 0;
						setTimeout(testBatteryCharging_waitUntilSet, 5000);
					}
				});
			}
		}
	});
}





function testBatteryCharging_waitUntilCharged()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E112. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object") return alert("E113. Please refresh the page!");
			if(!response.hasOwnProperty('1121') || !response['1121'].hasOwnProperty('1')) return alert("E114. Please refresh the page!");
			if(!response.hasOwnProperty('1074') || !response['1074'].hasOwnProperty('1')) return alert("E115. Please refresh the page!");
			if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('3')) return alert("E116. Please refresh the page!");

			if(response['2465']['3'] != 11) return alert("E117. Please refresh the page!");

			if(battery_waitCounter < 1 && response['1074']['1'] >= batteryMinLevel) {
				$('#log p:last-child').html(`✓ ${lang['charging_battery_to']} ${batteryMinLevel}%`);
				testBatteryCharging();
			} else {
				battery_waitCounter -= 1;
				$('#log p:last-child').html(`${lang['charging_battery_to']} ${batteryMinLevel}%<br>${lang['current_status']}: ${response['1074']['1']}% / ${response['1121']['1']}W`);
				setTimeout(testBatteryCharging_waitUntilCharged, 5000);
			}

		}
	});
}





function testBatteryCharging_waitUntilDischarged()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E118. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object") return alert("E119. Please refresh the page!");
			if(!response.hasOwnProperty('1121') || !response['1121'].hasOwnProperty('1')) return alert("E120. Please refresh the page!");
			if(!response.hasOwnProperty('1074') || !response['1074'].hasOwnProperty('1')) return alert("E121. Please refresh the page!");
			if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('5')) return alert("E122. Please refresh the page!");
			if(!response.hasOwnProperty('1634') || !response['1634'].hasOwnProperty('0')) return alert("E123. Please refresh the page!");

			if(response['2465']['5'] != 11) return alert("E123. Please refresh the page!");

			if(battery_waitCounter < 1 && response['1074']['1'] <= batteryMaxLevel) {
				$('#log p:last-child').html(`✓ ${lang['discharging_battery_to']} ${batteryMaxLevel}%`);
				$('#testBatteryCharging span span').html("");
				testBatteryCharging();
			} else {
				battery_waitCounter -= 1;
				$('#log p:last-child').html(`${lang['discharging_battery_to']} ${batteryMaxLevel}%<br>${lang['current_status']}: ${response['1074']['1']}% / ${response['1121']['1']}W`);
				$('#testBatteryCharging span span').html(parseInt(response['1634']['0']) > 100 ? lang['please_turn_solar_off'] : "");
				setTimeout(testBatteryCharging_waitUntilDischarged, 5000);
			}

		}
	});
}





function testBatteryCharging_waitUntilSet()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E009. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response != "object")
				return alert("E010. Please refresh the page!");
			if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('3'))
				return alert("E011. Please refresh the page!");
			// Check If Enabled
			if(response['2465']['3'] != 11)
				setTimeout(testBatteryCharging_waitUntilSet, 5000);
			else
				setTimeout(() => {
					$('#log p:last-child').html(`✓ ${lang['enable_ac_charging']}`);
					$('#log').append(`<p>${lang['performing_test']} (1 / 5)</p>`);
					testBatteryCharging_test();
				}, 15000); // Wait 15 seconds
		}
	});
}

function testBatteryCharging_test()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E011. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('1121') || !response['1121'].hasOwnProperty('1'))
				return alert("E012. Please refresh the page!");

			var batteryPower = parseInt(response['1121']['1']);
			batteryCharging_count += 1;
			$('#log p:last-child').html(`${lang['performing_test']} (${batteryCharging_count} / 5)`);

			if(batteryPower > 100) { // Charging with over 100W
				if(batteryCharging_count < 5)
					setTimeout(testBatteryCharging_test, 5000);
				else {
					$('#log p:last-child').html(`✓ ${lang['performing_test']} (${batteryCharging_count} / 5)`);
					$.get({
						url: "api.php?set=command&type=20738&entity=0&text1=3&text2=0",
						error: () => { alert("E013. Please refresh the page!"); },
						success: (response) => {
							if(response != '1') return alert("E014. Please refresh the page!");
							$('#log').append(`<p>${lang['disable_ac_charging']}</p>`);
							scrollToBottom();
							testBatteryCharging_waitUntilReset();
						}
					});
					$.get({
						url: "api.php?set=command&type=20738&entity=0&text1=5&text2=0",
						error: () => { alert("REFRESH PAGE!!!"); },
						success: (response) => { if(response != '1') alert("E014. Please refresh the page!"); }
					});
				}
			} else {
				$("#testBatteryCharging .notif").removeClass('loading error success').addClass('error');
				$('#log p:last-child').html(`✗ ${lang['performing_test']} (${batteryCharging_count} / 5)`);
				setTimeout(testBatteryCharging, 5000);
			}

		}
	});
}

function testBatteryCharging_waitUntilReset()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E017. Please refresh the page!"); },
		success: (response) => {
			if(!response || typeof response != "object")
				return alert("E018. Please refresh the page!");
			if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('3'))
				return alert("E019. Please refresh the page!");
				if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('5'))
					return alert("E019. Please refresh the page!");
			// Check If Disabled
			if(response['2465']['3'] != 10 && response['2465']['5'] != 10)
				setTimeout(testBatteryCharging_waitUntilReset, 5000);
			else {
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=3&text2=2",
					error: () => { alert("E020. Please refresh the page!"); },
					success: (response) => {
						if(response != '1') return alert("E021. Please refresh the page!");
						$("#testBatteryCharging .notif").removeClass('loading error success').addClass('success');
						$('#log p:last-child').html(`✓ ${lang['disable_ac_charging']}`);
						setTimeout(testUpsMode, 2500);
					}
				});
				$.get({
					url: "api.php?set=command&type=20738&entity=0&text1=5&text2=2",
					error: () => { alert("REFRESH PAGE!!!"); },
					success: (response) => { if(response != '1') alert("E014. Please refresh the page!"); }
				});
			}
		}
	});
}




















function testUpsMode()
{
	showLoading_upsMode();

	// Check Output Voltage
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E038. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('1297') || !response['1297'].hasOwnProperty('1'))
				return alert("E039. Please refresh the page!");

			let voltage1 = undefined;
			let voltage2 = undefined;
			let voltage3 = undefined;

			if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) voltage1 = response['1297']['1'];
			if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1')) voltage2 = response['1298']['1'];
			if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1')) voltage3 = response['1299']['1'];

			outputIsActive = undefined;

			if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined)
				outputIsActive = (voltage1 > 10000);
			else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				outputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E040. Please refresh the page!");

			if(outputIsActive == true) {
				// CONTINUE WITH TEST
				$('#log p:last-child').html(`✓ ${lang['check_output_active']}`);
				$('#log').append(`<p>${lang['turn_input_off']}</p>`);
				scrollToBottom();
				$('#testUpsMode span span').html(lang['please_turn_input_off']);
				setTimeout(testUpsMode_waitingForInput, 5000);
			} else if(outputIsActive != undefined) {
				// SHOW ERROR
				$('#log p:last-child').html(`✗ ${lang['check_output_active']}`);
				$('#testUpsMode span span').html(lang['please_turn_output_on']);
				setTimeout(() => { testUpsMode(); }, 5000);
			}

		}
	});

	upsMode_firstRun = false;
}

function testUpsMode_waitingForInput()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E041. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('273') || !response['273'].hasOwnProperty('1') || !response.hasOwnProperty('1634') || !response['1634'].hasOwnProperty('0'))
				return alert("E042. Please refresh the page!");

			let voltage1 = undefined;
			let voltage2 = undefined;
			let voltage3 = undefined;
			let solPower = undefined;

			if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) voltage1 = response['273']['1'];
			if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1')) voltage2 = response['274']['1'];
			if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1')) voltage3 = response['275']['1'];
			solPower = response['1634']['0'];

			inputIsActive = undefined;
			solarIsActive = (solPower > 1);

			if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined)
				inputIsActive = (voltage1 > 10000);
			else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				inputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E043. Please refresh the page!");

			if(inputIsActive == false && solarIsActive == false) {
				// CONTINUE WITH TEST
				$('#log p:last-child').html(`✓ ${lang['turn_input_off']}`);
				$('#log').append(`<p>${lang['performing_test']} (1 / 5)</p>`);
				scrollToBottom();
				$('#testUpsMode span span').html("");
				setTimeout(testUpsMode_test, 5000);
			} else if(inputIsActive != undefined && solarIsActive != undefined) {
				// RETRY
				setTimeout(testUpsMode_waitingForInput, 5000);
			}

		}
	});
}

function testUpsMode_test()
{
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E044. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('1297') || !response['1297'].hasOwnProperty('1'))
				return alert("E045. Please refresh the page!");

			upsMode_count += 1;
			$('#log p:last-child').html(`${lang['performing_test']} (${upsMode_count} / 5)`);

			let voltage1 = undefined;
			let voltage2 = undefined;
			let voltage3 = undefined;

			if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) voltage1 = response['1297']['1'];
			if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1')) voltage2 = response['1298']['1'];
			if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1')) voltage3 = response['1299']['1'];

			outputIsActive = undefined;

			if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined)
				outputIsActive = (voltage1 > 10000);
			else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				outputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E046. Please refresh the page!");

			if(outputIsActive == true) {
				if(upsMode_count < 5)
					setTimeout(testUpsMode_test, 5000);
				else {
					$('#log p:last-child').html(`✓ ${lang['performing_test']} (${upsMode_count} / 5)`);
					testUpsMode_finish();
				}
			} else if(outputIsActive != undefined) {
				$("#testUpsMode .notif").removeClass('loading error success').addClass('error');
				$('#log p:last-child').html(`✗ ${lang['performing_test']} (${upsMode_count} / 5)`);
				scrollToBottom();
			}

		}
	});
}

function testUpsMode_finish()
{
	// Check Input Voltage
	$.get({
		url: "api.php?get=currentstate",
		error: () => { alert("E047. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty('273') || !response['273'].hasOwnProperty('1'))
				return alert("E048. Please refresh the page!");

			let voltage1 = undefined;
			let voltage2 = undefined;
			let voltage3 = undefined;

			if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) voltage1 = response['273']['1'];
			if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1')) voltage2 = response['274']['1'];
			if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1')) voltage3 = response['275']['1'];

			inputIsActive = undefined;

			if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined)
				inputIsActive = (voltage1 > 10000);
			else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
				inputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
			else alert("E049. Please refresh the page!");

			if(inputIsActive == true) {
				// FINISH STEP
				$("#testUpsMode .notif").removeClass('loading error success').addClass('success');
				$("#testUpsMode span span").html("");
				finishStep();
			} else if(inputIsActive != undefined) {
				// RETRY
				$('#testUpsMode span span').html(lang['please_turn_input_on']);
				setTimeout(testUpsMode_finish, 5000);
			}

		}
	});
}




















// Finish Step

function finishStep()
{
	setTimeout(() => { $('#btn_next').attr('disabled', false); }, 1000);
	$('#btn_next').on('click', () => { window.location.href = "accept_terms.php"; });
}




















// Begin Testing

checkWarnings();
