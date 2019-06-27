$progress.trigger('step', 5);










function isCarbon() { return $('#bx_battery_type_1').is(':checked'); }





// Battery Type Change

$('input[name=bx_battery_type').on('change', function() {

    if(this.value == '1')
    {
        // SET Carbon
        $('#battery_section_0').hide();
        $('#battery_section_1').show();
    }
    else
    {
        // SET LiFePO
        $('#battery_section_0').show();
        $('#battery_section_1').hide();
    }

});





// Activate Submit Button

setInterval(function() {
    if(
        ( $("#bx_system"             ).val() != "" ) &&
        ( $("#bx_device"             ).val() != "" ) &&
        ( $("#bx_box"                ).val() != "" ) &&
        ( $("#solar_wattPeak"        ).val() != "" ) &&
        ( $("#solar_feedInLimitation").val() != "" ) &&
        ( isCarbon || $("#battery_1" ).val() != "" ) &&
        ( $("#installation_date"     ).val() != "" )
    ) {
        $("#btnSubmit").removeAttr("disabled");
    } else {
        $("#btnSubmit").attr("disabled", "disabled");
    }
}, 1000);










var systemModel = "";
var deviceModel = "";
var deviceDatetime = "";
var newParameters = {};
var oldParameters = {};




// Retrieve Installation Info

$.get({
    url: 'cmd/apikey.php',
    error: function() { alert("E001. Please refresh the page!") },
    success: function(response) {

        console.log(response);

        if(!response || response.length != 40) return alert("E002. Please refresh the page!");
        
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: {
                action: "retrieve_installation_info",
                apikey: response.toString()
            },
            error: function() { alert("E003. Please refresh the page!") },
            success: function(json) {

                console.log(json);

                if(!json) return;
                
                // Set System Info
                if(json.hasOwnProperty('system')) {
                    if(json.system.hasOwnProperty('serialnumber'))
                        $("#bx_system").val(json.system.serialnumber);
                    if(json.system.hasOwnProperty('model'))
                        if(json.system.model.includes('W'))
                            $("#bx_system_type_w").click();
                        else
                            $("#bx_system_type_r").click();
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
                        if(json.batteries.length > 0 && json.batteries[0].hasOwnProperty('serialnumber'))
                            $('#battery_1').val(json.batteries[0].serialnumber);
                        if(json.batteries.length > 1 && json.batteries[1].hasOwnProperty('serialnumber'))
                            $('#battery_2').val(json.batteries[1].serialnumber);
                        if(json.batteries.length > 2 && json.batteries[2].hasOwnProperty('serialnumber'))
                            $('#battery_3').val(json.batteries[2].serialnumber);
                        if(json.batteries.length > 3 && json.batteries[3].hasOwnProperty('serialnumber'))
                            $('#battery_4').val(json.batteries[3].serialnumber);
                    } else if(json.batteries.length == 1) {
                        if(json.batteries[0].hasOwnProperty('serialnumber') && json.batteries[0].hasOwnProperty('type')) {
                            var batterySerialnumber = json.batteries[0].serialnumber;
                            var batteryType         = json.batteries[0].type;
                            if(batteryType == 0)
                                $('#battery_1').val(batterySerialnumber);
                            else
                                $('#bx_battery_type_1').prop('checked', true).trigger('change');
                                $('#bx_system_type_w').prop('checked', true).trigger('change');
                        }
                    }
                }

            }
        });

    }
});










// Set LiveX Serial-Number

$.get({
    url: 'cmd/apikey.php',
    error: function() { alert("E004. Please refresh the page!") },
    success: function(response) {

        console.log(response);

        if(!response || response.length != 40) return alert("E005. Please refresh the page!");
        
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: {
                action: "retrieve_box_serial",
                apikey: response.toString()
            },
            error: function() { alert("E006. Please refresh the page!") },
            success: function(response) {
                console.log(response);
                var box_serial = response;
                // Save Serial-Number to Session
                $.post({
                    url: "cmd/session.php",
                    data: { box_serial: box_serial },
                    error: function() { alert("E007. Please refresh the page!") },
                    success: function(response) {
                        console.log(response);
                        if(response === '1') $('#bx_box').val(box_serial);
                        else alert("E008. Please refresh the page!");
                    }
                });
            }
        });
        
    }
});





