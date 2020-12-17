/*
	HELPER FUNCTIONS
*/

function getCurrentState(callback) {
    $.get({
        url: "api.php?get=currentstate",
        error: () => { callback(null); },
        success: (json) => { callback(json); }
    });
}
function getSettings(callback) {
    $.get({
        url: "api.php?get=settings",
        error: () => { callback(null); },
        success: (json) => { callback(json); }
    });
}

function enableStep (stepId) { $(`#${stepId}`).addClass   ("enable-step"); }
function disableStep(stepId) { $(`#${stepId}`).removeClass("enable-step"); }
function finishStep (stepId) { $(`#${stepId}`).removeClass("enable-step").addClass("finish-step"); }

function logMsg(viewId, cls, msg) {
	if(msg == $(`#${viewId} .log .msg:last-child`).html()) return;
	$(`#${viewId} .log`).append(`<div class="msg ${cls}">${msg}</div>`);
}

function removeLastMsg(viewId) {
	$(`#${viewId} .log .msg:last-child`).remove();
}




















/*
    LIVEX UPDATE
*/

var livex_update_newVersion = softwareVersion;
var livex_update_interval;
var livex_update_isFinished = false;

function livex_update() {

	enableStep("livex_update");

	logMsg("livex_update", "", `Installed Version: <b>${softwareVersion}</b>`);

    $.get({
		url: "https://api.batterx.io",
		dataType: "text",
		cache: false,
		error: () => {
			logMsg("livex_update", "mt-4 red", "No Internet Connection");
            setTimeout(livex_update, 5000); // Retry after 5 seconds
		},
		success: () => {

			logMsg("livex_update", "", "Searching For Update");

			// Get Latest Version Number
			$.get({
				url: "https://raw.githubusercontent.com/batterX/LiveSmart-Home/master/version.txt",
				dataType: "text",
				cache: false,
				error: () => {
					removeLastMsg("livex_update");
					logMsg("livex_update", "mt-4 red", "No Internet Connection");
					setTimeout(livex_update, 5000);
				},
				success: (versionNum) => {

					removeLastMsg("livex_update");
					logMsg("livex_update", "", `Available Version: <b>${versionNum}</b>`);

					// Compare Versions
					if(softwareVersion != versionNum) {
						livex_update_newVersion = versionNum;
						// Download Update
						$.post("cmd/update.php");
						// Downloading Update...
						logMsg("livex_update", "mt-4", "Downloading Update. Please wait…");
						clearInterval(livex_update_interval);
						livex_update_interval = undefined;
						livex_update_interval = setInterval(livex_update_waitForError, 5000);
					} else {
						// Update Completed
						logMsg("livex_update", "mt-4 green text-center", "<b>CONTINUE NEXT STEP</b>");
						finishStep("livex_update");
						ups_mode_test();
					}

				}
			});

		}
	});

}

function livex_update_waitForError() {
	$.get({
		url: "cmd/working.txt",
		cache: false,
		error: () => {
			// Rebooting...
			removeLastMsg("livex_update");
			logMsg("livex_update", "mt-4", "Rebooting. Please wait…");
			clearInterval(livex_update_interval);
			livex_update_interval = undefined;
			livex_update_interval = setInterval(livex_update_waitForSuccess, 5000);
		},
		success: (response) => {
			if(response) return;
			// Rebooting...
			removeLastMsg("livex_update");
			logMsg("livex_update", "mt-4", "Rebooting. Please wait…");
			clearInterval(livex_update_interval);
			livex_update_interval = undefined;
			livex_update_interval = setInterval(livex_update_waitForSuccess, 5000);
		}
	});
}

function livex_update_waitForSuccess() {
	$.get({
		url: "cmd/working.txt",
		cache: false,
		success: (response) => {
			if(!response) return;
			// Finishing Update...
			removeLastMsg("livex_update");
			logMsg("livex_update", "mt-4", "Finishing Update. Please wait…");
			clearInterval(livex_update_interval);
			livex_update_interval = undefined;
			setTimeout(() => {
				// Update Completed
				removeLastMsg("livex_update");
				logMsg("livex_update", "mt-4 green", "Update Completed");
				setTimeout(() => { window.location.reload(true); }, 5000);
			}, 60000);
		}
	});
}




















/*
    UPS MODE TEST
*/

