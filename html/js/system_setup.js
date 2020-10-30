$progress.trigger("step", 5);





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Define Variables
*/

function isLiFePO() { return $("#bx_battery_type_0").is(":checked"); }
function isCarbon() { return $("#bx_battery_type_1").is(":checked"); }
function isOther()  { return $("#bx_battery_type_9").is(":checked"); }

var systemApikey   = apikey;
var systemModel    = "";
var systemSerial   = "";
var systemType     = "";
var deviceModel    = "";
var deviceDatetime = "";

var newParameters  = {};
var oldParameters  = {};

var tempDatetime   = "";

var isAlreadyRegistered = false;
var isSettingParameters = false;
var checkParametersInterval;
var checkParametersCounter;





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Battery Type Change
*/

$("input[name=bx_battery_type]").on("change", function() {

	// SET Other
	if(this.value == "9") {
		$("#battery_section_0").hide();
		$("#battery_section_1").hide();
		$("#battery_section_9").show();
		$("#system_type").hide();
		$("#bx_system").val($("#bx_device").val());
		$("#bx_system_type_w").prop("checked", true);
		// Load Inverter Parameters
		$.get({
			url: "api.php?get=settings",
			error: () => { alert("E001. Please refresh the page!") },
			success: (response) => {
				if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
					return alert("E002. Please refresh the page!");
				response = response["InverterParameters"];
				// Show Inverter Parameters
				if(response.hasOwnProperty("30"))
					$("#other_battery_maxChargingCurrent      ").val(parseInt(response["30"]["s1"]) / 100);
				if(response.hasOwnProperty("34"))
					$("#other_battery_maxDischargingCurrent   ").val(parseInt(response["34"]["s1"]));
				if(response.hasOwnProperty("32")) {
					$("#other_battery_bulkChargingVoltage     ").val(parseInt(response["32"]["s1"].split(",")[0]) / 100);
					$("#other_battery_floatChargingVoltage    ").val(parseInt(response["32"]["s1"].split(",")[1]) / 100);
				}
				if(response.hasOwnProperty("33")) {
					$("#other_battery_cutoffVoltageHybrid     ").val(parseInt(response["33"]["s1"].split(",")[0]) / 100);
					$("#other_battery_redischargeVoltageHybrid").val(parseInt(response["33"]["s1"].split(",")[1]) / 100);
					$("#other_battery_cutoffVoltage           ").val(parseInt(response["33"]["s1"].split(",")[2]) / 100);
					$("#other_battery_redischargeVoltage      ").val(parseInt(response["33"]["s1"].split(",")[3]) / 100);
				}
			}
		});
	}
	// SET Carbon
	else if(this.value == "1") {
		$("#battery_section_0").hide();
		$("#battery_section_1").show();
		$("#battery_section_9").hide();
		$("#system_type").hide();
		$("#bx_system").val($("#bx_device").val());
		$("#bx_system_type_w").prop("checked", true);
	}
	// SET LiFePO
	else {
		$("#battery_section_0").show();
		$("#battery_section_1").hide();
		$("#battery_section_9").hide();
		$("#system_type").show();
		$("#bx_system").val(systemSerial);
		if(systemType == "wall")
			$("#bx_system_type_w").prop("checked", true);
		else
			$("#bx_system_type_r").prop("checked", true);
	}

});





/*
	Carbon Batteries OnChange Listener
*/

$("#carbon_battery_model, #carbon_battery_strings").on("change", function() {

	var batteryModel    = $("#carbon_battery_model  ").val();
	var batteryStrings  = $("#carbon_battery_strings").val();
	var batteryCapacity = 0;

	if(batteryModel == "LC+700")
		batteryCapacity = 4 * 700 * parseInt(batteryStrings);
	else if(batteryModel == "LC+1300")
		batteryCapacity = 4 * 1300 * parseInt(batteryStrings);
	else if(batteryModel == "LC+2V500")
		batteryCapacity = 24 * 2 * 500 * parseInt(batteryStrings);

	$("#carbon_battery_capacity").val(`${batteryCapacity} Wh`);

});





/*
	Show More Battery Modules (16)
*/

$("#btnShowAllModules").on("click", function() {
	$("#listAllModules").removeClass("d-none");
	$(this).addClass("d-none");
});





/*
	VDE4105 Mode Change
*/

$("#vde4105_mode").on("change", function() {
	$("#vde4105_mode1, #vde4105_mode2, #vde4105_mode3").addClass("d-none");
	if($(this).val() == 1) $("#vde4105_mode1").removeClass("d-none");
	if($(this).val() == 2) $("#vde4105_mode2").removeClass("d-none");
	if($(this).val() == 3) $("#vde4105_mode3").removeClass("d-none");
});
$("#vde4105_mode").trigger("change");

$("#vde4105_mode3_v1, #vde4105_mode3_v2, #vde4105_mode3_v3, #vde4105_mode3_v4").on("input", function() {
	$("#svg_vde4105_mode3 #svg_vde4105_mode3_v1_value").text(($("#vde4105_mode3_v1").val() == "" ? $("#vde4105_mode3_v1").attr("placeholder") : $("#vde4105_mode3_v1").val()) + "%");
	$("#svg_vde4105_mode3 #svg_vde4105_mode3_v2_value").text(($("#vde4105_mode3_v2").val() == "" ? $("#vde4105_mode3_v2").attr("placeholder") : $("#vde4105_mode3_v2").val()) + "%");
	$("#svg_vde4105_mode3 #svg_vde4105_mode3_v3_value").text(($("#vde4105_mode3_v3").val() == "" ? $("#vde4105_mode3_v3").attr("placeholder") : $("#vde4105_mode3_v3").val()) + "%");
	$("#svg_vde4105_mode3 #svg_vde4105_mode3_v4_value").text(($("#vde4105_mode3_v4").val() == "" ? $("#vde4105_mode3_v4").attr("placeholder") : $("#vde4105_mode3_v4").val()) + "%");
});





/*
	Activate Submit Button
*/

