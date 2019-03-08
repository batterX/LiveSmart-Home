<?php

session_start();
$step = 0;

$_SESSION['back_url']  = $_SERVER['REQUEST_URI'];
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
		<link rel="stylesheet" href="css/index.css">

	</head>



	<body>



		<div class="container text-center px-2 py-0">

			<div class="d-flex align-items-center justify-content-center">

				<div class="w-100">

					<div class="logo"></div>

					<h1>Select Language</h1>

					<div class="row m-0 p-0 lang">
						<div class="col"></div>
						<div id="langEn" class="col m-0 p-0">
							<div class="lang-en"></div>
							<span>English</span>
						</div>
						<div class="col-2"></div>
						<div id="langDe" class="col m-0 p-0">
							<div class="lang-de"></div>
							<span>Deutsch</span>
						</div>
						<div class="col"></div>
					</div>

				</div>

			</div>

		</div>
		

		
		<script src="js/dist/bundle.js"></script>
		<script src="js/common.js"></script>
		<script src="js/index.js"></script>



	</body>

</html>
