<?php

session_start();
$step = 8;

// Language

$lang = "en";

if(isset($_GET['lang']))
	$lang = $_GET['lang'];
else if(isset($_SESSION['lang']))
	$lang = $_SESSION['lang'];

if($lang != "en" && $lang != "de")
	$lang = "en";

$_SESSION['lang'] = $lang;

// Get Language Table

$strings = file_get_contents('common/lang.json');
$strings = json_decode($strings, true);

if($lang == "de") $strings = $strings['tables'][1];
else              $strings = $strings['tables'][0];


// Check Step

if(!isset($_SESSION['last_step'])) header("location: index.php");

if($_SESSION['last_step'] != $step && $_SESSION['last_step'] != $step - 1) header('location: ' . (isset($_SESSION['back_url']) ? $_SESSION['back_url'] : "index.php"));

$_SESSION['back_url']  = $_SERVER['REQUEST_URI'];
$_SESSION['last_step'] = $step;


// Value Arrays

$arrayGender = [
    '0' => $strings['gender_male'],
    '1' => $strings['gender_female']
];
$arrayCountry = [
    'be' => $strings['be'],
    'de' => $strings['de'],
    'fr' => $strings['fr'],
    'lu' => $strings['lu']
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

		<link rel="stylesheet" href="css/dist/bundle.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/installation_summary.css">
        
	</head>



	<body>



        <div id="progress" class="progress m-3">
            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
        </div>



		<div id="summary" class="container px-3">

            <h1><b><?php echo $strings['summary_installation_summary']; ?></b></h1>

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
            <button id="btnFinishInstallation" class="btn btn-success levitate ripple mb-3 mt-4 px-5 py-3 d-none"><?php echo $strings['summary_finish_installation']; ?></button>
        </div>



        <div id="successBox" class="container" style="display: none">

            <h1><b class="text-success">Success!</b></h1>

            <p>The setup of the batterX Home has been successfully completed and an email with confirmation link has been sent to the customer.</p>

            <p>By clicking the received link, the customer will be able to start using the batterX Portal to remotely monitor and control his batterX Home.</p>

            <p>As Installer of the System, you are granted full access to this batterX Home from your own account as well, so that you can provide remote support to your customer, if ever necessary.</p>

            <p class="mt-5">We have automatically uploaded the Installation Summary to the batterX Cloud,<br>but we also recommend you to download the file and store it locally using the button below.</p>

            <button id="btnDownload" class="btn btn-success levitate ripple mb-3 py-3 px-5" style="width:250px"><?php echo $strings['summary_download_pdf']; ?></button>

            <p class="mt-5">We also recommend you to reboot the LiveX once, by clicking the button below.</p>

            <div class="d-flex align-items-center mb-3">
                <button id="btnReboot" class="btn btn-primary levitate ripple py-3 px-5" style="width:250px"><?php echo $strings['summary_reboot_livex']; ?></button>
                <div id="loading" class="d-none"></div>
                <div id="success" class="d-none"></div>
            </div>

        </div>
		

		
        <script src="js/dist/bundle.js"></script>
        <script src="js/dist/jspdf.js"></script>
        <script src="js/dist/html2canvas.js"></script>
		<script src="js/common.js"></script>
        <script>const lang = <?php echo json_encode($strings); ?>;</script>
        <script>const dataObj = <?php echo json_encode($_SESSION); ?>;</script>
		<script src="js/installation_summary.js"></script>



	</body>

</html>
