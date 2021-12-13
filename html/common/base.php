<?php

/*
	Included on begin of every main .php file
*/





/*
	Secure Session Cookie
*/

$cookieParams = session_get_cookie_params();
session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], false, true);





/*
	Start Session
*/

session_start();
session_regenerate_id();





/*
	Load Language
*/

$_SESSION["lang"] = isset($_GET["lang"]) ? $_GET["lang"] : (isset($_SESSION["lang"]) ? $_SESSION["lang"] : "en");
if(!in_array($_SESSION["lang"], ["en", "de", "fr", "cs", "es"])) $_SESSION["lang"] = "en";

// Get Language Strings
$lang = file_get_contents("common/langs/" . $_SESSION["lang"] . ".json");
$lang = json_decode($lang, true);





/*
	Set Constant Variables
*/

$versionHash = time();

$softwareVersion = "v21.10.1-fix.1";
