$progress.trigger('step', 6);










var energyMeter_firstRun = true;

function testEnergyMeter()
{
    // Show Loading
    $('#testEnergyMeter .waiting').hide();
    $('#testEnergyMeter .success').hide();
    $('#testEnergyMeter .error'  ).hide();
    $('#testEnergyMeter .loading').show();
    if(energyMeter_firstRun)
        $('#log').append(`<p class="head"><b>${lang['energy_meter']}</b></p>`);
    $('#log').append(`<p>${lang['performing_test']}</p>`);
    // Test
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                setTimeout(function() {
                    $('#testEnergyMeter .loading').hide();
                    if(response.hasOwnProperty('2913') && response['2913'].hasOwnProperty('0')) {
                        $('#testEnergyMeter .success').show();
                        $('#log p:last-child').html(`✓ ${lang['performing_test']}`);
                        setTimeout(testBattery, 2500);
                    } else {
                        $('#testEnergyMeter .error').show();
                        $('#log p:last-child').html(`✗ ${lang['performing_test']}`);
                        setTimeout(testEnergyMeter, 5000);
                    }
                }, 2500);
            } else alert("An error has occured. Please refresh the page! _002");
            energyMeter_firstRun = false;
        },
        error: function() { alert("An error has occured. Please refresh the page! _001"); }
    });
}










var batteryChargingIsFirst = undefined;

function testBattery()
{
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('1074') && response['1074'].hasOwnProperty('1')) {
                    let batteryCapacity = response['1074']['1'];
                    if(batteryCapacity < 90) {
                        batteryChargingIsFirst = true;
                        testBatteryCharging();
                    } else {
                        batteryChargingIsFirst = false;
                        testBatteryDischarging();
                    }
                } else alert("An error has occured. Please refresh the page!");
            } else alert("An error has occured. Please refresh the page!");
        },
        error: function() { alert("An error has occured. Please refresh the page!"); }
    });
}










var batteryCharging_firstRun = true;
var batteryCharging_count = 0; // run 10 times (5sec delay), then finish
var batteryCharging_datetime = "";

function testBatteryCharging()
{
    // Show Loading
    $('#testBatteryCharging .waiting').hide();
    $('#testBatteryCharging .success').hide();
    $('#testBatteryCharging .error'  ).hide();
    $('#testBatteryCharging .loading').show();
    if(batteryCharging_firstRun)
        $('#log').append(`<p class="head"><b>${lang['battery_charging']}</b></p>`);
    $('#log').append(`<p>${lang['enable_ac_charging']}</p>`);
    // Set BatteryChargingAC ON
    $.get({
        url: "api.php?set=command&type=24066&entity=0&text2=B,1",
        success: function(response) {
            console.log(response);
            if(response === "1") {
                batteryCharging_count = 0;
                $.get({
                    url: "api.php?get=settings",
                    success: function(response) {
                        if(response && typeof response === "object" && response.hasOwnProperty('InverterParameters')) {
                            response = response['InverterParameters'];
                            batteryCharging_datetime = response["0"]["S1"];
                            setTimeout(testBatteryCharging_waitUntilSet, 5000);
                        } else alert("An error has occured. Please refresh the page! _006");
                    },
                    error: function() { alert("An error has occured. Please refresh the page! _005"); }
                });
            } else alert("An error has occured. Please refresh the page! _004");
            batteryCharging_firstRun = false;
        },
        error: function() { alert("An error has occured. Please refresh the page! _003"); }
    });
}

function testBatteryCharging_waitUntilSet()
{
    $.get({
        url: "api.php?get=settings",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object" && response.hasOwnProperty("InverterParameters")) {
                response = response['InverterParameters'];
                if(response["0"]["S1"] == batteryCharging_datetime)
                    setTimeout(testBatteryCharging_waitUntilSet, 2500);
                else {
                    $('#log p:last-child').html(`✓ ${lang['enable_ac_charging']}`);
                    $('#log').append(`<p>${lang['wait_before_test']}</p>`);
                    setTimeout(function() {
                        $('#log p:last-child').html(`✓ ${lang['wait_before_test']}`);
                        $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                        testBatteryCharging_part2();
                    }, 60000);
                }
            } else alert("An error has occured. Please refresh the page! _008");
        },
        error: function() { alert("An error has occured. Please refresh the page! _007"); }
    });
}

