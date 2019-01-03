<?php

session_start();
$step = 3;

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

		<title>batterX Live&amp;Smart</title>

		<link rel="stylesheet" href="css/dist/bundle.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/customer_info.css">
        
	</head>



	<body>



		<div class="bullet-progress">
			<div class="progress-bar">
				<div class="progress"></div>
			</div>
		</div>



		<div id="modalExistingCustomer" class="modal fade">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content levitate">
                    <form id="loginForm">
                        <div class="modal-header border-0">
                            <h5 class="modal-title"><?php echo $strings[4]; ?></h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body py-0">
                            <input id="email" class="form-control" type="email" placeholder="<?php echo $strings[5][0]; ?>">
                            <input id="password" class="form-control" type="password" placeholder="<?php echo $strings[5][1]; ?>">
                            <span id="errorMsg"><i><?php echo $strings[5][3]; ?></i></span>
                        </div>
                        <div class="modal-footer border-0 pt-0">
                            <button type="submit" id="btnLogin" class="btn btn-primary levitate ripple"><?php echo $strings[5][2]; ?></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>



		<div class="container p-0">

            <div class="row m-0 p-0">
                <div class="col-6 p-0">
                    <h1 class="customer-informations"><?php echo $strings[6]; ?></h1>
                </div>
                <div class="col-6 p-0 d-flex align-items-center justify-content-end">
                    <button id="existingCustomer" class="btn btn-info levitate ripple" data-toggle="modal" data-target="#modalExistingCustomer"><?php echo $strings[9]; ?></button>
                </div>
            </div>

            <form id="mainForm">

                <div id="customerInformations" class="row m-0 px-2 py-0">
                    
                    <div class="col-md-2 p-0 px-2 pt-3">
                        <select class="gender custom-select" required>
                            <option value="0"><?php echo $strings[8][0][0]; ?></option>
                            <option value="1"><?php echo $strings[8][0][1]; ?></option>
                        </select>
                    </div>
                    <div class="col-md-5 p-0 px-2 pt-3">
                        <input class="first-name form-control" type="text" placeholder="<?php echo $strings[8][1]; ?>" required>
                    </div>
                    <div class="col-md-5 p-0 px-2 pt-3">
                        <input class="last-name form-control" type="text" placeholder="<?php echo $strings[8][2]; ?>" required>
                    </div>

                    <div class="col-md-2 p-0"></div>
                    <div class="col-md-5 p-0 px-2 pt-3">
                        <input class="email form-control" type="email" placeholder="<?php echo $strings[8][3]; ?>" required>
                    </div>
                    <div class="col-md-5 p-0 px-2 pt-3">
                        <input class="telephone form-control" type="text" placeholder="<?php echo $strings[8][4]; ?>" required>
                    </div>
                    
                    <div class="w-100 p-3"></div>

                    <div class="col-md-4 p-0 px-2 pt-3">
                        <select class="location-country custom-select" required>
                            <option value="be"><?php echo $strings[8][5][0]; ?></option>
                            <option value="fr"><?php echo $strings[8][5][1]; ?></option>
                            <option value="de" selected><?php echo $strings[8][5][2]; ?></option>
                        </select>
                    </div>
                    <div class="col-md-4 p-0 px-2 pt-3">
                        <input class="location-city form-control" type="text" placeholder="<?php echo $strings[8][6]; ?>" required>
                    </div>
                    <div class="col-md-4 p-0 px-2 pt-3">
                        <input class="location-zip form-control" type="text" placeholder="<?php echo $strings[8][7]; ?>" required>
                    </div>
                    
                    <div class="col-md-12 p-0 px-2 pt-3">
                        <input class="location-address form-control" type="text" placeholder="<?php echo $strings[8][8]; ?>" required>
                    </div>

                </div>


                <h1 class="installation-address"><?php echo $strings[7]; ?></h1>

                <div class="custom-control custom-checkbox mx-3 my-3">
                    <input type="checkbox" class="custom-control-input" id="sameAddress">
                    <label class="custom-control-label" for="sameAddress"><?php echo $strings[10]; ?></label>
                </div>

                <div id="installationAddress" class="row m-0 px-2 py-0">
                    
                    <div class="col-md-4 p-0 px-2 pt-3">
                        <select class="location-country custom-select">
                            <option value="be"><?php echo $strings[8][5][0]; ?></option>
                            <option value="fr"><?php echo $strings[8][5][1]; ?></option>
                            <option value="de" selected><?php echo $strings[8][5][2]; ?></option>
                        </select>
                    </div>
                    <div class="col-md-4 p-0 px-2 pt-3">
                        <input class="location-city form-control" type="text" placeholder="<?php echo $strings[8][6]; ?>" required>
                    </div>
                    <div class="col-md-4 p-0 px-2 pt-3">
                        <input class="location-zip form-control" type="text" placeholder="<?php echo $strings[8][7]; ?>" required>
                    </div>
                    
                    <div class="col-md-12 p-0 px-2 pt-3">
                        <input class="location-address form-control" type="text" placeholder="<?php echo $strings[8][8]; ?>" required>
                    </div>

                </div>

                <div class="text-right pr-3">
                    <button type="submit" id="btnSubmit" class="btn btn-primary levitate ripple mt-5 mb-3 px-5 py-3" disabled>ACCEPT &amp; SUBMIT</button>
                </div>

            </form>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script>const lang = <?php echo json_encode($strings); ?>;</script>
		<script src="js/customer_info.js"></script>



	</body>

</html>
