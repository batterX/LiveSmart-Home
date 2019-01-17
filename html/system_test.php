<?php

session_start();
$step = 6;

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
		<link rel="stylesheet" href="css/system_test.css">
        
	</head>



	<body>



        <div id="progress" class="progress m-3">
            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
        </div>



		<div class="container px-3">

            <h1>System Test</h1>

            <div class="row m-0 p-0">

                <div class="col-lg-6 m-0 pr-lg-2">

                    <div id="testEnergyMeter" class="status d-flex align-items-center">
                        <div class="waiting"></div>
                        <div class="loading"></div>
                        <div class="success"></div>
                        <div class="error"></div>
                        <span>Energy Meter</span>
                    </div>

                    <div id="testBatteryCharging" class="status d-flex align-items-center mt-4">
                        <div class="waiting"></div>
                        <div class="loading"></div>
                        <div class="success"></div>
                        <div class="error"></div>
                        <span>Battery Charging</span>
                    </div>

                    <div id="testBatteryDischarging" class="status d-flex align-items-center mt-4">
                        <div class="waiting"></div>
                        <div class="loading"></div>
                        <div class="success"></div>
                        <div class="error"></div>
                        <span>Battery Discharging</span>
                    </div>

                    <div id="testUpsMode" class="status d-flex align-items-center mt-4">
                        <div class="waiting"></div>
                        <div class="loading"></div>
                        <div class="success"></div>
                        <div class="error"></div>
                        <span>UPS Mode<span></span></span>
                    </div>

                    <div class="w-100 text-center">
                        <button id="btnSubmit" class="btn btn-success levitate ripple my-5 px-5 py-3 d-none">Continue</button>
                    </div>

                </div>

                <div id="log" class="col-lg-6 m-0 pl-lg-2 mt-5 mt-lg-0"></div>

            </div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_test.js"></script>



	</body>

</html>