function testBatteryCharging_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('1121') && response['1121'].hasOwnProperty('1')) {
                    var batteryPower = parseInt(response['1121']['1']);
                    batteryCharging_count += 1;
                    $('#log p:last-child').html(`${lang['performing_test']} (${batteryCharging_count} / 10)`);
                    if(batteryPower > 100) {
                        if(batteryCharging_count < 10) {
                            setTimeout(testBatteryCharging_part2, 5000);
                        } else {
                            $('#log p:last-child').html(`✓ ${lang['performing_test']} (${batteryCharging_count} / 10)`);
                            $.get({
                                url: "api.php?set=command&type=24066&entity=0&text2=B,0",
                                success: function(response) {
                                    console.log(response);
                                    if(response === "1") {
                                        $('#log').append(`<p>${lang['disable_ac_charging']}</p>`);
                                        $.get({
                                            url: "api.php?get=settings",
                                            success: function(response) {
                                                if(response && typeof response === "object" && response.hasOwnProperty('InverterParameters')) {
                                                    response = response['InverterParameters'];
                                                    batteryCharging_datetime = response["0"]["S1"];
                                                    testBatteryCharging_waitUntilReset();
                                                } else alert("An error has occured. Please refresh the page! _015");
                                            },
                                            error: function() { alert("An error has occured. Please refresh the page! _014"); }
                                        });
                                    } else alert("An error has occured. Please refresh the page! _013");
                                },
                                error: function() { alert("An error has occured. Please refresh the page! _012"); }
                            });
                        }
                    } else {
                        $("#testBatteryCharging .loading").hide();
                        $("#testBatteryCharging .error").show();
                        $('#log p:last-child').html(`✗ ${lang['performing_test']} (${batteryCharging_count} / 10)`);
                        setTimeout(testBatteryCharging, 5000);
                    }
                } else alert("An error has occured. Please refresh the page! _011");
            } else alert("An error has occured. Please refresh the page! _010");
        },
        error: function() { alert("An error has occured. Please refresh the page! _009"); }
    });
}

function testBatteryCharging_waitUntilReset()
{
    $.get({
        url: "api.php?get=settings",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object" && response.hasOwnProperty("InverterParameters")) {
                response = response['InverterParameters'];
                if(response["0"]["S1"] == batteryCharging_datetime)
                    setTimeout(testBatteryCharging_waitUntilReset, 5000);
                else if(response["2"]["S1"].split(",")[1] === "0") {
                    $("#testBatteryCharging .loading").hide();
                    $("#testBatteryCharging .success").show();
                    $('#log p:last-child').html(`✓ ${lang['disable_ac_charging']}`);
                    if(batteryChargingIsFirst)
                        setTimeout(testBatteryDischarging, 2500);
                    else
                        setTimeout(testUpsMode, 2500);
                } else alert("An error has occured. Please refresh the page! _018");
            } else alert("An error has occured. Please refresh the page! _017");
        },
        error: function() { alert("An error has occured. Please refresh the page! _016"); }
    });
}










var batteryDischarging_firstRun = true;
var batteryDischarging_count = 0; // run 10 times (5sec delay), then finish
var batteryDischarging_datetime = "";

