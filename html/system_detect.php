<?php

session_start();
$step = 4;

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
		<link rel="stylesheet" href="css/system_detect.css">
        
	</head>



	<body>



		<div id="progress" class="progress m-3">
			<div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
		</div>



		<div class="container text-center px-2 py-0">

			<div id="inverterUnknown" class="w-100">
				<h1>Inverter Unknown</h1>
                <div class="d-flex align-items-center justify-content-center">
					<div class="error"></div>
					<div class="success"></div>
                    <div class="loading"></div>
					<span class="message">Please connect your Inverter to the Live & Smart</span>
				</div>
            </div>
            
            <div id="inverterDetected" class="w-100">
                <h1>batter<span>X</span> <b></b></h1>
                <img src="">
                <span class="serialnumber">S/N: <b></b></span>
                <div class="d-flex align-items-center justify-content-center">
					<div class="error"></div>
					<div class="success"></div>
                    <div class="loading"></div>
                    <span class="standard">VDE4105</span>
                </div>
                <button id="btnSubmit" class="btn btn-success levitate ripple d-none">Continue</button>
            </div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/dist/moment.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_detect.js"></script>



	</body>

</html>