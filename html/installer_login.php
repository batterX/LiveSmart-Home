<?php

session_start();
$step = 2;

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



// Set Software Version from previous Step
if(isset($_GET['software_version'])) $_SESSION['software_version'] = $_GET['software_version'];

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
		<link rel="stylesheet" href="css/installer_login.css">
        
	</head>



	<body>



		<div id="progress" class="progress m-3">
			<div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
		</div>



		<div class="container text-center px-2 py-0">

			<div class="w-100">

				<h1><?php echo $strings['installer_login']; ?></h1>
				
				<form id="loginForm">
					
					<div>
						<input id="email" class="form-control form-control-outline" type="email" placeholder="<?php echo $strings['email']; ?>" required>
					</div>
					
					<div>
						<input id="password" class="form-control form-control-outline" type="password" placeholder="<?php echo $strings['password']; ?>" required>
					</div>

					<span id="errorMsg"><i><?php echo $strings['wrong_email_or_password']; ?></i></span>
					
					<button type="submit" id="btnLogin" class="btn btn-success levitate ripple"><?php echo $strings['login']; ?></button>
				
				</form>
			
			</div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/installer_login.js"></script>



	</body>

</html>
