<?php

session_start();
$step = 5;

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
		<meta name="description" content="The „Live&amp;Smart“ monitoring and controlling tool designed by batterX® is a sophisticated energy management system for optimizing production and consumption.">
		<meta name="author" content="Ivan Gavrilov">
		<link rel="icon" href="img/favicon.png">

		<title>batterX Live&Smart</title>

		<link rel="stylesheet" href="css/dist/bundle.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/system_setup.css">
        
	</head>



	<body>



        <div id="progress" class="progress m-3">
            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%"></div>
        </div>



		<div class="container px-3">

            <form id="mainForm">

                <div class="row m-0 p-0">

                    <!-- batterX Home -->
                    <div id="bxHome" class="col-xl-4 px-3">
                        
                        <h1>batterX Home</h1>

                        <label for="bx_system"><?php echo $strings['serialnumber_system']; ?></label>
                        <input id="bx_system" class="form-control" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" required>

                        <div class="custom-control custom-radio mt-4">
                            <input type="radio" id="bx_system_type_r" name="bx_system_type" class="custom-control-input" checked>
                            <label class="custom-control-label" for="bx_system_type_r"><?php echo $strings['system_type_r']; ?></label>
                        </div>
                        <div class="custom-control custom-radio mt-2">
                            <input type="radio" id="bx_system_type_w" name="bx_system_type" class="custom-control-input">
                            <label class="custom-control-label" for="bx_system_type_w"><?php echo $strings['system_type_w']; ?></label>
                        </div>
                        
                        <label class="mt-5" for="bx_device"><?php echo $strings['serialnumber_inverter']; ?></label>
                        <input id="bx_device" class="form-control" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" value="" disabled required>

                        <label class="mt-5" for="bx_box"><?php echo $strings['serialnumber_box']; ?></label>
                        <input id="bx_box" class="form-control" type="text" placeholder="<?php echo $strings['serialnumber']; ?>" value="" disabled required>

                    </div>

                    <!-- Solar Panels -->
                    <div id="solar" class="col-lg-6 col-xl-4 px-3">
                        
                        <h1><?php echo $strings['pv_system'] ?></h1>

                        <label for="solar_wattPeak"><?php echo $strings['pv_system_size']; ?></label>
                        <div>
                            <input id="solar_wattPeak" class="form-control d-inline-block w-65" type="number" step="1" min="0" required>
                            <span class="pl-3"><?php echo $strings['watt_peak']; ?></span>
                        </div>

                        <label class="mt-5" for="solar_feedInLimitation"><?php echo $strings['pv_system_feed_in_limitation']; ?></label>
                        <div>
                            <input id="solar_feedInLimitation" class="form-control d-inline-block w-65" type="number" step="1" min="0" max="100" value="100" required>
                            <span class="pl-3">%</span>
                        </div>

                    </div>

                    <!-- Batteries -->
                    <div id="battery" class="col-lg-6 col-xl-4 px-3">
                        
                        <h1><?php echo $strings['batteries']; ?></h1>

                        <p><?php echo $strings['batteries_serialnumber']; ?></p>
                        <input id="battery_1" type="text" class="form-control mt-3" placeholder="<?php echo $strings['serialnumber_battery1']; ?>" required>
                        <input id="battery_2" type="text" class="form-control mt-3" placeholder="<?php echo $strings['serialnumber_battery2']; ?>">
                        <input id="battery_3" type="text" class="form-control mt-3" placeholder="<?php echo $strings['serialnumber_battery3']; ?>">
                        <input id="battery_4" type="text" class="form-control mt-3" placeholder="<?php echo $strings['serialnumber_battery4']; ?>">

                    </div>

                </div>

                <div class="text-center pt-5 mt-5 mb-5">
                    <button id="btnSubmit" type="submit" class="btn btn-success levitate ripple mb-3 px-5 py-3" disabled><?php echo $strings['continue']; ?></button>
                    <div class="setting-progress d-none">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="error"></div>
                            <div class="success"></div>
                            <div class="loading"></div>
                            <span><?php echo $strings['setting_parameters']; ?></span>
                        </div>
                    </div>
                </div>

                <input id="installation_date" type="hidden" value="<?php echo date('Y-m-d'); ?>">

            </form>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/system_setup.js"></script>



	</body>

</html>
