<?php

include_once "common/base.php";
$step = 2;

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

		<title>batterX liveX</title>

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/installer_login.css?v=<?php echo $versionHash ?>">

	</head>



	<body>



		<div id="progress" class="shadow-lg">
			<div><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>
			<div><button id="btn_next" class="btn btn-success ripple" type="submit" form="loginForm" disabled><?php echo $strings['login']; ?></button></div>
		</div>



		<div class="container">
			<div>

				<h1><?php echo $strings['installer_login']; ?></h1>

				<form id="loginForm">

					<div><input id="email"    class="form-control form-control-outline rounded-pill" type="email"    placeholder="<?php echo $strings['email'   ]; ?>" required></div>
					<div><input id="password" class="form-control form-control-outline rounded-pill" type="password" placeholder="<?php echo $strings['password']; ?>" required></div>

					<span id="errorMsg"><?php echo $strings['wrong_email_or_password']; ?></span>

				</form>

			</div>
		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/installer_login.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