function ups_mode_test() {

	enableStep("ups_mode_test");

	$("#ups_mode_test .step-start").on("click", () => {
		$("#ups_mode_test .step-info, #ups_mode_test .step-start").addClass("d-none");
		ups_mode_test_s1();
	});

}

function ups_mode_test_s1() {
	removeLastMsg("ups_mode_test");
	logMsg("ups_mode_test", "", "Setting System Mode to UPS. Please wait... (60 sec)");
	// Set SystemMode to UPS
	$.get({ url: "api.php?set=command&type=20752&text1=0&text2=0", success: (response) => { console.log(response); } });
	// Wait 60 seconds, then check if SystemMode is UPS
	setTimeout(() => {
		getSettings((json) => {
			if(json == null) { ups_mode_test_s1(); return; }
			// Check SystemMode
			if(!json.hasOwnProperty("SystemMode")) { ups_mode_test_s1(); return; }
			if(json["SystemMode"]["0"]["mode"] != "0") { ups_mode_test_s1(); return; }
			removeLastMsg("ups_mode_test");
			logMsg("ups_mode_test", "green", "System Mode = UPS");
			logMsg("ups_mode_test", "", "");
			ups_mode_test_s2();
		});
	}, 60000);
}

function ups_mode_test_s2() {
	removeLastMsg("ups_mode_test");
	logMsg("ups_mode_test", "", "Turning UPS Output ON. Please wait...");
	// Turn Output ON
	$.get({ url: "api.php?set=command&type=24224&text1=0&text2=1", success: (response) => { console.log(response); } });
	// Wait 15 seconds, then check if Output ON
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { ups_mode_test_s2(); return; }
			// Check UPS Output
			if(json[1297][1] < 20000) { ups_mode_test_s2(); return; }
			if(json[1298][1] < 20000) { ups_mode_test_s2(); return; }
			if(json[1299][1] < 20000) { ups_mode_test_s2(); return; }
			removeLastMsg("ups_mode_test");
			logMsg("ups_mode_test", "green", "UPS Output = ON");
			logMsg("ups_mode_test", "", "");
			ups_mode_test_s3();
		});
	}, 15000);
}

function ups_mode_test_s3() {
	// Check Voltages & Powers
	getCurrentState((json) => {
		if(json == null) { ups_mode_test_s3(); return; }
		// Check UPS Output Voltage
		if(json[1297][1] < 20000) { alert("ERROR -> UPS Output L1 Voltage < 200V"); return; }
		if(json[1298][1] < 20000) { alert("ERROR -> UPS Output L2 Voltage < 200V"); return; }
		if(json[1299][1] < 20000) { alert("ERROR -> UPS Output L3 Voltage < 200V"); return; }
		// Check UPS Input Voltage
		if(json[273][1] < 20000) { alert("ERROR -> UPS Input L1 Voltage < 200V"); return; }
		if(json[274][1] < 20000) { alert("ERROR -> UPS Input L2 Voltage < 200V"); return; }
		if(json[275][1] < 20000) { alert("ERROR -> UPS Input L3 Voltage < 200V"); return; }
		// Check E.Meter Voltage
		if(json[2833][0] < 20000) { alert("ERROR -> E.Meter L1 Voltage < 200V"); return; }
		if(json[2834][0] < 20000) { alert("ERROR -> E.Meter L2 Voltage < 200V"); return; }
		if(json[2835][0] < 20000) { alert("ERROR -> E.Meter L3 Voltage < 200V"); return; }
		// Check UPS Output Power
		if(json[1377][1] < 500) { alert("ERROR -> UPS Output Power < 500W"); return; }
		// Check Unprotected Power
		if(json[2913][2] > 500) { alert("ERROR -> Unprotected Power > 500W"); return; }
		ups_mode_test_s4();
	});
}

