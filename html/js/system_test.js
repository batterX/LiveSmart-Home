$progress.trigger('step', 6);





function scrollToBottom() { $('#log').scrollTop($('#log').prop("scrollHeight")); }










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
    scrollToBottom();
    
    // Test
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E001. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object")
                return alert("E002. Please refresh the page!");
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
            energyMeter_firstRun = false;
        }
    });
}










var batteryChargingIsFirst = undefined;

function testBattery()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E003. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object" || !response.hasOwnProperty('1074') || !response['1074'].hasOwnProperty('1'))
                return alert("E004. Please refresh the page!");
            let batteryCapacity = response['1074']['1'];
            if(batteryCapacity < 90) {
                batteryChargingIsFirst = true;
                testBatteryCharging();
            } else {
                batteryChargingIsFirst = false;
                testBatteryDischarging();
            }
        }
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
    scrollToBottom();

    // Set BatteryChargingAC ON
    $.get({
        url: "api.php?set=command&type=24066&entity=0&text2=B,1",
        error: function() { alert("E005. Please refresh the page!"); },
        success: function(response) {
            if(response != '1')
                return alert("E006. Please refresh the page!");
            batteryCharging_count = 0;
            $.get({
                url: "api.php?get=settings",
                error: function() { alert("E007. Please refresh the page!"); },
                success: function(response) {
                    if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
                        return alert("E008. Please refresh the page!");
                    response = response['InverterParameters'];
                    batteryCharging_datetime = response["0"]["S1"];
                    setTimeout(testBatteryCharging_waitUntilSet, 5000);
                }
            });
            batteryCharging_firstRun = false;
        }
    });
}

function testBatteryCharging_waitUntilSet()
{
    $.get({
        url: "api.php?get=settings",
        error: function() { alert("E009. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E010. Please refresh the page!");
            response = response['InverterParameters'];
            if(response["0"]["S1"] == batteryCharging_datetime) {
                setTimeout(testBatteryCharging_waitUntilSet, 2500);
            } else {
                $('#log p:last-child').html(`✓ ${lang['enable_ac_charging']}`);
                $('#log').append(`<p>${lang['wait_before_test']}</p>`);
                setTimeout(function() {
                    $('#log p:last-child').html(`✓ ${lang['wait_before_test']}`);
                    $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                    testBatteryCharging_part2();
                }, 45000); // TODO: Was 60000 ms
            }
            scrollToBottom();
        }
    });
}

function testBatteryCharging_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E011. Please refresh the page!") },
        success: function(response) {
            
            if(!response || typeof response != "object" || !response.hasOwnProperty('1121') || !response['1121'].hasOwnProperty('1'))
                return alert("E012. Please refresh the page!");

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
                        error: function() { alert("E013. Please refresh the page!"); },
                        success: function(response) {
                            if(response != "1")
                                return alert("E014. Please refresh the page!");
                            $('#log').append(`<p>${lang['disable_ac_charging']}</p>`);
                            scrollToBottom();
                            $.get({
                                url: "api.php?get=settings",
                                error: function() { alert("E015. Please refresh the page!"); },
                                success: function(response) {
                                    if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
                                        return alert("E016. Please refresh the page!");
                                    response = response['InverterParameters'];
                                    batteryCharging_datetime = response["0"]["S1"];
                                    testBatteryCharging_waitUntilReset();
                                }
                            });
                        }
                    });
                }
            } else {
                $("#testBatteryCharging .loading").hide();
                $("#testBatteryCharging .error").show();
                $('#log p:last-child').html(`✗ ${lang['performing_test']} (${batteryCharging_count} / 10)`);
                setTimeout(testBatteryCharging, 5000);
            }

        }
    });
}