setInterval(() => {

	if(isLiFePO()) {
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
	} else if(isCarbon()) {
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
	} else { // isOther()
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





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Begin Process
*/

step1();





/*
	Check If Apikey Correct
*/

function step1() {
	if(!apikey || apikey.length != 40)
		return alert("E003. Please refresh the page!");
	step2();
}





/*
	Get Installation Info
*/

function step2() {

	$.post({
		url: "https://api.batterx.io/v3/install_hs.php",
		data: {
			action: "get_installation_info",
			apikey: systemApikey
		},
		error: () => { alert("E004. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(json) {
				// Set System Info
				if(json.hasOwnProperty("system")) {
					if(json.system.hasOwnProperty("serialnumber")) {
						$("#bx_system").val(json.system.serialnumber).attr("disabled", true);
						systemSerial = json.system.serialnumber;
					}
					if(json.system.hasOwnProperty("model")) {
						if(json.system.model.includes("W"))
							$("#bx_system_type_w").click();
						else
							$("#bx_system_type_r").click();
						$("#bx_system_type_w").attr("disabled", true);
						$("#bx_system_type_r").attr("disabled", true);
						systemType = json.system.model.includes("W") ? "wall" : "rack";
					}
				}
				// Set Device Info
				if(json.hasOwnProperty("device")) {
					if(json.device.hasOwnProperty("solar_watt_peak"))
					$("#solar_wattPeak").val(json.device.solar_watt_peak);
					if(json.device.hasOwnProperty("grid_feedin_limitation"))
						$("#solar_feedInLimitation").val(json.device.grid_feedin_limitation);
				}
				// Set Installation Date
				if(json.hasOwnProperty("installation_date")) {
					$("#installation_date").val(json.installation_date);
				}
				// Set Solar Info
				if(json.hasOwnProperty("solar_info")) {
					$("#solar_info").val(json.solar_info);
				}
				// Set Inverter Memo
				if(json.hasOwnProperty("note")) {
					$("#installer_memo").val(json.note);
				}
				// Set Batteries Info
				if(json.hasOwnProperty("batteries")) {
					// Multiple Batteries (LiFePO Only)
					if(json.batteries.length > 1) {
						if(json.batteries.length >  0 && json.batteries[ 0].hasOwnProperty("serialnumber")) $("#lifepo_battery_1 ").val(json.batteries[ 0].serialnumber);
						if(json.batteries.length >  1 && json.batteries[ 1].hasOwnProperty("serialnumber")) $("#lifepo_battery_2 ").val(json.batteries[ 1].serialnumber);
						if(json.batteries.length >  2 && json.batteries[ 2].hasOwnProperty("serialnumber")) $("#lifepo_battery_3 ").val(json.batteries[ 2].serialnumber);
						if(json.batteries.length >  3 && json.batteries[ 3].hasOwnProperty("serialnumber")) $("#lifepo_battery_4 ").val(json.batteries[ 3].serialnumber);
						if(json.batteries.length >  4 && json.batteries[ 4].hasOwnProperty("serialnumber")) $("#lifepo_battery_5 ").val(json.batteries[ 4].serialnumber);
						if(json.batteries.length >  5 && json.batteries[ 5].hasOwnProperty("serialnumber")) $("#lifepo_battery_6 ").val(json.batteries[ 5].serialnumber);
						if(json.batteries.length >  6 && json.batteries[ 6].hasOwnProperty("serialnumber")) $("#lifepo_battery_7 ").val(json.batteries[ 6].serialnumber);
						if(json.batteries.length >  7 && json.batteries[ 7].hasOwnProperty("serialnumber")) $("#lifepo_battery_8 ").val(json.batteries[ 7].serialnumber);
						if(json.batteries.length >  8 && json.batteries[ 8].hasOwnProperty("serialnumber")) $("#lifepo_battery_9 ").val(json.batteries[ 8].serialnumber);
						if(json.batteries.length >  9 && json.batteries[ 9].hasOwnProperty("serialnumber")) $("#lifepo_battery_10").val(json.batteries[ 9].serialnumber);
						if(json.batteries.length > 10 && json.batteries[10].hasOwnProperty("serialnumber")) $("#lifepo_battery_11").val(json.batteries[10].serialnumber);
						if(json.batteries.length > 11 && json.batteries[11].hasOwnProperty("serialnumber")) $("#lifepo_battery_12").val(json.batteries[11].serialnumber);
						if(json.batteries.length > 12 && json.batteries[12].hasOwnProperty("serialnumber")) $("#lifepo_battery_13").val(json.batteries[12].serialnumber);
						if(json.batteries.length > 13 && json.batteries[13].hasOwnProperty("serialnumber")) $("#lifepo_battery_14").val(json.batteries[13].serialnumber);
						if(json.batteries.length > 14 && json.batteries[14].hasOwnProperty("serialnumber")) $("#lifepo_battery_15").val(json.batteries[14].serialnumber);
						if(json.batteries.length > 15 && json.batteries[15].hasOwnProperty("serialnumber")) $("#lifepo_battery_16").val(json.batteries[15].serialnumber);
						if(json.batteries.length >  4) $("#btnShowAllModules").click();
					}
					// Single Battery (LiFePO|Carbon|Other)
					else if(json.batteries.length == 1 && json.batteries[0].hasOwnProperty("serialnumber") && json.batteries[0].hasOwnProperty("type")) {
						var battery = json.batteries[0];
						// LiFePO
						if(battery.type == 0) {
							$("#lifepo_battery_1").val(battery.serialnumber);
						}
						// Carbon
						else if(battery.type == 1) {
							$("#bx_battery_type_1").prop("checked", true).trigger("change");
							$("#bx_system_type_w ").prop("checked", true).trigger("change");
							if(battery.hasOwnProperty("capacity")) $("#carbon_battery_capacity").val(battery.capacity + " Wh");
							if(battery.hasOwnProperty("strings" )) $("#carbon_battery_strings ").val(battery.strings).trigger("change");
							if(battery.hasOwnProperty("model"   )) $("#carbon_battery_model   ").val(battery.model).trigger("change");
						}
						// Other
						else if(battery.type == 9) {
							$("#bx_battery_type_9").prop("checked", true).trigger("change");
							$("#bx_system_type_w ").prop("checked", true).trigger("change");
							if(battery.hasOwnProperty("capacity")) $("#other_battery_capacity").val(battery.capacity);
						}
					}
					// No Batteries
					else if(json.batteries.length == 0) {
						$("#bx_battery_type_9").prop("checked", true).trigger("change");
						$("#bx_system_type_w ").prop("checked", true).trigger("change");
						$("#other_battery_capacity").val(0);
					}
				}
				// Set Flag System Already Registered
				isAlreadyRegistered = true;
			}

			step3();

		}
	});

}





/*
	Set LiveX Serial-Number
*/

function step3() {

	$.post({
		url: "https://api.batterx.io/v3/install_hs.php",
		data: {
			action: "get_box_serial",
			apikey: systemApikey
		},
		error: () => { alert("E005. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			var box_serial = response;
			// Save Serial-Number to Session
			if(box_serial) {
				$.post({
					url: "cmd/session.php",
					data: { box_serial: box_serial },
					error: () => { alert("E006. Please refresh the page!"); },
					success: (response) => {
						console.log(response);
						if(response !== "1") return alert("E007. Please refresh the page!");
						$("#bx_box").val(box_serial);
						step4();
					}
				});
			} else {
				return $("#errorBoxNotRegistered").modal("show");
			}
		}
	});

}





/*
	Set Inverter Serial-Number
*/

function step4() {

	$.get({
		url: "api.php?get=deviceinfo",
		error: () => { alert("E008. Please refresh the page!"); },
		success: (response) => {

			console.log(response);

			if(!response || typeof response != "object" || !response.hasOwnProperty("device_serial_number") || !response.hasOwnProperty("device_model"))
				return alert("E009. Please refresh the page!");

			var device_serial_number = response.device_serial_number;
			var device_model = response.device_model.toLowerCase();
			device_model = (device_model == "batterx h5") ? "h5" : (device_model == "batterx h10") ? "h10" : "";
			deviceModel = device_model;

			// Save Serial-Number & Model to Session
			$.post({
				url: "cmd/session.php",
				data: {
					device_serial: device_serial_number,
					device_model: device_model
				},
				error: () => { alert("E010. Please refresh the page!"); },
				success: (response) => {
					console.log(response);
					if(response !== "1") return alert("E011. Please refresh the page!");
					$("#bx_device").val(device_serial_number);
					if(isCarbon() || isOther()) $("#bx_system").val(device_serial_number);
					step5();
				}
			});

		}
	});

}





/*
	Show / Hide VDE4105 Stuff & Energy Meter Phase Selection
*/

function step5() {
	
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E012. Please refresh the page!"); },
		success: (response) => {
			
			console.log(response);
			if(!response || typeof response != "object")
				return alert("E013. Please refresh the page!");

			if(deviceModel == "h5") {
				$("#box_emeter_phase").removeClass("d-none");
				if(response.hasOwnProperty("InjectionMode")) {
					response = response["InjectionMode"];
					if(response["0"]["v6"] !== 0) $("#bx_emeter_phase").val(response["0"]["v6"]);
				}
			}

			var inverterParams = response.hasOwnProperty("InverterParameters") ? response["InverterParameters"] : "";
			// Q(U) Kennlinie
			if(inverterParams.hasOwnProperty("2") && inverterParams["2"]["s1"].split(",")[7] == 1) {
				$("#vde4105_mode").val("3").trigger("change");
				if(inverterParams.hasOwnProperty("37")) {
					var temp = inverterParams["37"]["s1"].split(",");
					$("#vde4105_mode3_cosphi").val(Math.round(Math.cos(Math.asin(parseInt(temp[0]) / (deviceModel == "h5" ? 5000 : 10000))) * 100)).trigger("input");
					$("#vde4105_mode3_v1    ").val(Math.round(parseInt(temp[1]) / 230.94)).trigger("input");
					$("#vde4105_mode3_v2    ").val(Math.round(parseInt(temp[2]) / 230.94)).trigger("input");
					$("#vde4105_mode3_v3    ").val(Math.round(parseInt(temp[3]) / 230.94)).trigger("input");
					$("#vde4105_mode3_v4    ").val(Math.round(parseInt(temp[4]) / 230.94)).trigger("input");
				}
			}
			// Fester cosφ
			else if(inverterParams.hasOwnProperty("36") && inverterParams["36"]["s1"].split(",")[0] == 1 && inverterParams["36"]["s1"].split(",")[1] == 10) {
				$("#vde4105_mode").val("2").trigger("change");
				$("#vde4105_mode2_cosphi").val(inverterParams["36"]["s1"].split(",")["2"]).trigger("input");
			}
			// cosφ(P) Kennlinie
			else if(inverterParams.hasOwnProperty("36") && inverterParams["36"]["s1"].split(",")[0] == 1 && inverterParams["36"]["s1"].split(",")[1] == 50 && inverterParams["36"]["s1"].split(",")[2] == 90) {
				$("#vde4105_mode").val("1").trigger("change");
			}

		}
	});

}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Main Form On-Submit
*/

$("#mainForm").on("submit", (e) => {
	e.preventDefault();
	mainFormSubmit();
});

function mainFormSubmit() {

	checkParametersInterval = undefined;

	if(isLiFePO()) {
		if( $("#installation_date     ").val() == "" ||
			$("#bx_system             ").val() == "" ||
			$("#bx_device             ").val() == "" ||
			$("#bx_box                ").val() == "" ||
			$("#solar_wattPeak        ").val() == "" ||
			$("#solar_feedInLimitation").val() == "" ||
			$("#lifepo_battery_1      ").val() == ""
		) return;
	} else if(isCarbon()) {
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
	} else { // isOther()
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

	// Confirm Solar Watt Peak (if under 1000 Wp)
	if(parseInt($("#solar_wattPeak").val()) < 1000) {
		var tempFlag = confirm(`${lang.system_setup.msg_solar_size_very_low}\n\n${lang.system_setup.msg_solar_size_very_low_confirm.replace("100", $("#solar_wattPeak").val())}\n`);
		if(!tempFlag) return $("#solar_wattPeak").val("");
	}

	// Check System S/N
	if(isLiFePO() && !isAlreadyRegistered) {
		if($("#bx_system").val().length != 14)
			return $("#errorSystemSerialNotCorrect").modal("show");
	}

	// Check Inverter S/N
	var canContinue = false;
	$.post({
		url: "https://api.batterx.io/v3/install_hs.php",
		async: false,
		data: {
			action       : "verify_device",
			serialnumber : $("#bx_device").val(),
			system       : $("#bx_system").val()
		},
		error: () => { alert("E014. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response === "1") canContinue = true;
			else $("#errorInverterRegisteredWithOtherSystem").modal("show");
		}
	});
	if(!canContinue) return;

	// Disable All Fields
	$(` #bx_system,
		#bx_system_type_r,
		#bx_system_type_w,
		#bx_device,
		#bx_box,
		#btnInstallerMemo,
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

		#vde4105_mode,
		#vde4105_mode2_cosphi,
		#vde4105_mode3_cosphi,
		#vde4105_mode3_v1,
		#vde4105_mode3_v2,
		#vde4105_mode3_v3,
		#vde4105_mode3_v4
	`).attr("disabled", true);

	// Show Loading Screen
	isSettingParameters = true;
	$("#btn_next").attr("disabled", true);
	$(".setting-progress").removeClass("d-none");

	// Scroll To Bottom
	$("html, body").scrollTop($(document).height());

	// Add VDE4105 Mode Variables To SESSION
	var tempData = { vde4105_mode: $("#vde4105_mode").val() };
	if($("#vde4105_mode").val() == "2")
		tempData["vde4105_cosphi"] = $("#vde4105_mode2_cosphi").val();
	if($("#vde4105_mode").val() == "3") {
		tempData["vde4105_cosphi"] = $("#vde4105_mode3_cosphi").val();
		tempData["vde4105_v1"] = $("#vde4105_mode3_v1").val() == "" ?  "93" : Math.round($("#vde4105_mode3_v1").val());
		tempData["vde4105_v2"] = $("#vde4105_mode3_v2").val() == "" ?  "97" : Math.round($("#vde4105_mode3_v2").val());
		tempData["vde4105_v3"] = $("#vde4105_mode3_v3").val() == "" ? "103" : Math.round($("#vde4105_mode3_v3").val());
		tempData["vde4105_v4"] = $("#vde4105_mode3_v4").val() == "" ? "107" : Math.round($("#vde4105_mode3_v4").val());
	}
	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E056. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response !== "1") return alert("E057. Please refresh the page!");
			// Start Setup
			checkParametersCounter = 0;
				 if(isLiFePO()) setupLiFePO();
			else if(isCarbon()) setupCarbon();
			else                setupOther();
		}
	});

}





