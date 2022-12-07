$progress.trigger("step", 5);










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Define Variables
*/

var skipSetup      = false;

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

var reactive_mode   = null;
var reactive_kink   = null;
var reactive_cosphi = null;
var reactive_v1     = null;
var reactive_v2     = null;
var reactive_v3     = null;
var reactive_v4     = null;
var reactive_qutime = null;
var reactive_qfix   = null;

var isClixV2 = false;

var dataSettings = {};
var importedData = {};










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Helper Functions
*/

function isLiFePO () { return $("#bx_battery_type_0").is(":checked"); }
function isCarbon () { return $("#bx_battery_type_1").is(":checked"); }
function isOther  () { return $("#bx_battery_type_9").is(":checked"); }

function isUPS    () { return $("#bx_sysmode").val() == "0"; }
function isBackup () { return $("#bx_sysmode").val() == "1"; }

function hasExtSol() { return $("#extsol_check").is(":checked"); }

function hasMeter1() { return $("#meter1_mode").val() == "1"; }
function hasMeter2() { return $("#meter2_mode").val() == "1"; }
function hasMeter3() { return $("#meter3_mode").val() == "1"; }
function hasMeter4() { return $("#meter4_mode").val() == "1"; }

function isNewSys () { return $("#system_co_new").is(":checked"); }
function isOldSys () { return $("#system_co_old").is(":checked"); }










/*
    Helper Function
*/

function convertVoltToUn(volt) { return Math.round(volt / 230 * 100) / 100; }
function convertUnToVolt(un) { return Math.round(un * 230 * 10) / 10; }










/*
    Helper Functions
*/

function disableBtnNext() { $("#btn_next").attr("disabled", true); }










/*
    Helper Functions
*/

function allFieldsCorrect() {
    
    // Return If Empty Field
    if( $("#installation_date           ").val() == "" ||
        $("#bx_device                   ").val() == "" ||
        $("#bx_box                      ").val() == "" ||
        $("#bx_sysmode                  ").val() == "" ||
        $("#solar_wattpeak              ").val() == "" ||
        $("#solar_feedinlimitation      ").val() == "" ||
        $("#reactive_mode               ").val() == "" ||
        $("#extended_dropRatedPowerPoint").val() == "" ||
        $("#extended_dropRatedPowerSlope").val() == "" ||
        (isTor && $("#extended_Ueff            ").val() == "") ||
        (isTor && $("#extended_UeffTime        ").val() == "") ||
        (isTor && $("#extended_UeffOver1       ").val() == "") ||
        (isTor && $("#extended_UeffUnder1      ").val() == "") ||
        (isTor && $("#extended_UeffOver2       ").val() == "") ||
        (isTor && $("#extended_UeffUnder2      ").val() == "") ||
        (isTor && $("#extended_fOver1          ").val() == "") ||
        (isTor && $("#extended_fUnder1         ").val() == "") ||
        (isTor && $("#extended_maxGridVoltage  ").val() == "") ||
        (isTor && $("#extended_minGridVoltage  ").val() == "") ||
        (isTor && $("#extended_maxGridFrequency").val() == "") ||
        (isTor && $("#extended_minGridFrequency").val() == "") ||
        (isTor && $("#extended_gridConnectDelay").val() == "") ||
        (isTor && $("#extended_puTime          ").val() == "")
    ) return false;

    // LiFePO
    if(isLiFePO()) {
        if( $("#bx_system       ").val() == ""
        ) return false;
        if( $("#lifepo_battery_1").val() == ""
        ) return false;
    }
    // Carbon
    else if(isCarbon()) {
        if( isOldSys() && $("#system_co_sn").val() == ""
        ) return false;
        if( $("#carbon_battery_model   ").val() == "" ||
            $("#carbon_battery_strings ").val() == "" ||
            $("#carbon_battery_capacity").val() == ""
        ) return false;
    }
    // Other
    else {
        if( isOldSys() && $("#system_co_sn").val() == ""
        ) return false;
        if( $("#other_battery_capacity                ").val() == "" ||
            $("#other_battery_maxChargingCurrent      ").val() == "" ||
            $("#other_battery_maxDischargingCurrent   ").val() == "" ||
            $("#other_battery_bulkChargingVoltage     ").val() == "" ||
            $("#other_battery_floatChargingVoltage    ").val() == "" ||
            $("#other_battery_cutoffVoltage           ").val() == "" ||
            $("#other_battery_redischargeVoltage      ").val() == "" ||
            $("#other_battery_cutoffVoltageHybrid     ").val() == "" ||
            $("#other_battery_redischargeVoltageHybrid").val() == ""
        ) return false;
    }

    return true;

}










/*
    Helper Functions
*/

function showSettingParametersError(errorStr) {
    clearInterval(checkParametersInterval);
    checkParametersInterval = undefined;
    isSettingParameters = false;
    $("#notif").removeClass("loading error success").addClass("error");
    $("#message").html(errorStr).css("color", "red");
    $("#btn_next").attr("disabled", false).unbind().on("click", () => { mainFormSubmit(); });
}










/*
    Helper Functions
*/

function verifyModulesLiFePO() {

    var system_serial = $("#bx_system").val();
    var tempArr = [];
    if($("#lifepo_battery_1 ").val() != "") tempArr.push($("#lifepo_battery_1 ").val());
    if($("#lifepo_battery_2 ").val() != "") tempArr.push($("#lifepo_battery_2 ").val());
    if($("#lifepo_battery_3 ").val() != "") tempArr.push($("#lifepo_battery_3 ").val());
    if($("#lifepo_battery_4 ").val() != "") tempArr.push($("#lifepo_battery_4 ").val());
    if($("#lifepo_battery_5 ").val() != "") tempArr.push($("#lifepo_battery_5 ").val());
    if($("#lifepo_battery_6 ").val() != "") tempArr.push($("#lifepo_battery_6 ").val());
    if($("#lifepo_battery_7 ").val() != "") tempArr.push($("#lifepo_battery_7 ").val());
    if($("#lifepo_battery_8 ").val() != "") tempArr.push($("#lifepo_battery_8 ").val());
    if($("#lifepo_battery_9 ").val() != "") tempArr.push($("#lifepo_battery_9 ").val());
    if($("#lifepo_battery_10").val() != "") tempArr.push($("#lifepo_battery_10").val());
    if($("#lifepo_battery_11").val() != "") tempArr.push($("#lifepo_battery_11").val());
    if($("#lifepo_battery_12").val() != "") tempArr.push($("#lifepo_battery_12").val());
    if($("#lifepo_battery_13").val() != "") tempArr.push($("#lifepo_battery_13").val());
    if($("#lifepo_battery_14").val() != "") tempArr.push($("#lifepo_battery_14").val());
    if($("#lifepo_battery_15").val() != "") tempArr.push($("#lifepo_battery_15").val());
    if($("#lifepo_battery_16").val() != "") tempArr.push($("#lifepo_battery_16").val());

    var canContinue = true;
    tempArr.forEach(sn => {
        if(canContinue) {
            canContinue = false;
            $.post({
                url: "https://api.batterx.app/v1/install.php",
                async: false,
                data: {
                    action: "verify_battery",
                    system: system_serial,
                    serialnumber: sn
                },
                error: () => { alert("E015. Please refresh the page!"); },
                success: (response) => {
                    if(response === "1") {
                        canContinue = true;
                    } else {
                        $("#errorBatterySerial").val(sn);
                        $("#errorBatteryNotExistOrWithOtherSystem").modal("show");
                    }
                }
            });
        }
    });

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

    // Return Result
    return canContinue;

}

function verifyModulesCommunication(callback) {
    $.get({
        url: "api.php?get=settings",
        error: () => { alert("E022. Please refresh the page!"); },
        success: (response) => {
            console.log(response);
            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E023. Please refresh the page!");
            dataSettings = JSON.parse(JSON.stringify(response));
            response = response["InverterParameters"];
            if(tempDatetime == "") { tempDatetime = response["0"]["s1"]; setTimeout(() => { verifyModulesCommunication(callback); }, 5000); return; }
            if(response["0"]["s1"] == tempDatetime) { setTimeout(() => { verifyModulesCommunication(callback); }, 5000); return; }
            // Verify Battery Charging Voltage
            var chargingVoltage = response["32"]["s1"];
            console.log(chargingVoltage);
            if(chargingVoltage != "5320,5320") {
                $("#notif").removeClass("loading error success").addClass("error");
                $("#message").html(lang.system_setup.msg_lifepo_communication_problem).css("color", "red");
                $("#btn_next").unbind().removeAttr("form").removeAttr("type").on("click", () => { setup1(); });
                isSettingParameters = false;
            } else {
                // Set Session Variables
                callback(true);
            }
        }
    });
}










/*
    Helper Functions
*/

setTimeout(() => { $("#modalSkipSetup input").val(""); }, 2500);
$("#modalSkipSetup input").on("keypress", (e) => {
    if(e.which == 13) {
        function sha1(str) {
            var rotate_left = function(n, s) { var t4 = (n << s) | (n >>> (32 - s)); return t4; };
            var cvt_hex = function(val) { var str = '', i, v; for(i = 7; i >= 0; i--) { v = (val >>> (i * 4)) & 0x0f; str += v.toString(16); } return str; };
            var blockstart, i, j, W = new Array(80), H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0, A, B, C, D, E, temp;
            str = unescape(encodeURIComponent(str));
            var str_len = str.length;
            var word_array = [];
            for(i = 0; i < str_len - 3; i += 4) { j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3); word_array.push(j); }
            switch(str_len % 4) {
                case 0: i = 0x080000000; break;
                case 1: i = str.charCodeAt(str_len - 1) << 24 | 0x0800000; break;
                case 2: i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000; break;
                case 3: i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80; break;
            }
            word_array.push(i);
            while((word_array.length % 16) != 14) { word_array.push(0); }
            word_array.push(str_len >>> 29);
            word_array.push((str_len << 3) & 0x0ffffffff);
            for(blockstart = 0; blockstart < word_array.length; blockstart += 16) {
                for(i = 0; i < 16; i++) { W[i] = word_array[blockstart + i]; } for(i = 16; i <= 79; i++) { W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1); } A = H0; B = H1; C = H2; D = H3; E = H4;
                for(i = 0; i <= 19; i++) { temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 20; i <= 39; i++) { temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 40; i <= 59; i++) { temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                for(i = 60; i <= 79; i++) { temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp; }
                H0 = (H0 + A) & 0x0ffffffff; H1 = (H1 + B) & 0x0ffffffff; H2 = (H2 + C) & 0x0ffffffff; H3 = (H3 + D) & 0x0ffffffff; H4 = (H4 + E) & 0x0ffffffff;
            }
            temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
            return temp.toLowerCase();
        }
        var pw = $("#modalSkipSetup input").val();
        if(sha1(pw) !== "01b6951429065548a08cb881ca9151eb651b6c5f") return $("#modalSkipSetup").modal("hide");
        if($("#btn_next").is(":disabled")) return $("#modalSkipSetup").modal("hide");
        if(confirm("Are you sure you want to continue?")) { $("#modalSkipSetup").modal("hide"); skipSetup = true; $("#btn_next").trigger("click"); }
    }
});










/*
    Helper Functions
*/