function testBatteryCharging_waitUntilReset()
{
    $.get({
        url: "api.php?get=settings",
        error: function() { alert("E017. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E018. Please refresh the page!");
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
            } else alert("E019. Please refresh the page!");
        }
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
    scrollToBottom();
    
    // Set BatteryDischargingToGrid ON (when PV is available)
    $.get({
        url: "api.php?set=command&type=24066&entity=0&text2=F,1",
        error: function() { alert("E020. Please refresh the page!"); },
        success: function(response) {
            if(response != "1") return alert("E021. Please refresh the page!");
            $.get({
                url: "api.php?set=command&type=24066&entity=0&text2=G,1",
                error: function() { alert("E022. Please refresh the page!"); },
                success: function(response) {
                    if(response != "1") return alert("E023. Please refresh the page!");
                    $.get({
                        url: "api.php?set=command&type=24066&entity=0&text2=B,0",
                        error: function() { alert("E050. Please refresh the page!"); },
                        success: function(response) {
                            if(response != "1") return alert("E051. Please refresh the page!");
                            batteryDischarging_count = 0;
                            $.get({
                                url: "api.php?get=settings",
                                error: function() { alert("E024. Please refresh the page!"); },
                                success: function(response) {
                                    if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
                                        return alert("E025. Please refresh the page!");
                                    response = response['InverterParameters'];
                                    batteryDischarging_datetime = response["0"]["S1"];
                                    setTimeout(testBatteryDischarging_waitUntilSet, 5000);
                                }
                            });
                        }
                    });
                }
            });
            batteryDischarging_firstRun = false;
        }
    });
}

function testBatteryDischarging_waitUntilSet()
{
    $.get({
        url: "api.php?get=settings",
        error: function() { alert("E026. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E027. Please refresh the page!");
            response = response['InverterParameters'];
            if(response["0"]["S1"] == batteryDischarging_datetime) {
                setTimeout(testBatteryDischarging_waitUntilSet, 5000);
            } else {
                $('#log p:last-child').html(`✓ ${lang['enable_discharging_to_grid']}`);
                $('#log').append(`<p>${lang['wait_before_test']}</p>`);
                setTimeout(function() {
                    $('#log p:last-child').html(`✓ ${lang['wait_before_test']}`);
                    $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                    testBatteryDischarging_part2();
                }, 45000); // TODO: Was 60000 ms
                scrollToBottom();
            }
        }
    });
}

function testBatteryDischarging_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E028. Please refresh the page!"); },
        success: function(response) {

            if(!response || typeof response != "object" || !response.hasOwnProperty('1121') || !response['1121'].hasOwnProperty('1'))
                return alert("E029. Please refresh the page!");

            var batteryPower = parseInt(response['1121']['1']);
            batteryDischarging_count += 1;
            $('#log p:last-child').html(`${lang['performing_test']} (${batteryDischarging_count} / 10)`);

            if(batteryPower < -100) {
                if(batteryDischarging_count < 10)
                    setTimeout(testBatteryDischarging_part2, 5000);
                else {
                    $('#log p:last-child').html(`✓ ${lang['performing_test']} (${batteryDischarging_count} / 10)`);
                    $.get({
                        url: "api.php?set=command&type=24066&entity=0&text2=F,0",
                        error: function() { alert("E030. Please refresh the page!"); },
                        success: function(response) {
                            if(response != "1")
                                return alert("E031. Please refresh the page!");
                            $.get({
                                url: "api.php?set=command&type=24066&entity=0&text2=G,0",
                                error: function() { alert("E032. Please refresh the page!"); },
                                success: function() {
                                    $('#log').append(`<p>${lang['disable_discharging_to_grid']}</p>`);
                                    scrollToBottom();
                                    $.get({
                                        url: "api.php?get=settings",
                                        error: function() { alert("E033. Please refresh the page!"); },
                                        success: function(response) {
                                            if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
                                                return alert("E034. Please refresh the page!");
                                            response = response['InverterParameters'];
                                            batteryDischarging_datetime = response["0"]["S1"];
                                            testBatteryDischarging_waitUntilReset();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                $("#testBatteryDischarging .loading").hide();
                $("#testBatteryDischarging .error").show();
                $('#log p:last-child').html(`✗ ${lang['performing_test']} (${batteryDischarging_count} / 10)`);
                setTimeout(testBatteryDischarging, 5000);
            }

        }
    });
}

function testBatteryDischarging_waitUntilReset()
{
    $.get({
        url: "api.php?get=settings",
        error: function() { alert("E035. Please refresh the page!"); },
        success: function(response) {

            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E036. Please refresh the page!");
            
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
            } else alert("E037. Please refresh the page!");

        }
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
    scrollToBottom();

    // Show Skip Button
    $('#btnSkip').removeClass('d-none');
    $('#btnSkip').on('click', function() { window.location.href = "accept_terms.php"; });

    // Check Output Voltage
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E038. Please refresh the page!"); },
        success: function(response) {
            
            if(!response || typeof response != "object" || !response.hasOwnProperty('1297') || !response['1297'].hasOwnProperty('1'))
                return alert("E039. Please refresh the page!");
            
            let voltage1 = undefined;
            let voltage2 = undefined;
            let voltage3 = undefined;
            
            if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) voltage1 = response['1297']['1'];
            if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1')) voltage2 = response['1298']['1'];
            if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1')) voltage3 = response['1299']['1'];
            
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
            } else alert("E040. Please refresh the page!");
            
            if(outputIsActive == true) {
                // CONTINUE WITH TEST
                $('#log p:last-child').html(`✓ ${lang['check_output_active']}`);
                $('#log').append(`<p>${lang['turn_input_breaker_off']}</p>`);
                scrollToBottom();
                $('#testUpsMode span span').html(lang['please_turn_input_breaker_off']);
                setTimeout(testUpsMode_waitingForInput, 5000);
            } else if(outputIsActive != undefined) {
                // SHOW ERROR
                $('#log p:last-child').html(`✗ ${lang['check_output_active']}`);
                $('#testUpsMode span span').html(lang['please_turn_output_on']);
                setTimeout(testUpsMode, 5000);
            }

        }
    });
}

function testUpsMode_waitingForInput()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E041. Please refresh the page!"); },
        success: function(response) {
            
            if(!response || typeof response != "object" || !response.hasOwnProperty('273') || !response['273'].hasOwnProperty('1'))
                return alert("E042. Please refresh the page!");

            let voltage1 = undefined;
            let voltage2 = undefined;
            let voltage3 = undefined;
            
            if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) voltage1 = response['273']['1'];
            if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1')) voltage2 = response['274']['1'];
            if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1')) voltage3 = response['275']['1'];
            
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
            } else alert("E043. Please refresh the page!");

            if(inputIsActive == false) {
                // CONTINUE WITH TEST
                $('#log p:last-child').html(`✓ ${lang['turn_input_breaker_off']}`);
                $('#log').append(`<p>${lang['performing_test']} (1 / 10)</p>`);
                scrollToBottom();
                $('#testUpsMode span span').html("");
                setTimeout(testUpsMode_part2, 5000);
            } else if(outputIsActive != undefined) {
                // RETRY
                setTimeout(testUpsMode_waitingForInput, 5000);
            }

        }
    });
}

