<?php

include_once "common/base.php";
$step = 8;

// Check Step
if(!isset($_SESSION['last_step'])) header("location: index.php");
if($_SESSION['last_step'] != $step && $_SESSION['last_step'] != $step - 1)
	header('location: ' . (isset($_SESSION['back_url']) ? $_SESSION['back_url'] : "index.php"));
$_SESSION['back_url']  = $_SERVER['REQUEST_URI'];
$_SESSION['last_step'] = $step;


// Value Arrays
$arrayGender = [
	'0' => $strings['gender_male'],
	'1' => $strings['gender_female']
];
$arrayCountry = [
	'de' => $strings['c_de'],
	'at' => $strings['c_at'],
	'be' => $strings['c_be'],
	'bg' => $strings['c_bg'],
	'ch' => $strings['c_ch'],
	'cy' => $strings['c_cy'],
	'cz' => $strings['c_cz'],
	'dk' => $strings['c_dk'],
	'ee' => $strings['c_ee'],
	'es' => $strings['c_es'],
	'fi' => $strings['c_fi'],
	'fr' => $strings['c_fr'],
	'gr' => $strings['c_gr'],
	'hr' => $strings['c_hr'],
	'hu' => $strings['c_hu'],
	'ie' => $strings['c_ie'],
	'it' => $strings['c_it'],
	'lt' => $strings['c_lt'],
	'lu' => $strings['c_lu'],
	'lv' => $strings['c_lv'],
	'nl' => $strings['c_nl'],
	'no' => $strings['c_no'],
	'pl' => $strings['c_pl'],
	'pt' => $strings['c_pt'],
	'ro' => $strings['c_ro'],
	'ru' => $strings['c_ru'],
	'si' => $strings['c_si'],
	'sk' => $strings['c_sk'],
	'se' => $strings['c_se'],
	'uk' => $strings['c_uk']
];
$arrayDeviceModel = [
	'h3'  => 'batterX h3',
	'h5'  => 'batterX h5',
	'h5e' => 'batterX h5-eco',
	'h10' => 'batterX h10'
];

?>



<!DOCTYPE html>

<html>



	<head>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="author" content="Ivan Gavrilov">
		<link rel="icon" href="img/favicon.png">

		<title>batterX LiveX</title>

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/installation_summary.css?v=<?php echo $versionHash ?>">
		
	</head>



	<body>



		<div id="progress" class="shadow-lg"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>



		<div id="summary" class="container px-3">

			<h1><?php echo $strings['summary_installation_summary']; ?></h1>

			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_installation_date']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['installation_date']; ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_latest_maintenance']; ?></div>
				<div class="col-6 col-md-8"><b id="latestMaintenanceDate"><?php echo date('Y-m-d'); ?></b></div>
			</div>

			<div class="p-3"></div>

			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_installer']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $arrayGender[$_SESSION['installer_gender']] . " " . $_SESSION['installer_firstname'] . " " . $_SESSION['installer_lastname'] . "<br>" . $_SESSION['installer_company'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_installer_email']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['installer_email'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_installer_telephone']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['installer_telephone'] ?></b></div>
			</div>

			<div class="p-3"></div>

			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_customer_name']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $arrayGender[$_SESSION['customer_gender']] . " " . $_SESSION['customer_firstname'] . " " . $_SESSION['customer_lastname'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_customer_email']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['customer_email'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_customer_telephone']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['customer_telephone'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_customer_address']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['customer_address'] . "<br>" . $_SESSION['customer_zipcode'] . " " . $_SESSION['customer_city'] . ", " . $arrayCountry[$_SESSION['customer_country']] ?></b></div>
			</div>

			<div class="p-3"></div>

			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_installation_address']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['installation_address'] . "<br>" . $_SESSION['installation_zipcode'] . " " . $_SESSION['installation_city'] . ", " . $arrayCountry[$_SESSION['installation_country']] ?></b></div>
			</div>

			<div class="p-3"></div>

			<?php if(!empty($_SESSION['system_model'])): ?>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_system_model']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['system_model']; ?></b></div>
			</div>
			<?php endif; ?>

			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_system']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['system_serial'] ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_inverter']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['device_serial'] . " (" . $arrayDeviceModel[$_SESSION['device_model']] ?>)</b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_livex']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['box_serial'] . " (" . $_SESSION['software_version'] . ")" ?></b></div>
			</div>

			<?php if(!empty($_SESSION['system_model']) && $_SESSION['battery1_serial'] != $_SESSION['device_serial']): ?>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_batteries']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo ($_SESSION['battery1_serial']) . (isset($_SESSION['battery2_serial']) ? "<br>" . $_SESSION['battery2_serial'] : "") . (isset($_SESSION['battery3_serial']) ? "<br>" . $_SESSION['battery3_serial'] : "") . (isset($_SESSION['battery4_serial']) ? "<br>" . $_SESSION['battery4_serial'] : "") ?></b></div>
			</div>
			<?php endif; ?>
			
			
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_pv_system_size']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['solar_wattPeak'] . " Wp" ?></b></div>
			</div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_feed_in_limitation']; ?></div>
				<div class="col-6 col-md-8"><b><?php echo $_SESSION['solar_feedInLimitation'] . " %" ?></b></div>
			</div>

			<?php if(!empty($_SESSION['solar_info'])): ?>
			<div class="p-3"></div>
			<div class="row">
				<div class="col-6 col-md-4"><?php echo $strings['summary_pv_installation_info']; ?></div>
				<div class="col-6 col-md-8 solar_info"><b><?php echo $_SESSION['solar_info'] ?></b></div>
			</div>
			<?php endif; ?>

		</div>


		<div id="confirm" class="container pt-5 pb-3">
			<div class="custom-control custom-checkbox">
				<input type="checkbox" class="custom-control-input" id="checkboxAccept">
				<label class="custom-control-label" for="checkboxAccept"><?php echo $strings['summary_confirm_box']; ?></label>
			</div>
		</div>
		

		<div id="btnFinish" class="container text-left">
			<button id="btnFinishInstallation" class="btn btn-success ripple mb-3 mt-4 px-5 py-3 d-none"><?php echo $strings['summary_finish_installation']; ?></button>
		</div>



		<div id="successBox" class="container" style="display: none">

			<h1><b class="text-success"><?php echo $strings['final_congratulations'] ?></b></h1>

			<p><?php echo $strings['final_p1'] ?></p>

			<p><?php echo $strings['final_p2'] ?></p>

			<p><?php echo $strings['final_p3'] ?></p>

			<p class="mt-5"><?php echo $strings['final_p4'] ?></p>

			<button id="btnDownload" class="btn btn-success ripple mb-3 py-3 px-5" style="width:300px"><?php echo $strings['summary_download_pdf']; ?></button>

			<p class="mt-5"><?php echo $strings['final_p5'] ?></p>

			<div class="d-flex align-items-center mb-3">
				<button id="btnReboot" class="btn btn-primary ripple py-3 px-5" style="width:300px"><?php echo $strings['summary_reboot_livex']; ?></button>
				<div id="loading" class="d-none"></div>
				<div id="success" class="d-none"></div>
			</div>

		</div>
		

		
		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/jspdf.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/dist/html2canvas.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script>const dataObj = <?php echo json_encode($_SESSION); ?>;</script>
		<script src="js/installation_summary.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