function showSystemInfo(json) {

    if(!json) return;

    // Set System Info
    if(json.hasOwnProperty("system")) {
        if(json.system.hasOwnProperty("serialnumber")) {
            $("#bx_system, #system_co_sn").val(json.system.serialnumber).attr("disabled", true);
            systemSerial = json.system.serialnumber;
        }
        if(json.system.hasOwnProperty("model")) {
            systemType = json.system.model.includes("W") ? "w" : "r";
            $(`#bx_system_type_${systemType}`).click();
            $("#bx_system_type_w, #bx_system_type_r").attr("disabled", true);
        }
    }

    // Set Device Info
    if(json.hasOwnProperty("device")) {
        if(json.device.hasOwnProperty("solar_watt_peak"))
            $("#solar_wattpeak").val(json.device.solar_watt_peak);
        if(json.device.hasOwnProperty("grid_feedin_limitation"))
            $("#solar_feedinlimitation").val(json.device.grid_feedin_limitation);
    }

    // Set Installation Date
    if(json.hasOwnProperty("installation_date"))
        $("#installation_date").val(json.installation_date);

    // Set Solar Info
    if(json.hasOwnProperty("solar_info"))
        $("#solar_info").val(json.solar_info);

    // Set Inverter Memo
    if(json.hasOwnProperty("note"))
        $("#installer_memo").val(json.note);

    // Set Batteries Info
    if(json.hasOwnProperty("batteries")) {
        // Multiple Batteries (LiFePO Only)
        if(json.batteries.length > 1) {
            if(json.batteries.length > 4) $("#btnShowAllModules").click();
            var x = 1;
            json.batteries.forEach(battery => {
                if(battery.hasOwnProperty("serialnumber")) $(`#lifepo_battery_${x}`).val(battery.serialnumber);
                x++;
            });
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
                if(battery.hasOwnProperty("capacity")) $("#carbon_battery_capacity").val(`${battery.capacity} Wh`);
                if(battery.hasOwnProperty("strings" )) $("#carbon_battery_strings ").val(battery.strings).trigger("change");
                if(battery.hasOwnProperty("model"   )) $("#carbon_battery_model   ").val(battery.model  ).trigger("change");
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

    // Disable CO System Radio
    $("#system_co_old").prop("checked", true).trigger("change");
    $("#system_co_new, #system_co_old").prop("disabled", true);

    isAlreadyRegistered = true;

}










/*
    Helper Functions
*/

function showSystemSettings(response) {

    // E.Meter Phase Connection (batterX h5)
    if(deviceModel == "batterx_h5") {
        $("#box_emeter_phase").removeClass("d-none");
        if(response.hasOwnProperty("InjectionMode")) {
            var temp = response["InjectionMode"];
            if(temp["0"]["v6"] !== 0) $("#bx_emeter_phase").val(temp["0"]["v6"]);
        }
    }

    // System Mode (cliX 2.0)
    if(isClixV2) {
        if(response.hasOwnProperty("SystemMode")) {
            var temp = response["SystemMode"];
            $("#bx_sysmode").val(temp["0"]["mode"]);
        }
    }

    // Inverter Parameters
    if(response.hasOwnProperty("InverterParameters")) {
        var temp = response["InverterParameters"];
        // Battery Parameters
        if(temp.hasOwnProperty("30"))
            $("#other_battery_maxChargingCurrent      ").val(parseInt(temp["30"]["s1"]) / 100);
        if(temp.hasOwnProperty("34"))
            $("#other_battery_maxDischargingCurrent   ").val(parseInt(temp["34"]["s1"]));
        if(temp.hasOwnProperty("32")) {
            $("#other_battery_bulkChargingVoltage     ").val(parseInt(temp["32"]["s1"].split(",")[0]) / 100);
            $("#other_battery_floatChargingVoltage    ").val(parseInt(temp["32"]["s1"].split(",")[1]) / 100);
        }
        if(temp.hasOwnProperty("33")) {
            $("#other_battery_cutoffVoltageHybrid     ").val(parseInt(temp["33"]["s1"].split(",")[0]) / 100);
            $("#other_battery_redischargeVoltageHybrid").val(parseInt(temp["33"]["s1"].split(",")[1]) / 100);
            $("#other_battery_cutoffVoltage           ").val(parseInt(temp["33"]["s1"].split(",")[2]) / 100);
            $("#other_battery_redischargeVoltage      ").val(parseInt(temp["33"]["s1"].split(",")[3]) / 100);
        }
        // Extended Parameters
        if(temp.hasOwnProperty("38")) {
            if(temp["38"]["s1"] != "") {
                $("#extended_dropRatedPowerPoint").val(temp["38"]["s1"].split(",")[0]);
                $("#extended_dropRatedPowerSlope").val(temp["38"]["s1"].split(",")[1]);
            }
        }
        // Extended Parameters TOR
        if(isTor && isAlreadyRegistered) {
            if(temp.hasOwnProperty("14")) $("#extended_Ueff            ").val(convertVoltToUn(parseInt(temp["14"]["s1"]) / 100));
            if(temp.hasOwnProperty("46")) $("#extended_UeffTime        ").val(Math.round(parseInt(temp["46"]["s1"]) / 60));
            if(temp.hasOwnProperty("39")) $("#extended_UeffOver1       ").val(convertVoltToUn(parseInt(temp["39"]["s1"].split(",")[0]) / 100));
            if(temp.hasOwnProperty("39")) $("#extended_UeffUnder1      ").val(convertVoltToUn(parseInt(temp["39"]["s1"].split(",")[1]) / 100));
            if(temp.hasOwnProperty("41")) $("#extended_UeffOver2       ").val(convertVoltToUn(parseInt(temp["41"]["s1"].split(",")[0]) / 100));
            if(temp.hasOwnProperty("41")) $("#extended_UeffUnder2      ").val(convertVoltToUn(parseInt(temp["41"]["s1"].split(",")[1]) / 100));
            if(temp.hasOwnProperty("40")) $("#extended_fOver1          ").val(parseInt(temp["40"]["s1"].split(",")[0]) / 100);
            if(temp.hasOwnProperty("40")) $("#extended_fUnder1         ").val(parseInt(temp["40"]["s1"].split(",")[1]) / 100);
            if(temp.hasOwnProperty("11")) $("#extended_maxGridVoltage  ").val(convertVoltToUn(parseInt(temp["11"]["s1"]) / 100));
            if(temp.hasOwnProperty("10")) $("#extended_minGridVoltage  ").val(convertVoltToUn(parseInt(temp["10"]["s1"]) / 100));
            if(temp.hasOwnProperty("13")) $("#extended_maxGridFrequency").val(parseInt(temp["13"]["s1"]) / 100);
            if(temp.hasOwnProperty("12")) $("#extended_minGridFrequency").val(parseInt(temp["12"]["s1"]) / 100);
            if(temp.hasOwnProperty( "4")) $("#extended_gridConnectDelay").val(parseInt(temp["4"]["s1"]));
            if(temp.hasOwnProperty("47")) $("#extended_puTime          ").val(parseInt(temp["47"]["s1"].split(",")[1]));
        }
    }

    // E.Meter Injection Regulation
    if(response.hasOwnProperty("InjectionMode")) {
        var temp = response["InjectionMode"];
        $("#regulation_check").prop("checked", temp["0"]["v5"] != "0");
    }

    // ExtSol Energy Meter
    if(response.hasOwnProperty("ModbusExtSolarDevice")) {
        var temp = response["ModbusExtSolarDevice"];
        $("#extsol_check").prop("checked", temp["0"]["mode"] != "0");
    }

    // User Meters
    if(response.hasOwnProperty("UserMeter")) {
        var temp = response["UserMeter"];
        if(temp.hasOwnProperty("1")) {
            $("#meter1_mode ").val(temp["1"]["mode"]);
            $("#meter1_label").val(temp["1"]["s1"  ]);
        }
        if(temp.hasOwnProperty("2")) {
            $("#meter2_mode ").val(temp["2"]["mode"]);
            $("#meter2_label").val(temp["2"]["s1"  ]);
        }
        if(temp.hasOwnProperty("3")) {
            $("#meter3_mode ").val(temp["3"]["mode"]);
            $("#meter3_label").val(temp["3"]["s1"  ]);
        }
        if(temp.hasOwnProperty("4")) {
            $("#meter4_mode ").val(temp["4"]["mode"]);
            $("#meter4_label").val(temp["4"]["s1"  ]);
        }
    }

}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Show|Hide Import Data From Cloud Button
*/

$("#bx_system, #system_co_sn").on("change", () => showImportDataFromCloud());

function showImportDataFromCloud() {

    $("#bxHome").removeClass("can-import-cloud-data");

    if(isLiFePO() && $("#bx_system").val().trim() == "") return;
    if((isCarbon() || isOther()) && isOldSys() && $("#system_co_sn").val().trim() == "") return;
    if(Object.keys(dataSettings).length == 0) return;
    if(!dataSettings.hasOwnProperty("CloudSet")) return;
    if(!dataSettings["CloudSet"].hasOwnProperty("0")) return;
    if(!dataSettings["CloudSet"]["0"].hasOwnProperty("mode")) return;
    if(dataSettings["CloudSet"]["0"]["mode"].toString() != "0") return;

    $.post({
        url: "https://api.batterx.app/v1/install.php",
        data: {
            action : "get_system_data",
            system : isLiFePO() ? $("#bx_system").val().trim() : $("#system_co_sn").val().trim(),
            customer : customerEmail.trim()
        },
        error: () => { alert("E004. Please refresh the page!"); },
        success: (json) => {
            console.log(json);
            if((isCarbon() || isOther()) && isOldSys() && !json) {
                alert(lang.system_setup.msg_system_with_sn_does_not_exist.replace("123", $("#system_co_sn").val().trim()));
                $("#system_co_sn").val("");
            }
            if(!json) return;
            importedData = json;
            $("#bxHome").addClass("can-import-cloud-data");
        }
    });

}










/*
    Show Imported Data From Cloud
*/

$("#btnImportDataFromCloud").on("click", () => {
    importSystemInfo();
    importSystemSettings();
    $("#bxHome").removeClass("can-import-cloud-data");
});










/*
    Show Imported Data From Cloud
*/

function importSystemInfo() {
    if(!importedData.hasOwnProperty("info")) return;
    showSystemInfo(importedData.info);
}










/*
    Log All Imported Settings to Database
*/

function importSystemSettings() {

    if(!importedData.hasOwnProperty("settings")) return;

    var response = importedData.settings;

    /*
        SETTINGS LOADED BELOW
        - ModbusExtSolarDevice 0
        - UserMeter 1
        - UserMeter 2
        - UserMeter 3
        - UserMeter 4
        - PrepareBatteryExtension 0
    */

    showSystemSettings(response);

    /*
        SETTINGS STORED DIRECTLY IN DATABASE
        - BxOutPin 1
        - BxOutPin 2
        - BxOutPin 3
        - BxOutPin 4
        - SystemMode 0
        - GridInjection 0
        - BatteryCharging 0
        - BatteryChargingAC 0
        - BatteryDischarging 0
        - BatteryDischargingAC 0
        - IgnoreWarnings 0
        - BatteryMinSoC 0
        - InjectionMode 0
    */

    var totalSteps = 13;
    var temp = false; // Function Inside Function
    temp = response.hasOwnProperty("BxOutPin"            ) && response["BxOutPin"            ].hasOwnProperty("1") ? response["BxOutPin"            ]["1"] : false; importSystemSettings_logSetting(totalSteps,  1, "BxOutPin"            , "1", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BxOutPin"            ) && response["BxOutPin"            ].hasOwnProperty("2") ? response["BxOutPin"            ]["2"] : false; importSystemSettings_logSetting(totalSteps,  2, "BxOutPin"            , "2", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BxOutPin"            ) && response["BxOutPin"            ].hasOwnProperty("3") ? response["BxOutPin"            ]["3"] : false; importSystemSettings_logSetting(totalSteps,  3, "BxOutPin"            , "3", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BxOutPin"            ) && response["BxOutPin"            ].hasOwnProperty("4") ? response["BxOutPin"            ]["4"] : false; importSystemSettings_logSetting(totalSteps,  4, "BxOutPin"            , "4", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("SystemMode"          ) && response["SystemMode"          ].hasOwnProperty("0") ? response["SystemMode"          ]["0"] : false; importSystemSettings_logSetting(totalSteps,  5, "SystemMode"          , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("GridInjection"       ) && response["GridInjection"       ].hasOwnProperty("0") ? response["GridInjection"       ]["0"] : false; importSystemSettings_logSetting(totalSteps,  6, "GridInjection"       , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BatteryCharging"     ) && response["BatteryCharging"     ].hasOwnProperty("0") ? response["BatteryCharging"     ]["0"] : false; importSystemSettings_logSetting(totalSteps,  7, "BatteryCharging"     , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BatteryChargingAC"   ) && response["BatteryChargingAC"   ].hasOwnProperty("0") ? response["BatteryChargingAC"   ]["0"] : false; importSystemSettings_logSetting(totalSteps,  8, "BatteryChargingAC"   , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BatteryDischarging"  ) && response["BatteryDischarging"  ].hasOwnProperty("0") ? response["BatteryDischarging"  ]["0"] : false; importSystemSettings_logSetting(totalSteps,  9, "BatteryDischarging"  , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BatteryDischargingAC") && response["BatteryDischargingAC"].hasOwnProperty("0") ? response["BatteryDischargingAC"]["0"] : false; importSystemSettings_logSetting(totalSteps, 10, "BatteryDischargingAC", "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("IgnoreWarnings"      ) && response["IgnoreWarnings"      ].hasOwnProperty("0") ? response["IgnoreWarnings"      ]["0"] : false; importSystemSettings_logSetting(totalSteps, 11, "IgnoreWarnings"      , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("BatteryMinSoC"       ) && response["BatteryMinSoC"       ].hasOwnProperty("0") ? response["BatteryMinSoC"       ]["0"] : false; importSystemSettings_logSetting(totalSteps, 12, "BatteryMinSoC"       , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
    temp = response.hasOwnProperty("InjectionMode"       ) && response["InjectionMode"       ].hasOwnProperty("0") ? response["InjectionMode"       ]["0"] : false; importSystemSettings_logSetting(totalSteps, 13, "InjectionMode"       , "0", temp === false ? [] : [temp.mode, temp.v1, temp.v2, temp.v3, temp.v4, temp.v5, temp.v6, temp.s1, temp.s2, temp.name], () => {
        // SHOW SUCCESS
        alert("Data imported successfully!");
        $("#importingDataFromCloud").modal("hide");
    }); }); }); }); }); }); }); }); }); }); }); }); });

}

function importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback) {
    $("#importingDataFromCloud_step").html(`<b>${currentStep} / ${totalSteps}</b>`);
    $("#importingDataFromCloud").modal("show");
    if(jsonArr.length == 0) return callback();
    $.get({
        url: `api.php?set=command&type=11&entity=0&text1=${entity} ${varName}&text2=${encodeURIComponent(JSON.stringify(jsonArr))}`,
        error: () => { alert("Error while writing the settings, please refresh the page! (E001)"); },
        success: (response) => {
            if(response != "1") return alert("Error while writing the settings, please refresh the page! (E002)");
            setTimeout(() => { importSystemSettings_waitUntilSet(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
        }
    });
}

function importSystemSettings_waitUntilSet(totalSteps, currentStep, varName, entity, jsonArr, callback) {
    $.get({
        url: "api.php?get=settings",
        error: () => { return setTimeout(() => { importSystemSettings_waitUntilSet(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000); },
        success: (response) => {
            
            console.log(response);
            
            if(!response || typeof response != "object") return setTimeout(() => { importSystemSettings_waitUntilSet(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            
            dataSettings = JSON.parse(JSON.stringify(response));

            if(!response.hasOwnProperty(varName) || !response[varName].hasOwnProperty(entity)) return alert("Error while writing the settings, please refresh the page! (E003) " + varName + " " + entity);

            if(jsonArr.length > 0 && response[varName][entity].mode != jsonArr[0]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 1 && response[varName][entity].v1   != jsonArr[1]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 2 && response[varName][entity].v2   != jsonArr[2]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 3 && response[varName][entity].v3   != jsonArr[3]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 4 && response[varName][entity].v4   != jsonArr[4]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 5 && response[varName][entity].v5   != jsonArr[5]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 6 && response[varName][entity].v6   != jsonArr[6]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 7 && response[varName][entity].s1   != jsonArr[7]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 8 && response[varName][entity].s2   != jsonArr[8]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);
            if(jsonArr.length > 9 && response[varName][entity].name != jsonArr[9]) return setTimeout(() => { importSystemSettings_logSetting(totalSteps, currentStep, varName, entity, jsonArr, callback); }, 5000);

            return callback();
        }
    });
}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    CO System Radio OnChange Listener
*/

$("input[name=system_co_radio]").on("change", function() {
    if(this.value == "old")
        $("#system_co_sn").show();
    else
        $("#system_co_sn").hide();
});










/*
    Battery Type OnChange Listener
*/

$("input[name=bx_battery_type]").on("change", function() {

    // Show Correct Battery Section
    $(`#battery_section_0, #battery_section_1, #battery_section_9`).hide();
    $(`#battery_section_${this.value}`).show();

    // Show|Hide Options
    if(this.value == "0") {
        // LiFePO
        $("#system_type, #system_mode").show();
        $("#system_co_box").hide();
        $("#bx_system").val(systemSerial).trigger("change");
        $(`#bx_system_type_${systemType}`).prop("checked", true);
    } else {
        // Carbon|Other
        $("#system_type, #system_mode").hide();
        $("#system_co_box").show();
        $("#bx_system").val(systemSerial).trigger("change");
        $("#bx_system_type_w").prop("checked", true);
        $("#bx_sysmode").val("0");
    }

});










/*
    Carbon Batteries|Strings OnChange Listener
*/

$("#carbon_battery_model, #carbon_battery_strings").on("change", function() {

    var batteryModel    = $("#carbon_battery_model").val();
    var batteryStrings  = $("#carbon_battery_strings").val();
    var batteryCapacity = 0;

         if(batteryModel == "LC+700"  ) batteryCapacity = 4 * 700 * parseInt(batteryStrings);
    else if(batteryModel == "LC+1300" ) batteryCapacity = 4 * 1300 * parseInt(batteryStrings);
    else if(batteryModel == "LC+2V500") batteryCapacity = 24 * 2 * 500 * parseInt(batteryStrings);

    $("#carbon_battery_capacity").val(`${batteryCapacity} Wh`);

});










/*
    More Battery Modules OnClick Listener
*/

$("#btnShowAllModules").on("click", function() {
    $("#listAllModules").removeClass("d-none");
    $(this).addClass("d-none");
});










/*
    Reactive Mode OnChange|OnInput Listeners
*/

$("#reactive_mode").on("change", function() {
    $(`#reactive_mode1, #reactive_mode2, #reactive_mode3, #reactive_mode4`).addClass("d-none");
    $(`#reactive_mode${this.value}`).removeClass("d-none");
});

$("#reactive_mode1_kink").on("change", function() {
    $("#svg_reactive_mode1 #svg_reactive_mode1_kink_value").text(parseInt($("#reactive_mode1_kink").val()) / 100);
});

$("#reactive_mode3_v1, #reactive_mode3_v2, #reactive_mode3_v3, #reactive_mode3_v4").on("change input", function() {
    $("#svg_reactive_mode3 #svg_reactive_mode3_v1_value").text(($("#reactive_mode3_v1").val() == "" ? $("#reactive_mode3_v1").attr("placeholder") : $("#reactive_mode3_v1").val()) + "%");
    $("#svg_reactive_mode3 #svg_reactive_mode3_v2_value").text(($("#reactive_mode3_v2").val() == "" ? $("#reactive_mode3_v2").attr("placeholder") : $("#reactive_mode3_v2").val()) + "%");
    $("#svg_reactive_mode3 #svg_reactive_mode3_v3_value").text(($("#reactive_mode3_v3").val() == "" ? $("#reactive_mode3_v3").attr("placeholder") : $("#reactive_mode3_v3").val()) + "%");
    $("#svg_reactive_mode3 #svg_reactive_mode3_v4_value").text(($("#reactive_mode3_v4").val() == "" ? $("#reactive_mode3_v4").attr("placeholder") : $("#reactive_mode3_v4").val()) + "%");
});

$("#reactive_mode, #reactive_mode1_kink, #reactive_mode3_v1, #reactive_mode3_v2, #reactive_mode3_v3, #reactive_mode3_v4").trigger("change");










/*
    Activate Submit Button
*/

setInterval(() => {

    // Return If Empty Fields
    if(!allFieldsCorrect()) return disableBtnNext();

    // Enable|Disable Button Next
    $("#btn_next").attr("disabled", isSettingParameters);

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

    if(!apikey || apikey.length != 40) return alert("E003. Please refresh the page!");

    step2();

}










/*
    Get Installation Info
*/

function step2() {

    $.post({
        url: "https://api.batterx.app/v1/install.php",
        data: {
            action : "get_installation_info",
            apikey : systemApikey
        },
        error: () => { alert("E004. Please refresh the page!"); },
        success: (json) => {

            console.log(json);

            if(!json) { step3(); return; }

            showSystemInfo(json);

            step3();

        }
    });

}










/*
    Set LiveX Serial-Number
*/

function step3() {

    $.post({
        url: "https://api.batterx.app/v1/install.php",
        data: {
            action : "get_box_serial",
            apikey : systemApikey
        },
        error: () => { alert("E005. Please refresh the page!"); },
        success: (response) => {

            console.log(response);

            var box_serial = response;

            if(!box_serial) return $("#errorBoxNotRegistered").modal("show");

            // Check If cliX v2
            if(box_serial.includes("XC") && box_serial.length == 10 && parseInt(box_serial.substring(0, 2)) >= 21) isClixV2 = true;
            if(!isClixV2) $("#bx_sysmode option[value=1]").remove();

            // Enable|Disable Battery Type Selection
            if(box_serial.includes("XC") && box_serial.length == 10) {
                // Only LiFePO|None
            } else {
                // Only Carbon|Other
                $("#bx_battery_type_1").prop("checked", true).trigger("change");
                $("#bx_battery_type_0").attr("disabled", true);
            }

            // Save LiveX Serial-Number to Session
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

            var objDeviceModels = {
                "batterX h5"  : "batterx_h5",
                "batterX h10" : "batterx_h10"
            }

            var device_serial_number = response.device_serial_number;
            var device_model = objDeviceModels.hasOwnProperty(response.device_model) ? objDeviceModels[response.device_model] : "";
            deviceModel = device_model;

            // Save Serial-Number & Model to Session
            $.post({
                url: "cmd/session.php",
                data: {
                    device_serial : device_serial_number,
                    device_model  : device_model
                },
                error: () => { alert("E010. Please refresh the page!"); },
                success: (response) => {
                    console.log(response);
                    if(response !== "1") return alert("E011. Please refresh the page!");
                    $("#bx_device").val(device_serial_number);
                    step5();
                }
            });

        }
    });

}










/*
    Load Other Parameters From Settings Table
*/

function step5() {
    
    $.get({
        url: "api.php?get=settings",
        error: () => { alert("E012. Please refresh the page!"); },
        success: (response) => {
            
            console.log(response);
            
            if(!response || typeof response != "object") return alert("E013. Please refresh the page!");

            dataSettings = JSON.parse(JSON.stringify(response));

            showSystemSettings(response);

            // Show|Hide Import Data From Cloud Button
            showImportDataFromCloud();

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
    if(isTor) {
        $("#confirmExtended_Ueff"            ).val($("#extended_Ueff"            ).val());
        $("#confirmExtended_UeffTime"        ).val($("#extended_UeffTime"        ).val());
        $("#confirmExtended_UeffOver1"       ).val($("#extended_UeffOver1"       ).val());
        $("#confirmExtended_UeffUnder1"      ).val($("#extended_UeffUnder1"      ).val());
        $("#confirmExtended_UeffOver2"       ).val($("#extended_UeffOver2"       ).val());
        $("#confirmExtended_UeffUnder2"      ).val($("#extended_UeffUnder2"      ).val());
        $("#confirmExtended_fOver1"          ).val($("#extended_fOver1"          ).val());
        $("#confirmExtended_fUnder1"         ).val($("#extended_fUnder1"         ).val());
        $("#confirmExtended_maxGridVoltage"  ).val($("#extended_maxGridVoltage"  ).val());
        $("#confirmExtended_minGridVoltage"  ).val($("#extended_minGridVoltage"  ).val());
        $("#confirmExtended_maxGridFrequency").val($("#extended_maxGridFrequency").val());
        $("#confirmExtended_minGridFrequency").val($("#extended_minGridFrequency").val());
        $("#confirmExtended_gridConnectDelay").val($("#extended_gridConnectDelay").val());
        $("#confirmExtended_puTime"          ).val($("#extended_puTime"          ).val());
        $("#modalConfirmExtendedParameters").modal("show");
        $("#modalConfirmExtendedParameters button.confirm").unbind().on("click", () => {
            $("#modalConfirmExtendedParameters").modal("hide");
            mainFormSubmit_2();
        });
        $("#modalConfirmExtendedParameters button.modify").unbind().on("click", () => {
            $("#modalConfirmExtendedParameters").modal("hide");
            $("#modalExtendedParameters").modal("show");
        });
    } else {
        mainFormSubmit_2();
    }
}

function mainFormSubmit_2() {
    if(isOther() && $("#other_battery_capacity").val() != "0") {
        $("#modalConfirmOtherBatteries").modal("show");
        $("#modalConfirmOtherBatteries button").unbind().on("click", () => {
            $("#modalConfirmOtherBatteries").modal("hide");
            mainFormSubmit_3();
        });
    } else {
        mainFormSubmit_3();
    }
}

function mainFormSubmit_3() {
    if(isClixV2 && isUPS()) {
        $("#modalConfirmUpsMode").modal("show");
        $("#modalConfirmUpsMode button").unbind().on("click", () => {
            $("#modalConfirmUpsMode").modal("hide");
            mainFormSubmit_4();
        });
    } else if(isClixV2 && isBackup()) {
        $("#modalConfirmBackupMode").modal("show");
        $("#modalConfirmBackupMode button").unbind().on("click", () => {
            $("#modalConfirmBackupMode").modal("hide");
            mainFormSubmit_4();
        });
    } else {
        mainFormSubmit_4();
    }
}

function mainFormSubmit_4() {
    if($("#regulation_check").is(":checked") && parseInt($("#solar_feedinlimitation").val()) < 100) {
        $("#modalConfirmInternalSolar .message").html(lang.system_setup.internalsolarconfirm_message.replace("30%", `<b>${Math.round(100 - parseInt($("#solar_feedinlimitation").val()))}%</b>`));
        $("#modalConfirmInternalSolar").modal("show");
        $("#modalConfirmInternalSolar button").unbind().on("click", () => {
            $("#modalConfirmInternalSolar").modal("hide");
            mainFormSubmit_5();
        });
    } else {
        mainFormSubmit_5();
    }
}










/*
    Check All Fields
*/

function mainFormSubmit_5() {

    // Return If Empty Fields
    if(!allFieldsCorrect()) return;

    // Confirm Solar Watt Peak (if under 1000Wp)
    if(parseInt($("#solar_wattpeak").val()) < 1000) {
        var tempFlag = confirm(`${lang.system_setup.msg_solar_size_very_low}\n\n${lang.system_setup.msg_solar_size_very_low_confirm.replace("100", $("#solar_wattpeak").val())}\n`);
        if(!tempFlag) return $("#solar_wattpeak").val("");
    }

    // Check System S/N (For LiFePO)
    if(isLiFePO() && !isAlreadyRegistered && $("#bx_system").val().length != 14)
        return $("#errorSystemSerialNotCorrect").modal("show");
    
    // Verify Battery Modules
    if(isLiFePO() && !verifyModulesLiFePO()) return;

    // Check Inverter S/N
    $.post({
        url: "https://api.batterx.app/v1/install.php",
        data: {
            action       : "verify_device",
            serialnumber : $("#bx_device").val(),
            system       : isLiFePO() ? $("#bx_system").val().trim() : isOldSys() ? $("#system_co_sn").val().trim() : "NEW"
        },
        error: () => { alert("E014. Please refresh the page!"); },
        success: (response) => {
            console.log(response);
            if(response !== "1") return $("#errorInverterRegisteredWithOtherSystem").modal("show");
            mainFormSubmit_6();
        }
    });

}










/*
    Start Setup
*/

function mainFormSubmit_6() {





    // Disable All Fields

    $(` #bx_system,
        #bx_system_type_r,
        #bx_system_type_w,
        #bx_device,
        #bx_box,
        #bx_sysmode,
        #btnInstallerMemo,
        #installer_memo,
        
        #solar_wattpeak,
        #solar_feedinlimitation,
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
        #other_battery_redischargeVoltage,

        #reactive_mode,
        #reactive_mode1_kink,
        #reactive_mode2_cosphi,
        #reactive_mode2_cosphi_sign,
        #reactive_mode3_cosphi,
        #reactive_mode3_v1,
        #reactive_mode3_v2,
        #reactive_mode3_v3,
        #reactive_mode3_v4,
        #reactive_mode3_qutime,
        #reactive_mode4_qfix,
        #btnExtendedParameters,
        #extended_dropRatedPowerPoint,
        #extended_dropRatedPowerSlope,
        #extended_Ueff,
        #extended_UeffTime,
        #extended_UeffOver1,
        #extended_UeffUnder1,
        #extended_UeffOver2,
        #extended_UeffUnder2,
        #extended_fOver1,
        #extended_fUnder1,
        #extended_maxGridVoltage,
        #extended_minGridVoltage,
        #extended_maxGridFrequency,
        #extended_minGridFrequency,
        #extended_gridConnectDelay,
        #extended_puTime,

        #regulation_check,
        #extsol_check,
        #btnUserMeters,
        #meter1_mode,
        #meter1_label,
        #meter2_mode,
        #meter2_label,
        #meter3_mode,
        #meter3_label,
        #meter4_mode,
        #meter4_label,

        #system_co_new,
        #system_co_old,
        #system_co_sn
    `).attr("disabled", true);





    // Show Loading Screen

    isSettingParameters = true;
    disableBtnNext();
    $(".setting-progress").removeClass("d-none");





    // Scroll to Bottom

    $("html, body").scrollTop($(document).height());





    // Set Values to Session

    setValuesToSession();





}










/*
    Set Values To Session
*/

function setValuesToSession() {





    var tempData = {};





    // Common Parameters

    tempData.system_serial          = $("#bx_system             ").val().trim();
    tempData.device_serial          = $("#bx_device             ").val().trim();
    tempData.solar_wattpeak         = $("#solar_wattpeak        ").val().trim();
    tempData.solar_feedinlimitation = $("#solar_feedinlimitation").val().trim();
    tempData.solar_info             = $("#solar_info            ").val().trim();
    tempData.note                   = $("#installer_memo        ").val().trim();
    tempData.installation_date      = $("#installation_date     ").val().trim();
    tempData.system_mode            = $("#bx_sysmode            ").val().trim();

    if(isCarbon() || isOther())
        tempData.system_serial = isOldSys() ? $("#system_co_sn").val().trim() : "NEW";





    // Reactive Power Mode

    reactive_mode   = Math.round($("#reactive_mode").val());
    reactive_kink   = null;
    reactive_cosphi = null;
    reactive_v1     = null;
    reactive_v2     = null;
    reactive_v3     = null;
    reactive_v4     = null;
    reactive_qutime = $("#reactive_mode3_qutime").val() == "" ? 5 : Math.round($("#reactive_mode3_qutime").val());
    reactive_qfix   = null;

    if(reactive_mode == "1") {
        reactive_kink = Math.round($("#reactive_mode1_kink").val());
    } else if(reactive_mode == "2") {
        reactive_cosphi = Math.round($("#reactive_mode2_cosphi").val());
        if($("#reactive_mode2_cosphi_sign").val() == "1" && reactive_cosphi != 100) reactive_cosphi = -reactive_cosphi;
    } else if(reactive_mode == "3") {
        reactive_cosphi = Math.round($("#reactive_mode3_cosphi").val());
        reactive_v1     = $("#reactive_mode3_v1").val() == "" ? isTor ?  92 :  93 : Math.round($("#reactive_mode3_v1").val());
        reactive_v2     = $("#reactive_mode3_v2").val() == "" ? isTor ?  96 :  97 : Math.round($("#reactive_mode3_v2").val());
        reactive_v3     = $("#reactive_mode3_v3").val() == "" ? isTor ? 105 : 103 : Math.round($("#reactive_mode3_v3").val());
        reactive_v4     = $("#reactive_mode3_v4").val() == "" ? isTor ? 108 : 107 : Math.round($("#reactive_mode3_v4").val());
        reactive_qutime = $("#reactive_mode3_qutime").val() == "" ? 5 : Math.round($("#reactive_mode3_qutime").val());
        if(reactive_qutime < 3) reactive_qutime = 3;
        if(reactive_qutime > 60) reactive_qutime = 60;
    } else if(reactive_mode == "4") {
        reactive_qfix   = $("#reactive_mode4_qfix").val() == "" ? 0 : Math.round($("#reactive_mode4_qfix").val());
        if(reactive_qfix < -5000) reactive_qfix = -5000;
        if(reactive_qfix >  5000) reactive_qfix =  5000;
    }

    if(reactive_mode   != null) tempData.reactive_mode   = reactive_mode;
    if(reactive_kink   != null) tempData.reactive_kink   = reactive_kink;
    if(reactive_cosphi != null) tempData.reactive_cosphi = reactive_cosphi;
    if(reactive_v1     != null) tempData.reactive_v1     = reactive_v1;
    if(reactive_v2     != null) tempData.reactive_v2     = reactive_v2;
    if(reactive_v3     != null) tempData.reactive_v3     = reactive_v3;
    if(reactive_v4     != null) tempData.reactive_v4     = reactive_v4;
    if(reactive_qutime != null) tempData.reactive_qutime = reactive_qutime;
    if(reactive_qfix   != null) tempData.reactive_qfix   = reactive_qfix;

    if($("#extended_dropRatedPowerPoint").val() != "") tempData.extended_dropRatedPowerPoint = $("#extended_dropRatedPowerPoint").val();
    if($("#extended_dropRatedPowerSlope").val() != "") tempData.extended_dropRatedPowerSlope = $("#extended_dropRatedPowerSlope").val();
    if($("#extended_Ueff               ").val() != "") tempData.extended_Ueff                = $("#extended_Ueff               ").val();
    if($("#extended_UeffTime           ").val() != "") tempData.extended_UeffTime            = $("#extended_UeffTime           ").val();
    if($("#extended_UeffOver1          ").val() != "") tempData.extended_UeffOver1           = $("#extended_UeffOver1          ").val();
    if($("#extended_UeffUnder1         ").val() != "") tempData.extended_UeffUnder1          = $("#extended_UeffUnder1         ").val();
    if($("#extended_UeffOver2          ").val() != "") tempData.extended_UeffOver2           = $("#extended_UeffOver2          ").val();
    if($("#extended_UeffUnder2         ").val() != "") tempData.extended_UeffUnder2          = $("#extended_UeffUnder2         ").val();
    if($("#extended_fOver1             ").val() != "") tempData.extended_fOver1              = $("#extended_fOver1             ").val();
    if($("#extended_fUnder1            ").val() != "") tempData.extended_fUnder1             = $("#extended_fUnder1            ").val();
    if($("#extended_maxGridVoltage     ").val() != "") tempData.extended_maxGridVoltage      = $("#extended_maxGridVoltage     ").val();
    if($("#extended_minGridVoltage     ").val() != "") tempData.extended_minGridVoltage      = $("#extended_minGridVoltage     ").val();
    if($("#extended_maxGridFrequency   ").val() != "") tempData.extended_maxGridFrequency    = $("#extended_maxGridFrequency   ").val();
    if($("#extended_minGridFrequency   ").val() != "") tempData.extended_minGridFrequency    = $("#extended_minGridFrequency   ").val();
    if($("#extended_gridConnectDelay   ").val() != "") tempData.extended_gridConnectDelay    = $("#extended_gridConnectDelay   ").val();
    if($("#extended_puTime             ").val() != "") tempData.extended_puTime              = $("#extended_puTime             ").val();





    // Battery Parameters

    if(isLiFePO()) {
        tempData.battery_type    = "lifepo";
        tempData.battery_voltage = "48";
        var tempBatteries = [];
        if($("#lifepo_battery_1 ").val() != "") tempBatteries.push($("#lifepo_battery_1 ").val());
        if($("#lifepo_battery_2 ").val() != "") tempBatteries.push($("#lifepo_battery_2 ").val());
        if($("#lifepo_battery_3 ").val() != "") tempBatteries.push($("#lifepo_battery_3 ").val());
        if($("#lifepo_battery_4 ").val() != "") tempBatteries.push($("#lifepo_battery_4 ").val());
        if($("#lifepo_battery_5 ").val() != "") tempBatteries.push($("#lifepo_battery_5 ").val());
        if($("#lifepo_battery_6 ").val() != "") tempBatteries.push($("#lifepo_battery_6 ").val());
        if($("#lifepo_battery_7 ").val() != "") tempBatteries.push($("#lifepo_battery_7 ").val());
        if($("#lifepo_battery_8 ").val() != "") tempBatteries.push($("#lifepo_battery_8 ").val());
        if($("#lifepo_battery_9 ").val() != "") tempBatteries.push($("#lifepo_battery_9 ").val());
        if($("#lifepo_battery_10").val() != "") tempBatteries.push($("#lifepo_battery_10").val());
        if($("#lifepo_battery_11").val() != "") tempBatteries.push($("#lifepo_battery_11").val());
        if($("#lifepo_battery_12").val() != "") tempBatteries.push($("#lifepo_battery_12").val());
        if($("#lifepo_battery_13").val() != "") tempBatteries.push($("#lifepo_battery_13").val());
        if($("#lifepo_battery_14").val() != "") tempBatteries.push($("#lifepo_battery_14").val());
        if($("#lifepo_battery_15").val() != "") tempBatteries.push($("#lifepo_battery_15").val());
        if($("#lifepo_battery_16").val() != "") tempBatteries.push($("#lifepo_battery_16").val());
        tempData.system_model = "batterX " + (deviceModel == "batterx_h10" ? "h10" : "h5") + ($("#bx_system_type_w").is(":checked") ? "W" : "R") + "-" + (tempBatteries.length * 3.5).toString().replace(".", ",");
        tempData.battery_serialnumbers = tempBatteries.join(",");
    } else if(isCarbon()) {
        tempData.battery_type     = "carbon";
        tempData.battery_voltage  = "48";
        tempData.battery_capacity = $("#carbon_battery_capacity").val().split(" ")[0];
        tempData.battery_model    = $("#carbon_battery_model   ").val();
        tempData.battery_strings  = $("#carbon_battery_strings ").val();
    } else {
        tempData.battery_type     = "other";
        tempData.battery_voltage  = "48";
        tempData.battery_capacity = $("#other_battery_capacity").val();
    }





    // Energy Meters

    tempData.has_extsol = $("#extsol_check").is(":checked") ? "1" : "0";
    tempData.has_meter1 = $("#meter1_mode").val();
    tempData.has_meter2 = $("#meter2_mode").val();
    tempData.has_meter3 = $("#meter3_mode").val();
    tempData.has_meter4 = $("#meter4_mode").val();





    // Add Values To Session

    $.post({
        url: "cmd/session.php",
        data: tempData,
        error: () => { alert("E056. Please refresh the page!"); },
        success: (response) => {
            console.log(response);
            if(response !== "1") return alert("E057. Please refresh the page!");
            // Start Setup
            checkParametersCounter = 0;
            if(skipSetup)
                setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
            else
                setup1();
        }
    });



    

}










//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////










/*
    Begin Setup
*/

function setup1() {
    




    isSettingParameters = true;
    $("#notif").removeClass("loading error success").addClass("loading");
    $("#message").html(lang.system_setup.msg_setting_parameters).css("color", "");





    // Set Grid InjectionPhase (batterX h5)

    if(deviceModel == "batterx_h5") {
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

    var maxGridFeedInPower = Math.round(Math.max(parseInt($("#solar_wattpeak").val()) * parseInt($("#solar_feedinlimitation").val()) / 100, 50)).toString();
    $.get({
        url: "api.php?set=command&type=20736&entity=1&text2=" + maxGridFeedInPower,
        error: () => { alert("E018. Please refresh the page!"); },
        success: (response) => { if(response != "1") return alert("E019. Please refresh the page!"); }
    });





    // Next Step For Carbon|Other Batteries

    if(isCarbon() || isOther()) setup2();
    




    // Verify LiFePO Communication

    if(isLiFePO()) {
        setTimeout(() => {
            $.get({
                url: "api.php?set=command&type=24065&entity=0&text2=I,1",
                error: () => { alert("E024. Please refresh the page!"); },
                success: (response) => {
                    if(response != "1") return alert("E025. Please refresh the page!");
                    setTimeout(() => {
                        $.get({
                            url: "api.php?set=command&type=24114&entity=0&text2=5320,5300",
                            error: () => { alert("E020. Please refresh the page!"); },
                            success: (response) => {
                                if(response != "1") return alert("E021. Please refresh the page!");
                                tempDatetime = "";
                                verifyModulesCommunication((flag) => {
                                    // Next Step For LiFePO Batteries
                                    if(flag) setup2();
                                });
                            }
                        });
                    }, 10000);
                }
            });
        }, 5000);
    }




    
}










/*
    Continue Setup
*/

function setup2() {





    newParameters = {};

    var maxChargingCurrent    = deviceModel == "batterx_h10" ? 20000 : 6000; // x0.01A
    var maxDischargingCurrent = deviceModel == "batterx_h10" ?   300 :  150; // x1.00A

    if(isLiFePO()) {
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
        newParameters["chargingVoltage"         ] = "5320,5320";
        newParameters["dischargingVoltage"      ] = "4600,5000,4600,5000";
        newParameters["maxDischargingCurrent"   ] = Math.min(numberOfModules * 37, maxDischargingCurrent).toString();
    } else if(isCarbon()) {
        var batteryCapacity = parseInt($("#carbon_battery_capacity").val().split(" ")[0]);
        newParameters["maxChargingCurrent"      ] = Math.min(Math.max(Math.round(batteryCapacity * 0.15 / 48), 10) * 100, maxChargingCurrent).toString();
        newParameters["chargingVoltage"         ] = "5600,5400";
        newParameters["dischargingVoltage"      ] = "4680,5200,4300,4800";
        newParameters["maxDischargingCurrent"   ] = Math.min(Math.max(Math.round(batteryCapacity * 0.20 / 48), 20), maxDischargingCurrent).toString();
    } else {
        var custom_maxChargingCurrent       =                Math.round(parseFloat($("#other_battery_maxChargingCurrent      ").val()) *  1) * 100 ;
        var custom_maxDischargingCurrent    =                Math.round(parseFloat($("#other_battery_maxDischargingCurrent   ").val()) *  1) *   1 ;
        var custom_bulkChargingVoltage      = Math.min(6000, Math.round(parseFloat($("#other_battery_bulkChargingVoltage     ").val()) * 10) *  10);
        var custom_floatChargingVoltage     = Math.min(6000, Math.round(parseFloat($("#other_battery_floatChargingVoltage    ").val()) * 10) *  10);
        var custom_cutoffVoltage            = Math.min(6000, Math.round(parseFloat($("#other_battery_cutoffVoltage           ").val()) * 10) *  10);
        var custom_redischargeVoltage       = Math.min(6000, Math.round(parseFloat($("#other_battery_redischargeVoltage      ").val()) * 10) *  10);
        var custom_cutoffVoltageHybrid      = Math.min(6000, Math.round(parseFloat($("#other_battery_cutoffVoltageHybrid     ").val()) * 10) *  10);
        var custom_redischargeVoltageHybrid = Math.min(6000, Math.round(parseFloat($("#other_battery_redischargeVoltageHybrid").val()) * 10) *  10);
        newParameters["maxChargingCurrent"      ] = Math.min(custom_maxChargingCurrent, maxChargingCurrent).toString();
        newParameters["chargingVoltage"         ] = `${custom_bulkChargingVoltage},${custom_floatChargingVoltage}`;
        newParameters["dischargingVoltage"      ] = `${custom_cutoffVoltageHybrid},${custom_redischargeVoltageHybrid},${custom_cutoffVoltage},${custom_redischargeVoltage}`;
        newParameters["maxDischargingCurrent"   ] = Math.min(custom_maxDischargingCurrent, maxDischargingCurrent).toString();
    }

    newParameters["batteryType"             ] = isLiFePO() ? "1" : "0";
    newParameters["solarEnergyPriority"     ] = "1";
    newParameters["allowBatteryCharging"    ] = "1";
    newParameters["allowBatteryChargingAC"  ] = "0";
    newParameters["allowGridInjection"      ] = "1";
    newParameters["allowDischargingSolarOK" ] = "1";
    newParameters["allowDischargingSolarNOK"] = "1";
    newParameters["maxGridFeedInPower"      ] = Math.round(Math.max(parseInt($("#solar_wattpeak").val()) * parseInt($("#solar_feedinlimitation").val()) / 100, 50)).toString();
    newParameters["systemMode"              ] = $("#bx_sysmode").val();
    newParameters["allowNGRelCloseInBatMode"] = "1";

    newParameters["allowOverVoltageDerating"] = isTor ? "1" : "0";
    newParameters["allowUnderFreqDropPower" ] = (isVde4105 || isEstonia) ? "1" : "0";
    newParameters["allowLVRT"               ] = ((isTor || isEstonia) && isBackup()) ? "1" : "0";
    newParameters["allowHVRT"               ] = ((isTor || isEstonia) && isBackup()) ? "1" : "0";
    newParameters["allowSoftStartACCharging"] = (isTor && isBackup()) ? "1" : "0";
    newParameters["allowOverFreqDerating"   ] = (isVde4105 || isTor || isEstonia) ? "1" : "0";
    newParameters["allowQuDeratingFunction" ] = "0";
    newParameters["feedInPowerFactor"       ] = "100";
    newParameters["autoAdjustPowerFactor"   ] = "0,50,-90";
    newParameters["voltageAndReactivePower" ] = "4359,21390,22310,23690,24610";
    newParameters["overFreqDropRatedPower"  ] = "5020,40,0";
    newParameters["feedInReactivePower"     ] = "0";
    newParameters["configTimeConstants"     ] = "5,5";

    if(reactive_mode == 1) {
        // cosφ(P) Curve
        newParameters["autoAdjustPowerFactor"] = `1,${reactive_kink},-90`;
    } else if(reactive_mode == 2) {
        // Fixed cosφ
        newParameters["feedInPowerFactor"] = `${reactive_cosphi}`;
    } else if(reactive_mode == 3) {
        // Q(U) Curve
        var devicePower = deviceModel == "batterx_h10" ? 10000 : 5000;
        var temp_v1     = Math.round(Math.round(reactive_v1) * 230.94 / 10) * 10;
        var temp_v2     = Math.round(Math.round(reactive_v2) * 230.94 / 10) * 10;
        var temp_v3     = Math.round(Math.round(reactive_v3) * 230.94 / 10) * 10;
        var temp_v4     = Math.round(Math.round(reactive_v4) * 230.94 / 10) * 10;
        var temp_q      = Math.round(Math.sqrt(Math.pow(devicePower, 2) - Math.pow(devicePower * reactive_cosphi / 100, 2)));
        newParameters["allowQuDeratingFunction"] = `1`;
        newParameters["voltageAndReactivePower"] = `${temp_q},${temp_v1},${temp_v2},${temp_v3},${temp_v4}`;
        newParameters["configTimeConstants"    ] = `${reactive_qutime},5`;
    } else if(reactive_mode == 4) {
        newParameters["feedInReactivePower"] = `${reactive_qfix}`;
    }
    var temp_point = Math.round($("#extended_dropRatedPowerPoint").val());
    var temp_slope = Math.round($("#extended_dropRatedPowerSlope").val());
    newParameters["overFreqDropRatedPower"] = `${temp_point},${temp_slope},0`;

    if(isTor) {
        var temp_Ueff             = Math.round(convertUnToVolt($("#extended_Ueff").val()) * 100);
        var temp_UeffTime         = Math.round($("#extended_UeffTime").val() * 60);
        var temp_UeffOver1        = Math.round(convertUnToVolt($("#extended_UeffOver1").val()) * 100);
        var temp_UeffUnder1       = Math.round(convertUnToVolt($("#extended_UeffUnder1").val()) * 100);
        var temp_UeffOver2        = Math.round(convertUnToVolt($("#extended_UeffOver2").val()) * 100);
        var temp_UeffUnder2       = Math.round(convertUnToVolt($("#extended_UeffUnder2").val()) * 100);
        var temp_fOver1           = Math.round($("#extended_fOver1").val() * 100);
        var temp_fUnder1          = Math.round($("#extended_fUnder1").val() * 100);
        var temp_maxGridVoltage   = Math.round(convertUnToVolt($("#extended_maxGridVoltage").val()) * 100);
        var temp_minGridVoltage   = Math.round(convertUnToVolt($("#extended_minGridVoltage").val()) * 100);
        var temp_maxGridFrequency = Math.round($("#extended_maxGridFrequency").val() * 100);
        var temp_minGridFrequency = Math.round($("#extended_minGridFrequency").val() * 100);
        var temp_gridConnectDelay = Math.round($("#extended_gridConnectDelay").val());
        var temp_puTime           = Math.round($("#extended_puTime").val());
        newParameters["configTimeConstants"        ] = `${reactive_qutime},${temp_puTime}`;
        newParameters["gridVoltageProtectionTime"  ] = "100,500,60000,1500";
        newParameters["gridFrequencyProtectionTime"] = "60,60,100,100";
        newParameters["gridAverageVoltage"         ] = `${temp_Ueff}`;
        newParameters["gridAverageVoltageTime"     ] = `${temp_UeffTime}`;
        newParameters["gridFirstOrderVoltage"      ] = `${temp_UeffOver1},${temp_UeffUnder1}`;
        newParameters["gridSecondOrderVoltage"     ] = `${temp_UeffOver2},${temp_UeffUnder2}`;
        newParameters["gridFirstOrderFrequency"    ] = `${temp_fOver1},${temp_fUnder1}`;
        newParameters["maxGridVoltage"             ] = `${temp_maxGridVoltage}`;
        newParameters["minGridVoltage"             ] = `${temp_minGridVoltage}`;
        newParameters["maxGridFrequency"           ] = `${temp_maxGridFrequency}`;
        newParameters["minGridFrequency"           ] = `${temp_minGridFrequency}`;
        newParameters["gridConnectDelay"           ] = `${temp_gridConnectDelay}`;
    } else if(isEstonia) {
        newParameters["gridVoltageProtectionTime"  ] = "100,360,3000,1200";
        newParameters["gridFrequencyProtectionTime"] = "160,360,100,100";
        newParameters["gridFirstOrderVoltage"      ] = "25530,19550";
        newParameters["gridSecondOrderVoltage"     ] = "26450,4600";
        newParameters["gridFirstOrderFrequency"    ] = "5160,4740";
        newParameters["maxGridVoltage"             ] = "26450";
        newParameters["minGridVoltage"             ] = "19550";
        newParameters["maxGridFrequency"           ] = "5200";
        newParameters["minGridFrequency"           ] = "4700";
    }

    newParameters["regulationMode"] = $("#regulation_check").is(":checked") ? "1" : "0";
    newParameters["extsolMode"    ] = $("#extsol_check    ").is(":checked") ? "1" : "0";
    newParameters["meter1Mode"    ] = $("#meter1_mode     ").val();
    newParameters["meter2Mode"    ] = $("#meter2_mode     ").val();
    newParameters["meter3Mode"    ] = $("#meter3_mode     ").val();
    newParameters["meter4Mode"    ] = $("#meter4_mode     ").val();
    newParameters["meter1Label"   ] = $("#meter1_label    ").val();
    newParameters["meter2Label"   ] = $("#meter2_label    ").val();
    newParameters["meter3Label"   ] = $("#meter3_label    ").val();
    newParameters["meter4Label"   ] = $("#meter4_label    ").val();

    newParameters["prepareBatteryExtension"] = "0";
    newParameters["cloudSet"               ] = "1";





    // Get oldParameters
    $.get({
        url: "api.php?get=settings",
        async: false,
        error: () => { alert("E026. Please refresh the page!"); },
        success: (response) => {

            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E027. Please refresh the page!");

            dataSettings = JSON.parse(JSON.stringify(response));
            
            var temp = response["InverterParameters"];
            deviceDatetime = temp["0"]["s1"];
            
            oldParameters["chargingVoltage"         ] = !temp.hasOwnProperty("32") || !temp["32"]["s1"].replaceAll(",", "") ? "" : temp["32"]["s1"];
            oldParameters["dischargingVoltage"      ] = !temp.hasOwnProperty("33") || !temp["33"]["s1"].replaceAll(",", "") ? "" : temp["33"]["s1"];
            oldParameters["maxDischargingCurrent"   ] = !temp.hasOwnProperty("34") || !temp["34"]["s1"].replaceAll(",", "") ? "" : temp["34"]["s1"];
            oldParameters["batteryType"             ] = !temp.hasOwnProperty( "5") || !temp[ "5"]["s1"].replaceAll(",", "") ? "" : temp[ "5"]["s1"];
            oldParameters["solarEnergyPriority"     ] = !temp.hasOwnProperty( "6") || !temp[ "6"]["s1"].replaceAll(",", "") ? "" : temp[ "6"]["s1"];
            oldParameters["allowBatteryCharging"    ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[0];
            oldParameters["allowBatteryChargingAC"  ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[1];
            oldParameters["allowGridInjection"      ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[2];
            oldParameters["allowDischargingSolarOK" ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[3];
            oldParameters["allowDischargingSolarNOK"] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[4];
            oldParameters["maxGridFeedInPower"      ] = !temp.hasOwnProperty("15") || !temp["15"]["s1"].replaceAll(",", "") ? "" : temp["15"]["s1"];
            oldParameters["systemMode"              ] = !response.hasOwnProperty("SystemMode") ? "" : response["SystemMode"]["0"]["mode"];
            oldParameters["allowNGRelCloseInBatMode"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[5];

            if(isCarbon() || isOther())
                oldParameters["maxChargingCurrent"  ] = !temp.hasOwnProperty("30") || !temp["30"]["s1"].replaceAll(",", "") ? "" : temp["30"]["s1"];

            oldParameters["allowOverVoltageDerating"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[6];
            oldParameters["allowUnderFreqDropPower" ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[9];
            oldParameters["allowLVRT"               ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[10];
            oldParameters["allowHVRT"               ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[11];
            oldParameters["allowSoftStartACCharging"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[12];
            oldParameters["allowOverFreqDerating"   ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[7];
            oldParameters["allowQuDeratingFunction" ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[7];
            oldParameters["feedInPowerFactor"       ] = !temp.hasOwnProperty("16") || !temp["16"]["s1"].replaceAll(",", "") ? "" : temp["16"]["s1"];
            oldParameters["autoAdjustPowerFactor"   ] = !temp.hasOwnProperty("36") || !temp["36"]["s1"].replaceAll(",", "") ? "" : temp["36"]["s1"];
            oldParameters["voltageAndReactivePower" ] = !temp.hasOwnProperty("37") || !temp["37"]["s1"].replaceAll(",", "") ? "" : temp["37"]["s1"];
            oldParameters["overFreqDropRatedPower"  ] = !temp.hasOwnProperty("38") || !temp["38"]["s1"].replaceAll(",", "") ? "" : temp["38"]["s1"];
            oldParameters["feedInReactivePower"     ] = !temp.hasOwnProperty("43") || !temp["43"]["s1"].replaceAll(",", "") ? "" : temp["43"]["s1"];
            oldParameters["configTimeConstants"     ] = !temp.hasOwnProperty("47") || !temp["47"]["s1"].replaceAll(",", "") ? "" : temp["47"]["s1"];

            if(isTor || isEstonia) {
                oldParameters["gridVoltageProtectionTime"  ] = !temp.hasOwnProperty("44") || !temp["44"]["s1"].replaceAll(",", "") ? "" : temp["44"]["s1"];
                oldParameters["gridFrequencyProtectionTime"] = !temp.hasOwnProperty("45") || !temp["45"]["s1"].replaceAll(",", "") ? "" : temp["45"]["s1"];
                oldParameters["gridFirstOrderVoltage"      ] = !temp.hasOwnProperty("39") || !temp["39"]["s1"].replaceAll(",", "") ? "" : temp["39"]["s1"];
                oldParameters["gridSecondOrderVoltage"     ] = !temp.hasOwnProperty("41") || !temp["41"]["s1"].replaceAll(",", "") ? "" : temp["41"]["s1"];
                oldParameters["gridFirstOrderFrequency"    ] = !temp.hasOwnProperty("40") || !temp["40"]["s1"].replaceAll(",", "") ? "" : temp["40"]["s1"];
                oldParameters["maxGridVoltage"             ] = !temp.hasOwnProperty("11") || !temp["11"]["s1"].replaceAll(",", "") ? "" : temp["11"]["s1"];
                oldParameters["minGridVoltage"             ] = !temp.hasOwnProperty("10") || !temp["10"]["s1"].replaceAll(",", "") ? "" : temp["10"]["s1"];
                oldParameters["maxGridFrequency"           ] = !temp.hasOwnProperty("13") || !temp["13"]["s1"].replaceAll(",", "") ? "" : temp["13"]["s1"];
                oldParameters["minGridFrequency"           ] = !temp.hasOwnProperty("12") || !temp["12"]["s1"].replaceAll(",", "") ? "" : temp["12"]["s1"];
                if(isTor) {
                    oldParameters["gridAverageVoltage"     ] = !temp.hasOwnProperty("14") || !temp["14"]["s1"].replaceAll(",", "") ? "" : temp["14"]["s1"];
                    oldParameters["gridAverageVoltageTime" ] = !temp.hasOwnProperty("46") || !temp["46"]["s1"].replaceAll(",", "") ? "" : temp["46"]["s1"];
                    oldParameters["gridConnectDelay"       ] = !temp.hasOwnProperty( "4") || !temp[ "4"]["s1"].replaceAll(",", "") ? "" : temp[ "4"]["s1"];
                }
            }

            if(isLiFePO() && oldParameters["dischargingVoltage"].split(",")[2] == "4700") // Old B Modules
                newParameters["dischargingVoltage"] = "4700,5000,4700,5000";
            else if(isLiFePO() && oldParameters["dischargingVoltage"].split(",")[2] == "4500") // New C Modules
                newParameters["dischargingVoltage"] = "4500,5000,4500,5000";

            oldParameters["regulationMode"] = !response.hasOwnProperty("InjectionMode") ? "0" : response["InjectionMode"]["0"]["v5"];
            oldParameters["extsolMode"    ] = !response.hasOwnProperty("ModbusExtSolarDevice") ? "0" : response["ModbusExtSolarDevice"]["0"]["mode"];
            oldParameters["meter1Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("1") ? "0" : response["UserMeter"]["1"]["mode"];
            oldParameters["meter2Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("2") ? "0" : response["UserMeter"]["2"]["mode"];
            oldParameters["meter3Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("3") ? "0" : response["UserMeter"]["3"]["mode"];
            oldParameters["meter4Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("4") ? "0" : response["UserMeter"]["4"]["mode"];
            oldParameters["meter1Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("1") ? ""  : response["UserMeter"]["1"]["s1"  ];
            oldParameters["meter2Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("2") ? ""  : response["UserMeter"]["2"]["s1"  ];
            oldParameters["meter3Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("3") ? ""  : response["UserMeter"]["3"]["s1"  ];
            oldParameters["meter4Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("4") ? ""  : response["UserMeter"]["4"]["s1"  ];

            oldParameters["prepareBatteryExtension"] = !response.hasOwnProperty("PrepareBatteryExtension") || !response["PrepareBatteryExtension"].hasOwnProperty("0") ? "0" : response["PrepareBatteryExtension"]["0"]["mode"];
            oldParameters["cloudSet"               ] = !response.hasOwnProperty("CloudSet"               ) || !response["CloudSet"               ].hasOwnProperty("0") ? ""  : response["CloudSet"               ]["0"]["mode"];

        }
    });

    console.log("newParameters"); console.log(newParameters);
    console.log("oldParameters"); console.log(oldParameters);

    var retry = false;

    if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setup_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
    if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setup_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
    if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setup_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
    if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setup_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
    if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setup_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
    if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setup_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
    if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setup_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
    if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setup_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
    if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setup_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
    if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setup_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
    if(newParameters["systemMode"              ] != oldParameters["systemMode"              ]) { retry = true; setup_sendCommand(20752, 0, "",        newParameters["systemMode"              ]); }
    if(newParameters["allowNGRelCloseInBatMode"] != oldParameters["allowNGRelCloseInBatMode"]) { retry = true; setup_sendCommand(24065, 0, "", "F," + newParameters["allowNGRelCloseInBatMode"]); }

    if(isCarbon() || isOther())
        if(newParameters["maxChargingCurrent"  ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setup_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }

    if(newParameters["allowOverVoltageDerating"] != oldParameters["allowOverVoltageDerating"]) { retry = true; setup_sendCommand(24065, 0, "", "G," + newParameters["allowOverVoltageDerating"]); }
    if(newParameters["allowUnderFreqDropPower" ] != oldParameters["allowUnderFreqDropPower" ]) { retry = true; setup_sendCommand(24065, 0, "", "J," + newParameters["allowUnderFreqDropPower" ]); }
    if(newParameters["allowLVRT"               ] != oldParameters["allowLVRT"               ]) { retry = true; setup_sendCommand(24065, 0, "", "K," + newParameters["allowLVRT"               ]); }
    if(newParameters["allowHVRT"               ] != oldParameters["allowHVRT"               ]) { retry = true; setup_sendCommand(24065, 0, "", "M," + newParameters["allowHVRT"               ]); }
    if(newParameters["allowSoftStartACCharging"] != oldParameters["allowSoftStartACCharging"]) { retry = true; setup_sendCommand(24065, 0, "", "N," + newParameters["allowSoftStartACCharging"]); }
    if(newParameters["allowOverFreqDerating"   ] != oldParameters["allowOverFreqDerating"   ]) { retry = true; setup_sendCommand(24065, 0, "", "H," + newParameters["allowOverFreqDerating"   ]); }
    if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setup_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
    if(newParameters["feedInPowerFactor"       ] != oldParameters["feedInPowerFactor"       ]) { retry = true; setup_sendCommand(24086, 0, "",        newParameters["feedInPowerFactor"       ]); }
    if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setup_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
    if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setup_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }
    if(newParameters["overFreqDropRatedPower"  ] != oldParameters["overFreqDropRatedPower"  ]) { retry = true; setup_sendCommand(24120, 0, "",        newParameters["overFreqDropRatedPower"  ]); }
    if(newParameters["feedInReactivePower"     ] != oldParameters["feedInReactivePower"     ]) { retry = true; setup_sendCommand(24131, 0, "",        newParameters["feedInReactivePower"     ]); }
    if(newParameters["configTimeConstants"     ] != oldParameters["configTimeConstants"     ]) { retry = true; setup_sendCommand(24135, 0, "",        newParameters["configTimeConstants"     ]); }

    if(isTor || isEstonia) {
        if(newParameters["gridVoltageProtectionTime"  ] != oldParameters["gridVoltageProtectionTime"  ]) { retry = true; setup_sendCommand(24132, 0, "",        newParameters["gridVoltageProtectionTime"  ]); }
        if(newParameters["gridFrequencyProtectionTime"] != oldParameters["gridFrequencyProtectionTime"]) { retry = true; setup_sendCommand(24133, 0, "",        newParameters["gridFrequencyProtectionTime"]); }
        if(newParameters["gridFirstOrderVoltage"      ] != oldParameters["gridFirstOrderVoltage"      ]) { retry = true; setup_sendCommand(24121, 0, "",        newParameters["gridFirstOrderVoltage"      ]); }
        if(newParameters["gridSecondOrderVoltage"     ] != oldParameters["gridSecondOrderVoltage"     ]) { retry = true; setup_sendCommand(24129, 0, "",        newParameters["gridSecondOrderVoltage"     ]); }
        if(newParameters["gridFirstOrderFrequency"    ] != oldParameters["gridFirstOrderFrequency"    ]) { retry = true; setup_sendCommand(24128, 0, "",        newParameters["gridFirstOrderFrequency"    ]); }
        if(newParameters["maxGridVoltage"             ] != oldParameters["maxGridVoltage"             ]) { retry = true; setup_sendCommand(24081, 0, "",        newParameters["maxGridVoltage"             ]); }
        if(newParameters["minGridVoltage"             ] != oldParameters["minGridVoltage"             ]) { retry = true; setup_sendCommand(24080, 0, "",        newParameters["minGridVoltage"             ]); }
        if(newParameters["maxGridFrequency"           ] != oldParameters["maxGridFrequency"           ]) { retry = true; setup_sendCommand(24083, 0, "",        newParameters["maxGridFrequency"           ]); }
        if(newParameters["minGridFrequency"           ] != oldParameters["minGridFrequency"           ]) { retry = true; setup_sendCommand(24082, 0, "",        newParameters["minGridFrequency"           ]); }
        if(isTor) {
            if(newParameters["gridAverageVoltage"     ] != oldParameters["gridAverageVoltage"         ]) { retry = true; setup_sendCommand(24084, 0, "",        newParameters["gridAverageVoltage"         ]); }
            if(newParameters["gridAverageVoltageTime" ] != oldParameters["gridAverageVoltageTime"     ]) { retry = true; setup_sendCommand(24134, 0, "",        newParameters["gridAverageVoltageTime"     ]); }
            if(newParameters["gridConnectDelay"       ] != oldParameters["gridConnectDelay"           ]) { retry = true; setup_sendCommand(24068, 0, "",        newParameters["gridConnectDelay"           ]); }
        }
    }

    if(newParameters["regulationMode"] != oldParameters["regulationMode"]) { retry = true; setup_sendSetting("InjectionMode"        , "0", "v5"   , newParameters["regulationMode"]); }
    if(newParameters["extsolMode"    ] != oldParameters["extsolMode"    ]) { retry = true; setup_sendSetting("ModbusExtSolarDevice" , "0", "mode" , newParameters["extsolMode"    ]); }
    if(newParameters["meter1Mode"    ] != oldParameters["meter1Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "1", "mode" , newParameters["meter1Mode"    ]); }
    if(newParameters["meter2Mode"    ] != oldParameters["meter2Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "2", "mode" , newParameters["meter2Mode"    ]); }
    if(newParameters["meter3Mode"    ] != oldParameters["meter3Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "3", "mode" , newParameters["meter3Mode"    ]); }
    if(newParameters["meter4Mode"    ] != oldParameters["meter4Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "4", "mode" , newParameters["meter4Mode"    ]); }
    if(newParameters["meter1Label"   ] != oldParameters["meter1Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "1", "s1"   , newParameters["meter1Label"   ]); }
    if(newParameters["meter2Label"   ] != oldParameters["meter2Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "2", "s1"   , newParameters["meter2Label"   ]); }
    if(newParameters["meter3Label"   ] != oldParameters["meter3Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "3", "s1"   , newParameters["meter3Label"   ]); }
    if(newParameters["meter4Label"   ] != oldParameters["meter4Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "4", "s1"   , newParameters["meter4Label"   ]); }

    if(newParameters["prepareBatteryExtension"] != oldParameters["prepareBatteryExtension"]) { retry = true; setup_sendSetting("PrepareBatteryExtension", "0", "mode", newParameters["prepareBatteryExtension"]) }
    if(newParameters["cloudSet"               ] != oldParameters["cloudSet"               ]) { retry = true; setup_sendSetting("CloudSet"               , "0", "mode", newParameters["cloudSet"               ]) }

    if(!retry) {
        $(".setting-progress span").html(lang.system_setup.msg_setting_success).css("color", "#28a745");
        $("#notif").removeClass("loading error success").addClass("success");
        // Next Step
        setTimeout(() => { window.location.href = "system_test.php"; }, 2500);
    } else console.log("SETTING PARAMETERS");





}










/*
    Send Command
*/

function setup_sendCommand(type, entity, text1, text2) {
    $.get({
        url: `api.php?set=command&type=${type}&entity=${entity}&text1=${text1}&text2=${text2}`,
        error: () => { alert("E028. Please refresh the page!") },
        success: function(response) {
            if(response != "1") return alert("E029. Please refresh the page!");
            if(checkParametersInterval == undefined) checkParametersInterval = setInterval(setup_checkParameters, 5000);
        }
    });
}

function setup_sendSetting(varname, entity, field, value) {
    var bxSet = { "mode":11, "v1":21, "v2":22, "v3":23, "v4":24, "v5":25, "v6":26, "s1":31, "s2":32 };
    setup_sendCommand(11, bxSet[field], entity + " " + varname, value);
}










/*
    Check Parameters
*/

function setup_checkParameters() {

    $.get({
        url: "api.php?get=settings",
        error: () => { alert("E030. Please refresh the page!") },
        success: (response) => {

            if(!response || typeof response != "object" || !response.hasOwnProperty("InverterParameters"))
                return alert("E031. Please refresh the page!");

            dataSettings = JSON.parse(JSON.stringify(response));

            var temp = response["InverterParameters"];
            if(temp["0"]["s1"] == deviceDatetime) return false;
            deviceDatetime = temp["0"]["s1"];

            oldParameters["chargingVoltage"         ] = !temp.hasOwnProperty("32") || !temp["32"]["s1"].replaceAll(",", "") ? "" : temp["32"]["s1"];
            oldParameters["dischargingVoltage"      ] = !temp.hasOwnProperty("33") || !temp["33"]["s1"].replaceAll(",", "") ? "" : temp["33"]["s1"];
            oldParameters["maxDischargingCurrent"   ] = !temp.hasOwnProperty("34") || !temp["34"]["s1"].replaceAll(",", "") ? "" : temp["34"]["s1"];
            oldParameters["batteryType"             ] = !temp.hasOwnProperty( "5") || !temp[ "5"]["s1"].replaceAll(",", "") ? "" : temp[ "5"]["s1"];
            oldParameters["solarEnergyPriority"     ] = !temp.hasOwnProperty( "6") || !temp[ "6"]["s1"].replaceAll(",", "") ? "" : temp[ "6"]["s1"];
            oldParameters["allowBatteryCharging"    ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[0];
            oldParameters["allowBatteryChargingAC"  ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[1];
            oldParameters["allowGridInjection"      ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[2];
            oldParameters["allowDischargingSolarOK" ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[3];
            oldParameters["allowDischargingSolarNOK"] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[4];
            oldParameters["maxGridFeedInPower"      ] = !temp.hasOwnProperty("15") || !temp["15"]["s1"].replaceAll(",", "") ? "" : temp["15"]["s1"];
            oldParameters["systemMode"              ] = !response.hasOwnProperty("SystemMode") ? "" : response["SystemMode"]["0"]["mode"];
            oldParameters["allowNGRelCloseInBatMode"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[5];

            if(isCarbon() || isOther())
                oldParameters["maxChargingCurrent"  ] = !temp.hasOwnProperty("30") || !temp["30"]["s1"].replaceAll(",", "") ? "" : temp["30"]["s1"];

            oldParameters["allowOverVoltageDerating"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[6];
            oldParameters["allowUnderFreqDropPower" ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[9];
            oldParameters["allowLVRT"               ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[10];
            oldParameters["allowHVRT"               ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[11];
            oldParameters["allowSoftStartACCharging"] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[12];
            oldParameters["allowOverFreqDerating"   ] = !temp.hasOwnProperty( "1") || !temp[ "1"]["s1"].replaceAll(",", "") ? "" : temp[ "1"]["s1"].split(",")[7];
            oldParameters["allowQuDeratingFunction" ] = !temp.hasOwnProperty( "2") || !temp[ "2"]["s1"].replaceAll(",", "") ? "" : temp[ "2"]["s1"].split(",")[7];
            oldParameters["feedInPowerFactor"       ] = !temp.hasOwnProperty("16") || !temp["16"]["s1"].replaceAll(",", "") ? "" : temp["16"]["s1"];
            oldParameters["autoAdjustPowerFactor"   ] = !temp.hasOwnProperty("36") || !temp["36"]["s1"].replaceAll(",", "") ? "" : temp["36"]["s1"];
            oldParameters["voltageAndReactivePower" ] = !temp.hasOwnProperty("37") || !temp["37"]["s1"].replaceAll(",", "") ? "" : temp["37"]["s1"];
            oldParameters["overFreqDropRatedPower"  ] = !temp.hasOwnProperty("38") || !temp["38"]["s1"].replaceAll(",", "") ? "" : temp["38"]["s1"];
            oldParameters["feedInReactivePower"     ] = !temp.hasOwnProperty("43") || !temp["43"]["s1"].replaceAll(",", "") ? "" : temp["43"]["s1"];
            oldParameters["configTimeConstants"     ] = !temp.hasOwnProperty("47") || !temp["47"]["s1"].replaceAll(",", "") ? "" : temp["47"]["s1"];
            
            if(isTor || isEstonia) {
                oldParameters["gridVoltageProtectionTime"  ] = !temp.hasOwnProperty("44") || !temp["44"]["s1"].replaceAll(",", "") ? "" : temp["44"]["s1"];
                oldParameters["gridFrequencyProtectionTime"] = !temp.hasOwnProperty("45") || !temp["45"]["s1"].replaceAll(",", "") ? "" : temp["45"]["s1"];
                oldParameters["gridFirstOrderVoltage"      ] = !temp.hasOwnProperty("39") || !temp["39"]["s1"].replaceAll(",", "") ? "" : temp["39"]["s1"];
                oldParameters["gridSecondOrderVoltage"     ] = !temp.hasOwnProperty("41") || !temp["41"]["s1"].replaceAll(",", "") ? "" : temp["41"]["s1"];
                oldParameters["gridFirstOrderFrequency"    ] = !temp.hasOwnProperty("40") || !temp["40"]["s1"].replaceAll(",", "") ? "" : temp["40"]["s1"];
                oldParameters["maxGridVoltage"             ] = !temp.hasOwnProperty("11") || !temp["11"]["s1"].replaceAll(",", "") ? "" : temp["11"]["s1"];
                oldParameters["minGridVoltage"             ] = !temp.hasOwnProperty("10") || !temp["10"]["s1"].replaceAll(",", "") ? "" : temp["10"]["s1"];
                oldParameters["maxGridFrequency"           ] = !temp.hasOwnProperty("13") || !temp["13"]["s1"].replaceAll(",", "") ? "" : temp["13"]["s1"];
                oldParameters["minGridFrequency"           ] = !temp.hasOwnProperty("12") || !temp["12"]["s1"].replaceAll(",", "") ? "" : temp["12"]["s1"];
                if(isTor) {
                    oldParameters["gridAverageVoltage"     ] = !temp.hasOwnProperty("14") || !temp["14"]["s1"].replaceAll(",", "") ? "" : temp["14"]["s1"];
                    oldParameters["gridAverageVoltageTime" ] = !temp.hasOwnProperty("46") || !temp["46"]["s1"].replaceAll(",", "") ? "" : temp["46"]["s1"];
                    oldParameters["gridConnectDelay"       ] = !temp.hasOwnProperty( "4") || !temp[ "4"]["s1"].replaceAll(",", "") ? "" : temp[ "4"]["s1"];
                }
            }

            if(oldParameters["allowOverVoltageDerating"] == "") newParameters["allowOverVoltageDerating"] = "";
            if(oldParameters["allowUnderFreqDropPower" ] == "") newParameters["allowUnderFreqDropPower" ] = "";
            if(oldParameters["allowLVRT"               ] == "") newParameters["allowLVRT"               ] = "";
            if(oldParameters["allowHVRT"               ] == "") newParameters["allowHVRT"               ] = "";
            if(oldParameters["allowSoftStartACCharging"] == "") newParameters["allowSoftStartACCharging"] = "";
            if(oldParameters["allowOverFreqDerating"   ] == "") newParameters["allowOverFreqDerating"   ] = "";
            if(oldParameters["allowQuDeratingFunction" ] == "") newParameters["allowQuDeratingFunction" ] = "";
            if(oldParameters["feedInPowerFactor"       ] == "") newParameters["feedInPowerFactor"       ] = "";
            if(oldParameters["autoAdjustPowerFactor"   ] == "") newParameters["autoAdjustPowerFactor"   ] = "";
            if(oldParameters["voltageAndReactivePower" ] == "") newParameters["voltageAndReactivePower" ] = "";
            if(oldParameters["overFreqDropRatedPower"  ] == "") newParameters["overFreqDropRatedPower"  ] = "";
            if(oldParameters["feedInReactivePower"     ] == "") newParameters["feedInReactivePower"     ] = "";
            if(oldParameters["configTimeConstants"     ] == "") newParameters["configTimeConstants"     ] = "";

            if(isTor || isEstonia) {
                if(oldParameters["gridVoltageProtectionTime"  ] == "") newParameters["gridVoltageProtectionTime"  ] = "";
                if(oldParameters["gridFrequencyProtectionTime"] == "") newParameters["gridFrequencyProtectionTime"] = "";
                if(oldParameters["gridFirstOrderVoltage"      ] == "") newParameters["gridFirstOrderVoltage"      ] = "";
                if(oldParameters["gridSecondOrderVoltage"     ] == "") newParameters["gridSecondOrderVoltage"     ] = "";
                if(oldParameters["gridFirstOrderFrequency"    ] == "") newParameters["gridFirstOrderFrequency"    ] = "";
                if(oldParameters["maxGridVoltage"             ] == "") newParameters["maxGridVoltage"             ] = "";
                if(oldParameters["minGridVoltage"             ] == "") newParameters["minGridVoltage"             ] = "";
                if(oldParameters["maxGridFrequency"           ] == "") newParameters["maxGridFrequency"           ] = "";
                if(oldParameters["minGridFrequency"           ] == "") newParameters["minGridFrequency"           ] = "";
                if(isTor) {
                    if(oldParameters["gridAverageVoltage"     ] == "") newParameters["gridAverageVoltage"         ] = "";
                    if(oldParameters["gridAverageVoltageTime" ] == "") newParameters["gridAverageVoltageTime"     ] = "";
                    if(oldParameters["gridConnectDelay"       ] == "") newParameters["gridConnectDelay"           ] = "";
                }
            }

            oldParameters["regulationMode"] = !response.hasOwnProperty("InjectionMode") ? "0" : response["InjectionMode"]["0"]["v5"];
            oldParameters["extsolMode"    ] = !response.hasOwnProperty("ModbusExtSolarDevice") ? "0" : response["ModbusExtSolarDevice"]["0"]["mode"];
            oldParameters["meter1Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("1") ? "0" : response["UserMeter"]["1"]["mode"];
            oldParameters["meter2Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("2") ? "0" : response["UserMeter"]["2"]["mode"];
            oldParameters["meter3Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("3") ? "0" : response["UserMeter"]["3"]["mode"];
            oldParameters["meter4Mode"    ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("4") ? "0" : response["UserMeter"]["4"]["mode"];
            oldParameters["meter1Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("1") ? ""  : response["UserMeter"]["1"]["s1"  ];
            oldParameters["meter2Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("2") ? ""  : response["UserMeter"]["2"]["s1"  ];
            oldParameters["meter3Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("3") ? ""  : response["UserMeter"]["3"]["s1"  ];
            oldParameters["meter4Label"   ] = !response.hasOwnProperty("UserMeter") || !response["UserMeter"].hasOwnProperty("4") ? ""  : response["UserMeter"]["4"]["s1"  ];

            oldParameters["prepareBatteryExtension"] = !response.hasOwnProperty("PrepareBatteryExtension") || !response["PrepareBatteryExtension"].hasOwnProperty("0") ? "0" : response["PrepareBatteryExtension"]["0"]["mode"];
            oldParameters["cloudSet"               ] = !response.hasOwnProperty("CloudSet"               ) || !response["CloudSet"               ].hasOwnProperty("0") ? ""  : response["CloudSet"               ]["0"]["mode"];

            console.log("newParameters"); console.log(newParameters);
            console.log("oldParameters"); console.log(oldParameters);

            var retry = false;

            if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) { retry = true; setup_sendCommand(24114, 0, "",        newParameters["chargingVoltage"         ]); }
            if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) { retry = true; setup_sendCommand(24115, 0, "",        newParameters["dischargingVoltage"      ]); }
            if(newParameters["maxDischargingCurrent"   ] != oldParameters["maxDischargingCurrent"   ]) { retry = true; setup_sendCommand(24116, 0, "",        newParameters["maxDischargingCurrent"   ]); }
            if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) { retry = true; setup_sendCommand(24069, 0, "",        newParameters["batteryType"             ]); }
            if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) { retry = true; setup_sendCommand(24070, 0, "",        newParameters["solarEnergyPriority"     ]); }
            if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) { retry = true; setup_sendCommand(24066, 0, "", "A," + newParameters["allowBatteryCharging"    ]); }
            if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) { retry = true; setup_sendCommand(24066, 0, "", "B," + newParameters["allowBatteryChargingAC"  ]); }
            if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) { retry = true; setup_sendCommand(24066, 0, "", "C," + newParameters["allowGridInjection"      ]); }
            if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) { retry = true; setup_sendCommand(24066, 0, "", "D," + newParameters["allowDischargingSolarOK" ]); }
            if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) { retry = true; setup_sendCommand(24066, 0, "", "E," + newParameters["allowDischargingSolarNOK"]); }
            if(newParameters["systemMode"              ] != oldParameters["systemMode"              ]) { retry = true; setup_sendCommand(20752, 0, "",        newParameters["systemMode"              ]); }
            if(newParameters["allowNGRelCloseInBatMode"] != oldParameters["allowNGRelCloseInBatMode"]) { retry = true; setup_sendCommand(24065, 0, "", "F," + newParameters["allowNGRelCloseInBatMode"]); }

            if(isCarbon() || isOther())
                if(newParameters["maxChargingCurrent"  ] != oldParameters["maxChargingCurrent"      ]) { retry = true; setup_sendCommand(24112, 0, "",        newParameters["maxChargingCurrent"      ]); }

            if(newParameters["allowOverVoltageDerating"] != oldParameters["allowOverVoltageDerating"]) { retry = true; setup_sendCommand(24065, 0, "", "G," + newParameters["allowOverVoltageDerating"]); }
            if(newParameters["allowUnderFreqDropPower" ] != oldParameters["allowUnderFreqDropPower" ]) { retry = true; setup_sendCommand(24065, 0, "", "J," + newParameters["allowUnderFreqDropPower" ]); }
            if(newParameters["allowLVRT"               ] != oldParameters["allowLVRT"               ]) { retry = true; setup_sendCommand(24065, 0, "", "K," + newParameters["allowLVRT"               ]); }
            if(newParameters["allowHVRT"               ] != oldParameters["allowHVRT"               ]) { retry = true; setup_sendCommand(24065, 0, "", "M," + newParameters["allowHVRT"               ]); }
            if(newParameters["allowSoftStartACCharging"] != oldParameters["allowSoftStartACCharging"]) { retry = true; setup_sendCommand(24065, 0, "", "N," + newParameters["allowSoftStartACCharging"]); }
            if(newParameters["allowOverFreqDerating"   ] != oldParameters["allowOverFreqDerating"   ]) { retry = true; setup_sendCommand(24065, 0, "", "H," + newParameters["allowOverFreqDerating"   ]); }
            if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) { retry = true; setup_sendCommand(24066, 0, "", "H," + newParameters["allowQuDeratingFunction" ]); }
            if(newParameters["feedInPowerFactor"       ] != oldParameters["feedInPowerFactor"       ]) { retry = true; setup_sendCommand(24086, 0, "",        newParameters["feedInPowerFactor"       ]); }
            if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) { retry = true; setup_sendCommand(24118, 0, "",        newParameters["autoAdjustPowerFactor"   ]); }
            if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) { retry = true; setup_sendCommand(24119, 0, "",        newParameters["voltageAndReactivePower" ]); }
            if(newParameters["overFreqDropRatedPower"  ] != oldParameters["overFreqDropRatedPower"  ]) { retry = true; setup_sendCommand(24120, 0, "",        newParameters["overFreqDropRatedPower"  ]); }
            if(newParameters["feedInReactivePower"     ] != oldParameters["feedInReactivePower"     ]) { retry = true; setup_sendCommand(24131, 0, "",        newParameters["feedInReactivePower"     ]); }
            if(newParameters["configTimeConstants"     ] != oldParameters["configTimeConstants"     ]) { retry = true; setup_sendCommand(24135, 0, "",        newParameters["configTimeConstants"     ]); }

            if(isTor || isEstonia) {
                if(newParameters["gridVoltageProtectionTime"  ] != oldParameters["gridVoltageProtectionTime"  ]) { retry = true; setup_sendCommand(24132, 0, "",        newParameters["gridVoltageProtectionTime"  ]); }
                if(newParameters["gridFrequencyProtectionTime"] != oldParameters["gridFrequencyProtectionTime"]) { retry = true; setup_sendCommand(24133, 0, "",        newParameters["gridFrequencyProtectionTime"]); }
                if(newParameters["gridFirstOrderVoltage"      ] != oldParameters["gridFirstOrderVoltage"      ]) { retry = true; setup_sendCommand(24121, 0, "",        newParameters["gridFirstOrderVoltage"      ]); }
                if(newParameters["gridSecondOrderVoltage"     ] != oldParameters["gridSecondOrderVoltage"     ]) { retry = true; setup_sendCommand(24129, 0, "",        newParameters["gridSecondOrderVoltage"     ]); }
                if(newParameters["gridFirstOrderFrequency"    ] != oldParameters["gridFirstOrderFrequency"    ]) { retry = true; setup_sendCommand(24128, 0, "",        newParameters["gridFirstOrderFrequency"    ]); }
                if(newParameters["maxGridVoltage"             ] != oldParameters["maxGridVoltage"             ]) { retry = true; setup_sendCommand(24081, 0, "",        newParameters["maxGridVoltage"             ]); }
                if(newParameters["minGridVoltage"             ] != oldParameters["minGridVoltage"             ]) { retry = true; setup_sendCommand(24080, 0, "",        newParameters["minGridVoltage"             ]); }
                if(newParameters["maxGridFrequency"           ] != oldParameters["maxGridFrequency"           ]) { retry = true; setup_sendCommand(24083, 0, "",        newParameters["maxGridFrequency"           ]); }
                if(newParameters["minGridFrequency"           ] != oldParameters["minGridFrequency"           ]) { retry = true; setup_sendCommand(24082, 0, "",        newParameters["minGridFrequency"           ]); }
                if(isTor) {
                    if(newParameters["gridAverageVoltage"     ] != oldParameters["gridAverageVoltage"         ]) { retry = true; setup_sendCommand(24084, 0, "",        newParameters["gridAverageVoltage"         ]); }
                    if(newParameters["gridAverageVoltageTime" ] != oldParameters["gridAverageVoltageTime"     ]) { retry = true; setup_sendCommand(24134, 0, "",        newParameters["gridAverageVoltageTime"     ]); }
                    if(newParameters["gridConnectDelay"       ] != oldParameters["gridConnectDelay"           ]) { retry = true; setup_sendCommand(24068, 0, "",        newParameters["gridConnectDelay"           ]); }
                }
            }

            if(newParameters["regulationMode"] != oldParameters["regulationMode"]) { retry = true; setup_sendSetting("InjectionMode"        , "0", "v5"   , newParameters["regulationMode"]); }
            if(newParameters["extsolMode"    ] != oldParameters["extsolMode"    ]) { retry = true; setup_sendSetting("ModbusExtSolarDevice" , "0", "mode" , newParameters["extsolMode"    ]); }
            if(newParameters["meter1Mode"    ] != oldParameters["meter1Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "1", "mode" , newParameters["meter1Mode"    ]); }
            if(newParameters["meter2Mode"    ] != oldParameters["meter2Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "2", "mode" , newParameters["meter2Mode"    ]); }
            if(newParameters["meter3Mode"    ] != oldParameters["meter3Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "3", "mode" , newParameters["meter3Mode"    ]); }
            if(newParameters["meter4Mode"    ] != oldParameters["meter4Mode"    ]) { retry = true; setup_sendSetting("UserMeter"            , "4", "mode" , newParameters["meter4Mode"    ]); }
            if(newParameters["meter1Label"   ] != oldParameters["meter1Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "1", "s1"   , newParameters["meter1Label"   ]); }
            if(newParameters["meter2Label"   ] != oldParameters["meter2Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "2", "s1"   , newParameters["meter2Label"   ]); }
            if(newParameters["meter3Label"   ] != oldParameters["meter3Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "3", "s1"   , newParameters["meter3Label"   ]); }
            if(newParameters["meter4Label"   ] != oldParameters["meter4Label"   ]) { retry = true; setup_sendSetting("UserMeter"            , "4", "s1"   , newParameters["meter4Label"   ]); }

            if(newParameters["prepareBatteryExtension"] != oldParameters["prepareBatteryExtension"]) { retry = true; setup_sendSetting("PrepareBatteryExtension", "0", "mode", newParameters["prepareBatteryExtension"]) }
            if(newParameters["cloudSet"               ] != oldParameters["cloudSet"               ]) { retry = true; setup_sendSetting("CloudSet"               , "0", "mode", newParameters["cloudSet"               ]) }

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
                    if((isCarbon() || isOther()) && newParameters["maxChargingCurrent"] != oldParameters["maxChargingCurrent"])
                        showSettingParametersError("Problem when setting maxChargingCurrent");
                    else if((isCarbon() || isOther()) && newParameters["maxChargingCurrent"] != oldParameters["maxChargingCurrent"])
                        showSettingParametersError("Problem when setting maxDischargingCurrent");
                    else if(isLiFePO() && newParameters["maxDischargingCurrent"] != oldParameters["maxDischargingCurrent"]) {
                        showSettingParametersError(lang.system_setup.msg_lifepo_recognition_problem.split("X").join(Math.round(parseInt(oldParameters["maxDischargingCurrent"]) / 37)));
                        if(oldParameters["maxDischargingCurrent"] == "10") {
                            showSettingParametersError(lang.system_setup.msg_low_soc_please_wait);
                            newParameters["allowBatteryChargingAC"] = "1";
                            $.get({ url: "api.php?set=command&type=20738&entity=0&text1=3&text2=1", success: () => {} });
                        }
                    }
                    else if(newParameters["chargingVoltage"         ] != oldParameters["chargingVoltage"         ]) showSettingParametersError("Problem when setting chargingVoltage"         );
                    else if(newParameters["dischargingVoltage"      ] != oldParameters["dischargingVoltage"      ]) showSettingParametersError("Problem when setting dischargingVoltage"      );
                    else if(newParameters["batteryType"             ] != oldParameters["batteryType"             ]) showSettingParametersError("Problem when setting batteryType"             );
                    else if(newParameters["solarEnergyPriority"     ] != oldParameters["solarEnergyPriority"     ]) showSettingParametersError("Problem when setting solarEnergyPriority"     );
                    else if(newParameters["allowBatteryCharging"    ] != oldParameters["allowBatteryCharging"    ]) showSettingParametersError("Problem when setting allowBatteryCharging"    );
                    else if(newParameters["allowBatteryChargingAC"  ] != oldParameters["allowBatteryChargingAC"  ]) showSettingParametersError("Problem when setting allowBatteryChargingAC"  );
                    else if(newParameters["allowGridInjection"      ] != oldParameters["allowGridInjection"      ]) showSettingParametersError("Problem when setting allowGridInjection"      );
                    else if(newParameters["allowDischargingSolarOK" ] != oldParameters["allowDischargingSolarOK" ]) showSettingParametersError("Problem when setting allowDischargingSolarOK" );
                    else if(newParameters["allowDischargingSolarNOK"] != oldParameters["allowDischargingSolarNOK"]) showSettingParametersError("Problem when setting allowDischargingSolarNOK");
                    else if(newParameters["systemMode"              ] != oldParameters["systemMode"              ]) showSettingParametersError("Problem when setting systemMode"              );
                    else if(newParameters["allowNGRelCloseInBatMode"] != oldParameters["allowNGRelCloseInBatMode"]) showSettingParametersError("Problem when setting allowNGRelCloseInBatMode");
                    else if(newParameters["allowOverVoltageDerating"] != oldParameters["allowOverVoltageDerating"]) showSettingParametersError("Problem when setting allowOverVoltageDerating");
                    else if(newParameters["allowUnderFreqDropPower" ] != oldParameters["allowUnderFreqDropPower" ]) showSettingParametersError("Problem when setting allowUnderFreqDropPower" );
                    else if(newParameters["allowLVRT"               ] != oldParameters["allowLVRT"               ]) showSettingParametersError("Problem when setting allowLVRT"               );
                    else if(newParameters["allowHVRT"               ] != oldParameters["allowHVRT"               ]) showSettingParametersError("Problem when setting allowHVRT"               );
                    else if(newParameters["allowSoftStartACCharging"] != oldParameters["allowSoftStartACCharging"]) showSettingParametersError("Problem when setting allowSoftStartACCharging");
                    else if(newParameters["allowOverFreqDerating"   ] != oldParameters["allowOverFreqDerating"   ]) showSettingParametersError("Problem when setting allowOverFreqDerating"   );
                    else if(newParameters["allowQuDeratingFunction" ] != oldParameters["allowQuDeratingFunction" ]) showSettingParametersError("Problem when setting allowQuDeratingFunction" );
                    else if(newParameters["feedInPowerFactor"       ] != oldParameters["feedInPowerFactor"       ]) showSettingParametersError("Problem when setting feedInPowerFactor"       );
                    else if(newParameters["autoAdjustPowerFactor"   ] != oldParameters["autoAdjustPowerFactor"   ]) showSettingParametersError("Problem when setting autoAdjustPowerFactor"   );
                    else if(newParameters["voltageAndReactivePower" ] != oldParameters["voltageAndReactivePower" ]) showSettingParametersError("Problem when setting voltageAndReactivePower" );
                    else if(newParameters["overFreqDropRatedPower"  ] != oldParameters["overFreqDropRatedPower"  ]) showSettingParametersError("Problem when setting overFreqDropRatedPower"  );
                    else if(newParameters["feedInReactivePower"     ] != oldParameters["feedInReactivePower"     ]) showSettingParametersError("Problem when setting feedInReactivePower"     );
                    else if(newParameters["configTimeConstants"     ] != oldParameters["configTimeConstants"     ]) showSettingParametersError("Problem when setting configTimeConstants"     );
                    else if(newParameters["regulationMode"          ] != oldParameters["regulationMode"          ]) showSettingParametersError("Problem when setting regulationMode"          );
                    else if(newParameters["extsolMode"              ] != oldParameters["extsolMode"              ]) showSettingParametersError("Problem when setting extsolMode"              );
                    else if(newParameters["meter1Mode"              ] != oldParameters["meter1Mode"              ]) showSettingParametersError("Problem when setting meter1Mode"              );
                    else if(newParameters["meter2Mode"              ] != oldParameters["meter2Mode"              ]) showSettingParametersError("Problem when setting meter2Mode"              );
                    else if(newParameters["meter3Mode"              ] != oldParameters["meter3Mode"              ]) showSettingParametersError("Problem when setting meter3Mode"              );
                    else if(newParameters["meter4Mode"              ] != oldParameters["meter4Mode"              ]) showSettingParametersError("Problem when setting meter4Mode"              );
                    else if(newParameters["meter1Label"             ] != oldParameters["meter1Label"             ]) showSettingParametersError("Problem when setting meter1Label"             );
                    else if(newParameters["meter2Label"             ] != oldParameters["meter2Label"             ]) showSettingParametersError("Problem when setting meter2Label"             );
                    else if(newParameters["meter3Label"             ] != oldParameters["meter3Label"             ]) showSettingParametersError("Problem when setting meter3Label"             );
                    else if(newParameters["meter4Label"             ] != oldParameters["meter4Label"             ]) showSettingParametersError("Problem when setting meter4Label"             );
                    else if(newParameters["prepareBatteryExtension" ] != oldParameters["prepareBatteryExtension" ]) showSettingParametersError("Problem when setting prepareBatteryExtension" );
                    else if(newParameters["cloudSet"                ] != oldParameters["cloudSet"                ]) showSettingParametersError("Problem when setting cloudSet"                );
                    else if(isTor || isEstonia) {
                        if(newParameters["gridVoltageProtectionTime"  ] != oldParameters["gridVoltageProtectionTime"  ]) showSettingParametersError("Problem when setting gridVoltageProtectionTime"  );
                        if(newParameters["gridFrequencyProtectionTime"] != oldParameters["gridFrequencyProtectionTime"]) showSettingParametersError("Problem when setting gridFrequencyProtectionTime");
                        if(newParameters["gridFirstOrderVoltage"      ] != oldParameters["gridFirstOrderVoltage"      ]) showSettingParametersError("Problem when setting gridFirstOrderVoltage"      );
                        if(newParameters["gridSecondOrderVoltage"     ] != oldParameters["gridSecondOrderVoltage"     ]) showSettingParametersError("Problem when setting gridSecondOrderVoltage"     );
                        if(newParameters["gridFirstOrderFrequency"    ] != oldParameters["gridFirstOrderFrequency"    ]) showSettingParametersError("Problem when setting gridFirstOrderFrequency"    );
                        if(newParameters["maxGridVoltage"             ] != oldParameters["maxGridVoltage"             ]) showSettingParametersError("Problem when setting maxGridVoltage"             );
                        if(newParameters["minGridVoltage"             ] != oldParameters["minGridVoltage"             ]) showSettingParametersError("Problem when setting minGridVoltage"             );
                        if(newParameters["maxGridFrequency"           ] != oldParameters["maxGridFrequency"           ]) showSettingParametersError("Problem when setting maxGridFrequency"           );
                        if(newParameters["minGridFrequency"           ] != oldParameters["minGridFrequency"           ]) showSettingParametersError("Problem when setting minGridFrequency"           );
                        if(isTor) {
                            if(newParameters["gridAverageVoltage"     ] != oldParameters["gridAverageVoltage"         ]) showSettingParametersError("Problem when setting gridAverageVoltage"         );
                            if(newParameters["gridAverageVoltageTime" ] != oldParameters["gridAverageVoltageTime"     ]) showSettingParametersError("Problem when setting gridAverageVoltageTime"     );
                            if(newParameters["gridConnectDelay"       ] != oldParameters["gridConnectDelay"           ]) showSettingParametersError("Problem when setting gridConnectDelay"           );
                        }
                    }
                }
            }

        }
    });

}