function showSettingParametersError(errorStr) {
	clearInterval(checkParametersInterval);
	// Hide Loading Screen
	isSettingParameters = false;
	$("#notif").removeClass("loading error success").addClass("error");
	$("#message").html(errorStr).css("color", "red");
	$("#btn_next").attr("disabled", false).unbind().on("click", () => { mainFormSubmit(); });
}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup for LiFePO Batteries - Verify Serial Numbers
*/

function setupLiFePO() {

	var system_serial    = $("#bx_system        ").val();
	var battery1_serial  = $("#lifepo_battery_1 ").val();
	var battery2_serial  = $("#lifepo_battery_2 ").val();
	var battery3_serial  = $("#lifepo_battery_3 ").val();
	var battery4_serial  = $("#lifepo_battery_4 ").val();
	var battery5_serial  = $("#lifepo_battery_5 ").val();
	var battery6_serial  = $("#lifepo_battery_6 ").val();
	var battery7_serial  = $("#lifepo_battery_7 ").val();
	var battery8_serial  = $("#lifepo_battery_8 ").val();
	var battery9_serial  = $("#lifepo_battery_9 ").val();
	var battery10_serial = $("#lifepo_battery_10").val();
	var battery11_serial = $("#lifepo_battery_11").val();
	var battery12_serial = $("#lifepo_battery_12").val();
	var battery13_serial = $("#lifepo_battery_13").val();
	var battery14_serial = $("#lifepo_battery_14").val();
	var battery15_serial = $("#lifepo_battery_15").val();
	var battery16_serial = $("#lifepo_battery_16").val();

	var canContinue = true;

	/* Check Battery  1 S/N */ if(canContinue && battery1_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery1_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery1_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  2 S/N */ if(canContinue && battery2_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery2_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery2_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  3 S/N */ if(canContinue && battery3_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery3_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery3_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  4 S/N */ if(canContinue && battery4_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery4_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery4_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  5 S/N */ if(canContinue && battery5_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery5_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery5_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  6 S/N */ if(canContinue && battery6_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery6_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery6_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  7 S/N */ if(canContinue && battery7_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery7_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery7_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  8 S/N */ if(canContinue && battery8_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery8_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery8_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery  9 S/N */ if(canContinue && battery9_serial  != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery9_serial  }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery9_serial ); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 10 S/N */ if(canContinue && battery10_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery10_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery10_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 11 S/N */ if(canContinue && battery11_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery11_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery11_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 12 S/N */ if(canContinue && battery12_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery12_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery12_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 13 S/N */ if(canContinue && battery13_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery13_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery13_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 14 S/N */ if(canContinue && battery14_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery14_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery14_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 15 S/N */ if(canContinue && battery15_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery15_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery15_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }
	/* Check Battery 16 S/N */ if(canContinue && battery16_serial != "") { canContinue = false; $.post({ url: "https://api.batterx.io/v3/install_hs.php", async: false, data: { action: "verify_battery", system: system_serial, serialnumber: battery16_serial }, error: () => { alert("E015. Please refresh the page!"); }, success: (response) => { if(response === "1") canContinue = true; else { $("#errorBatterySerial").val(battery16_serial); $("#errorBatteryNotExistOrWithOtherSystem").modal("show"); } } }); }

	if(!canContinue) {
		// Enable Battery Fields
		$(` #lifepo_battery_1,
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
			#btnShowAllModules
		`).attr("disabled", false);
		// Hide Loading Screen
		isSettingParameters = false;
		$("#btn_next").attr("disabled", false);
		$(".setting-progress").addClass("d-none");
	}

	// Continue with Step 2
	if(canContinue) setupLiFePO_2();

}





/*
	Set InjectionPhase & InjectionPower & Verify LiFePO Connection
*/

function setupLiFePO_2() {

	// Show Loading
	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;

	// Set Grid InjectionPhase
	if(deviceModel == "h5") {
		var selectedPhase = $("#bx_emeter_phase").val();
		if(selectedPhase == "1" || selectedPhase == "2" || selectedPhase == "3") {
			$.get({
				url: "api.php?set=command&type=20736&entity=6&text2=" + selectedPhase,
				error: () => { alert("E016. Please refresh the page!"); },
				success: (response) => { if(response != "1") return alert("E017. Please refresh the page!"); }
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = (deviceModel == "h10") ? 10000 : 5000; // x1.00W
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: "api.php?set=command&type=20736&entity=1&text2=" + maxGridFeedInPower,
		error: () => { alert("E018. Please refresh the page!"); },
		success: (response) => { if(response != "1") return alert("E019. Please refresh the page!"); }
	});

	// Verify LiFePO Communication
	$.get({
		url: "api.php?set=command&type=24114&entity=0&text2=5320,5300",
		error: () => { alert("E020. Please refresh the page!"); },
		success: (response) => {
			if(response != "1") return alert("E021. Please refresh the page!");
			tempDatetime = "";
			setupLiFePO_2_check();
		}
	});

}





/*
	Verify LiFePO Connection
*/

function setupLiFePO_2_check() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E022. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E023. Please refresh the page!");
			response = response["InverterParameters"];
			if(tempDatetime == "") { tempDatetime = response["0"]["s1"]; setTimeout(setupLiFePO_2_check, 5000); return; }
			if(response["0"]["s1"] == tempDatetime) { setTimeout(setupLiFePO_2_check, 5000); return; }
			// Verify Battery Charging Voltage
			var chargingVoltage = response["32"]["s1"];
			console.log(chargingVoltage);
			if(chargingVoltage == "5320,5300") {
				$("#notif").removeClass("loading error success").addClass("error");
				$("#message").html(lang.system_setup.msg_lifepo_communication_problem).css("color", "red");
				$("#btn_next").unbind().removeAttr("form").removeAttr("type").on("click", () => { setupLiFePO_2(); });
				isSettingParameters = false;
			} else {
				setupLiFePO_3();
			}
		}
	});

}





/*
	Set Session Variables
*/

function setupLiFePO_3() {

	var countBat = 0;
	if($("#lifepo_battery_1 ").val() != "") countBat++;
	if($("#lifepo_battery_2 ").val() != "") countBat++;
	if($("#lifepo_battery_3 ").val() != "") countBat++;
	if($("#lifepo_battery_4 ").val() != "") countBat++;
	if($("#lifepo_battery_5 ").val() != "") countBat++;
	if($("#lifepo_battery_6 ").val() != "") countBat++;
	if($("#lifepo_battery_7 ").val() != "") countBat++;
	if($("#lifepo_battery_8 ").val() != "") countBat++;
	if($("#lifepo_battery_9 ").val() != "") countBat++;
	if($("#lifepo_battery_10").val() != "") countBat++;
	if($("#lifepo_battery_11").val() != "") countBat++;
	if($("#lifepo_battery_12").val() != "") countBat++;
	if($("#lifepo_battery_13").val() != "") countBat++;
	if($("#lifepo_battery_14").val() != "") countBat++;
	if($("#lifepo_battery_15").val() != "") countBat++;
	if($("#lifepo_battery_16").val() != "") countBat++;
	systemModel = "batterX " + deviceModel + ($("#bx_system_type_w").is(":checked") ? "W" : "R") + "-" + (countBat * 3.5).toString().replace(".", ",");

	var tempData = {
		system_serial          : $("#bx_system             ").val(),
		device_serial          : $("#bx_device             ").val(),
		solar_wattPeak         : $("#solar_wattPeak        ").val(),
		solar_feedInLimitation : $("#solar_feedInLimitation").val(),
		solar_info             : $("#solar_info            ").val(),
		note                   : $("#installer_memo        ").val(),
		installation_date      : $("#installation_date     ").val(),
		battery_type           : "lifepo",
		system_model           : systemModel
	};
	if($("#lifepo_battery_1 ").val() != "") tempData["battery1_serial" ] = $("#lifepo_battery_1" ).val();
	if($("#lifepo_battery_2 ").val() != "") tempData["battery2_serial" ] = $("#lifepo_battery_2" ).val();
	if($("#lifepo_battery_3 ").val() != "") tempData["battery3_serial" ] = $("#lifepo_battery_3" ).val();
	if($("#lifepo_battery_4 ").val() != "") tempData["battery4_serial" ] = $("#lifepo_battery_4" ).val();
	if($("#lifepo_battery_5 ").val() != "") tempData["battery5_serial" ] = $("#lifepo_battery_5" ).val();
	if($("#lifepo_battery_6 ").val() != "") tempData["battery6_serial" ] = $("#lifepo_battery_6" ).val();
	if($("#lifepo_battery_7 ").val() != "") tempData["battery7_serial" ] = $("#lifepo_battery_7" ).val();
	if($("#lifepo_battery_8 ").val() != "") tempData["battery8_serial" ] = $("#lifepo_battery_8" ).val();
	if($("#lifepo_battery_9 ").val() != "") tempData["battery9_serial" ] = $("#lifepo_battery_9" ).val();
	if($("#lifepo_battery_10").val() != "") tempData["battery10_serial"] = $("#lifepo_battery_10").val();
	if($("#lifepo_battery_11").val() != "") tempData["battery11_serial"] = $("#lifepo_battery_11").val();
	if($("#lifepo_battery_12").val() != "") tempData["battery12_serial"] = $("#lifepo_battery_12").val();
	if($("#lifepo_battery_13").val() != "") tempData["battery13_serial"] = $("#lifepo_battery_13").val();
	if($("#lifepo_battery_14").val() != "") tempData["battery14_serial"] = $("#lifepo_battery_14").val();
	if($("#lifepo_battery_15").val() != "") tempData["battery15_serial"] = $("#lifepo_battery_15").val();
	if($("#lifepo_battery_16").val() != "") tempData["battery16_serial"] = $("#lifepo_battery_16").val();

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E024. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E025. Please refresh the page!");
			setupLiFePO_4();
		}
	});

}





/*
	Set Parameters
*/

function setupLiFePO_4() {

	var numberOfModules = 0;
	if($("#lifepo_battery_1 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_2 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_3 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_4 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_5 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_6 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_7 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_8 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_9 ").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_10").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_11").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_12").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_13").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_14").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_15").val() != "") numberOfModules += 1;
	if($("#lifepo_battery_16").val() != "") numberOfModules += 1;

	var maxChargingCurrent    = deviceModel == "h10" ? 20000 : 6000; // x0.01A
	var maxGridFeedInPower    = deviceModel == "h10" ? 10000 : 5000; // x1.00W
	var maxDischargingCurrent = deviceModel == "h10" ?   300 :  150; // x1.00A
	
	newParameters["maxChargingCurrentAC"    ] = Math.min(numberOfModules * 37 * 100, maxChargingCurrent).toString();
	newParameters["chargingVoltage"         ] = "5320,5320";
	newParameters["dischargingVoltage"      ] = "4600,5000,4600,5000";
	newParameters["maxDischargingCurrent"   ] = Math.min(numberOfModules * 37, maxDischargingCurrent).toString();
	newParameters["batteryType"             ] = "1";
	newParameters["solarEnergyPriority"     ] = "1";
	newParameters["allowBatteryCharging"    ] = "1";
	newParameters["allowBatteryChargingAC"  ] = "0";
	newParameters["allowGridInjection"      ] = "1";
	newParameters["allowDischargingSolarOK" ] = "1";
	newParameters["allowDischargingSolarNOK"] = "1";
	newParameters["maxGridFeedInPower"      ] = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();
	
	var vde4105_mode   = $("#vde4105_mode    ").val();
	var vde4105_v1     = Math.round(Math.round($("#vde4105_mode3_v1").val()) * 230.94 / 10) * 10;
	var vde4105_v2     = Math.round(Math.round($("#vde4105_mode3_v2").val()) * 230.94 / 10) * 10;
	var vde4105_v3     = Math.round(Math.round($("#vde4105_mode3_v3").val()) * 230.94 / 10) * 10;
	var vde4105_v4     = Math.round(Math.round($("#vde4105_mode3_v4").val()) * 230.94 / 10) * 10;
	var vde4105_cosphi = parseInt(vde4105_mode == 2 ? Math.min($("#vde4105_mode2_cosphi").val(), 99) : (vde4105_mode == 3 ? $("#vde4105_mode3_cosphi").val() : 90));
	var devicePower    = (deviceModel == "h5" ? 5000 : 10000);
	var vde4105_q      = Math.round(Math.sqrt(Math.pow(devicePower, 2) - Math.pow(devicePower * vde4105_cosphi / 100, 2)));
	newParameters["autoAdjustPowerFactor"   ] = "0,50,90";
	newParameters["allowQuDeratingFunction" ] = "0";
	newParameters["voltageAndReactivePower" ] = "4359,21390,22310,23690,24610";
	if(vde4105_mode == 1) {
		newParameters["autoAdjustPowerFactor"   ] = `1,50,90`;
	} else if(vde4105_mode == 2) {
		newParameters["autoAdjustPowerFactor"   ] = `1,10,${vde4105_cosphi}`
	} else if(vde4105_mode == 3) {
		newParameters["allowQuDeratingFunction" ] = `1`;
		newParameters["voltageAndReactivePower" ] = `${vde4105_q},${vde4105_v1},${vde4105_v2},${vde4105_v3},${vde4105_v4}`;
	}

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E026. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E027. Please refresh the page!");
			
			response = response["InverterParameters"];
			deviceDatetime = response["0"]["s1"];
			
			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

			if(oldParameters["dischargingVoltage"].split(",")[2] == "4700") newParameters["dischargingVoltage"] = "4700,5000,4700,5000";

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	var retry = false;

	if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupLiFePO_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
	if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupLiFePO_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
	if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupLiFePO_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
	if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupLiFePO_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
	if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupLiFePO_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
	if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupLiFePO_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
	if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
	if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
	if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
	if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
	if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
	if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupLiFePO_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
	if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
	if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupLiFePO_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

	if(!retry) {
		$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
		$("#notif").removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");

}





/*
	Send LiFePO Command
*/

function setupLiFePO_sendCommand(type, entity, text1, text2) {
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: () => { alert("E028. Please refresh the page!") },
		success: function(response) {
			if(response != "1") return alert("E029. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupLiFePO_checkParameters, 5000);
		}
	});
}





/*
	Check If Parameters Are Correct
*/

function setupLiFePO_checkParameters() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E030. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E031. Please refresh the page!");

			response = response["InverterParameters"];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

			if(oldParameters["voltageAndReactivePower"] == "") newParameters["voltageAndReactivePower"] = "";

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			var retry = false;

			if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupLiFePO_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
			if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupLiFePO_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
			if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupLiFePO_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
			if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupLiFePO_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
			if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupLiFePO_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
			if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupLiFePO_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
			if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
			if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
			if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
			if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
			if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
			if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupLiFePO_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
			if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupLiFePO_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
			if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupLiFePO_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

			if(!retry) {
				$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
				$("#notif").removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else {
				checkParametersCounter++;
				if(checkParametersCounter < 5) {
					console.log(`RETRYING, ${checkParametersCounter + 1}/5, PLEASE WAIT!`);
				} else {
					// Show Error - Parameter Not Accepted
						 if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) showSettingParametersError("Problem when setting maxChargingCurrentAC"    );
					else if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) showSettingParametersError("Problem when setting chargingVoltage"         );
					else if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) showSettingParametersError("Problem when setting dischargingVoltage"      );
					else if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) showSettingParametersError("Problem when setting batteryType"             );
					else if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) showSettingParametersError("Problem when setting solarEnergyPriority"     );
					else if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) showSettingParametersError("Problem when setting allowBatteryCharging"    );
					else if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) showSettingParametersError("Problem when setting allowBatteryChargingAC"  );
					else if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) showSettingParametersError("Problem when setting allowGridInjection"      );
					else if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) showSettingParametersError("Problem when setting allowDischargingSolarOK" );
					else if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) showSettingParametersError("Problem when setting allowDischargingSolarNOK");
					else if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) showSettingParametersError("Problem when setting autoAdjustPowerFactor"   );
					else if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) showSettingParametersError("Problem when setting allowQuDeratingFunction" );
					else if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) showSettingParametersError("Problem when setting voltageAndReactivePower" );
					else if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) {
						var modulesCount = parseInt(oldParameters["maxDischargingCurrent"]) / 37;
						showSettingParametersError(lang.system_setup.msg_lifepo_recognition_problem.split("X").join(modulesCount));
					}
				}
			}

		}
	});

}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup For Carbon Batteries
*/

