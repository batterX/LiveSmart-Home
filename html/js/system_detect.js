$progress.trigger("step", 4);





step1();





var objDeviceStandards = {
	"050": "VDE0126",
	"051": "AS4777",
	"052": "DK",
	"053": "RD1663",
	"054": "G83",
	"055": "TaiWan",
	"056": "USH",
	"057": "USL",
	"058": "VDE4105",
	"059": "Korea",
	"060": "HongSun",
	"061": "Sweden",
	"062": "NRS097",
	"063": "Indian",
	"064": "EN50438",
	"065": "Czech",
	"066": "DanMark",
	"067": "Finland",
	"068": "Ireland",
	"069": "Norway",
	"070": "CEI-021",
	"071": "G59",
	"072": "NZLD",
	"073": "Cyprus",
	"074": "TOR",
	"075": "EN50549",
	"076": "G98",
	"901": "Estonia"
}

var deviceStandard = "";
var isVde4105 = "";
var isVde0126 = "";
var isTor     = "";
var isEstonia = "";





// Get CurrentState (Verify if inverter is working)

var previousLogtime = null;

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
				if(previousLogtime == null) previousLogtime = json["logtime"];
				else if(previousLogtime != json["logtime"]) alert("Error! PC or liveX time/timezone not set correctly.");
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
		error: () => { alert("E001. Please refresh the page! (Error while reading device info from local database)"); },
		success: (json) => {
			console.log(json);
			if(!json || typeof json != "object" || !json.hasOwnProperty("device_model") || !json.hasOwnProperty("device_serial_number"))
				return alert("E002. Please refresh the page! (Missing or malformed data in local device info table)");
			var device_model         = json["device_model"        ];
			var device_serial_number = json["device_serial_number"];
			$(".serialnumber b").html(device_serial_number);
			if(device_model == "batterX h5") {
				$("#inverterDetected h1 .model").html("h5");
				$("#inverterDetected img").attr("src", "img/device_batterx_h5.png");
			} else if(device_model == "batterX h10") {
				$("#inverterDetected h1 .model").html("h10");
				$("#inverterDetected img").attr("src", "img/device_batterx_h10.png");
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
		url: "https://api.batterx.app/v2/install.php",
		data: {
			action: "verify_device",
			serialnumber: device_serial_number
		},
		error: () => { alert("E003. Please refresh the page! (Error while verifying device serialnumber in cloud)"); },
		success: (response) => {
			// Show Not Registered
			if(response != "1") {
				$(".notif").removeClass("loading error success").addClass("error");
				$(".message").html(lang.system_detect.inverter_not_registered + "<br>" + "(S/N: " + device_serial_number + ")").css("color", "red");
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





// Show Certificate Status & Disable Buzzer

function step4() {

	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E004. Please refresh the page! (Error while reading local settings table)"); },
		success: (response) => {

			// Log Response
			console.log(response);

			// Check If MachineModel Exists
			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters") || !response["InverterParameters"].hasOwnProperty("35"))
				return alert("Please wait one minute, then refresh the page!");

			// Get Machine Model
			deviceStandard = response["InverterParameters"]["35"]["s1"];
			isVde4105 = deviceStandard == "058" ? "1" : "0";
			isVde0126 = deviceStandard == "050" ? "1" : "0";
			isTor     = deviceStandard == "074" ? "1" : "0";
			isEstonia = deviceStandard == "901" ? "1" : "0";

			$("#germanyMachineModelSelect").val(deviceStandard);
			$("#machineModelSelect").val(deviceStandard);
			$("#modalConfirmDeviceStandardValue").text(objDeviceStandards[deviceStandard]);
			
			// Germany (058 = VDE4105 | 050 = VDE0126)
			if(installationCountry == "de") {
				$(".standard").text("VDE4105");
				// Show Status
				if(isVde4105 != "1" && isVde0126 != "1") {
					$(".standard").css("color", "red");
					$(".cert-status").removeClass("loading error success").addClass("error").css("display", "block");
					$(`#machineModelSelect option[value="${deviceStandard}"]`).append("*");
					$("#machineModelBox").removeClass("d-none");
				} else {
					if(isVde4105 == "1") {
						$(".standard").css("color", "#28a745");
						$(".cert-status").removeClass("loading error success").addClass("success").css("display", "block");
					} else {
						$(".standard").css("color", "red");
						$(".cert-status").removeClass("loading error success").addClass("error").css("display", "block");
					}
					$(`#germanyMachineModelSelect option[value="${deviceStandard}"]`).append("*");
					$("#germanyMachineModelBox").removeClass("d-none");
				}
			}
			// Austria (074 = TOR)
			else if(installationCountry == "at") {
				$(".standard").text("TOR");
				// Show Status
				if(isTor != "1") {
					$(".standard").css("color", "red");
					$(".cert-status").removeClass("loading error success").addClass("error").css("display", "block");
					$(`#machineModelSelect option[value="${deviceStandard}"]`).append("*");
					$("#machineModelBox").removeClass("d-none");
				} else {
					$(".standard").css("color", "#28a745");
					$(".cert-status").removeClass("loading error success").addClass("success").css("display", "block");
				}
			}
			// Other
			else {
				// Show Status
				$(".standard").css("color", "black").html(`${objDeviceStandards.hasOwnProperty(deviceStandard) ? objDeviceStandards[deviceStandard] : '-'}`);
				$(".cert-status").addClass("d-none");
				$("#machineModelSelect").removeClass("border-danger").addClass("border-secondary");
				$(`#machineModelSelect option[value="${deviceStandard}"]`).append("*");
				$("#machineModelBtn").removeClass("btn-danger").addClass("btn-secondary");
				$("#machineModelBox").removeClass("d-none");
			}

			// Store Certificate Variable
			$.post({
				url: "cmd/session.php",
				data: {
					vde4105: isVde4105,
					tor:     isTor,
					estonia: isEstonia
				},
				error: () => { alert("E006. Please refresh the page! (Error while saving data to session)"); },
				success: (response) => {
					console.log(response);
					if(response === "1") $("#btn_next").attr("disabled", false);
					else alert("E007. Please refresh the page! (Bad response while saving data to session)");
				}
			});

		}
	});
}





// Button MachineModel onClick

$("#germanyMachineModelBtn").on("click", () => {
	$("#machineModelSelect").val($("#germanyMachineModelSelect").val());
	$("#machineModelBtn").trigger("click");
});

$("#machineModelBtn").on("click", () => {
	// Switch to Selected MachineModel
	$.get({
		url: "api.php?set=command&type=24117&entity=0&text2=" + $("#machineModelSelect").val(),
		error: () => { alert("E008. Please refresh the page! (Error while writing command to local database)"); },
		success: () => {
			$("#germanyMachineModelBox").hide();
			$("#machineModelBox").hide();
			$("#btn_next").attr("disabled", true);
			$(".cert-loading").css("display", "block");
			checkParameters();
		}
	});
});

var deviceDatetime = "";
function checkParameters() {
	$.get({
		url: "api.php?get=settings",
		error: () => { alert("E009. Please refresh the page! (Error while reading local settings table)"); },
		success: (response) => {
			console.log(response);
			if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
				return alert("E010. Please refresh the page! (Missing or malformed data in local settings table)");
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
		error: () => { alert("E011. Please refresh the page! (Error while writing command to local database)"); },
		success: () => {

			// Show Confirmation Modal IF Germany Without VDE4105
			if(installationCountry == "de" && isVde4105 != "1") {
				$("#modalConfirmDeviceStandard").modal("show");
				$("#modalConfirmDeviceStandardBtn").unbind().on("click", () => {
					setTimeout(() => { window.location.href = "system_setup.php"; }, 1000);
					$("#modalConfirmDeviceStandard").modal("hide");
				});
			}
			// Else Continue To Next Page
			else {
				setTimeout(() => { window.location.href = "system_setup.php"; }, 1000);
			}

		}
	});
});
