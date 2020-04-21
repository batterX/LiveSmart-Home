<?php

include_once "common/base.php";
$step = 5;

// Check Step
if(!isset($_SESSION['last_step'])) header("location: index.php");
if($_SESSION['last_step'] != $step && $_SESSION['last_step'] != $step - 1)
	header('location: ' . (isset($_SESSION['back_url']) ? $_SESSION['back_url'] : "index.php"));
$_SESSION['back_url' ] = $_SERVER['REQUEST_URI'];
$_SESSION['last_step'] = $step;

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



		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
			<div><button id="btn_next" class="btn btn-success ripple" type="submit" form="mainForm" disabled><?php echo $strings['continue']; ?></button></div>
		</div>



		<div id="modalInstallerMemo" class="modal fade">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<h4 class="modal-header mb-0">
						<?php echo $strings['installer_memo']; ?>
					</h4>
					<div class="modal-body">
						<textarea id="installer_memo" class="form-control form-control-outline w-100"></textarea>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-sm px-5 py-2 btn-success" data-dismiss="modal">SAVE</button>
					</div>
				</div>
			</div>
		</div>



		<div class="container px-3">

			<form id="mainForm">

				<div class="row m-0 p-0">

					<!-- batterX Home -->
					<div id="bxHome" class="col-xl-4 px-3">

						<h1>batterX Home</h1>

						<div id="system_type" class="mb-4">
							<label for="bx_system"><?php echo $strings['serialnumber_system']; ?></label>
							<input id="bx_system" class="form-control form-control-outline" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" required>
							<div class="custom-control custom-radio mt-3">
								<input type="radio" id="bx_system_type_r" name="bx_system_type" class="custom-control-input" checked>
								<label class="custom-control-label" for="bx_system_type_r"><?php echo $strings['system_type_r']; ?></label>
							</div>
							<div class="custom-control custom-radio mt-2">
								<input type="radio" id="bx_system_type_w" name="bx_system_type" class="custom-control-input">
								<label class="custom-control-label" for="bx_system_type_w"><?php echo $strings['system_type_w']; ?></label>
							</div>
						</div>

						<label for="bx_device"><?php echo $strings['serialnumber_inverter']; ?></label>
						<input id="bx_device" class="form-control form-control-outline" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" value="" disabled required>

						<label class="mt-4" for="bx_box"><?php echo $strings['serialnumber_box']; ?></label>
						<input id="bx_box" class="form-control form-control-outline" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" value="" disabled required>

						<div class="pt-3">
							<button id="btnInstallerMemo" type="button" class="btn-block btn btn-sm btn-outline-secondary ripple px-5 py-2 mt-3" data-toggle="modal" data-target="#modalInstallerMemo"><b><?php echo $strings['installer_memo']; ?></b></button>
						</div>

					</div>

					<!-- Solar Panels -->
					<div id="solar" class="col-lg-6 col-xl-4 px-3">

						<h1><?php echo $strings['pv_system'] ?></h1>

						<label for="solar_wattPeak"><?php echo $strings['pv_system_size']; ?></label>
						<div>
							<input id="solar_wattPeak" class="form-control form-control-outline d-inline-block w-50" type="number" step="1" min="0" required>
							<span class="pl-2"><?php echo $strings['watt_peak']; ?></span>
						</div>

						<label class="mt-4" for="solar_feedInLimitation"><?php echo $strings['pv_system_feed_in_limitation']; ?></label>
						<div>
							<input id="solar_feedInLimitation" class="form-control form-control-outline d-inline-block w-50" type="number" step="1" min="0" max="100" value="100" required>
							<span class="pl-2">%</span>
						</div>

						<label class="mt-4" for="solar_info"><?php echo $strings['pv_installation_info']; ?></label>
						<div>
							<textarea id="solar_info" class="form-control form-control-outline w-100" placeholder="Paneltyp: ...

MPPT 1
	String 1: ...
	String 2: ...