function setupCarbon() {
	setupCarbon_2();
}





/*
	Set InjectionPhase & InjectionPower
*/

function setupCarbon_2() {

	// Show Loading
	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;

	// Set Grid InjectionPhase
	if(deviceModel == "h5") {
		var selectedPhase = $("#bx_emeter_phase").val();
		if(selectedPhase == "1" || selectedPhase == "2" || selectedPhase == "3") {
			$.get({
				url: "api.php?set=command&type=20736&entity=6&text2=" + selectedPhase,
				error: () => { alert("E032. Please refresh the page!"); },
				success: (response) => { if(response != "1") return alert("E033. Please refresh the page!"); }
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = (deviceModel == "h10") ? 10000 : 5000; // x1.00W
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: "api.php?set=command&type=20736&entity=1&text2=" + maxGridFeedInPower,
		error: () => { alert("E034. Please refresh the page!"); },
		success: (response) => { if(response != "1") return alert("E035. Please refresh the page!"); }
	});

	// Set Session Variables
	setupCarbon_3();

}





/*
	Set Session Variables
*/

function setupCarbon_3() {

	var tempData = {
		system_serial          : $("#bx_device              ").val(),
		device_serial          : $("#bx_device              ").val(),
		solar_wattPeak         : $("#solar_wattPeak         ").val(),
		solar_feedInLimitation : $("#solar_feedInLimitation ").val(),
		solar_info             : $("#solar_info             ").val(),
		note                   : $("#installer_memo         ").val(),
		installation_date      : $("#installation_date      ").val(),
		battery_model          : $("#carbon_battery_model   ").val(),
		battery_strings        : $("#carbon_battery_strings ").val(),
		battery_capacity       : $("#carbon_battery_capacity").val().split(" ")[0],
		battery_type           : "carbon"
	};

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E036. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E037. Please refresh the page!");
			setupCarbon_4();
		}
	});

}





