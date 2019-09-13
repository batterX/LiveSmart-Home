<?php

include_once "common/base.php";
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

		<link rel="stylesheet" href="css/dist/bundle.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/common.css?v=<?php echo $versionHash ?>">
		<link rel="stylesheet" href="css/index.css?v=<?php echo $versionHash ?>">

	</head>



	<body>



		<div class="container">
			<div>
				<div>

					<div class="logo"></div>

					<h1>Select Language</h1>

					<div class="row lang">
						<div class="col-2"></div>
						<div id="langEn" class="col">
							<div class="lang-en"></div>
							<span>English</span>
						</div>
						<div id="langDe" class="col">
							<div class="lang-de"></div>
							<span>Deutsch</span>
						</div>
						<div id="langFr" class="col">
							<div class="lang-fr"></div>
							<span>Français</span>
						</div>
						<div class="col-2"></div>
					</div>

				</div>
			</div>
		</div>



		<script src="js/dist/bundle.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/common.js?v=<?php echo $versionHash ?>"></script>
		<script src="js/index.js?v=<?php echo $versionHash ?>"></script>



	</body>

</html>
