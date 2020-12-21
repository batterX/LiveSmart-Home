<?php

/*
    Special Menu For Factory Testing
*/

// Include Base
include_once "common/base.php";

// Password Restricted Page
$secretPass = '$2y$10$BTwS3NZ4g4VgRFjjdBOrHeN4o4gyEAeUCDVhNnNCNuhigZ4MCIuXS';
if(empty($_POST["secretPass"]) || !password_verify($_POST["secretPass"], $secretPass)) {
    echo '
        <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 90vh;
                        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
                        color: black;
                        background: #f0f0f0;
                    }
                    form {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    h1 {
                        text-align: center;
                    }
                    input {
                        font-size: 1.25rem;
                        background: #ffffff;
                        color: black;
                        padding: 1rem 2rem;
                        border: 1px solid #aaaaaa;
                        border-radius: 4px;
                        text-align: center;
                    }
                    button {
                        background-color: #cccccc;
                        border: 1px solid #aaaaaa;
                        color: black;
                        padding: 0.75rem 3rem;
                        margin-top: 1.5rem;
                        text-align: center;
                        display: inline-block;
                        border-radius: 4px;
                        cursor: pointer;
                        text-transform: uppercase;
                        text-decoration: none;
                        font-size: 1.25rem;
                    }
                    button:hover {
                        background-color: #aaaaaa;
                    }
                </style>
            </head>
            <body>
                <form method="POST" action="'.$_SERVER['REQUEST_URI'].'">
                    <h1>Password Eingeben</h1>
                    <input type="password" name="secretPass" placeholder="Password Eingeben">
                    <button>Weiter</button>
                </form>
            </body>
        </html>
    ';
    exit();
}

// Get Apikey
$output = shell_exec("cat /proc/cpuinfo");
$find = "Serial";
$pos = strpos($output, $find);
$serial = substr($output, $pos + 10, 16);
$apikey = sha1(strval($serial));

?>










<!DOCTYPE html>

<html>

	<head>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="author" content="Ivan Gavrilov">

		<title>batterX Factory Test</title>

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
        <link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/_clixtest.css?v=<?php echo $versionHash ?>">

	</head>

	<body>

        <main class="container">










            <h1>LiveX Update</h1>
            
            <div class="card p-4 elevate" id="livex_update">

                <div class="log"></div>
                
            </div>










            <h1>UPS Mode Test</h1>
            
            <div class="card p-4 elevate" id="ups_mode_test">

                <p class="step-info">Connect the UPS MODE connector to the back side of the cliX, then press <u>Begin Test</u> below.</p>
                <button class="step-start btn btn-sm btn-primary w-20 ripple">Begin Test</button>

                <div class="log"></div>

            </div>










            <h1>GPIO Test</h1>
            
            <div class="card p-4 elevate" id="gpio_test">

                <p class="step-info">Connect GPIO Outputs and Inputs together, then press <u>Begin Test</u> below.</p>
                <button class="step-start btn btn-sm btn-primary w-20 ripple">Begin Test</button>

                <div class="step-content row m-0 p-0 d-none text-muted">
                    <div class="out1 col-3 text-center pb-3">Output 1</div>
                    <div class="out2 col-3 text-center pb-3">Output 2</div>
                    <div class="out3 col-3 text-center pb-3">Output 3</div>
                    <div class="out4 col-3 text-center pb-3">Output 4</div>
                    <div class="in1  col-3 text-center">Input 1</div>
                    <div class="in2  col-3 text-center">Input 2</div>
                    <div class="in3  col-3 text-center">Input 3</div>
                    <div class="in4  col-3 text-center">Input 4</div>
                </div>

                <div class="log"></div>

            </div>










            <h1>Emeter Test</h1>
            
            <div class="card p-4 elevate" id="emeter_test">

                <p class="step-info">Connect Energy Meter to the liveX, then press <u>Begin Test</u> below.</p>
                <button class="step-start btn btn-sm btn-primary w-20 ripple">Begin Test</button>

                <div class="log"></div>

            </div>










            <h1>Backup Mode Test</h1>
            
            <div class="card p-4 elevate" id="backup_mode_test">

                <p class="step-info-1">Disconnect the GPIO connectors, then press <u>Continue</u> below.</p>
                <button class="step-start-1 btn btn-sm btn-primary w-20 ripple">Continue</button>

                <p class="step-info-2 d-none">Remove UPS MODE connector and connect BACKUP MODE connector, then press <u>Begin Test</u> below.</p>
                <button class="step-start-2 btn btn-sm btn-primary w-20 ripple d-none">Begin Test</button>

                <div class="log"></div>
                
            </div>










            <h1>Connect Default Mode</h1>
            
            <div class="card p-4 elevate" id="connect_default_mode">

                <p class="step-info d-none">Remove BACKUP MODE connector and connect UPS MODE connector, then press <u>Continue</u> below.</p>
                <button class="step-start btn btn-sm btn-primary w-20 ripple d-none">Continue</button>

                <div class="log"></div>
                
            </div>










            <h1>Generate Report</h1>
            
            <div class="card p-4 elevate" id="generate_report">
                <div id="report" class="d-none">

                    <table class="table table-borderless mb-4">
                        <tbody>
                            <tr>
                                <td>Date</td>
                                <td id="report_date"><?php echo date('Y-m-d') ?></td>
                            </tr>
                            <tr>
                                <td>Apikey</td>
                                <td id="report_apikey"><?php echo $apikey ?></td>
                            </tr>
                            <tr>
                                <td>S/N</td>
                                <td id="report_sn"></td>
                            </tr>
                            <tr>
                                <td>EW S/N</td>
                                <td><input id="report_ewsn" type="text" class="form-control-plaintext p-0" placeholder="Type here…"></td>
                            </tr>
                            <tr>
                                <td>Software</td>
                                <td id="report_software"><?php echo $softwareVersion ?></td>
                            </tr>
                            <tr>
                                <td>Passed Tests</td>
                                <td id="report_tests">
                                    liveX Update<br>
                                    UPS Mode<br>
                                    GPIO<br>
                                    E.Meter<br>
                                    Backup Mode
                                </td>
                            </tr>
                            <tr>
                                <td>Note</td>
                                <td>
                                    <textarea id="report_note" class="form-control-plaintext p-0" placeholder="Type here…" rows="1" style="height:26px"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div>
                        <button id="report_send" class="btn btn-success w-20 ripple">Send Report</button>
                        <button id="report_download" class="btn btn-primary w-20 ripple" disabled>Download</button>
                    </div>

                </div>
            </div>










            <h1>Finish Test / Shutdown LiveX</h1>
            
            <div class="card p-4 elevate" id="finish_test">

                <div class="row p-0 m-0">
                    <div class="col-6 pl-4 pr-4">
                        <button id="finish_cleardb" class="btn btn-lg btn-primary w-100 ripple">Clear Database</button>
                    </div>
                    <div class="col-6 pl-4 pr-4">
                        <button id="finish_shutdown" class="btn btn-lg btn-danger w-100 ripple" disabled>Shutdown</button>
                    </div>
                </div>

            </div>










        </main>

		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
        <script>
            const softwareVersion = <?php echo json_encode($softwareVersion) ?>;
        </script>
		<script src="js/_clixtest.js?v=<?php echo $versionHash ?>"></script>

	</body>

</html>
