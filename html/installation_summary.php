<?php

/*
	Installation Summary
*/

// Include Base
include_once "common/base.php";
// Set Step
$step = 8;

// Disable Back Button
if(!isset($_SESSION["last_step"])) header("location: index.php");
if($_SESSION["last_step"] != $step && $_SESSION["last_step"] != $step - 1)
	header("location: " . (isset($_SESSION["back_url"]) ? $_SESSION["back_url"] : "index.php"));
$_SESSION["back_url" ] = $_SERVER["REQUEST_URI"];
$_SESSION["last_step"] = $step;

// Define Arrays
$arrayGender       = $lang["dict_gender"   ];
$arrayCountry      = $lang["dict_countries"];
$arrayDeviceModel  = [ "h5"  => "batterX h5", "h10" => "batterX h10" ];
$arrayNominalPower = [ "h5"  => "5000"      , "h10" => "10000"       ];

// Get Battery Type
$batteryType = isset($_SESSION["battery_type"]) ? $_SESSION["battery_type"] : "";
if($batteryType == "other" && $_SESSION["battery_capacity"] == "0") $batteryType = "";

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
		<link rel="stylesheet" href="css/installation_summary.css?v=<?php echo $versionHash ?>">

	</head>

	<body>





		<!-- Progress Bar -->
		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
		</div>
		<!-- Progress Bar -->





		<div id="summary" class="mt-5 mx-auto">

			<div class="head border box-margin">
				<div class="title br">
					<span><?php echo $lang["summary"]["installation_summary"]; ?></span>
				</div>
				<div class="logo">
					<img src="img/batterx_logo.png">
				</div>
			</div>

			<div class="installation-date border box-margin">
				<div class="box-row bb">
					<span class="br"><?php echo $lang["summary"]["installation_date"]; ?></span>
					<span><?php echo $_SESSION["installation_date"]; ?></span>
				</div>
				<div class="box-row">
					<span class="br"><?php echo $lang["summary"]["latest_maintenance"]; ?></span>
					<span><?php echo date("Y-m-d"); ?></span>
				</div>
			</div>
			
			<div class="installer-info border box-margin">
				<div class="box-head">
					<span><?php echo $lang["summary"]["installer"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["name"]; ?></span>
					<span><?php echo $arrayGender[$_SESSION["installer_gender"]] . " " . $_SESSION["installer_firstname"] . " " . $_SESSION["installer_lastname"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["company"]; ?></span>
					<span><?php echo $_SESSION["installer_company"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["email"]; ?></span>
					<span><?php echo $_SESSION["installer_email"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["telephone"]; ?></span>
					<span><?php echo $_SESSION["installer_telephone"]; ?></span>
				</div>
				<?php if(!empty($_SESSION["note"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installer_memo"]; ?></span>
						<span style="white-space: pre-wrap"><?php echo $_SESSION["note"]; ?></span>
					</div>
				<?php endif; ?>
			</div>
			
			<div class="customer-info border box-margin">
				<div class="box-head">
					<span><?php echo $lang["summary"]["customer"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["name"]; ?></span>
					<span><?php echo $arrayGender[$_SESSION["customer_gender"]] . " " . $_SESSION["customer_firstname"] . " " . $_SESSION["customer_lastname"]; ?></span>
				</div>
				<?php if(!empty($_SESSION["customer_company"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["common"]["company"]; ?></span>
						<span><?php echo $_SESSION["customer_company"]; ?></span>
					</div>
				<?php endif; ?>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["email"]; ?></span>
					<span><?php echo $_SESSION["customer_email"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["telephone"]; ?></span>
					<span><?php echo $_SESSION["customer_telephone"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["address"]; ?></span>
					<span><?php echo $_SESSION["customer_address"] . "<br>" . $_SESSION["customer_zipcode"] . " " . $_SESSION["customer_city"] . ", " . $arrayCountry[$_SESSION["customer_country"]]; ?></span>
				</div>
			</div>

			<div class="system-info border box-margin">
				<div class="box-head">
					<span><?php echo $lang["summary"]["installation"]; ?></span>
				</div>
				<?php if($batteryType == "lifepo" && !empty($_SESSION["system_model"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installation_system_model"]; ?></span>
						<span><?php echo ($_SESSION["system_model"]) . ($_SESSION["vde4105"] == "1" ? "<br>(" . $lang["summary"]["installation_system_is_vde4105"] . ")" : ""); ?></span>
					</div>
				<?php endif; ?>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_sn_system"]; ?></span>
					<span><?php echo $_SESSION["system_serial"]; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_sn_inverter"]; ?></span>
					<span><?php echo $_SESSION["device_serial"] . " (" . $arrayDeviceModel[$_SESSION["device_model"]] . ")"; ?></b></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_nominal_power"]; ?></span>
					<span><?php echo $arrayNominalPower[$_SESSION["device_model"]]; ?> W</span>
				</div>
				<?php if($_SESSION["vde4105_mode"] > 0): ?>
					<div class="box-row bt">
						<span class="br">Blindleistungsbereitstellung</span>
						<span>
							<?php
								if($_SESSION["vde4105_mode"] == "1") {
									echo $lang["dict_vde4105_mode"]["1"];
								} else if($_SESSION["vde4105_mode"] == "2") {
									if($_SESSION["vde4105_cosphi"] == "100") echo $lang["dict_vde4105_mode"]["2"] . " = 1.00";
									else echo $lang["dict_vde4105_mode"]["2"] . " = 0." . $_SESSION["vde4105_cosphi"];
								} else if($_SESSION["vde4105_mode"] == "3") {
									echo $lang["dict_vde4105_mode"]["3"] . "<br>";
									echo "U1 = " . $_SESSION["vde4105_v1"] . "% &nbsp; ";
									echo "U2 = " . $_SESSION["vde4105_v2"] . "% &nbsp; ";
									echo "U3 = " . $_SESSION["vde4105_v3"] . "% &nbsp; ";
									echo "U4 = " . $_SESSION["vde4105_v4"] . "% &nbsp; ";
									if($_SESSION["vde4105_cosphi"] == "100") echo "cosφ = 1.00";
									else echo "cosφ = 0." . $_SESSION["vde4105_cosphi"];
								}
							?>
						</span>
					</div>
				<?php endif; ?>
				<!--
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_power_factor"]; ?></span>
					<span>0.9</span>
				</div>
				-->
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_sn_livex"]; ?></span>
					<span><?php echo $_SESSION["box_serial"] . " (" . $_SESSION["software_version"] . ")"; ?></span>
				</div>
				<?php if($batteryType == "lifepo"): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installation_batteries"]; ?></span>
						<span>
							<?php
								if(isset($_SESSION["battery5_serial"])) {
									if(isset($_SESSION["battery1_serial" ])) echo     "" . $_SESSION["battery1_serial" ];
									if(isset($_SESSION["battery2_serial" ])) echo   ", " . $_SESSION["battery2_serial" ];
									if(isset($_SESSION["battery3_serial" ])) echo "<br>" . $_SESSION["battery3_serial" ];
									if(isset($_SESSION["battery4_serial" ])) echo   ", " . $_SESSION["battery4_serial" ];
									if(isset($_SESSION["battery5_serial" ])) echo "<br>" . $_SESSION["battery5_serial" ];
									if(isset($_SESSION["battery6_serial" ])) echo   ", " . $_SESSION["battery6_serial" ];
									if(isset($_SESSION["battery7_serial" ])) echo "<br>" . $_SESSION["battery7_serial" ];
									if(isset($_SESSION["battery8_serial" ])) echo   ", " . $_SESSION["battery8_serial" ];
									if(isset($_SESSION["battery9_serial" ])) echo "<br>" . $_SESSION["battery9_serial" ];
									if(isset($_SESSION["battery10_serial"])) echo   ", " . $_SESSION["battery10_serial"];
									if(isset($_SESSION["battery11_serial"])) echo "<br>" . $_SESSION["battery11_serial"];
									if(isset($_SESSION["battery12_serial"])) echo   ", " . $_SESSION["battery12_serial"];
									if(isset($_SESSION["battery13_serial"])) echo "<br>" . $_SESSION["battery13_serial"];
									if(isset($_SESSION["battery14_serial"])) echo   ", " . $_SESSION["battery14_serial"];
									if(isset($_SESSION["battery15_serial"])) echo "<br>" . $_SESSION["battery15_serial"];
									if(isset($_SESSION["battery16_serial"])) echo   ", " . $_SESSION["battery16_serial"];
								} else {
									if(isset($_SESSION["battery1_serial" ])) echo     "" . $_SESSION["battery1_serial" ];
									if(isset($_SESSION["battery2_serial" ])) echo "<br>" . $_SESSION["battery2_serial" ];
									if(isset($_SESSION["battery3_serial" ])) echo "<br>" . $_SESSION["battery3_serial" ];
									if(isset($_SESSION["battery4_serial" ])) echo "<br>" . $_SESSION["battery4_serial" ];
								}
							?>
						</span>
					</div>
				<?php elseif($batteryType == "carbon"): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installation_batteries"]; ?></span>
						<span><?php echo (intval($_SESSION["battery_strings"]) * ($_SESSION["battery_model"] == "LC+2V500" ? 24 : 4)) . "x " . $_SESSION["battery_model"] . " (" . $_SESSION["battery_capacity"] . " Wh)"; ?></span>
					</div>
				<?php elseif($batteryType == "other"): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installation_batteries"]; ?></span>
						<span><?php echo $_SESSION["battery_capacity"] . " Wh"; ?></span>
					</div>
				<?php endif; ?>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_solar_size"]; ?></span>
					<span><?php echo $_SESSION["solar_wattPeak"] . " Wp"; ?></span>
				</div>
				<?php if(!empty($_SESSION["solar_info"])): ?>
					<div class="box-row bt">
						<span class="br"><?php echo $lang["summary"]["installation_solar_info"]; ?></span>
						<span style="white-space: pre-wrap"><?php echo $_SESSION["solar_info"]; ?></span>
					</div>
				<?php endif; ?>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["summary"]["installation_solar_feed_in_limitation"]; ?></span>
					<span><?php echo $_SESSION["solar_feedInLimitation"] . " %"; ?></span>
				</div>
				<div class="box-row bt">
					<span class="br"><?php echo $lang["common"]["address"]; ?></span>
					<span><?php echo $_SESSION["installation_address"] . "<br>" . $_SESSION["installation_zipcode"] . " " . $_SESSION["installation_city"] . ", " . $arrayCountry[$_SESSION["installation_country"]]; ?></span>
				</div>
			</div>

			<div id="confirmLoadCorrect" class="installer-accept border d-none">
				<div class="box-row">
					<span class="w-100 text-justify"><?php echo $lang["summary"]["confirm_load_final"]; ?></span>
				</div>
			</div>

		</div>





		<div id="confirm" class="pt-5 pb-3 px-3 mx-auto">
			<div class="custom-control custom-checkbox">
				<input type="checkbox" class="custom-control-input" id="checkboxAccept2">
				<label class="custom-control-label" for="checkboxAccept2"><?php echo $lang["summary"]["confirm_info"]; ?></label>
			</div>
			<div class="custom-control custom-checkbox mt-5">
				<input type="checkbox" class="custom-control-input" id="checkboxAccept1">
				<label class="custom-control-label" for="checkboxAccept1"><?php echo $lang["summary"]["confirm_load"]; ?></label>
			</div>
		</div>

		



		<div id="btnFinish" class="px-3 mx-auto">
			<button id="btnFinishInstallation" class="btn btn-success ripple mb-3 mt-4 px-5 py-3"><?php echo $lang["summary"]["finish_installation"]; ?></button>
		</div>





		<div id="successBox" class="container elevate-1 p-5 my-lg-5" style="display: none">

			<h1 class="text-success"><?php echo $lang["summary"]["final_congratulations"]; ?></h1>

			<p class="mt-2rem"><?php echo $lang["summary"]["final_text1"]; ?></p>

			<p><?php echo $lang["summary"]["final_text2"]; ?></p>

			<p><?php echo $lang["summary"]["final_text3"]; ?></p>

			<p class="mt-2rem"><?php echo $lang["summary"]["final_text4"]; ?>: <br><a href="https://my.batterx.io" target="_blank">my.batterx.io</a></p>

			<p class="mt-2rem"><?php echo $lang["summary"]["final_text5"]; ?></p>

			<button id="btnDownload" class="btn btn-sm btn-success ripple py-2 px-4"><?php echo $lang["summary"]["final_download_pdf"]; ?></button>

			<p class="mt-2rem"><?php echo $lang["summary"]["final_text6"]; ?></p>

			<div class="d-flex align-items-center">
				<button id="btnReboot" class="btn btn-sm btn-primary ripple py-2 px-4"><?php echo $lang["summary"]["final_reboot_livex"]; ?></button>
				<div class="notif ml-3"></div>
			</div>

		</div>





		<input id="lang" type="hidden" value="<?php echo $_SESSION["lang"]; ?>">





		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/jspdf.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/html2canvas.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($lang); ?>;</script>
		<script>const dataObj = <?php echo json_encode($_SESSION); ?>;</script>
		<script src="js/installation_summary.js?v=<?php echo $versionHash ?>"></script>





	</body>

</html>