MPPT 2
	String 1: ...
	String 2: ..."></textarea>
						</div>

						<div id="box_emeter_phase" class="d-none">
							<label class="mt-4"><?php echo $strings['emeter_phase_connected']; ?></label>
							<div>
								<select id="bx_emeter_phase" class="form-control custom-select-outline custom-select">
									<option value="1">Phase 1</option>
									<option value="2">Phase 2</option>
									<option value="3">Phase 3</option>
								</select>
							</div>
						</div>

					</div>

					<!-- Batteries -->
					<div id="battery" class="col-lg-6 col-xl-4 px-3">

						<h1><?php echo $strings['batteries']; ?></h1>

						<div class="mb-4">
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
								<label class="custom-control-label" for="bx_battery_type_9"><?php echo $strings['other']; ?></label>
							</div>
						</div>

						<div id="battery_section_0">
							<p><?php echo $strings['batteries_serialnumber']; ?></p>
							<input id="lifepo_battery_1" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "1", $strings['serialnumber_battery1']); ?>">
							<input id="lifepo_battery_2" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "2", $strings['serialnumber_battery1']); ?>">
							<input id="lifepo_battery_3" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "3", $strings['serialnumber_battery1']); ?>">
							<input id="lifepo_battery_4" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "4", $strings['serialnumber_battery1']); ?>">
							<div id="listAllModules" class="d-none">
								<input id="lifepo_battery_5"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "5", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_6"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "6", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_7"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "7", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_8"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "8", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_9"  type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1",  "9", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_10" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "10", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_11" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "11", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_12" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "12", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_13" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "13", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_14" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "14", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_15" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "15", $strings['serialnumber_battery1']); ?>">
								<input id="lifepo_battery_16" type="text" class="form-control form-control-outline mt-2" placeholder="<?php echo str_replace("1", "16", $strings['serialnumber_battery1']); ?>">
							</div>
							<div class="text-center">
								<button type="button" id="btnShowAllModules" class="btn ripple mt-2"><small><b><?php echo $strings['show_more'] ?></b></small></button>
							</div>
						</div>

						<div id="battery_section_1" style="display: none">
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-3"><?php echo $strings['batteries']; ?></span>
								<select id="carbon_battery_model" class="custom-select-sm custom-select custom-select-outline w-50">
									<option value="LC+700">LC+700 (4x12V)</option>
									<option value="LC+1300">LC+1300 (4x12V)</option>
									<option value="LC+2V500">LC+2V500 (24x2V)</option>
								</select>
							</div>
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-3"><?php echo $strings['number_of_strings'] ?></span>
								<select id="carbon_battery_strings" class="custom-select-sm custom-select custom-select-outline w-50">
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
							</div>
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-3"><?php echo $strings['capacity'] ?></span>
								<input id="carbon_battery_capacity" type="text" class="form-control form-control-sm form-control-outline text-right w-50" value="2800 Wh" disabled>
							</div>
						</div>

						<div id="battery_section_9" style="display: none">
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['battery_capacity'] ?></small></span>
								<input id="other_battery_capacity" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>Wh</small></span>
							</div>
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['max_charging_current'] ?></small></span>
								<input id="other_battery_maxChargingCurrent" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>A</small></span>
							</div>
							<div class="mt-2 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['max_discharging_current'] ?></small></span>
								<input id="other_battery_maxDischargingCurrent" type="number" step="1" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>A</small></span>
							</div>
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['bulk_charging_voltage'] ?></small></span>
								<input id="other_battery_bulkChargingVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
							<div class="mt-2 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['float_charging_voltage'] ?></small></span>
								<input id="other_battery_floatChargingVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
							<div class="mt-3 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['cutoff_voltage_hybrid'] ?></small></span>
								<input id="other_battery_cutoffVoltageHybrid" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
							<div class="mt-2 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['redischarging_voltage_hybrid'] ?></small></span>
								<input id="other_battery_redischargeVoltageHybrid" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
							<div class="mt-2 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['cutoff_voltage'] ?></small></span>
								<input id="other_battery_cutoffVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
							<div class="mt-2 d-flex justify-content-between align-items-center">
								<span class="d-inline-block pr-2 flex-grow-1"><small><?php echo $strings['redischarging_voltage'] ?></small></span>
								<input id="other_battery_redischargeVoltage" type="number" step="0.1" max="60" class="form-control form-control-outline p-1" style="width:25%;max-width:25%;height:calc(1.5em + 0.25rem + 2px);font-size:0.8rem">
								<span class="d-inline-block pl-2" style="width:10%;min-width:10%"><small>V</small></span>
							</div>
						</div>

					</div>

				</div>

				<div class="text-center">
					<div class="setting-progress d-none pt-4 mt-5">
						<div class="d-flex align-items-center justify-content-center">
							<div id="notif" class="loading d-inline-block"></div>
							<span id="message"><?php echo $strings['setting_parameters']; ?></span>
						</div>
					</div>
				</div>

				<input id="installation_date" type="hidden" value="<?php echo date('Y-m-d'); ?>">

			</form>

		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_setup.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