function ups_mode_test_s4() {
	removeLastMsg("ups_mode_test");
	logMsg("ups_mode_test", "", "Testing System UPS Mode. Please wait...");
	// Turn Output OFF
	$.get({ url: "api.php?set=command&type=24224&text1=0&text2=0", success: (response) => { console.log(response); } });
	// Wait 15 seconds, then check if working
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { ups_mode_test_s4(); return; }
			// Check UPS Output Voltage
			if(json[1297][1] != 0) { alert("ERROR -> UPS Output L1 Voltage != 0V"); return; }
			if(json[1298][1] != 0) { alert("ERROR -> UPS Output L2 Voltage != 0V"); return; }
			if(json[1299][1] != 0) { alert("ERROR -> UPS Output L3 Voltage != 0V"); return; }
			// Check UPS Input Voltage
			if(json[273][1] < 20000) { alert("ERROR -> UPS Input L1 Voltage < 200V"); return; }
			if(json[274][1] < 20000) { alert("ERROR -> UPS Input L2 Voltage < 200V"); return; }
			if(json[275][1] < 20000) { alert("ERROR -> UPS Input L3 Voltage < 200V"); return; }
			// Check E.Meter Voltage
			if(json[2833][0] < 20000) { alert("ERROR -> E.Meter L1 Voltage < 200V"); return; }
			if(json[2834][0] < 20000) { alert("ERROR -> E.Meter L2 Voltage < 200V"); return; }
			if(json[2835][0] < 20000) { alert("ERROR -> E.Meter L3 Voltage < 200V"); return; }
			// Check UPS Output Power
			if(json[1377][1] > 0) { alert("ERROR -> UPS Output Power > 0W"); return; }
			// Check Unprotected Power
			if(json[2913][2] < 500) { alert("ERROR -> Unprotected Power < 500W"); return; }
			// TEST OK
			removeLastMsg("ups_mode_test");
			logMsg("ups_mode_test", "green", "Test = OK");
			logMsg("ups_mode_test", "", "");
			ups_mode_test_s5();
		});
	}, 15000);
}

function ups_mode_test_s5() {
	removeLastMsg("ups_mode_test");
	logMsg("ups_mode_test", "", "Finishing Test. Please wait...");
	// Turn Output ON
	$.get({ url: "api.php?set=command&type=24224&text1=0&text2=1", success: (response) => { console.log(response); } });
	// Wait 15 seconds, then check if Output ON
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { ups_mode_test_s5(); return; }
			// Check UPS Output
			if(json[1297][1] < 20000) { ups_mode_test_s5(); return; }
			if(json[1298][1] < 20000) { ups_mode_test_s5(); return; }
			if(json[1299][1] < 20000) { ups_mode_test_s5(); return; }
			removeLastMsg("ups_mode_test");
			logMsg("ups_mode_test", "mt-4 green text-center", "<b>CONTINUE NEXT STEP</b>");
			finishStep("ups_mode_test");
			gpio_test();
		});
	}, 15000);
}




















/*
    GPIO TEST
*/

function gpio_test() {
	enableStep("gpio_test");
	// Attention! Output 4 is inverted!
	$("#gpio_test .step-start, #gpio_test .step-content").on("click", () => {
		$("#gpio_test .step-info, #gpio_test .step-start").addClass("d-none");
		$("#gpio_test .step-content").removeClass("d-none");
		gpio_test_start();
	});
}

function gpio_test_start() {
	// Turn-Off Outputs
	$.get({ url: "api.php?set=command&type=20737&text1=1&text2=0", success: (response) => { console.log(response); } });
	$.get({ url: "api.php?set=command&type=20737&text1=2&text2=0", success: (response) => { console.log(response); } });
	$.get({ url: "api.php?set=command&type=20737&text1=3&text2=0", success: (response) => { console.log(response); } });
	$.get({ url: "api.php?set=command&type=20737&text1=4&text2=0", success: (response) => { console.log(response); } });
	// Wait 10 seconds, then check if all ouputs are off
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { gpio_test_start(); return; }
			// Check Outputs (Must be forced-off)
			if(json[2337][1] != 10) { gpio_test_start(); return; }
			if(json[2337][2] != 10) { gpio_test_start(); return; }
			if(json[2337][3] != 10) { gpio_test_start(); return; }
			if(json[2337][4] != 10) { gpio_test_start(); return; }
			// Check Inputs (1/2/3 Off, 4 On)
			if(json[2321][1] !=  0) { alert("ERROR -> INPUT 1"); return; }
			if(json[2321][2] !=  0) { alert("ERROR -> INPUT 2"); return; }
			if(json[2321][3] !=  0) { alert("ERROR -> INPUT 3"); return; }
			if(json[2321][4] !=  1) { alert("ERROR -> INPUT 4"); return; }
			// Begin Test
			gpio_test_1();
		});
	}, 10000);
}

