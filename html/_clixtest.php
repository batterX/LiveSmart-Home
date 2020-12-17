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

                TODO
                
            </div>










            <h1>Print / Download / Upload Report</h1>
            
            <div class="card p-4 elevate">
                TODO
            </div>










            <h1>Finish Test / Shutdown LiveX</h1>
            
            <div class="card p-4 elevate">
                TODO
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
