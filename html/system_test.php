<?php

include_once "common/base.php";
$step = 6;

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

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/system_test.css?v=<?php echo $versionHash ?>">

	</head>



	<body>



		<div id="warningsModal" class="modal" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title text-danger text-center w-100"><?php echo $strings['warning'] ?></h5>
					</div>
					<div class="modal-body">
						<p class="m-0 text-center"></p>
					</div>
				</div>
			</div>
		</div>



		<div id="progress" class="shadow-lg"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>



		<div class="container px-3">

			<h1><?php echo $strings['system_test']; ?></h1>

			<div class="row m-0 p-0">

				<div class="col-lg-6 m-0 pr-lg-2">

					<div id="testEnergyMeter" class="status d-flex align-items-center">
						<div class="waiting"></div>
						<div class="loading"></div>
						<div class="success"></div>
						<div class="error"></div>
						<span><?php echo $strings['energy_meter']; ?></span>
					</div>

					<div id="testBatteryCharging" class="status d-flex align-items-center mt-4">
						<div class="waiting"></div>
						<div class="loading"></div>
						<div class="success"></div>
						<div class="error"></div>
						<span><?php echo $strings['battery_charging']; ?></span>
					</div>

					<div id="testUpsMode" class="status d-flex align-items-center mt-4">
						<div class="waiting"></div>
						<div class="loading"></div>
						<div class="success"></div>
						<div class="error"></div>
						<span><?php echo $strings['ups_mode']; ?><span></span></span>
					</div>

					<div class="w-100 text-center">
						<button id="btnSubmit" class="btn btn-success ripple my-5 px-5 py-3 d-none"><?php echo $strings['continue'] ?></button>
					</div>

				</div>

				<div id="log" class="col-lg-6 m-0 pl-lg-2 mt-5 mt-lg-0"></div>

			</div>

		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script>const battery_type = <?php echo json_encode($_SESSION['battery_type']); ?>;</script>
		<script src="js/system_test.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
