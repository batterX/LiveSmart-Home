<?php

/*
	System Setup
*/

// Include Base
include_once "common/base.php";
// Set Step
$step = 5;

// Disable Back Button
if(!isset($_SESSION["last_step"])) header("location: index.php");
if($_SESSION["last_step"] != $step && $_SESSION["last_step"] != $step - 1)
	header("location: " . (isset($_SESSION["back_url"]) ? $_SESSION["back_url"] : "index.php"));
$_SESSION["back_url" ] = $_SERVER["REQUEST_URI"];
$_SESSION["last_step"] = $step;

// Unset Batteries From Session
if(isset($_SESSION["battery1_serial" ])) unset($_SESSION["battery1_serial" ]);
if(isset($_SESSION["battery2_serial" ])) unset($_SESSION["battery2_serial" ]);
if(isset($_SESSION["battery3_serial" ])) unset($_SESSION["battery3_serial" ]);
if(isset($_SESSION["battery4_serial" ])) unset($_SESSION["battery4_serial" ]);
if(isset($_SESSION["battery5_serial" ])) unset($_SESSION["battery5_serial" ]);
if(isset($_SESSION["battery6_serial" ])) unset($_SESSION["battery6_serial" ]);
if(isset($_SESSION["battery7_serial" ])) unset($_SESSION["battery7_serial" ]);
if(isset($_SESSION["battery8_serial" ])) unset($_SESSION["battery8_serial" ]);
if(isset($_SESSION["battery9_serial" ])) unset($_SESSION["battery9_serial" ]);
if(isset($_SESSION["battery10_serial"])) unset($_SESSION["battery10_serial"]);
if(isset($_SESSION["battery11_serial"])) unset($_SESSION["battery11_serial"]);
if(isset($_SESSION["battery12_serial"])) unset($_SESSION["battery12_serial"]);
if(isset($_SESSION["battery13_serial"])) unset($_SESSION["battery13_serial"]);
if(isset($_SESSION["battery14_serial"])) unset($_SESSION["battery14_serial"]);
if(isset($_SESSION["battery15_serial"])) unset($_SESSION["battery15_serial"]);
if(isset($_SESSION["battery16_serial"])) unset($_SESSION["battery16_serial"]);

// Get Apikey
$output = shell_exec("cat /proc/cpuinfo");
$find = "Serial";
$pos = strpos($output, $find);
$serial = substr($output, $pos + 10, 16);
$apikey = sha1(strval($serial));
$_SESSION["box_apikey"] = $apikey;

?>





<!DOCTYPE html>

