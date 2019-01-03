<?php

session_start();
$step = 5;

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
		<link rel="stylesheet" href="css/system_setup.css">
        
	</head>



	<body>



		<div class="bullet-progress">
			<div class="progress-bar">
				<div class="progress"></div>
			</div>
		</div>



		<div class="container px-3">

            <form id="mainForm">

                <div class="row m-0 p-0">

                    <!-- batterX Home -->
                    <div id="bxHome" class="col-xl-4 px-3">
                        
                        <h1>batterX Home</h1>

                        <label for="bx_system">Serial number of the System (Cabinet)</label>
                        <input id="bx_system" class="form-control" type="text" placeholder="Serial number" required>

                        <label class="mt-5" for="bx_device">Serial number of the Inverter</label>
                        <input id="bx_device" class="form-control" type="text" placeholder="Serial number" value="" disabled required>

                        <label class="mt-5" for="bx_box">Serial number of the Live&amp;Smart</label>
                        <input id="bx_box" class="form-control" type="text" placeholder="Serial number" value="" disabled required>

                    </div>

                    <!-- Solar Panels -->
                    <div id="solar" class="col-lg-6 col-xl-4 px-3">
                        
                        <h1>PV-System</h1>

                        <label for="solar_wattPeak">Size of the PV-System</label>
                        <div>
                            <input id="solar_wattPeak" class="form-control d-inline-block w-65" type="number" step="1" min="0" required>
                            <span class="pl-3">Watt&nbsp;Peak</span>
                        </div>

                        <label class="mt-5" for="solar_feedInLimitation">How much percent of solar power can be fed to grid in terms of peak power?</label>
                        <div>
                            <input id="solar_feedInLimitation" class="form-control d-inline-block w-65" type="number" step="1" min="0" max="100" value="100" required>
                            <span class="pl-3">%</span>
                        </div>

                    </div>

                    <!-- Batteries -->
                    <div id="battery" class="col-lg-6 col-xl-4 px-3">
                        
                        <h1>Batteries</h1>

                        <p>Please enter the S/N of each battery connected to the system.</p>
                        <input id="battery_1" type="text" class="form-control mt-3" placeholder="Serial number of 1st Battery" required>
                        <input id="battery_2" type="text" class="form-control mt-3" placeholder="Serial number of 2nd Battery">
                        <input id="battery_3" type="text" class="form-control mt-3" placeholder="Serial number of 3rd Battery">
                        <input id="battery_4" type="text" class="form-control mt-3" placeholder="Serial number of 4th Battery">

                    </div>

                </div>

                <div class="text-center pt-5 mt-5 mb-5">
                    <button id="btnSubmit" type="submit" class="btn btn-primary levitate ripple mb-3 px-5 py-3" disabled>CONFIRM</button>
                    <div class="setting-progress d-none">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="error"></div>
                            <div class="success"></div>
                            <div class="loading"></div>
                            <span>Setting Parameters. Please Wait...</span>
                        </div>
                    </div>
                </div>

            </form>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_setup.js"></script>



	</body>

</html>