function testBatteryDischarging()
{
    // Show Loading
    $('#testBatteryDischarging .waiting').hide();
    $('#testBatteryDischarging .success').hide();
    $('#testBatteryDischarging .error'  ).hide();
    $('#testBatteryDischarging .loading').show();
    if(batteryDischarging_firstRun)
        $('#log').append(`<p class="head"><b>${lang['battery_discharging']}</b></p>`);
    $('#log').append(`<p>${lang['enable_discharging_to_grid']}</p>`);
    // Set BatteryDischargingToGrid ON (when PV is available)
    $.get({
        url: "api.php?set=command&type=24066&entity=0&text2=F,1",
        success: function(response) {
            console.log(response);
            if(response === "1") {
                $.get({
                    url: "api.php?set=command&type=24066&entity=0&text2=G,1",
                    success: function(response) {
                        console.log(response);
                        if(response == "1") {
                            batteryDischarging_count = 0;
                            $.get({
                                url: "api.php?get=settings",
                                success: function(response) {
                                    if(response && typeof response === "object" && response.hasOwnProperty('InverterParameters')) {
                                        response = response['InverterParameters'];
                                        batteryDischarging_datetime = response["0"]["S1"];
                                        setTimeout(testBatteryDischarging_waitUntilSet, 5000);
                                    } else alert("An error has occured. Please refresh the page! _022");
                                },
                                error: function() { alert("An error has occured. Please refresh the page! _021"); }
                            });
                        }
                    },
                    error: function() { alert("An error has occured. Please refresh the page! _123"); }
                });
            } else alert("An error has occured. Please refresh the page! _020");
            batteryDischarging_firstRun = false;
        },
        error: function() { alert("An error has occured. Please refresh the page! _019"); }
    });
}

function testBatteryDischarging_waitUntilSet()
{
    $.get({
        url: "api.php?get=settings",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object" && response.hasOwnProperty("InverterParameters")) {
                response = response['InverterParameters'];
                if(response["0"]["S1"] == batteryDischarging_datetime)
                    setTimeout(testBatteryDischarging_waitUntilSet, 5000);
                else {
                    $('#log p:last-child').html(`✓ ${lang['enable_discharging_to_grid']}`);
                    $('#log').append(`<p>${lang['wait_before_test']}</p>`);
                    setTimeout(function() {
                        $('#log p:last-child').html(`✓ ${lang['wait_before_test']}`);
                        $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                        testBatteryDischarging_part2();
                    }, 60000);
                }
            } else alert("An error has occured. Please refresh the page! _024");
        },
        error: function() { alert("An error has occured. Please refresh the page! _023"); }
    });
}

function testBatteryDischarging_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('1121') && response['1121'].hasOwnProperty('1')) {
                    var batteryPower = parseInt(response['1121']['1']);
                    batteryDischarging_count += 1;
                    $('#log p:last-child').html(`${lang['performing_test']} (${batteryDischarging_count} / 10)`);
                    if(batteryPower < -100) {
                        if(batteryDischarging_count < 10) {
                            setTimeout(testBatteryDischarging_part2, 5000);
                        } else {
                            $('#log p:last-child').html(`✓ ${lang['performing_test']} (${batteryDischarging_count} / 10)`);
                            $.get({
                                url: "api.php?set=command&type=24066&entity=0&text2=F,0",
                                success: function(response) {
                                    console.log(response);
                                    if(response === "1") {
                                        $.get({
                                            url: "api.php?set=command&type=24066&entity=0&text2=G,0",
                                            success: function(response) {
                                                $('#log').append(`<p>${lang['disable_discharging_to_grid']}</p>`);
                                                $.get({
                                                    url: "api.php?get=settings",
                                                    success: function(response) {
                                                        if(response && typeof response === "object" && response.hasOwnProperty('InverterParameters')) {
                                                            response = response['InverterParameters'];
                                                            batteryDischarging_datetime = response["0"]["S1"];
                                                            testBatteryDischarging_waitUntilReset();
                                                        } else alert("An error has occured. Please refresh the page! _031");
                                                    },
                                                    error: function() { alert("An error has occured. Please refresh the page! _030"); }
                                                });
                                            },
                                            error: function() { alert("An error has occured. Please refresh the page! _124"); }
                                        });
                                    } else alert("An error has occured. Please refresh the page! _029");
                                },
                                error: function() { alert("An error has occured. Please refresh the page! _028"); }
                            });
                        }
                    } else {
                        $("#testBatteryDischarging .loading").hide();
                        $("#testBatteryDischarging .error").show();
                        $('#log p:last-child').html(`✗ ${lang['performing_test']} (${batteryDischarging_count} / 10)`);
                        setTimeout(testBatteryDischarging, 5000);
                    }
                } else alert("An error has occured. Please refresh the page! _027");
            } else alert("An error has occured. Please refresh the page! _026");
        },
        error: function() { alert("An error has occured. Please refresh the page! _025"); }
    });
}

