$progress.trigger("step", 4);





step1();





// Get CurrentState (Verify if inverter is working)

function step1() {

	$.get({
		url: "api.php?get=currentstate",
		error: () => { setTimeout(step1, 5000); },
		success: (json) => {
			console.log(json);
			if(!json || typeof json != "object" || !json.hasOwnProperty("logtime")) {
				setTimeout(step1, 5000);
				return;
			}
			var curtime   = moment.utc().subtract(1, "minute").format("YYYY-MM-DD hh:mm:ss");
			var isWorking = moment(json["logtime"]).isAfter(moment(curtime));
			if(!isWorking) {
				setTimeout(step1, 5000);
				return;
			}
			// Continue Next Step
			step2();
		}
	});

}





// Get Inverter Serial-Number

function step2() {

	$.get({
		url: "api.php?get=deviceinfo",
		error: () => { alert("E001. Please refresh the page!"); },
		success: (json) => {
			console.log(json);
			if(!json || typeof json != "object" || !json.hasOwnProperty("device_model") || !json.hasOwnProperty("device_serial_number"))
				return alert("E002. Please refresh the page!");
			var device_model         = json["device_model"        ];
			var device_serial_number = json["device_serial_number"];
			$(".serialnumber b").html(device_serial_number);
			if(device_model.toLowerCase() == "batterx h5") {
				$("#inverterDetected h1 .model").html("h5");
				$("#inverterDetected img").attr("src", "img/device_h5.png");
			} else if(device_model.toLowerCase() == "batterx h10") {
				$("#inverterDetected h1 .model").html("h10");
				$("#inverterDetected img").attr("src", "img/device_h10.png");
			} else {
				$("#inverterDetected h1 .model").html("");
				$("#inverterDetected img").attr("src", "");
			}
			// Continue Next Step
			step3(json);
		}
	});

}





// Check if Inverter registered in Cloud & Show Working Status

function step3(json) {

	var device_serial_number = json.device_serial_number;

	$.post({
		url: "https://api.batterx.io/v3/install_hs.php",
		data: {
			action: "verify_device",
			serialnumber: device_serial_number
		},
		error: () => { alert("E003. Please refresh the page!"); },
		success: (response) => {
			// Show Not Registered
			if(response != "1") {
				$(".notif").removeClass("loading error success").addClass("error");
				$(".message").html(lang.system_detect.inverter_not_registered).css("color", "red");
				return;
			}
			// Show Working
			$("#inverterUnknown").addClass("d-none");
			$("#inverterDetected").removeClass("d-none");
			// Continue Next Step
			step4();
		}
	});

}





// Show VDE4105 Status & Disable Buzzer

function step4() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E004. Please refresh the page!"); },
		success: (response) => {

			// Log Response
			console.log(response);
			
			// Check If MachineModel Exists
			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters") || !response["InverterParameters"].hasOwnProperty("35"))
				return alert("E005. Please refresh the page!");

			// Get Machine Model
			var deviceStandard = response["InverterParameters"]["35"]["s1"];
			var isVde4105 = deviceStandard == "058" ? "1" : "0";
			
			// Germany (058 = VDE4105)
			if(installationCountry == "de") {
				// Show Status
				if(isVde4105 != "1") {
					$(".standard").css("color", "red");
					$(".vde-status").removeClass("loading error success").addClass("error").css("display", "block");;
					$(`#machineModelSelect option[value="${deviceStandard}"]`).append("*");
					$("#machineModelBox").removeClass("d-none");
				} else {
					$(".standard").css("color", "#28a745");
					$(".vde-status").removeClass("loading error success").addClass("success").css("display", "block");;
				}
			}
			// Other
			else {
				var obj = {
					"050": "VDE",
					"051": "AS4777",
					"052": "DK",
					"053": "RD1663",
					"054": "G83",
					"055": "Taiwan",
					"056": "USH",
					"057": "USL",
					"058": "VDE4105",
					"059": "Korea",
					"060": "HongSun",
					"061": "Sweden"
				}
				// Show Status
				$(".standard").css("color", "black").html(`${obj.hasOwnProperty(deviceStandard) ? obj[deviceStandard] : '-'}`);
				$(".vde-status").addClass("d-none");
				$("#machineModelSelect").removeClass("border-danger").addClass("border-secondary");
				$(`#machineModelSelect option[value="${deviceStandard}"]`).append("*");
				$("#machineModelBtn").removeClass("btn-danger").addClass("btn-secondary");
				$("#machineModelBox").removeClass("d-none");
			}

			// Store VDE Variable
			$.post({
				url: "cmd/session.php",
				data: { vde4105: isVde4105 },
				error: () => { alert("E006. Please refresh the page!"); },
				success: (response) => {
					console.log(response);
					if(response === "1") $("#btn_next").attr("disabled", false);
					else alert("E007. Please refresh the page!");
				}
			});

		}
	});
}





// Button MachineModel onClick

$("#machineModelBtn").on("click", () => {
	// Switch to Selected MachineModel
	$.get({
		url: "api.php?set=command&type=24117&entity=0&text2=" + $("#machineModelSelect").val(),
		error: () => { alert("E008. Please refresh the page!"); },
		success: () => {
			$("#machineModelBox").hide();
			$("#btn_next").attr("disabled", true);
			$(".vde-loading").css("display", "block");
			checkParameters();
		}
	});
});

var deviceDatetime = "";
function checkParameters() {
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E009. Please refresh the page!"); },
		success: (response) => {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E010. Please refresh the page!");
			response = response["InverterParameters"];
			if(deviceDatetime == "") { deviceDatetime = response["0"]["s1"]; setTimeout(checkParameters, 5000); return; }
			if(response["0"]["s1"] == deviceDatetime) { setTimeout(checkParameters, 5000); return; }
			location.reload();
		}
	});
}





// Button Next On-Click
$("#btn_next").on("click", () => {
	// Disable Buzzer
	$.get({
		url: "api.php?set=command&type=24065&entity=0&text2=A,1",
		error: () => { alert("E011. Please refresh the page!"); },
		success: () => { window.location.href = "system_setup.php"; }
	});
});
