$progress.trigger('step', 6);





function scrollToBottom() { $('#log').scrollTop($('#log').prop("scrollHeight")); }




















function showLoading_energyMeter()
{
    $('#testEnergyMeter .waiting').hide();
    $('#testEnergyMeter .success').hide();
    $('#testEnergyMeter .error'  ).hide();
    $('#testEnergyMeter .loading').show();
    if(energyMeter_firstRun)
        $('#log').append(`<p class="head"><b>${lang['energy_meter']}</b></p>`);
    $('#log').append(`<p>${lang['performing_test']}</p>`);
    scrollToBottom();
}

function showLoading_batteryCharging()
{
    $('#testBatteryCharging .waiting').hide();
    $('#testBatteryCharging .success').hide();
    $('#testBatteryCharging .error'  ).hide();
    $('#testBatteryCharging .loading').show();
    if(batteryCharging_firstRun)
        $('#log').append(`<p class="head"><b>${lang['battery_charging']}</b></p>`);
    $('#log').append(`<p>${lang['enable_ac_charging']}</p>`);
    scrollToBottom();
}

function showLoading_upsMode()
{
    $('#testUpsMode .waiting').hide();
    $('#testUpsMode .success').hide();
    $('#testUpsMode .error'  ).hide();
    $('#testUpsMode .loading').show();
    if(upsMode_firstRun)
        $('#log').append(`<p class="head"><b>${lang['ups_mode']}</b></p>`);
    $('#log').append(`<p>${lang['check_output_active']}</p>`);
    scrollToBottom();
}




















var energyMeter_firstRun = true;

function testEnergyMeter()
{
    showLoading_energyMeter();

    // Perform Test
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E001. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object") return alert("E002. Please refresh the page!");
            setTimeout(function() {
                $('#testEnergyMeter .loading').hide();
                if(response.hasOwnProperty('2913') && response['2913'].hasOwnProperty('0')) {
                    $('#testEnergyMeter .success').show();
                    $('#log p:last-child').html(`✓ ${lang['performing_test']}`);
                    setTimeout(testBatteryCharging, 2500);
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




















var batteryCharging_firstRun = true;
var batteryCharging_count = 0; // run 5 times (5sec delay), then finish
var batteryCharging_datetime = "";

function testBatteryCharging()
{
    showLoading_batteryCharging();

    // Set BatteryChargingAC ON
    $.get({
        url: "api.php?set=command&type=20738&entity=0&text1=3&text2=1",
        error: function() { alert("E005. Please refresh the page!"); },
        success: function(response) {
            if(response != '1') return alert("E006. Please refresh the page!");
            batteryCharging_count = 0;
            setTimeout(testBatteryCharging_waitUntilSet, 5000);
        }
    });
}

function testBatteryCharging_waitUntilSet()
{
    $.get({
        url: "api.php?get=currentstate",
        error: function() { alert("E009. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object")
                return alert("E010. Please refresh the page!");
            if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('3'))
                return alert("E011. Please refresh the page!");
            // Check If Enabled
            if(response['2465']['3'] != 11)
                setTimeout(testBatteryCharging_waitUntilSet, 5000);
            else
                setTimeout(function() {
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
        error: function() { alert("E011. Please refresh the page!") },
        success: function(response) {
            
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
                        error: function() { alert("E013. Please refresh the page!"); },
                        success: function(response) {
                            if(response != '1') return alert("E014. Please refresh the page!");
                            $('#log').append(`<p>${lang['disable_ac_charging']}</p>`);
                            scrollToBottom();
                            testBatteryCharging_waitUntilReset();
                        }
                    });
                }
            } else {
                $("#testBatteryCharging .loading").hide();
                $("#testBatteryCharging .error").show();
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
        error: function() { alert("E017. Please refresh the page!"); },
        success: function(response) {
            if(!response || typeof response != "object")
                return alert("E018. Please refresh the page!");
            if(!response.hasOwnProperty('2465') || !response['2465'].hasOwnProperty('3'))
                return alert("E019. Please refresh the page!");
            // Check If Disabled
            if(response['2465']['3'] != 10)
                setTimeout(testBatteryCharging_waitUntilReset, 5000);
            else {
                $.get({
                    url: "api.php?set=command&type=20738&entity=0&text1=3&text2=2",
                    error: function() { alert("E020. Please refresh the page!"); },
                    success: function(response) {
                        if(response != '1') return alert("E021. Please refresh the page!");
                        $("#testBatteryCharging .loading").hide();
                        $("#testBatteryCharging .success").show();
                        $('#log p:last-child').html(`✓ ${lang['disable_ac_charging']}`);
                        setTimeout(testUpsMode, 2500);
                    }
                });
            }
        }
    });
}




















var upsMode_firstRun = true;
var upsMode_count = 0; // run 5 times (5sec delay), then finish

function testUpsMode()
{
    showLoading_upsMode();

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
                setTimeout(function() { testUpsMode(); }, 5000);
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
        error: function() { alert("E044. Please refresh the page!"); },
        success: function(response) {

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
                $("#testUpsMode .loading").hide();
                $("#testUpsMode .error").show();
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

            if(voltage1 != undefined && voltage2 == undefined && voltage3 == undefined)
                inputIsActive = (voltage1 > 10000);
            else if(voltage1 != undefined && voltage2 != undefined && voltage3 != undefined)
                inputIsActive = (voltage1 > 10000 && voltage2 > 10000 && voltage3 > 10000);
            else alert("E049. Please refresh the page!");
            
            if(inputIsActive == true) {
                // FINISH STEP
                $("#testUpsMode .loading").hide();
                $("#testUpsMode .success").show();
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
    setTimeout(function() { $('#btnSubmit').removeClass('d-none'); }, 1000);
    $('#btnSubmit').on('click', function() { window.location.href = "accept_terms.php"; });
}










// Begin Testing

testEnergyMeter();