function gpio_test_1() {
	$.get({
		url: "api.php?set=command&type=20737&text1=1&text2=1",
		error: () => { alert("ERROR -> API PROBLEM"); },
		success: (response) => {
			console.log(response);
			$("#gpio_test .out1").addClass("red");
			$("#gpio_test .in1").addClass("red");
			setTimeout(() => {
				getCurrentState((json) => {
					if(json == null) { gpio_test_1(); return; }
					if(json[2337][1] != 11) { gpio_test_1(); return; }
					$("#gpio_test .out1").addClass("green");
					if(json[2321][1] != 1) { alert("ERROR -> INPUT 1"); return; }
					$("#gpio_test .in1").addClass("green");
					$.get({ url: "api.php?set=command&type=20737&text1=1&text2=0", success: (response) => { console.log(response); } });
					gpio_test_2();
				});
			}, 10000);
		}
	});
}

function gpio_test_2() {
	$.get({
		url: "api.php?set=command&type=20737&text1=2&text2=1",
		error: () => { alert("ERROR -> API PROBLEM"); },
		success: (response) => {
			console.log(response);
			$("#gpio_test .out2").addClass("red");
			$("#gpio_test .in2").addClass("red");
			setTimeout(() => {
				getCurrentState((json) => {
					if(json == null) { gpio_test_2(); return; }
					if(json[2337][2] != 11) { gpio_test_2(); return; }
					$("#gpio_test .out2").addClass("green");
					if(json[2321][2] != 1) { alert("ERROR -> INPUT 2"); return; }
					$("#gpio_test .in2").addClass("green");
					$.get({ url: "api.php?set=command&type=20737&text1=2&text2=0", success: (response) => { console.log(response); } });
					gpio_test_3();
				});
			}, 10000);
		}
	});
}

function gpio_test_3() {
	$.get({
		url: "api.php?set=command&type=20737&text1=3&text2=1",
		error: () => { alert("ERROR -> API PROBLEM"); },
		success: (response) => {
			console.log(response);
			$("#gpio_test .out3").addClass("red");
			$("#gpio_test .in3").addClass("red");
			setTimeout(() => {
				getCurrentState((json) => {
					if(json == null) { gpio_test_3(); return; }
					if(json[2337][3] != 11) { gpio_test_3(); return; }
					$("#gpio_test .out3").addClass("green");
					if(json[2321][3] != 1) { alert("ERROR -> INPUT 3"); return; }
					$("#gpio_test .in3").addClass("green");
					$.get({ url: "api.php?set=command&type=20737&text1=3&text2=0", success: (response) => { console.log(response); } });
					gpio_test_4();
				});
			}, 10000);
		}
	});
}

function gpio_test_4() {
	$.get({
		url: "api.php?set=command&type=20737&text1=4&text2=1",
		error: () => { alert("ERROR -> API PROBLEM"); },
		success: (response) => {
			console.log(response);
			$("#gpio_test .out4").addClass("red");
			$("#gpio_test .in4").addClass("red");
			setTimeout(() => {
				getCurrentState((json) => {
					if(json == null) { gpio_test_4(); return; }
					if(json[2337][4] != 11) { gpio_test_4(); return; }
					$("#gpio_test .out4").addClass("green");
					if(json[2321][4] != 0) { alert("ERROR -> INPUT 4"); return; }
					$("#gpio_test .in4").addClass("green");
					$.get({ url: "api.php?set=command&type=20737&text1=4&text2=0", success: (response) => { console.log(response); } });
					// Test Completed
					logMsg("gpio_test", "mt-4 green text-center", "<b>CONTINUE NEXT STEP</b>");
					finishStep("gpio_test");
					emeter_test();
				});
			}, 10000);
		}
	});
}




















/*
    E.METER TEST
*/

function emeter_test() {
	enableStep("emeter_test");
	$("#emeter_test .step-start").on("click", () => {
		$("#emeter_test .step-info, #emeter_test .step-start").addClass("d-none");
		emeter_test_start();
	});
}

function emeter_test_start() {
	removeLastMsg("emeter_test");
	logMsg("emeter_test", "", "Testing E.Meter Connection. Please wait...")
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { emeter_test_start(); return; }
			if(!json.hasOwnProperty(2913) || !json[2913].hasOwnProperty(0)) {
				removeLastMsg("emeter_test");
				logMsg("emeter_test", "red", "E.Meter Connection Problem!");
				setTimeout(() => { emeter_test_start(); }, 5000);
				return;
			}
			removeLastMsg("emeter_test");
			logMsg("emeter_test", "green", "E.Meter Test OK");
			logMsg("emeter_test", "mt-4 green text-center", "<b>CONTINUE NEXT STEP</b>");
			finishStep("emeter_test");
			backup_mode_test();
		});
	}, 5000);
}




