function testUpsMode_part2()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E044. Please refresh the page!"); },
        success: function(response) {

            if(!response || typeof response != "object" || !response.hasOwnProperty('1297') || !response['1297'].hasOwnProperty('1'))
                return alert("E045. Please refresh the page!");

            upsMode_count += 1;
            $('#log p:last-child').html(`${lang['performing_test']} (${upsMode_count} / 10)`);
            
            let voltage1 = undefined;
            let voltage2 = undefined;
            let voltage3 = undefined;
            
            if(response.hasOwnProperty('1297') && response['1297'].hasOwnProperty('1')) voltage1 = response['1297']['1'];
            if(response.hasOwnProperty('1298') && response['1298'].hasOwnProperty('1')) voltage2 = response['1298']['1'];
            if(response.hasOwnProperty('1299') && response['1299'].hasOwnProperty('1')) voltage3 = response['1299']['1'];
            
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
            } else alert("E046. Please refresh the page!");

            if(outputIsActive == true) {
                if(upsMode_count < 10) {
                    setTimeout(testUpsMode_part2, 5000);
                } else {
                    $('#log p:last-child').html(`✓ ${lang['performing_test']} (${upsMode_count} / 10)`);
                    testUpsMode_finish();
                }
            } else if(outputIsActive != undefined) {
                $("#testUpsMode .loading").hide();
                $("#testUpsMode .error").show();
                $('#log p:last-child').html(`✗ ${lang['performing_test']} (${upsMode_count} / 10)`);
            }

        }
    });
}










// Finish Step

function testUpsMode_finish()
{
    // Check Input Voltage
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E047. Please refresh the page!"); },
        success: function(response) {

            if(!response || typeof response != "object" || !response.hasOwnProperty('273') || !response['273'].hasOwnProperty('1'))
                return alert("E048. Please refresh the page!");

            let voltage1 = undefined;
            let voltage2 = undefined;
            let voltage3 = undefined;
            
            if(response.hasOwnProperty('273') && response['273'].hasOwnProperty('1')) voltage1 = response['273']['1'];
            if(response.hasOwnProperty('274') && response['274'].hasOwnProperty('1')) voltage2 = response['274']['1'];
            if(response.hasOwnProperty('275') && response['275'].hasOwnProperty('1')) voltage3 = response['275']['1'];
            
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
            } else alert("E049. Please refresh the page!");
            
            if(inputIsActive == true) {
                // FINISH STEP
                $("#testUpsMode .loading").hide();
                $("#testUpsMode .success").show();
                $('#testUpsMode span span').html("");
                finishStep();
            } else if(inputIsActive != undefined) {
                // RETRY
                $('#testUpsMode span span').html(lang['please_turn_input_breaker_on']);
                setTimeout(testUpsMode_finish, 5000);
            }

        }
    });
}










// Finish Step

function finishStep()
{
    $('#btnSkip').addClass('d-none');
    setTimeout(function() { $('#btnSubmit').removeClass('d-none'); }, 2500);
    $('#btnSubmit').on('click', function() { window.location.href = "accept_terms.php"; });
}










// Begin Testing

testEnergyMeter();