function testBatteryDischarging_waitUntilReset()
{
    $.get({
        url: "api.php?get=settings",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object" && response.hasOwnProperty("InverterParameters")) {
                response = response['InverterParameters'];
                if(response["0"]["S1"] == batteryDischarging_datetime) {
                    setTimeout(testBatteryDischarging_waitUntilReset, 5000);
                } else if(
                    response["2"]["S1"].split(",")[5] === "0" &&
                    response["2"]["S1"].split(",")[6] === "0"
                ) {
                    $("#testBatteryDischarging .loading").hide();
                    $("#testBatteryDischarging .success").show();
                    $('#log p:last-child').html(`✓ ${lang['disable_discharging_to_grid']}`);
                    if(batteryChargingIsFirst == false)
                        setTimeout(testBatteryCharging, 2500);
                    else
                        setTimeout(testUpsMode, 2500);
                } else alert("An error has occured. Please refresh the page! _034");
            } else alert("An error has occured. Please refresh the page! _033");
        },
        error: function() { alert("An error has occured. Please refresh the page! _032"); }
    });
}










var upsMode_firstRun = true;
var upsMode_count = 0; // run 10 times (5sec delay), then finish

function testUpsMode()
{
    // Show Loading
    $('#testUpsMode .waiting').hide();
    $('#testUpsMode .success').hide();
    $('#testUpsMode .error'  ).hide();
    $('#testUpsMode .loading').show();
    if(upsMode_firstRun)
        $('#log').append(`<p class="head"><b>${lang['ups_mode']}</b></p>`);
    $('#log').append(`<p>${lang['check_output_active']}</p>`);
    // Check Output Voltage
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) {
                    
                    let voltage1 = undefined;
                    let voltage2 = undefined;
                    let voltage3 = undefined;
                    
                    if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1'))
                        voltage1 = response['1297']['1'];
                    if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1'))
                        voltage2 = response['1298']['1'];
                    if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1'))
                        voltage3 = response['1299']['1'];
                    
                    outputIsActive = undefined;

                    if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined) {
                        if(voltage1 > 10000)
                            outputIsActive = true;
                        else
                            outputIsActive = false;
                    } else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined) {
                        if(voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000)
                            outputIsActive = true;
                        else
                            outputIsActive = false;
                    } else alert("An error has occured. Please refresh the page! _038");
                    
                    if(outputIsActive == true) {
                        // CONTINUE WITH TEST
                        $('#log p:last-child').html(`✓ ${lang['check_output_active']}`);
                        $('#log').append(`<p>${lang['turn_input_breaker_off']}</p>`);
                        $('#testUpsMode span span').html(lang['please_turn_input_breaker_off']);
                        setTimeout(testUpsMode_waitingForInput, 5000);
                    } else if(outputIsActive != undefined) {
                        // SHOW ERROR
                        $('#log p:last-child').html(`✗ ${lang['check_output_active']}`);
                        $('#testUpsMode span span').html(lang['please_turn_output_on']);
                        setTimeout(testUpsMode, 5000);
                    }

                } else alert("An error has occured. Please refresh the page! _037");
            } else alert("An error has occured. Please refresh the page! _036");
        },
        error: function() { alert("An error has occured. Please refresh the page! _035"); }
    });
}

