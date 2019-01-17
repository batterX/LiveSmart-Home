<?php

session_start();
$step = 7;

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
    '0' => 'Mr.',
    '1' => 'Ms.'
];
$arrayCountry = [
    'be' => 'Belgium',
    'de' => 'Germany',
    'fr' => 'France'
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
		<meta name="description" content="The „Live&amp;Smart“ monitoring and controlling tool designed by batterX® is a sophisticated energy management system for optimizing production and consumption.">
		<meta name="author" content="Ivan Gavrilov">
		<link rel="icon" href="img/favicon.png">

		<title>batterX Live&Smart</title>

		<link rel="stylesheet" href="css/dist/bundle.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/installation_summary.css">
        
	</head>



	<body>



        <div id="progress" class="progress m-3">
            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
        </div>



		<div id="summary" class="container px-3">

            <h1>Installation Summary</h1>

            <div class="row">
                <div class="col-6 col-lg-4">Installer</div>
                <div class="col-6 col-lg-4"><b><?php echo $arrayGender[$_SESSION['installer_gender']] . " " . $_SESSION['installer_firstname'] . " " . $_SESSION['installer_lastname'] . "<br>" . $_SESSION['installer_company'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Installer Email</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['installer_email'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Installer Telephone</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['installer_telephone'] ?></b></div>
            </div>

            <div class="p-3"></div>

            <div class="row">
                <div class="col-6 col-lg-4">Customer Name</div>
                <div class="col-6 col-lg-4"><b><?php echo $arrayGender[$_SESSION['customer_gender']] . " " . $_SESSION['customer_firstname'] . " " . $_SESSION['customer_lastname'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Customer Email</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['customer_email'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Customer Telephone</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['customer_telephone'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Customer Address</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['customer_address'] . "<br>" . $_SESSION['customer_zipcode'] . " " . $_SESSION['customer_city'] . ", " . $arrayCountry[$_SESSION['customer_country']] ?></b></div>
            </div>

            <div class="p-3"></div>

            <div class="row">
                <div class="col-6 col-lg-4">Installation Address</div>
                <div class="col-6 col-lg-4"><b><?php echo $_SESSION['installation_address'] . "<br>" . $_SESSION['installation_zipcode'] . " " . $_SESSION['installation_city'] . ", " . $arrayCountry[$_SESSION['installation_country']] ?></b></div>
            </div>

            <div class="p-3"></div>

            <div class="row">
                <div class="col-6 col-lg-4">System (Cabinet)</div>
                <div class="col-6 col-lg-8"><b><?php echo $_SESSION['system_serial'] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Inverter</div>
                <div class="col-6 col-lg-8"><b><?php echo $_SESSION['device_serial'] . "<br>" . $arrayDeviceModel[$_SESSION['device_model']] ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Live&amp;Smart</div>
                <div class="col-6 col-lg-8"><b><?php echo $_SESSION['box_serial'] . " (" . $_SESSION['software_version'] . ")" ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Batteries</div>
                <div class="col-6 col-lg-8"><b><?php echo ($_SESSION['battery1_serial']) . (isset($_SESSION['battery2_serial']) ? "<br>" . $_SESSION['battery2_serial'] : "") . (isset($_SESSION['battery3_serial']) ? "<br>" . $_SESSION['battery3_serial'] : "") . (isset($_SESSION['battery4_serial']) ? "<br>" . $_SESSION['battery4_serial'] : "") ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">PV-System Size</div>
                <div class="col-6 col-lg-8"><b><?php echo $_SESSION['solar_wattPeak'] . " Wp" ?></b></div>
            </div>
            <div class="row">
                <div class="col-6 col-lg-4">Grid Feed-in Limitation</div>
                <div class="col-6 col-lg-8"><b><?php echo $_SESSION['solar_feedInLimitation'] . " %" ?></b></div>
            </div>

        </div>


        <div class="container pt-5 pb-3">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="checkboxAccept">
                <label class="custom-control-label" for="checkboxAccept">I hereby confirm that the information above is true, complete and accurate.</label>
            </div>
        </div>
        

        <div class="container text-left">
            <button id="btnFinishInstallation" class="btn btn-success levitate ripple mb-3 mt-4 px-5 py-3 d-none">FINISH INSTALLATION</button>
            <button id="btnDownload" class="btn btn-secondary levitate ripple mb-3 mt-4 px-5 py-3 ml-3 d-none">DOWNLOAD PDF</button>
        </div>
		

		
        <script src="js/dist/bundle.js"></script>
        <script src="js/dist/jspdf.js"></script>
        <script src="js/dist/html2canvas.js"></script>
		<script src="js/common.js"></script>
        <script>const lang = <?php echo json_encode($strings); ?>;</script>
        <script>const dataObj = <?php echo json_encode($_SESSION); ?></script>
		<script src="js/installation_summary.js"></script>



	</body>

</html>