/*
    BACKUP MODE TEST
*/

function backup_mode_test() {
	enableStep("backup_mode_test");
	$("#backup_mode_test .step-start-1").on("click", () => {
		$("#backup_mode_test .step-info-1, #backup_mode_test .step-start-1").addClass("d-none");
		backup_mode_test_start();
	});
}

function backup_mode_test_start() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Verifying. Please wait...");
	// Turn-On Output 1
	$.get({ url: "api.php?set=command&type=20737&text1=1&text2=1", success: (response) => { console.log(response); } });
	// Wait 10 seconds, then check if output 1 is on
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_start(); return; }
			// Check Output 1 (Must be forced-on)
			if(json[2337][1] != 11) { backup_mode_test_start(); return; }
			// Check Input 1 (Must be on)
			if(json[2321][1] !=  0) { alert("ERROR -> GPIO CONNECTOR IS STILL CONNECTED"); return; }
			// Turn-Off Output 1
			$.get({ url: "api.php?set=command&type=20737&text1=1&text2=0", success: (response) => { console.log(response); } });
			// Continue Test
			backup_mode_test_2();
		});
	}, 10000);
}

function backup_mode_test_2() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Turning UPS Output OFF. Please wait...");
	// Turn Output OFF
	$.get({ url: "api.php?set=command&type=24224&text1=0&text2=0", success: (response) => { console.log(response); } });
	// Wait 15 seconds, then check if Output OFF
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_2(); return; }
			// Check UPS Output
			if(json[1297][1] != 0) { backup_mode_test_2(); return; }
			if(json[1298][1] != 0) { backup_mode_test_2(); return; }
			if(json[1299][1] != 0) { backup_mode_test_2(); return; }
			backup_mode_test_3();
		});
	}, 15000);
}

function backup_mode_test_3() {
	removeLastMsg("backup_mode_test");
	$("#backup_mode_test .step-info-2, #backup_mode_test .step-start-2").removeClass("d-none");
	$("#backup_mode_test .step-start-2").on("click", () => {
		$("#backup_mode_test .step-info-2, #backup_mode_test .step-start-2").addClass("d-none");
		backup_mode_test_4();
	});
}

function backup_mode_test_4() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Turning UPS Output ON. Please wait...");
	// Turn Output ON
	$.get({ url: "api.php?set=command&type=24224&text1=0&text2=1", success: (response) => { console.log(response); } });
	// Wait 15 seconds, then check if Output ON
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_4(); return; }
			// Check UPS Output
			if(json[1297][1] < 20000) { backup_mode_test_4(); return; }
			if(json[1298][1] < 20000) { backup_mode_test_4(); return; }
			if(json[1299][1] < 20000) { backup_mode_test_4(); return; }
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "UPS Output = ON");
			logMsg("backup_mode_test", "", "");
			backup_mode_test_5();
		});
	}, 15000);
}

function backup_mode_test_5() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Setting System Mode to BACKUP. Please wait... (60 sec)");
	// Set SystemMode to BACKUP
	$.get({ url: "api.php?set=command&type=20752&text1=0&text2=1", success: (response) => { console.log(response); } });
	// Wait 60 seconds, then check if SystemMode is BACKUP
	setTimeout(() => {
		getSettings((json) => {
			if(json == null) { backup_mode_test_5(); return; }
			// Check SystemMode
			if(!json.hasOwnProperty("SystemMode")) { backup_mode_test_5(); return; }
			if(json["SystemMode"]["0"]["mode"] != "1") { backup_mode_test_5(); return; }
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "System Mode = BACKUP");
			logMsg("backup_mode_test", "", "");
			backup_mode_test_6();
		});
	}, 60000);
}

