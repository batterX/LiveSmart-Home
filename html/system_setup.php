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
							<input id="solar_wattPeak" class="form-control form-control-outline d-inline-block w-65" type="number" step="1" min="0" required>
							<span class="pl-3"><?php echo $strings['watt_peak']; ?></span>
						</div>

						<label class="mt-4" for="solar_feedInLimitation"><?php echo $strings['pv_system_feed_in_limitation']; ?></label>
						<div>
							<input id="solar_feedInLimitation" class="form-control form-control-outline d-inline-block w-65" type="number" step="1" min="0" max="100" value="100" required>
							<span class="pl-3">%</span>
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
								<input type="radio" id="bx_battery_type_2" name="bx_battery_type" class="custom-control-input" value="1">
								<label class="custom-control-label" for="bx_battery_type_2"><?php echo $strings['no_batteries']; ?></label>
							</div>
						</div>

						<div id="battery_section_0">
							<p><?php echo $strings['batteries_serialnumber']; ?></p>
							<input id="battery_1" type="text" class="form-control form-control-outline mt-3" placeholder="<?php echo $strings['serialnumber_battery1']; ?>">
							<input id="battery_2" type="text" class="form-control form-control-outline mt-3" placeholder="<?php echo $strings['serialnumber_battery2']; ?>">
							<input id="battery_3" type="text" class="form-control form-control-outline mt-3" placeholder="<?php echo $strings['serialnumber_battery3']; ?>">
							<input id="battery_4" type="text" class="form-control form-control-outline mt-3" placeholder="<?php echo $strings['serialnumber_battery4']; ?>">
						</div>
						<div id="battery_section_1" style="display: none">
							<!-- WRITE SOMETHING ABOUT THE CARBON BATTERIES ??? -->
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