function testUpsMode_waitingForInput()
{
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) {

                    let voltage1 = undefined;
                    let voltage2 = undefined;
                    let voltage3 = undefined;
                    
                    if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1'))
                        voltage1 = response['273']['1'];
                    if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1'))
                        voltage2 = response['274']['1'];
                    if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1'))
                        voltage3 = response['275']['1'];
                    
                    inputIsActive = undefined;

                    if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined) {
                        if(voltage1 > 10000)
                            inputIsActive = true;
                        else
                            inputIsActive = false;
                    } else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined) {
                        if(voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000)
                            inputIsActive = true;
                        else
                            inputIsActive = false;
                    } else alert("An error has occured. Please refresh the page! _042");

                    if(inputIsActive == false) {
                        // CONTINUE WITH TEST
                        $('#log p:last-child').html(`✓ ${lang['turn_input_breaker_off']}`);
                        $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                        $('#testUpsMode span span').html("");
                        setTimeout(testUpsMode_part2, 5000);
                    } else if(outputIsActive != undefined) {
                        // RETRY
                        setTimeout(testUpsMode_waitingForInput, 5000);
                    }

                } else alert("An error has occured. Please refresh the page! _041");
            } else alert("An error has occured. Please refresh the page! _040");
        },
        error: function() { alert("An error has occured. Please refresh the page! _039"); }
    });
}

function testUpsMode_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) {

                    upsMode_count += 1;
                    $('#log p:last-child').html(`${lang['performing_test']} (${upsMode_count} / 10)`);
                    
                    let voltage1 = undefined;
                    let voltage2 = undefined;
                    let voltage3 = undefined;
                    
                    if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1'))
                        voltage1 = response['1297']['1'];
                    if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1'))
                        voltage2 = response['1298']['1'];
                    if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1'))
                        voltage3 = response['1299']['1'];
                    
                    outputIsActive = undefined;

                    if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined) {
                        if(voltage1 > 10000)
                            outputIsActive = true;
                        else
                            outputIsActive = false;
                    } else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined) {
                        if(voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000)
                            outputIsActive = true;
                        else
                            outputIsActive = false;
                    } else alert("An error has occured. Please refresh the page! _046");

                    if(outputIsActive == true) {
                        if(upsMode_count < 10) {
                            setTimeout(testUpsMode_part2, 5000);
                        } else {
                            $('#log p:last-child').html(`✓ ${lang['performing_test']} (${upsMode_count} / 10)`);
                            finishStep();
                        }
                    } else if(outputIsActive != undefined) {
                        $("#testUpsMode .loading").hide();
                        $("#testUpsMode .error").show();
                        $('#log p:last-child').html(`✗ ${lang['performing_test']} (${upsMode_count} / 10)`);
                    }

                } else alert("An error has occured. Please refresh the page! _045");
            } else alert("An error has occured. Please refresh the page! _044");
        },
        error: function() { alert("An error has occured. Please refresh the page! _043"); }
    });
}










// Finish Step

function finishStep()
{
    // Check Input Voltage
    $.get({
        url: "api.php?get=currentstate",
        success: function(response) {
            console.log(response);
            if(response && typeof response === "object") {
                if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) {

                    let voltage1 = undefined;
                    let voltage2 = undefined;
                    let voltage3 = undefined;
                    
                    if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1'))
                        voltage1 = response['273']['1'];
                    if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1'))
                        voltage2 = response['274']['1'];
                    if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1'))
                        voltage3 = response['275']['1'];
                    
                    inputIsActive = undefined;

                    if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined) {
                        if(voltage1 > 10000)
                            inputIsActive = true;
                        else
                            inputIsActive = false;
                    } else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined) {
                        if(voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000)
                            inputIsActive = true;
                        else
                            inputIsActive = false;
                    } else alert("An error has occured. Please refresh the page! _125");
                    
                    if(inputIsActive == true) {
                        // FINISH STEP
                        $("#testUpsMode .loading").hide();
                        $("#testUpsMode .success").show();
                        $('#testUpsMode span span').html("");
                        setTimeout(function() { $('#btnSubmit').removeClass('d-none'); }, 2500);
                        $('#btnSubmit').on('click', function() { window.location.href = "installation_summary.php"; });
                    } else if(inputIsActive != undefined) {
                        // RETRY
                        $('#testUpsMode span span').html(lang['please_turn_input_breaker_on']);
                        setTimeout(finishStep, 5000);
                    }

                } else alert("An error has occured. Please refresh the page! _126");
            } else alert("An error has occured. Please refresh the page! _127");
        },
        error: function() { alert("An error has occured. Please refresh the page! _128"); }
    });
}










// Begin Testing

testEnergyMeter();