<?php

session_start();
$step = 4;

// Set Language
$lang = isset($_GET['lang']) ? $_GET['lang'] : (isset($_SESSION['lang']) ? $_SESSION['lang'] : "en");
if($lang != "en" && $lang != "de") $lang = "en";
$_SESSION['lang'] = $lang;

// Get Language Strings
$strings = file_get_contents('common/lang.json');
$strings = json_decode($strings, true);
$strings = ($lang == "de") ? $strings['tables'][1] : $strings['tables'][0];

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

		<title>batterX LiveX</title>

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
				<h1><?php echo $strings['inverter_unknown']; ?></h1>
                <div class="d-flex align-items-center justify-content-center">
					<div class="error"></div>
					<div class="success"></div>
                    <div class="loading"></div>
					<span class="message"><?php echo $strings['please_connect_inverter']; ?></span>
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
                <button id="btnSubmit" class="btn btn-success levitate ripple d-none"><?php echo $strings['continue']; ?></button>
            </div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/dist/moment.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_detect.js"></script>



	</body>

</html>