// Set Inverter Serial-Number

$.get({
    url: 'api.php?get=deviceinfo',
    error: function() { alert("E009. Please refresh the page!") },
    success: function(response) {

        console.log(response);
        
        if(!response || typeof response != 'object' || !response.hasOwnProperty('device_serial_number') || !response.hasOwnProperty('device_model'))
            return alert("E010. Please refresh the page!");

        var device_serial_number = response['device_serial_number'];
        var device_model = response['device_model'].toLowerCase();
        device_model = (device_model == 'batterx h3') ? 'h3' : (device_model == 'batterx h5') ? 'h5' : (device_model == 'batterx h5-eco') ? 'h5e' : (device_model == 'batterx h10') ? 'h10' : '';
        deviceModel = device_model;

        // Sava Serial-Number & Model to Session
        $.post({
            url: "cmd/session.php",
            data: {
                device_serial: device_serial_number,
                device_model: device_model
            },
            error: function() { alert("E011. Please refresh the page!") },
            success: function(response) {
                console.log(response);
                if(response === '1') $('#bx_device').val(device_serial_number);
                else alert("E012. Please refresh the page!");
            }
        });

    }
});










// Main Form On-Submit

$('#mainForm').on('submit', function(e) {

    e.preventDefault();

    if(
        ( $("#bx_system"             ).val() == "" ) ||
        ( $("#bx_device"             ).val() == "" ) ||
        ( $("#bx_box"                ).val() == "" ) ||
        ( $("#solar_wattPeak"        ).val() == "" ) ||
        ( $("#solar_feedInLimitation").val() == "" ) ||
        ( !isCarbon && $("#battery_1").val() == "" ) ||
        ( $("#installation_date"     ).val() == "" )
    ) {
        return;
    }

    // DISABLE INPUTS
    $(` #bx_system,
        #bx_device,
        #bx_box,
        #solar_wattPeak,
        #solar_feedInLimitation,
        #bx_battery_type_0,
        #bx_battery_type_1,
        #battery_1,
        #battery_2,
        #battery_3,
        #battery_4,
        #bx_system_type_r,
        #bx_system_type_w,
        #solar_info,
        #installer_memo
    `).attr('disabled', 'disabled');
    
    // SHOW LOADING SCREEN
    $('#btnSubmit').hide();
    $('.setting-progress').removeClass('d-none');

    var system_serial   = $('#bx_system').val();
    var device_serial   = $('#bx_device').val();
    var battery1_serial = !isCarbon() ? $('#battery_1').val() : $('#bx_device').val();
    var battery2_serial = !isCarbon() ? $('#battery_2').val() : "";
    var battery3_serial = !isCarbon() ? $('#battery_3').val() : "";
    var battery4_serial = !isCarbon() ? $('#battery_4').val() : "";

    var canContinue = true;

    // Check Inverter SerialNumber
    if(canContinue) {
        canContinue = false;
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            async: false,
            data: {
                action:       "verify_device",
                serialnumber: device_serial,
                system:       system_serial
            },
            error: function() { alert("E013. Please refresh the page!") },
            success: function(response) {
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
            url: "https://api.batterx.io/v2/installation.php",
            async: false,
            data: {
                action:       "verify_battery",
                serialnumber: battery1_serial,
                system:       system_serial
            },
            error: function() { alert("E014. Please refresh the page!") },
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
            url: "https://api.batterx.io/v2/installation.php",
            async: false,
            data: {
                action:       "verify_battery",
                serialnumber: battery2_serial,
                system:       system_serial
            },
            error: function() { alert("E015. Please refresh the page!") },
            success: function(response) {
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
            url: "https://api.batterx.io/v2/installation.php",
            async: false,
            data: {
                action:       "verify_battery",
                serialnumber: battery3_serial,
                system:       system_serial
            },
            error: function() { alert("E016. Please refresh the page!") },
            success: function(response) {
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
            url: "https://api.batterx.io/v2/installation.php",
            async: false,
            data: {
                action:       "verify_battery",
                serialnumber: battery4_serial,
                system:       system_serial
            },
            error: function() { alert("E017. Please refresh the page!") },
            success: function(response) {
                console.log(response);
                if(response === "1") canContinue = true;
                else alert(lang['battery_not_exist_or_registered_with_other_system']);
            }
        });
    }

    // Finish Setup if everything is OK
    if(canContinue) finishSetup();

});





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
        solar_wattPeak:         $('#solar_wattPeak'        ).val(),
        solar_feedInLimitation: $('#solar_feedInLimitation').val(),
        solar_info:             $('#solar_info'            ).val(),
        note:                   $('#installer_memo'        ).val(),
        installation_date:      $('#installation_date'     ).val(),
    };
    if(!isCarbon()) tempData["system_model"] = systemModel;

    var battery1_serial = !isCarbon() ? $('#battery_1').val() : $('#bx_device').val();
    var battery2_serial = !isCarbon() ? $('#battery_2').val() : "";
    var battery3_serial = !isCarbon() ? $('#battery_3').val() : "";
    var battery4_serial = !isCarbon() ? $('#battery_4').val() : "";
    if(battery1_serial != "") tempData["battery1_serial"] = battery1_serial;
    if(battery2_serial != "") tempData["battery2_serial"] = battery2_serial;
    if(battery3_serial != "") tempData["battery3_serial"] = battery3_serial;
    if(battery4_serial != "") tempData["battery4_serial"] = battery4_serial;

    console.log(tempData);
    
    $.post({
        url: "cmd/session.php",
        data: tempData,
        error: function() { alert("E018. Please refresh the page!") },
        success: function(response) {

            console.log(response);

            if(response != '1') return alert("E019. Please refresh the page!");
            
            // Apply Parameters to Inverter
            let numberOfModules = 0;
            if($('#battery_1').val() != "") numberOfModules += 1;
            if($('#battery_2').val() != "") numberOfModules += 1;
            if($('#battery_3').val() != "") numberOfModules += 1;
            if($('#battery_4').val() != "") numberOfModules += 1;

            let maxChargingCurrent    =  2500; // x0.01A
            let maxGridFeedInPower    =  3000; // x1.00W
                 if(deviceModel == "h3" ) { maxChargingCurrent =  2500; maxDischargingCurrent = 150; maxGridFeedInPower =  3000; }
            else if(deviceModel == "h5" ) { maxChargingCurrent =  6000; maxDischargingCurrent = 150; maxGridFeedInPower =  5000; }
            else if(deviceModel == "h5e") { maxChargingCurrent = 10000; maxDischargingCurrent = 150; maxGridFeedInPower =  5500; }
            else if(deviceModel == "h10") { maxChargingCurrent = 20000; maxDischargingCurrent = 300; maxGridFeedInPower = 10000; }

            if(!isCarbon()) newParameters['maxChargingCurrentAC'         ] = Math.min(numberOfModules * 3700, maxChargingCurrent   ).toString();
            if(!isCarbon()) newParameters['cutoffVoltageHybrid'          ] = '4700';
            if(!isCarbon()) newParameters['redischargeVoltageHybrid'     ] = '5000';
            if(!isCarbon()) newParameters['cutoffVoltage'                ] = '4700';
            if(!isCarbon()) newParameters['redischargeVoltage'           ] = '5000';
            if(!isCarbon()) newParameters['batteryType'                  ] = '1';
            newParameters['maxGridFeedInPower'           ] = Math.round(Math.min(Math.max(parseInt($('#solar_wattPeak').val()) * parseInt($('#solar_feedInLimitation').val()) / 100, 50), maxGridFeedInPower));
            newParameters['solarEnergyPriority'          ] = '1';
            newParameters['allowBatteryCharging'         ] = '1';
            newParameters['allowBatteryChargingAC'       ] = '0';
            newParameters['allowGridFeedIn'              ] = '1';
            newParameters['allowBatteryDischargeSolarOK' ] = '1';
            newParameters['allowBatteryDischargeSolarNOK'] = '1';

            // Get Old Parameters
            $.get({
                url: "api.php?get=settings",
                async: false,
                error: function() { alert("E020. Please refresh the page!") },
                success: function(response) {
                    if(!response || typeof response != "object" || !response.hasOwnProperty('InverterParameters'))
                        return alert("E021. Please refresh the page!");
                        
                    response = response['InverterParameters'];
                    deviceDatetime = response['0']['S1'];
                    if(!isCarbon()) oldParameters['maxChargingCurrentAC'         ] = response['31']['S1'];
                    if(!isCarbon()) oldParameters['cutoffVoltageHybrid'          ] = response['33']['S1'].split(",")[0];
                    if(!isCarbon()) oldParameters['redischargeVoltageHybrid'     ] = response['33']['S1'].split(",")[1];
                    if(!isCarbon()) oldParameters['cutoffVoltage'                ] = response['33']['S1'].split(",")[2];
                    if(!isCarbon()) oldParameters['redischargeVoltage'           ] = response['33']['S1'].split(",")[3];
                    if(!isCarbon()) oldParameters['batteryType'                  ] = response[ '5']['S1'];
                    oldParameters['maxGridFeedInPower'           ] = response['15']['S1'];
                    oldParameters['solarEnergyPriority'          ] = response[ '6']['S1'];
                    oldParameters['allowBatteryCharging'         ] = response[ '2']['S1'].split(",")[0];
                    oldParameters['allowBatteryChargingAC'       ] = response[ '2']['S1'].split(",")[1];
                    oldParameters['allowGridFeedIn'              ] = response[ '2']['S1'].split(",")[2];
                    oldParameters['allowBatteryDischargeSolarOK' ] = response[ '2']['S1'].split(",")[3];
                    oldParameters['allowBatteryDischargeSolarNOK'] = response[ '2']['S1'].split(",")[4];
                }
            });

            console.log("newParameters"); console.log(newParameters);
            console.log("oldParameters"); console.log(oldParameters);

            let retry = false;

            // Resend Not Set Commands
            if(!isCarbon()) {
                if(newParameters['maxChargingCurrentAC'] != oldParameters['maxChargingCurrentAC'])
                    { retry = true; sendCommand(24113, 0, "", newParameters['maxChargingCurrentAC']); }
                if(newParameters['cutoffVoltageHybrid'] != oldParameters['cutoffVoltageHybrid'] || newParameters['redischargeVoltageHybrid'] != oldParameters['redischargeVoltageHybrid'] || newParameters['redischargeVoltage'] != oldParameters['redischargeVoltage'])
                    { retry = true; sendCommand(24115, 0, "", newParameters['cutoffVoltageHybrid'] + "," + newParameters['redischargeVoltageHybrid'] + "," + newParameters['cutoffVoltage'] + "," + newParameters['redischargeVoltage']); }
                if(newParameters['batteryType'] != oldParameters['batteryType'])
                    { retry = true; sendCommand(24069, 0, "", newParameters['batteryType']); }
            }
            if(newParameters['maxGridFeedInPower'] != oldParameters['maxGridFeedInPower'])
                { retry = true; sendCommand(24085, 0, "", newParameters['maxGridFeedInPower']); }
            if(newParameters['solarEnergyPriority'] != oldParameters['solarEnergyPriority'])
                { retry = true; sendCommand(24070, 0, "", newParameters['solarEnergyPriority']); }
            if(newParameters['allowBatteryCharging'] != oldParameters['allowBatteryCharging'])
                { retry = true; sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging']); }
            if(newParameters['allowBatteryChargingAC'] != oldParameters['allowBatteryChargingAC'])
                { retry = true; sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC']); }
            if(newParameters['allowGridFeedIn'] != oldParameters['allowGridFeedIn'])
                { retry = true; sendCommand(24066, 0, "", "C," + newParameters['allowGridFeedIn']); }
            if(newParameters['allowbatteryDischargeSolarOK'] != oldParameters['allowbatteryDischargeSolarOK'])
                { retry = true; sendCommand(24066, 0, "", "D," + newParameters['allowbatteryDischargeSolarOK']); }
            if(newParameters['allowbatteryDischargeSolarNOK'] != oldParameters['allowbatteryDischargeSolarNOK'])
                { retry = true; sendCommand(24066, 0, "", "E," + newParameters['allowbatteryDischargeSolarNOK']); }

            // Show Setting Success
            if(!retry) {
                $('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
                $('.loading').hide();
                $('.success').show();
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
            if(response["0"]["S1"] == deviceDatetime) return false;

            deviceDatetime = response["0"]["S1"];

            // Check if All Commands Are Correct
            if(!isCarbon()) oldParameters['maxChargingCurrentAC'    ] = response['31']['S1'];
            if(!isCarbon()) oldParameters['cutoffVoltageHybrid'     ] = response['33']['S1'].split(",")[0];
            if(!isCarbon()) oldParameters['redischargeVoltageHybrid'] = response['33']['S1'].split(",")[1];
            if(!isCarbon()) oldParameters['cutoffVoltage'           ] = response['33']['S1'].split(",")[2];
            if(!isCarbon()) oldParameters['redischargeVoltage'      ] = response['33']['S1'].split(",")[3];
            if(!isCarbon()) oldParameters['batteryType'             ] = response[ '5']['S1'];
            oldParameters['maxGridFeedInPower'           ] = response['15']['S1'];
            oldParameters['solarEnergyPriority'          ] = response[ '6']['S1'];
            oldParameters['allowBatteryCharging'         ] = response[ '2']['S1'].split(",")[0];
            oldParameters['allowBatteryChargingAC'       ] = response[ '2']['S1'].split(",")[1];
            oldParameters['allowGridFeedIn'              ] = response[ '2']['S1'].split(",")[2];
            oldParameters['allowBatteryDischargeSolarOK' ] = response[ '2']['S1'].split(",")[3];
            oldParameters['allowBatteryDischargeSolarNOK'] = response[ '2']['S1'].split(",")[4];

            let retry = false;

            // Resend Not Set Commands
            if(!isCarbon()) {
                if(newParameters['maxChargingCurrentAC'] != oldParameters['maxChargingCurrentAC'])
                    { retry = true; sendCommand(24113, 0, "", newParameters['maxChargingCurrentAC']); }
                if(newParameters['cutoffVoltageHybrid'] != oldParameters['cutoffVoltageHybrid'] || newParameters['redischargeVoltageHybrid'] != oldParameters['redischargeVoltageHybrid'] || newParameters['redischargeVoltage'] != oldParameters['redischargeVoltage'])
                    { retry = true; sendCommand(24115, 0, "", newParameters['cutoffVoltageHybrid'] + "," + newParameters['redischargeVoltageHybrid'] + "," + newParameters['cutoffVoltage'] + "," + newParameters['redischargeVoltage']); }
                if(newParameters['batteryType'] != oldParameters['batteryType'])
                    { retry = true; sendCommand(24069, 0, "", newParameters['batteryType']); }
            }
            if(newParameters['maxGridFeedInPower'] != oldParameters['maxGridFeedInPower'])
                { retry = true; sendCommand(24085, 0, "", newParameters['maxGridFeedInPower']); }
            if(newParameters['solarEnergyPriority'] != oldParameters['solarEnergyPriority'])
                { retry = true; sendCommand(24070, 0, "", newParameters['solarEnergyPriority']); }
            if(newParameters['allowBatteryCharging'] != oldParameters['allowBatteryCharging'])
                { retry = true; sendCommand(24066, 0, "", "A," + newParameters['allowBatteryCharging']); }
            if(newParameters['allowBatteryChargingAC'] != oldParameters['allowBatteryChargingAC'])
                { retry = true; sendCommand(24066, 0, "", "B," + newParameters['allowBatteryChargingAC']); }
            if(newParameters['allowGridFeedIn'] != oldParameters['allowGridFeedIn'])
                { retry = true; sendCommand(24066, 0, "", "C," + newParameters['allowGridFeedIn']); }
            if(newParameters['allowbatteryDischargeSolarOK'] != oldParameters['allowbatteryDischargeSolarOK'])
                { retry = true; sendCommand(24066, 0, "", "D," + newParameters['allowbatteryDischargeSolarOK']); }
            if(newParameters['allowbatteryDischargeSolarNOK'] != oldParameters['allowbatteryDischargeSolarNOK'])
                { retry = true; sendCommand(24066, 0, "", "E," + newParameters['allowbatteryDischargeSolarNOK']); }

            console.log("newParameters"); console.log(newParameters);
            console.log("oldParameters"); console.log(oldParameters);

            // Show Setting Success
            if(!retry) {
                $('.setting-progress span').html(lang['setting_success']).css('color', '#25ae88');
                $('.loading').hide();
                $('.success').show();
                // Move to next step
                setTimeout(function() { window.location.href = "system_test.php"; }, 2500);
            } else console.log("RETRYING, PLEASE WAIT !!!");

        }
    });
}