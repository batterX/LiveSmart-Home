<?php

include_once "common/base.php";
$step = 3;

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
        <link rel="stylesheet" href="css/customer_info.css?v=<?php echo $versionHash ?>">
        
	</head>



	<body>



        <div id="progress" class="shadow-lg"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated"></div></div></div>



        <div id="modalExistingCustomer" class="modal fade">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <form id="loginForm">
                        <div class="modal-header border-0">
                            <h5 class="modal-title w-100 text-center"><?php echo $strings['customer_login']; ?></h5>
                        </div>
                        <div class="modal-body py-0">
                            <input id="email" class="form-control form-control-outline rounded-pill text-center" type="email" placeholder="<?php echo $strings['email']; ?>">
                            <input id="password" class="form-control form-control-outline rounded-pill text-center" type="password" placeholder="<?php echo $strings['password']; ?>">
                            <span id="errorMsg" class="text-center"><i><?php echo $strings['wrong_email_or_password']; ?></i></span>
                        </div>
                        <div class="modal-footer border-0 pt-0">
                            <button type="submit" id="btnLogin" class="btn btn-block mx-5 btn-success rounded-pill ripple"><?php echo $strings['login']; ?></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>



		<div class="container">

            <div class="row">
                <div class="col-6">
                    <h1 class="customer-informations"><?php echo $strings['customer_informations']; ?></h1>
                </div>
                <div class="col-6">
                    <button id="existingCustomer" class="btn btn-success ripple" data-toggle="modal" data-target="#modalExistingCustomer"><?php echo $strings['existing_customer']; ?></button>
                </div>
            </div>

            <form id="mainForm">

                <div id="customerInformations" class="row">
                    
                    <div class="col-md-2 input-padding">
                        <select class="gender custom-select custom-select-outline" required>
                            <option value="0"><?php echo $strings['gender_male']; ?></option>
                            <option value="1"><?php echo $strings['gender_female']; ?></option>
                        </select>
                    </div>
                    <div class="col-md-5 input-padding">
                        <input class="first-name form-control form-control-outline" type="text" placeholder="<?php echo $strings['first_name']; ?>" required>
                    </div>
                    <div class="col-md-5 input-padding">
                        <input class="last-name form-control form-control-outline" type="text" placeholder="<?php echo $strings['last_name']; ?>" required>
                    </div>

                    <div class="col-md-2"></div>
                    <div class="col-md-5 input-padding">
                        <input class="email form-control form-control-outline" type="email" placeholder="<?php echo $strings['email']; ?>" required>
                    </div>
                    <div class="col-md-5 input-padding">
                        <input class="telephone form-control form-control-outline" type="text" placeholder="<?php echo $strings['telephone']; ?>" required>
                    </div>
                    
                    <div class="w-100 p-3"></div>

                    <div class="col-md-4 input-padding">
                        <select class="location-country custom-select custom-select-outline" required>
                            <option value="de" selected><?php echo $strings['c_de'] ?></option>
                            <option value="at"><?php echo $strings['c_at'] ?></option>
                            <option value="be"><?php echo $strings['c_be'] ?></option>
                            <optgroup label="Europe">
                                <option value="ch"><?php echo $strings['c_ch'] ?></option>
                                <option value="es"><?php echo $strings['c_es'] ?></option>
                                <option value="lt"><?php echo $strings['c_lt'] ?></option>
                                <option value="lu"><?php echo $strings['c_lu'] ?></option>
                                <option value="nl"><?php echo $strings['c_nl'] ?></option>
                                <option value="se"><?php echo $strings['c_se'] ?></option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="col-md-4 input-padding">
                        <input class="location-city form-control form-control-outline" type="text" placeholder="<?php echo $strings['city']; ?>" required>
                    </div>
                    <div class="col-md-4 input-padding">
                        <input class="location-zip form-control form-control-outline" type="text" placeholder="<?php echo $strings['zip_code']; ?>" required>
                    </div>
                    
                    <div class="col-md-12 input-padding">
                        <input class="location-address form-control form-control-outline" type="text" placeholder="<?php echo $strings['address']; ?>" required>
                    </div>

                </div>


                <h1 class="installation-address"><?php echo $strings['installation_address']; ?></h1>

                <div class="custom-control custom-checkbox mx-3 my-3">
                    <input type="checkbox" class="custom-control-input" id="sameAddress">
                    <label class="custom-control-label" for="sameAddress"><?php echo $strings['same_as_customer_address']; ?></label>
                </div>

                <div id="installationAddress" class="row">
                    
                    <div class="col-md-4 input-padding">
                        <select class="location-country custom-select custom-select-outline">
                            <option value="de" selected><?php echo $strings['c_de'] ?></option>
                            <option value="at"><?php echo $strings['c_at'] ?></option>
                            <option value="be"><?php echo $strings['c_be'] ?></option>
                            <optgroup label="Europe">
                                <option value="ch"><?php echo $strings['c_ch'] ?></option>
                                <option value="es"><?php echo $strings['c_es'] ?></option>
                                <option value="lt"><?php echo $strings['c_lt'] ?></option>
                                <option value="lu"><?php echo $strings['c_lu'] ?></option>
                                <option value="nl"><?php echo $strings['c_nl'] ?></option>
                                <option value="se"><?php echo $strings['c_se'] ?></option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="col-md-4 input-padding">
                        <input class="location-city form-control form-control-outline" type="text" placeholder="<?php echo $strings['city']; ?>" required>
                    </div>
                    <div class="col-md-4 input-padding">
                        <input class="location-zip form-control form-control-outline" type="text" placeholder="<?php echo $strings['zip_code']; ?>" required>
                    </div>
                    
                    <div class="col-md-12 input-padding">
                        <input class="location-address form-control form-control-outline" type="text" placeholder="<?php echo $strings['address']; ?>" required>
                    </div>

                </div>

                <div class="text-right pr-3">
                    <button type="submit" id="btnSubmit" class="btn btn-success ripple mt-5 mb-3 px-5 py-3" disabled><?php echo $strings['continue']; ?></button>
                </div>

            </form>

		</div>
		

		
		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
        <script>const lang = <?php echo json_encode($strings); ?>;</script>
        <script>const installerEmail = <?php echo json_encode($_SESSION['installer_email']); ?>;</script>
		<script src="js/customer_info.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