function backup_mode_test_6() {
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_6(); return; }
			// Check UPS Output Voltage
			if(json[1297][1] < 20000) { alert("ERROR -> UPS Output L1 Voltage < 200V"); return; }
			if(json[1298][1] < 20000) { alert("ERROR -> UPS Output L2 Voltage < 200V"); return; }
			if(json[1299][1] < 20000) { alert("ERROR -> UPS Output L3 Voltage < 200V"); return; }
			// Check UPS Input Voltage
			if(json[273][1] < 20000) { alert("ERROR -> UPS Input L1 Voltage < 200V"); return; }
			if(json[274][1] < 20000) { alert("ERROR -> UPS Input L2 Voltage < 200V"); return; }
			if(json[275][1] < 20000) { alert("ERROR -> UPS Input L3 Voltage < 200V"); return; }
			// Check E.Meter Voltage
			if(json[2833][0] < 20000) { alert("ERROR -> E.Meter L1 Voltage < 200V"); return; }
			if(json[2834][0] < 20000) { alert("ERROR -> E.Meter L2 Voltage < 200V"); return; }
			if(json[2835][0] < 20000) { alert("ERROR -> E.Meter L3 Voltage < 200V"); return; }
			// Check UPS Output Power
			if(json[1377][1] > 100) { alert("ERROR -> UPS Output Power > 100W"); return; }
			// Check Unprotected Power
			if(json[2913][2] < 500) { alert("ERROR -> Unprotected Power < 500W"); return; }
			// Continue
			backup_mode_test_7();
		});
	}, 5000);
}

function backup_mode_test_7() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "mt-4", "<b>Please Turn Grid Input OFF</b>");
	// Wait Until Grid Input OFF
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_7(); return; }
			// Check UPS Input
			if(json[273][1] != 0) { backup_mode_test_7(); return; }
			if(json[274][1] != 0) { backup_mode_test_7(); return; }
			if(json[275][1] != 0) { backup_mode_test_7(); return; }
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "Grid Input = OFF");
			logMsg("backup_mode_test", "", "");
			backup_mode_test_8();
		});
	}, 5000);
}

function backup_mode_test_8() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Testing. Please wait...");
	// Wait 15 seconds then test voltage/power
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_8(); return; }
			// Check UPS Output Voltage
			if(json[1297][1] < 20000) { alert("ERROR -> UPS Output L1 Voltage < 200V"); return; }
			if(json[1298][1] < 20000) { alert("ERROR -> UPS Output L2 Voltage < 200V"); return; }
			if(json[1299][1] < 20000) { alert("ERROR -> UPS Output L3 Voltage < 200V"); return; }
			// Check UPS Output Power
			if(json[1377][1] < 500) { alert("ERROR -> UPS Output Power < 500W"); return; }
			// Continue
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "Test = OK");
			logMsg("backup_mode_test", "", "");
			backup_mode_test_9();
		});
	}, 15000);
}

function backup_mode_test_9() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "mt-4", "<b>Please Turn Grid Input ON</b>");
	// Wait Until Grid Input ON
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_9(); return; }
			// Check UPS Input
			if(json[273][1] < 20000) { backup_mode_test_9(); return; }
			if(json[274][1] < 20000) { backup_mode_test_9(); return; }
			if(json[275][1] < 20000) { backup_mode_test_9(); return; }
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "Grid Input = ON");
			logMsg("backup_mode_test", "", "");
			backup_mode_test_10();
		});
	}, 5000);
}

function backup_mode_test_10() {
	removeLastMsg("backup_mode_test");
	logMsg("backup_mode_test", "", "Testing. Please wait...");
	// Wait 15 seconds then test voltage/power
	setTimeout(() => {
		getCurrentState((json) => {
			if(json == null) { backup_mode_test_10(); return; }
			// Check UPS Output Voltage
			if(json[1297][1] < 20000) { alert("ERROR -> UPS Output L1 Voltage < 200V"); return; }
			if(json[1298][1] < 20000) { alert("ERROR -> UPS Output L2 Voltage < 200V"); return; }
			if(json[1299][1] < 20000) { alert("ERROR -> UPS Output L3 Voltage < 200V"); return; }
			// Check UPS Output Power
			if(json[1377][1] > 100) { alert("ERROR -> UPS Output Power > 100W"); return; }
			// Check Unprotected Power
			if(json[2913][2] < 500) { alert("ERROR -> Unprotected Power < 500W"); return; }
			// Test Completed
			removeLastMsg("backup_mode_test");
			logMsg("backup_mode_test", "green", "Test = OK");
			logMsg("backup_mode_test", "mt-4 green text-center", "<b>CONTINUE NEXT STEP</b>");
			finishStep("backup_mode_test");
			connect_default_mode();
		});
	}, 15000);
}




















/*
    CONNECT DEFAULT MODE
*/

function connect_default_mode() {

	enableStep("connect_default_mode");

	alert("TODO ... KOMMT NOCH");

}




















/*
	BEGIN TEST
*/

livex_update();