/*
	Set Parameters
*/

function setupCarbon_4() {

	var batteryCapacity = parseInt($("#carbon_battery_capacity").val().split(" ")[0]);

	var maxChargingCurrent    = deviceModel == "h10" ? 20000 : 6000; // x0.01A
	var maxGridFeedInPower    = deviceModel == "h10" ? 10000 : 5000; // x1.00W
	var maxDischargingCurrent = deviceModel == "h10" ?   300 :  150; // x1.00A

    newParameters["maxChargingCurrent"      ] = Math.min(Math.max(Math.round(batteryCapacity * 0.15 / 48), 10) * 100, maxChargingCurrent).toString();
	newParameters["maxChargingCurrentAC"    ] = Math.min(Math.max(Math.round(batteryCapacity * 0.15 / 48), 10) * 100, maxChargingCurrent).toString();
	newParameters["chargingVoltage"         ] = "5600,5400";
	newParameters["dischargingVoltage"      ] = "4680,5200,4300,4800";
	newParameters["maxDischargingCurrent"   ] = Math.min(Math.max(Math.round(batteryCapacity * 0.20 / 48), 20), maxDischargingCurrent).toString();
	newParameters["batteryType"             ] = "0";
	newParameters["solarEnergyPriority"     ] = "1";
	newParameters["allowBatteryCharging"    ] = "1";
	newParameters["allowBatteryChargingAC"  ] = "0";
	newParameters["allowGridInjection"      ] = "1";
	newParameters["allowDischargingSolarOK" ] = "1";
	newParameters["allowDischargingSolarNOK"] = "1";
	newParameters["maxGridFeedInPower"      ] = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();

	var vde4105_mode   = $("#vde4105_mode    ").val();
	var vde4105_v1     = Math.round(Math.round($("#vde4105_mode3_v1").val()) * 230.94 / 10) * 10;
	var vde4105_v2     = Math.round(Math.round($("#vde4105_mode3_v2").val()) * 230.94 / 10) * 10;
	var vde4105_v3     = Math.round(Math.round($("#vde4105_mode3_v3").val()) * 230.94 / 10) * 10;
	var vde4105_v4     = Math.round(Math.round($("#vde4105_mode3_v4").val()) * 230.94 / 10) * 10;
	var vde4105_cosphi = parseInt(vde4105_mode == 2 ? Math.min($("#vde4105_mode2_cosphi").val(), 99) : (vde4105_mode == 3 ? $("#vde4105_mode3_cosphi").val() : 90));
	var devicePower    = (deviceModel == "h5" ? 5000 : 10000);
	var vde4105_q      = Math.round(Math.sqrt(Math.pow(devicePower, 2) - Math.pow(devicePower * vde4105_cosphi / 100, 2)));
	newParameters["autoAdjustPowerFactor"   ] = "0,50,90";
	newParameters["allowQuDeratingFunction" ] = "0";
	newParameters["voltageAndReactivePower" ] = "4359,21390,22310,23690,24610";
	if(vde4105_mode == 1) {
		newParameters["autoAdjustPowerFactor"   ] = `1,50,90`;
	} else if(vde4105_mode == 2) {
		newParameters["autoAdjustPowerFactor"   ] = `1,10,${vde4105_cosphi}`
	} else if(vde4105_mode == 3) {
		newParameters["allowQuDeratingFunction" ] = `1`;
		newParameters["voltageAndReactivePower" ] = `${vde4105_q},${vde4105_v1},${vde4105_v2},${vde4105_v3},${vde4105_v4}`;
	}

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E038. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E039. Please refresh the page!");
			
			response = response["InverterParameters"];
			deviceDatetime = response["0"]["s1"];
			
			oldParameters["maxChargingCurrent"      ] = !response.hasOwnProperty("30") ? "" : response["30"]["s1"];
			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	var retry = false;

	if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setupCarbon_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }
	if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupCarbon_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
	if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupCarbon_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
	if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupCarbon_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
	if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupCarbon_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
	if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupCarbon_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
	if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupCarbon_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
	if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
	if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
	if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
	if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
	if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
	if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupCarbon_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
	if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
	if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupCarbon_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

	if(!retry) {
		$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
		$("#notif").removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");

}