<html>

	<head>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="author" content="Ivan Gavrilov">
		<link rel="icon" href="img/favicon.png">

		<title>batterX liveX</title>

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/system_setup.css?v=<?php echo $versionHash ?>">

	</head>

	<body>





		<!-- Progress Bar -->
		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
			<div><button id="btn_next" class="btn btn-success ripple" type="submit" form="mainForm" disabled><?php echo $lang["btn"]["continue"]; ?></button></div>
		</div>
		<!-- Progress Bar -->





		<div class="modal fade" id="errorBoxNotRegistered" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["system_setup"]["livex_not_registered"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b>APIKEY</b></span>
							<input type="text" class="form-control form-control-outline text-center mt-2" value="<?php echo $apikey ?>" readonly>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorSystemSerialNotCorrect" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["system_setup"]["system_serial_not_correct"] ?></b></span>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorInverterRegisteredWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["system_setup"]["inverter_registered_with_other_system"] ?></b></span>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="errorBatteryNotExistOrWithOtherSystem" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span style="color: red"><b><?php echo $lang["system_setup"]["battery_not_exist_or_registered_with_other_system"] ?></b></span>
						<div class="mt-3">
							<span class="d-block"><b><?php echo $lang["system_setup"]["serialnumber"] ?></b></span>
							<input id="errorBatterySerial" type="text" class="form-control-plaintext text-center">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="modalInstallerMemo" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<h5 class="modal-header mb-0"><?php echo $lang["system_setup"]["installer_memo"]; ?></h5>
					<div class="modal-body"><textarea id="installer_memo" class="form-control form-control-outline"></textarea></div>
					<div class="modal-footer"><button type="button" class="btn btn-sm px-4 py-2 btn-success ripple" data-dismiss="modal"><b><?php echo $lang["btn"]["save"] ?></b></button></div>
				</div>
			</div>
		</div>





		<div class="container pb-5">
			<form id="mainForm" class="pb-4">

				<div class="row">

					<!-- batterX Home -->
					<div class="col-lg-3 d-xl-none"></div>
					<div id="bxHome" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0">batterX Home</h1>

						<div class="card elevate-1 h-100">
							<div id="system_type" class="card-body border-bottom">
								<label for="bx_system"><?php echo $lang["system_setup"]["serialnumber_system"]; ?></label>
								<input id="bx_system" class="form-control form-control-outline" type="text" placeholder="<?php echo $lang["system_setup"]["serialnumber"]; ?>" required>
								<div class="custom-control custom-radio mt-3">
									<input type="radio" id="bx_system_type_r" name="bx_system_type" class="custom-control-input" checked>
									<label class="custom-control-label" for="bx_system_type_r"><?php echo $lang["system_setup"]["system_type_r"]; ?></label>
								</div>
								<div class="custom-control custom-radio mt-1">
									<input type="radio" id="bx_system_type_w" name="bx_system_type" class="custom-control-input">
									<label class="custom-control-label" for="bx_system_type_w"><?php echo $lang["system_setup"]["system_type_w"]; ?></label>
								</div>
							</div>
							<div class="card-body border-bottom pt-3">
								<label for="bx_device"><?php echo $lang["system_setup"]["serialnumber_inverter"]; ?></label>
								<input id="bx_device" class="form-control form-control-outline" type="text" placeholder="<?php echo $lang["system_setup"]["serialnumber"]; ?>" value="" disabled required>
							</div>
							<div class="card-body border-bottom pt-3">
								<label for="bx_box"><?php echo $lang["system_setup"]["serialnumber_box"]; ?></label>
								<input id="bx_box" class="form-control form-control-outline" type="text" placeholder="<?php echo $lang["system_setup"]["serialnumber"]; ?>" value="" disabled required>
							</div>
							<div class="card-body p-2">
								<button id="btnInstallerMemo" type="button" class="btn btn-block ripple p-2" data-toggle="modal" data-target="#modalInstallerMemo"><small><b><?php echo $lang["system_setup"]["installer_memo"]; ?></b></small></button>
							</div>
						</div>

					</div>
					<div class="col-lg-3 d-xl-none"></div>

					<!-- Solar Panels -->
					<div id="solar" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["system_setup"]["pv_system"] ?></h1>

						<div class="card elevate-1 h-100">
							<div class="card-body border-bottom">
								<label for="solar_wattPeak"><?php echo $lang["system_setup"]["pv_system_size"]; ?></label>
								<div class="row m-0 p-0">
									<div class="col-6 d-flex align-items-center m-0 p-0"><input id="solar_wattPeak" class="form-control form-control-outline" type="number" step="1" min="0" required></div>
									<div class="col-6 d-flex align-items-center m-0 py-0 pr-0 pl-2"><span><?php echo $lang["system_setup"]["watt_peak"]; ?></span></div>
								</div>
							</div>
							<div class="card-body border-bottom pt-3">
								<label for="solar_feedInLimitation"><?php echo $lang["system_setup"]["pv_system_feed_in_limitation"]; ?></label>
								<div class="row m-0 p-0">
									<div class="col-6 d-flex align-items-center m-0 p-0"><input id="solar_feedInLimitation" class="form-control form-control-outline" type="number" step="1" min="0" max="100" value="100" required></div>
									<div class="col-6 d-flex align-items-center m-0 py-0 pr-0 pl-2"><span>%</span></div>
								</div>
							</div>
							<div class="card-body pt-3">
								<label for="solar_info"><?php echo $lang["system_setup"]["pv_installation_info"]; ?></label>
								<textarea id="solar_info" class="form-control form-control-outline" placeholder="Paneltyp: ...

MPPT 1
	String 1: ...
	String 2: ...
MPPT 2
	String 1: ...
	String 2: ..."></textarea>
							</div>
							<div id="box_emeter_phase" class="card-body border-top pt-3 d-none">
								<label for="bx_emeter_phase"><?php echo $lang["system_setup"]["emeter_phase_connected"]; ?></label>
								<select id="bx_emeter_phase" class="form-control form-control-outline">
									<option value="1">Phase 1</option>
									<option value="2">Phase 2</option>
									<option value="3">Phase 3</option>
								</select>
							</div>
						</div>

					</div>

					<!-- Batteries -->
					<div id="battery" class="col-lg-6 col-xl-4 pt-5">

						<h1 class="card-header bg-transparent border-0"><?php echo $lang["system_setup"]["batteries"] ?></h1>

						<div class="card elevate-1 h-100">
						
							<div class="card-body">
								<div class="custom-control custom-radio d-inline-block">
									<input type="radio" id="bx_battery_type_0" name="bx_battery_type" class="custom-control-input" value="0" checked>
									<label class="custom-control-label" for="bx_battery_type_0">LiFePO</label>
								</div>
								<div class="custom-control custom-radio d-inline-block ml-4">
									<input type="radio" id="bx_battery_type_1" name="bx_battery_type" class="custom-control-input" value="1">
									<label class="custom-control-label" for="bx_battery_type_1">Carbon</label>
								</div>
								<div class="custom-control custom-radio d-inline-block ml-4">
									<input type="radio" id="bx_battery_type_9" name="bx_battery_type" class="custom-control-input" value="9">
									<label class="custom-control-label" for="bx_battery_type_9"><?php echo $lang["system_setup"]["other"]; ?></label>
								</div>
							</div>

							<div class="card-body border-top">

								<div id="battery_section_0">
									<p><?php echo $lang["system_setup"]["batteries_serialnumber"]; ?></p>
									<input id="lifepo_battery_1" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "1", $lang["system_setup"]["serialnumber_battery1"]); ?>">
									<input id="lifepo_battery_2" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "2", $lang["system_setup"]["serialnumber_battery1"]); ?>">
									<input id="lifepo_battery_3" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "3", $lang["system_setup"]["serialnumber_battery1"]); ?>">
									<input id="lifepo_battery_4" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "4", $lang["system_setup"]["serialnumber_battery1"]); ?>">
									<div id="listAllModules" class="d-none">
										<input id="lifepo_battery_5"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "5", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_6"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "6", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_7"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "7", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_8"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "8", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_9"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "9", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_10" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "10", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_11" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "11", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_12" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "12", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_13" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "13", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_14" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "14", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_15" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "15", $lang["system_setup"]["serialnumber_battery1"]); ?>">
										<input id="lifepo_battery_16" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "16", $lang["system_setup"]["serialnumber_battery1"]); ?>">
									</div>
									<div class="text-center">
										<button type="button" id="btnShowAllModules" class="btn ripple mt-2 px-3"><small><b><?php echo $lang["system_setup"]["show_more"] ?></b></small></button>
									</div>
								</div>

								<div id="battery_section_1" style="display: none">
									<div class="d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["system_setup"]["batteries"]; ?></span>
										<select id="carbon_battery_model" class="custom-select-sm custom-select custom-select-outline w-50">
											<option value="LC+700">LC+700 (4x12V)</option>
											<option value="LC+1300">LC+1300 (4x12V)</option>
											<option value="LC+2V500">LC+2V500 (24x2V)</option>
										</select>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["system_setup"]["number_of_strings"] ?></span>
										<select id="carbon_battery_strings" class="custom-select-sm custom-select custom-select-outline w-50">
											<option value="1">1</option>
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
										</select>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2"><?php echo $lang["system_setup"]["capacity"] ?></span>
										<input id="carbon_battery_capacity" type="text" class="form-control form-control-sm form-control-outline text-right w-50" value="2800 Wh" disabled>
									</div>
								</div>

								<div id="battery_section_9" style="display: none">
									<div class="d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["battery_capacity"] ?></small></span>
										<input id="other_battery_capacity" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>Wh</small></span>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["max_charging_current"] ?></small></span>
										<input id="other_battery_maxChargingCurrent" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>A</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["max_discharging_current"] ?></small></span>
										<input id="other_battery_maxDischargingCurrent" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>A</small></span>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["bulk_charging_voltage"] ?></small></span>
										<input id="other_battery_bulkChargingVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["float_charging_voltage"] ?></small></span>
										<input id="other_battery_floatChargingVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-3 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["cutoff_voltage_hybrid"] ?></small></span>
										<input id="other_battery_cutoffVoltageHybrid" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["redischarging_voltage_hybrid"] ?></small></span>
										<input id="other_battery_redischargeVoltageHybrid" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["cutoff_voltage"] ?></small></span>
										<input id="other_battery_cutoffVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
									<div class="mt-2 d-flex justify-content-between align-items-center">
										<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $lang["system_setup"]["redischarging_voltage"] ?></small></span>
										<input id="other_battery_redischargeVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
										<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
									</div>
								</div>

							</div>
						</div>

					</div>

				</div>

				<div class="text-center">
					<div class="setting-progress pt-4 mt-5 d-none">
						<div class="d-flex align-items-center justify-content-center">
							<div id="notif" class="loading d-block"></div>
							<span id="message"><?php echo $lang["system_setup"]["setting_parameters"]; ?></span>
						</div>
					</div>
				</div>

				<input id="installation_date" type="hidden" value="<?php echo date("Y-m-d"); ?>">

			</form>

		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($lang) ?>;</script>
		<script>const apikey = <?php echo json_encode($apikey) ?>;</script>
		<script src="js/system_setup.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
