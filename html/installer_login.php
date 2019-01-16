<?php

session_start();
$step = 2;

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


// Set Software Version from previous Step

if(isset($_GET['software_version'])) $_SESSION['software_version'] = $_GET['software_version'];


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

		<title>batterX Live&amp;Smart</title>

		<link rel="stylesheet" href="css/dist/bundle.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/installer_login.css">
        
	</head>



	<body>



		<div id="progress" class="progress m-3">
			<div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
		</div>



		<div class="container text-center px-2 py-0">

			<div class="w-100">

				<h1><?php echo $strings[3]; ?></h1>
				
				<form id="loginForm">
					
					<div>
						<input id="email" class="form-control" type="email" placeholder="<?php echo $strings[5][0]; ?>" required>
					</div>
					
					<div>
						<input id="password" class="form-control" type="password" placeholder="<?php echo $strings[5][1]; ?>" required>
					</div>

					<span id="errorMsg"><i><?php echo $strings[5][3]; ?></i></span>
					
					<button type="submit" id="btnLogin" class="btn btn-success levitate ripple"><?php echo $strings[5][2]; ?></button>
				
				</form>
			
			</div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/installer_login.js"></script>



	</body>

</html>