/*
	Send Carbon Command
*/

function setupCarbon_sendCommand(type, entity, text1, text2) {
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: () => { alert("E040. Please refresh the page!") },
		success: function(response) {
			if(response != "1") return alert("E041. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupCarbon_checkParameters, 5000);
		}
	});
}





/*
	Check If Parameters Are Correct
*/

function setupCarbon_checkParameters() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E042. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E043. Please refresh the page!");

			response = response["InverterParameters"];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters["maxChargingCurrent"      ] = !response.hasOwnProperty("30") ? "" : response["30"]["s1"];
			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

			if(oldParameters["voltageAndReactivePower"] == "") newParameters["voltageAndReactivePower"] = "";

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			var retry = false;

			if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setupCarbon_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }
			if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupCarbon_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
			if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupCarbon_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
			if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupCarbon_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
			if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupCarbon_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
			if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupCarbon_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
			if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupCarbon_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
			if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
			if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
			if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
			if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
			if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
			if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupCarbon_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
			if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupCarbon_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
			if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupCarbon_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

			if(!retry) {
				$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
				$("#notif").removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else {
				checkParametersCounter++;
				if(checkParametersCounter < 5) {
					console.log(`RETRYING, ${checkParametersCounter + 1}/5, PLEASE WAIT!`);
				} else {
					// Show Error - Parameter Not Accepted
						 if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) showSettingParametersError("Problem when setting maxChargingCurrent"      );
					else if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) showSettingParametersError("Problem when setting maxChargingCurrentAC"    );
					else if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) showSettingParametersError("Problem when setting chargingVoltage"         );
					else if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) showSettingParametersError("Problem when setting dischargingVoltage"      );
					else if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) showSettingParametersError("Problem when setting maxDischargingCurrent"   );
					else if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) showSettingParametersError("Problem when setting batteryType"             );
					else if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) showSettingParametersError("Problem when setting solarEnergyPriority"     );
					else if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) showSettingParametersError("Problem when setting allowBatteryCharging"    );
					else if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) showSettingParametersError("Problem when setting allowBatteryChargingAC"  );
					else if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) showSettingParametersError("Problem when setting allowGridInjection"      );
					else if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) showSettingParametersError("Problem when setting allowDischargingSolarOK" );
					else if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) showSettingParametersError("Problem when setting allowDischargingSolarNOK");
					else if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) showSettingParametersError("Problem when setting autoAdjustPowerFactor"   );
					else if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) showSettingParametersError("Problem when setting allowQuDeratingFunction" );
					else if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) showSettingParametersError("Problem when setting voltageAndReactivePower" );
				}
			}

		}
	});

}





//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////





/*
	Setup For Other Batteries
*/

function setupOther() {
	setupOther_2();
}





/*
	Set InjectionPhase & InjectionPower
*/

function setupOther_2() {

	// Show Loading
	$("#notif").removeClass("loading error success").addClass("loading");
	$("#message").html(lang.system_setup.msg_setting_parameters).css("color", "");
	isSettingParameters = true;

	// Set Grid InjectionPhase
	if(deviceModel == "h5") {
		var selectedPhase = $("#bx_emeter_phase").val();
		if(selectedPhase == "1" || selectedPhase == "2" || selectedPhase == "3") {
			$.get({
				url: "api.php?set=command&type=20736&entity=6&text2=" + selectedPhase,
				error: () => { alert("E044. Please refresh the page!"); },
				success: (response) => { if(response != "1") return alert("E045. Please refresh the page!"); }
			});
		}
	}

	// Set Grid MaxInjectionPower
	var maxGridFeedInPower = (deviceModel == "h10") ? 10000 : 5000; // x1.00W
	maxGridFeedInPower = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();
	$.get({
		url: "api.php?set=command&type=20736&entity=1&text2=" + maxGridFeedInPower,
		error: () => { alert("E046. Please refresh the page!"); },
		success: (response) => { if(response != "1") return alert("E047. Please refresh the page!"); }
	});

	// Set Session Variables
	setupOther_3();

}





/*
	Set Session Variables
*/

function setupOther_3() {

	var tempData = {
		system_serial          : $("#bx_device             ").val(),
		device_serial          : $("#bx_device             ").val(),
		solar_wattPeak         : $("#solar_wattPeak        ").val(),
		solar_feedInLimitation : $("#solar_feedInLimitation").val(),
		solar_info             : $("#solar_info            ").val(),
		note                   : $("#installer_memo        ").val(),
		installation_date      : $("#installation_date     ").val(),
		battery_capacity       : $("#other_battery_capacity").val(),
		battery_type           : "other"
	};

	console.log(tempData);

	$.post({
		url: "cmd/session.php",
		data: tempData,
		error: () => { alert("E048. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(response != "1") return alert("E049. Please refresh the page!");
			setupOther_4();
		}
	});

}






/*
	Set Parameters
*/

function setupOther_4() {

	var custom_maxChargingCurrent       =                Math.round(parseFloat($("#other_battery_maxChargingCurrent      ").val()) *  1) * 100 ;
	var custom_maxDischargingCurrent    =                Math.round(parseFloat($("#other_battery_maxDischargingCurrent   ").val()) *  1) *   1 ;
	var custom_bulkChargingVoltage      = Math.min(6000, Math.round(parseFloat($("#other_battery_bulkChargingVoltage     ").val()) * 10) *  10);
	var custom_floatChargingVoltage     = Math.min(6000, Math.round(parseFloat($("#other_battery_floatChargingVoltage    ").val()) * 10) *  10);
	var custom_cutoffVoltage            = Math.min(6000, Math.round(parseFloat($("#other_battery_cutoffVoltage           ").val()) * 10) *  10);
	var custom_redischargeVoltage       = Math.min(6000, Math.round(parseFloat($("#other_battery_redischargeVoltage      ").val()) * 10) *  10);
	var custom_cutoffVoltageHybrid      = Math.min(6000, Math.round(parseFloat($("#other_battery_cutoffVoltageHybrid     ").val()) * 10) *  10);
	var custom_redischargeVoltageHybrid = Math.min(6000, Math.round(parseFloat($("#other_battery_redischargeVoltageHybrid").val()) * 10) *  10);

	var maxChargingCurrent    = deviceModel == "h10" ? 20000 : 6000; // x0.01A
	var maxGridFeedInPower    = deviceModel == "h10" ? 10000 : 5000; // x1.00W
	var maxDischargingCurrent = deviceModel == "h10" ?   300 :  150; // x1.00A

	newParameters["maxChargingCurrent"      ] = Math.min(custom_maxChargingCurrent, maxChargingCurrent).toString();
	newParameters["maxChargingCurrentAC"    ] = Math.min(custom_maxChargingCurrent, maxChargingCurrent).toString();
	newParameters["chargingVoltage"         ] = `${custom_bulkChargingVoltage},${custom_floatChargingVoltage}`;
	newParameters["dischargingVoltage"      ] = `${custom_cutoffVoltageHybrid},${custom_redischargeVoltageHybrid},${custom_cutoffVoltage},${custom_redischargeVoltage}`;
	newParameters["maxDischargingCurrent"   ] = Math.min(custom_maxDischargingCurrent, maxDischargingCurrent).toString();
	newParameters["batteryType"             ] = "0";
	newParameters["solarEnergyPriority"     ] = "1";
	newParameters["allowBatteryCharging"    ] = "1";
	newParameters["allowBatteryChargingAC"  ] = "0";
	newParameters["allowGridInjection"      ] = "1";
	newParameters["allowDischargingSolarOK" ] = "1";
	newParameters["allowDischargingSolarNOK"] = "1";
	newParameters["maxGridFeedInPower"      ] = Math.round(Math.min(Math.max(parseInt($("#solar_wattPeak").val()) * parseInt($("#solar_feedInLimitation").val()) / 100, 50), maxGridFeedInPower)).toString();

	var vde4105_mode   = $("#vde4105_mode    ").val();
	var vde4105_v1     = Math.round(Math.round($("#vde4105_mode3_v1").val()) * 230.94 / 10) * 10;
	var vde4105_v2     = Math.round(Math.round($("#vde4105_mode3_v2").val()) * 230.94 / 10) * 10;
	var vde4105_v3     = Math.round(Math.round($("#vde4105_mode3_v3").val()) * 230.94 / 10) * 10;
	var vde4105_v4     = Math.round(Math.round($("#vde4105_mode3_v4").val()) * 230.94 / 10) * 10;
	var vde4105_cosphi = parseInt(vde4105_mode == 2 ? Math.min($("#vde4105_mode2_cosphi").val(), 99) : (vde4105_mode == 3 ? $("#vde4105_mode3_cosphi").val() : 90));
	var devicePower    = (deviceModel == "h5" ? 5000 : 10000);
	var vde4105_q      = Math.round(Math.sqrt(Math.pow(devicePower, 2) - Math.pow(devicePower * vde4105_cosphi / 100, 2)));
	newParameters["autoAdjustPowerFactor"   ] = "0,50,90";
	newParameters["allowQuDeratingFunction" ] = "0";
	newParameters["voltageAndReactivePower" ] = "4359,21390,22310,23690,24610";
	if(vde4105_mode == 1) {
		newParameters["autoAdjustPowerFactor"   ] = `1,50,90`;
	} else if(vde4105_mode == 2) {
		newParameters["autoAdjustPowerFactor"   ] = `1,10,${vde4105_cosphi}`
	} else if(vde4105_mode == 3) {
		newParameters["allowQuDeratingFunction" ] = `1`;
		newParameters["voltageAndReactivePower" ] = `${vde4105_q},${vde4105_v1},${vde4105_v2},${vde4105_v3},${vde4105_v4}`;
	}

	// Get oldParameters
	$.get({
		url: "api.php?get=settings",
		async: false,
		error: () => { alert("E050. Please refresh the page!"); },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E051. Please refresh the page!");
			
			response = response["InverterParameters"];
			deviceDatetime = response["0"]["s1"];
			
			oldParameters["maxChargingCurrent"      ] = !response.hasOwnProperty("30") ? "" : response["30"]["s1"];
			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

		}
	});

	console.log("newParameters"); console.log(newParameters);
	console.log("oldParameters"); console.log(oldParameters);

	var retry = false;

	if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setupOther_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }
	if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupOther_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
	if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupOther_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
	if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupOther_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
	if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupOther_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
	if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupOther_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
	if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupOther_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
	if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupOther_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
	if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupOther_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
	if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupOther_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
	if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupOther_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
	if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupOther_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
	if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupOther_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
	if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupOther_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
	if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupOther_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

	if(!retry) {
		$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
		$("#notif").removeClass("loading error success").addClass("success");
		// Next Step
		setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
	} else console.log("SETTING PARAMETERS");

}





/*
	Send Other Command
*/

function setupOther_sendCommand(type, entity, text1, text2) {
	$.get({
		url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
		error: () => { alert("E052. Please refresh the page!") },
		success: function(response) {
			if(response != "1") return alert("E053. Please refresh the page!");
			if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setupOther_checkParameters, 5000);
		}
	});
}





/*
	Check If Parameters Are Correct
*/

function setupOther_checkParameters() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E054. Please refresh the page!") },
		success: (response) => {

			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E055. Please refresh the page!");

			response = response["InverterParameters"];
			if(response["0"]["s1"] == deviceDatetime) return false;
			deviceDatetime = response["0"]["s1"];

			oldParameters["maxChargingCurrent"      ] = !response.hasOwnProperty("30") ? "" : response["30"]["s1"];
			oldParameters["maxChargingCurrentAC"    ] = !response.hasOwnProperty("31") ? "" : response["31"]["s1"];
			oldParameters["chargingVoltage"         ] = !response.hasOwnProperty("32") ? "" : response["32"]["s1"];
			oldParameters["dischargingVoltage"      ] = !response.hasOwnProperty("33") ? "" : response["33"]["s1"];
			oldParameters["maxDischargingCurrent"   ] = !response.hasOwnProperty("34") ? "" : response["34"]["s1"];
			oldParameters["batteryType"             ] = !response.hasOwnProperty( "5") ? "" : response[ "5"]["s1"];
			oldParameters["solarEnergyPriority"     ] = !response.hasOwnProperty( "6") ? "" : response[ "6"]["s1"];
			oldParameters["allowBatteryCharging"    ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[0];
			oldParameters["allowBatteryChargingAC"  ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[1];
			oldParameters["allowGridInjection"      ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[2];
			oldParameters["allowDischargingSolarOK" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[3];
			oldParameters["allowDischargingSolarNOK"] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[4];
			oldParameters["maxGridFeedInPower"      ] = !response.hasOwnProperty("15") ? "" : response["15"]["s1"];
			oldParameters["autoAdjustPowerFactor"   ] = !response.hasOwnProperty("36") ? "" : response["36"]["s1"];
			oldParameters["allowQuDeratingFunction" ] = !response.hasOwnProperty( "2") ? "" : response[ "2"]["s1"].split(",")[7];
			oldParameters["voltageAndReactivePower" ] = !response.hasOwnProperty("37") ? "" : response["37"]["s1"];

			if(oldParameters["voltageAndReactivePower"] == "") newParameters["voltageAndReactivePower"] = "";

			console.log("newParameters"); console.log(newParameters);
			console.log("oldParameters"); console.log(oldParameters);
			
			var retry = false;

			if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setupOther_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }
			if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) { retry = true; setupOther_sendCommand(24113, 0, "",        newParameters["maxChargingCurrentAC"    ]); }
			if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setupOther_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
			if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setupOther_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
			if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setupOther_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
			if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setupOther_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
			if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setupOther_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
			if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setupOther_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
			if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setupOther_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
			if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setupOther_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
			if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setupOther_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
			if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setupOther_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
			if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setupOther_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
			if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setupOther_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
			if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setupOther_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }

			if(!retry) {
				$(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
				$("#notif").removeClass("loading error success").addClass("success");
				// Next Step
				setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
			} else {
				checkParametersCounter++;
				if(checkParametersCounter < 5) {
					console.log(`RETRYING, ${checkParametersCounter + 1}/5, PLEASE WAIT!`);
				} else {
					// Show Error - Parameter Not Accepted
						 if(newParameters["maxChargingCurrent"      ] != oldParameters["maxChargingCurrent"      ]) showSettingParametersError("Problem when setting maxChargingCurrent"      );
					else if(newParameters["maxChargingCurrentAC"    ] != oldParameters["maxChargingCurrentAC"    ]) showSettingParametersError("Problem when setting maxChargingCurrentAC"    );
					else if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) showSettingParametersError("Problem when setting chargingVoltage"         );
					else if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) showSettingParametersError("Problem when setting dischargingVoltage"      );
					else if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) showSettingParametersError("Problem when setting maxDischargingCurrent"   );
					else if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) showSettingParametersError("Problem when setting batteryType"             );
					else if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) showSettingParametersError("Problem when setting solarEnergyPriority"     );
					else if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) showSettingParametersError("Problem when setting allowBatteryCharging"    );
					else if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) showSettingParametersError("Problem when setting allowBatteryChargingAC"  );
					else if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) showSettingParametersError("Problem when setting allowGridInjection"      );
					else if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) showSettingParametersError("Problem when setting allowDischargingSolarOK" );
					else if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) showSettingParametersError("Problem when setting allowDischargingSolarNOK");
					else if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) showSettingParametersError("Problem when setting autoAdjustPowerFactor"   );
					else if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) showSettingParametersError("Problem when setting allowQuDeratingFunction" );
					else if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) showSettingParametersError("Problem when setting voltageAndReactivePower" );
				}
			}

		}
	});
}
